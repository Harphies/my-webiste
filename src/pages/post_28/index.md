---
path: "/blogs/k8s-aws-alb"
date: "2022-01-22"
title: "Kubernetes Ingress Controller with AWS ALB Ingress Controller"
author: "Olalekan Taofeek"
timeToRead: "5"
smallTitle: "Kubernetes Ingress Controller with ALB"
description: "Ingress Controller on Kubernetes with AWS ALB"
postNum: "28"
---

<img src="./alb-ingress-controller.png"/>
<br/>
<br/>
<br/>


**Steps to getting AWS ALB Ingress Controller Working in Your EKS Cluster**

Note: Some level of working with kubernetes, terraform, AWS and Helm is required

Stage1: Helm Chart Installation and Helm Chart Values--With Terraform

```
Step1: 
create a terraform template to parametarise the Ingress Helm chart values for improved code structure and future updates

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


Step2: 
Create a helm release resource with terraform helm release provider and pass the helm values loaded
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

Official docs for more supports:
Terraform helm provider: https://registry.terraform.io/providers/hashicorp/helm/latest/docs
ALB Ingress Controller Helm chart: https://artifacthub.io/packages/helm/aws/aws-load-balancer-controller

```

Stage2: Ingress Annotations and Apply to the cluster
Create the ingress file and apply it to the cluster

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: experiment-alb
  namespace: default
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/load-balancer-name: experiment-alb
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/security-groups: sg-1
    alb.ingress.kubernetes.io/subnets: subnet-1, subnet-2, subnet-3
    alb.ingress.kubernetes.io/load-balancer-attributes: idle_timeout.timeout_seconds=600
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

Stage 3: OIDC Service Account and IAM Policy Permissions for the Ingress Controller

Downlaod the IAM Policy from here: https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.3.1/docs/install/iam_policy.json

Get the iam assume role module here: https://registry.terraform.io/modules/terraform-aws-modules/iam/aws/latest/submodules/iam-assumable-role-with-oidc

```

Step1: 
data "tls_certificate" "core_eks" {
  url = local.oidc_provider_url
}

Step2:
resource "aws_iam_openid_connect_provider" "example" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.core_eks.certificates[0].sha1_fingerprint]
  url             = local.oidc_provider_url
}

Step3: Create the IAM Policy

resource "aws_iam_policy" "alb_ingress_controller" {
  name        = "aws-alb-ingress-iam-policy"
  description = "IAM Policy for the AWS Ingress controller"
  policy      = file("alb-ingress-iam-policy.json")
}

Step4: Create Service Account and Annotate the Service Account with the IAM Assume Role
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

Step 5: Assume Role for the service account created above
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



Stage 3: External DNS Configurations
Downlaod the YAML Deployment Specification from here: https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.0.0/docs/examples/external-dns.yaml
official docs: official doc: https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.1/guide/integrations/external_dns/
Deploy it to the cluster
```
Step1: 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: external-dns
spec:
  selector:
    matchLabels:
      app: external-dns
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: external-dns
    spec:
      serviceAccountName: external-dns
      containers:
        - name: external-dns
          image: bitnami/external-dns:0.7.1
          args:
            - --source=service
            - --source=ingress
            - --domain-filter={replace with your dns name}
            - --provider=aws
            - --policy=upsert-only
            - --aws-zone-type=public
            - --registry=txt
            - --txt-owner-id={replace with your Route53 Hosted Zone}
          resources:
            limits:
              memory: 128Mi
              cpu: 100m
            requests:
              memory: 128Mi
              cpu: 100m
      securityContext:
        fsGroup: 65534
```