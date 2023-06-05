---
path: "/blogs/k8s-aws-alb"
date: "2022-01-22"
title: "Kubernetes Load Balancing and Ingress Controller with AWS ALB Ingress Controller"
author: "Olalekan Taofeek"
timeToRead: "10"
smallTitle: "Kubernetes Ingress Controller with ALB"
description: "Ingress Controller and Load Balancing on Kubernetes with AWS ALB"
postNum: "28"
---

<img src="./alb-ingress-controller.png"/>
<br/>
<br/>
<br/>


## **Kubernetes Load balncing and Ingress with AWS ALB Ingress Controller on EKS Cluster**

Ingress controller will accept traffic from outside kubernetes cluster, and load balance it to pods running behind a service inside the cluster.

## Prerequisites

* Some level of working with kubernetes, terraform, AWS and Helm is required
* Some level of GitOps understanding, [GitOps Principle](https://opengitops.dev/#principles) and a GitOps controller e.g [FluxCD](https://fluxcd.io/flux/components/source/) or [ArgoCd](https://argo-cd.readthedocs.io/en/stable/).
* A Kubernetes cluster running on EKS,AKS,GKE or OpenShift.

## Capabilities

* Path based routing
  * Using a single hostname we can route traffic to different backend services based on path.
* Canary
  * We can release our service incrementally to a subset of users
* A/B Testing
  * We have different versions of the same service run simultaneously in the same environment for a given period of time as an experiment
  * The experimental services can be controlled a number of ways:
    * via feature flags toggling
    * via A/B test tools
    * via distinct service deployments
* Blue/Green
  * User traffic is shifted from the green (stagging) environment to the blue (production) environment
  * Quality assurance and user acceptance testing can be done on the green (staging) environment prior to promotion

* Rate Limiting
  * We can use a technique called `rate limiting`, this is actually an API gateway use case that limits the incoming request rate to a value we set for our service.
  * This value is typically a value we expect for real users.


## Setup and Configuration  with GitOps(push) Approach

### Prepare Helm Chart Values Override with Terraform

Parameterise the [chart values](https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/helm/aws-load-balancer-controller/values.yaml) overrides by creating a terraform template file for the Ingress Helm chart values.

```yaml
clusterName: ${cluster_name}
region: ${region}
vpcId: ${vpc_id}
ingressClass: alb
securityContext: {}
serviceAccount:
  create: false
  name: aws-load-balancer-controller
resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
podLabels:
  app.kubernetes.io/instance: aws-load-balancer-controller
  app.kubernetes.io/name: aws-load-balancer-controller
```


### Create Helm Release with Terraform

Create a helm release from the [ALB helm chart](https://github.com/kubernetes-sigs/aws-load-balancer-controller/tree/main/helm/aws-load-balancer-controller#tldr) with terraform [helm provider](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release) and pass the values override above.

```hcl
resource "helm_release" "alb_ingress_controller" {
  name       = "aws-load-balancer-controller"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  repository = "https://aws.github.io/eks-charts"
  version    = "1.3.1"
  timeout    = "1500"

  # configuration settings
  values = [local.alb_config]
}
```

### Deploy an Example ALB Ingress Class

Once the controller is deployed, Create a example ALB Ingress Class for a test service.

Note: ALB Ingress Controller heavily rely on [annotation](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.5/guide/ingress/annotations/) to do configuration overrides.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: experiment-alb
  namespace: default
  annotations:
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: ${alb_ssl_certificate_arn}
    alb.ingress.kubernetes.io/group.name: platform.services
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS":443}]'
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/backend-protocol: HTTP
    alb.ingress.kubernetes.io/security-groups: ${alb_sg_id}
    alb.ingress.kubernetes.io/subnets: ${subnet1}, ${subnet2}, ${subnet3}
    alb.ingress.kubernetes.io/load-balancer-attributes: routing.http.drop_invalid_header-fields.enabled=true,idle_timeout.timeout_seconds=600
    alb.ingress.kubernetes.io/healthcheck-path: /metrics
    alb.ingress.kubernetes.io/success-codes: 200,404,301,302,307  #200-299 
    alb.ingress.kubernetes.io/target-node-labels: k8s.harphies.com/role=platform
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-FS-1-2-Res-2020-10
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/inbound-cidrs: "<comma separated cidr list that can acces the ingress.>"
  labels:
    app: experiment-alb
spec:
  rules:
  - host: {your dns host}
    http:
      paths:
      - path: /app
        pathType: Prefix
        backend:
          service:
            name: client-app
            port:
              number: 80
```

### Create Controller Instance Profile

The ALB Controller Pod needs an Instance profile which is configured via [IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)


Downlaod the [IAM Policy](https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.3.1/docs/install/iam_policy.json) and use the [iam role for oidc module](https://registry.terraform.io/modules/terraform-aws-modules/iam/aws/latest/submodules/iam-assumable-role-with-oidc) to complete the setup

```hcl
data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
  depends_on = [
    module.eks
  ]
}

locals {
  oidc_provider_url       = data.aws_eks_cluster.cluster.identity.0.oidc.0.issuer
}

data "tls_certificate" "core_eks" {
  url = local.oidc_provider_url
}

resource "aws_iam_openid_connect_provider" "example" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.core_eks.certificates[0].sha1_fingerprint]
  url             = local.oidc_provider_url
}

resource "aws_iam_policy" "alb_ingress_controller" {
  name        = "aws-alb-ingress-iam-policy"
  description = "IAM Policy for the AWS Ingress controller"
  policy      = file("alb-ingress-iam-policy.json")
}

resource "kubernetes_service_account" "ALB_controller" {
  metadata {
    name      = "aws-load-balancer-controller"
    namespace = "kube-system"
    annotations = {
      "eks.amazonaws.com/role-arn" = module.alb_iam_role.iam_role_arn
    }
  }
  depends_on = [module.alb_iam_role]
}

module "alb_iam_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
  version = "~> 4.0"

  create_role = true
  role_name   = "alb-ingress-access-${local.cluster_name}"
  provider_url = replace(flatten(concat(data.aws_eks_cluster.cluster[*].identity[*].oidc.0.issuer, [
  ""]))[0], "https://", "")
  role_policy_arns = [
  aws_iam_policy.alb_ingress_controller.arn]
  oidc_fully_qualified_subjects = [
  "system:serviceaccount:kube-system:aws-load-balancer-controller"] #namespace:serviceaccountname
  oidc_fully_qualified_audiences = [
    "sts.amazonaws.com"
  ]
}
```

### Optional External DNS Configuration

We optionally can configure an [external DNS](https://github.com/kubernetes-sigs/external-dns) for a domain hosted in AWS Route53 hosted zone to use for the created ALB Ingresss to expose the service over a CNAME record in the route53 hosted zone of choice.

Note: External DNS configuration also rely heavily on [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/service/annotations/) on both the service to expose and the Ingress Object to use for service path-based routing.

## Example Usage

An example usage to do path-based service routing with custom AWS Route53 Record to access the service on configured DNS via external dns deployment that filter a custom route53 zone.

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: platform-observ
  name: jaeger-query-ing
  annotations:
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: ${alb_ssl_certificate_arn}
    alb.ingress.kubernetes.io/group.name: platform.services
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS":443}]'
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/security-groups: ${alb_sg_id}
    alb.ingress.kubernetes.io/subnets: ${subnet1}, ${subnet2}, ${subnet3}
    alb.ingress.kubernetes.io/load-balancer-attributes: idle_timeout.timeout_seconds=600
    alb.ingress.kubernetes.io/success-codes: 200,404,301,302,307  #200-299 
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS-1-1-2017-01
    alb.ingress.kubernetes.io/ssl-redirect: '443'
spec:
  ingressClassName: alb
  rules:
    - host: ${cluster_name}-jaegerquery.${root_domain}
      http:
        paths:
          - path: /
            pathType: Prefix #Avoid using exact
            backend:
              service:
                name: jaeger-query
                port:
                  number: 80
```

## Issues and Considerations

ALB Ingress Controller creates an Instance of Application Load Balancer for every Ingress Object deployed, This is expensive as if you have multipe services says thousands of services it'll create thousands of ALB.|

Good news, there's an [annotation](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.5/guide/ingress/annotations/#group.name) you can configure to batch multiple target groups under the same Application Load balancer and use the same ALB for multiple services. e.g

```yaml
alb.ingress.kubernetes.io/group.name: platform.services
```