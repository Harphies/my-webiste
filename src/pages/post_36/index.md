---
path: "/blogs/multi-cloud"
date: "2022-03-27"
title: "Multi-Cloud Providers Comparism"
author: "Olalekan Taofeek"
timeToRead: "5"
smallTitle: "Multi-Cloud Providers Comparism"
description: "Multi-Cloud Providers Comparism"
postNum: "36"
---

<img src="./multi-cloud.jpg"/>
<br/>
<br/>
<br/>

# AWS | Azure | GCP Product or Services Options
You don't have to worry much about the option in each of your cloud provider of choise during migration or going multi-cloud, this ever growing list could be of help to make informed decision:

## Categories
- [Infrastructure as Code](#infrastructure-as-code)
- [Networking](#networking)
- [Compute](#compute-and-container-orchestration)
- [CDN and Load Balancer](#cdn-and-load-balancers)
- [Storage](#storage-object-storage)
- [File Systems](#file-systems)
- [Databases](#databases)
- [Data Engineering](#data-analytics-aiml)

## Infrastructure as Code
| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS Cloudformation template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) | [Azure template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/) | ?
| AWS Serverles Architecture model(SAM) | ? | ?
| AWS CDK | ? | ?
| [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) | [Terraform Azure](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) | [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

</br>
Small Note: While I think Azure use json for IaC, I know AWS have option for YAML and JSON and I personally do prefer YAML in a lot of times. Likewise, AWS have much tooling for IaC other than Cloudformation template includding CDK, SAM

</br>

## Networking 
</br>

## Compute and Container Orchestration

| AWS                                   |           Azure                       | GCP                               |
:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------:|:-------------------------:|
| [Elastic Kubernetes Service(EKS)](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) | [Azure kubernetes Engine(AKS)](https://docs.microsoft.com/en-us/azure/aks/)    | [Google Kubernetes Engine(GKE)](https://cloud.google.com/kubernetes-engine/docs)
| [Elastic Container Service(ECS)](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)  | [Azure Container Instance](https://docs.microsoft.com/en-us/azure/container-instances/) | ?
| [EC2 Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) | [Azure Virtual Machine](https://docs.microsoft.com/en-us/azure/virtual-machines/) | ?
| [Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) | [Azure functions](https://docs.microsoft.com/en-us/azure/azure-functions/) | [Cloud Functions](https://cloud.google.com/functions)
| [AWS Amplify](https://docs.amplify.aws/) | [Azure app services](https://docs.microsoft.com/en-us/azure/app-service/) | ?
</br>

## CDN and Load Balancers
</br>


## Storage (Object Storage)
</br>

## File Systems
</br>

## Databases
</br>

## Data Analytics AI/ML
</br>