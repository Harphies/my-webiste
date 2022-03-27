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

# AWS | Azure | GCP Product or Services Options: The Goal is to make going multi-cloud less painful
You don't have to worry much about the option in each of your cloud provider of choice during migration or going multi-cloud, this ever growing list could be of help to make informed decisions:

## Categories

- [Infrastructure as Code](#infrastructure-as-code)
- [IAM](#iam-identity-and-access-management)
- [Networking](#networking)
- [Compute](#compute-container-orchestration-and-serverless)
- [CDN and Load Balancer](#cdn-and-load-balancers)
- [Storage and File Systems](#storage-object-storage-and-file-systems)
- [Databases](#databases)
- [Continous Integration and Continous Delivery](#conitnous-integration-and-continous-delivery)
- [Data Engineering](#data-analytics-aiml)

## Infrastructure as Code
| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS Cloudformation template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) | [Azure template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/) | ?
| AWS Serverles Architecture model(SAM) | ? | ?
| AWS CDK | ? | ?
| [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) | [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) | [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

__Small Note__: While I think Azure use json for IaC, I know AWS have option for YAML and JSON and I personally do prefer YAML in a lot of times. Likewise, AWS have much tooling for IaC other than Cloudformation template includding CDK, SAM

</br>

## IAM: Identity and Access Management

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) | [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/) | ?

__Small Note__: Still exploring

</br>

## Networking

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) | [Azure Virtual Network](https://docs.microsoft.com/en-us/azure/virtual-network/) | ?

__Small Note__: Still exploring

</br>

## Compute: Container Orchestration and Serverless

| AWS                                   |           Azure                       | GCP                               |
:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------:|:-------------------------:|
| [Elastic Kubernetes Service(EKS)](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) | [Azure kubernetes Engine(AKS)](https://docs.microsoft.com/en-us/azure/aks/)    | [Google Kubernetes Engine(GKE)](https://cloud.google.com/kubernetes-engine/docs)
| [Elastic Container Service(ECS)](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)  | [Azure Container Instance](https://docs.microsoft.com/en-us/azure/container-instances/) | ?
| [EC2 Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) | [Azure Virtual Machine](https://docs.microsoft.com/en-us/azure/virtual-machines/) | ?
| [Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) | [Azure functions](https://docs.microsoft.com/en-us/azure/azure-functions/) | [Cloud Functions](https://cloud.google.com/functions)
| [AWS Amplify](https://docs.amplify.aws/) | [Azure app services](https://docs.microsoft.com/en-us/azure/app-service/) | ?

__Small Note__: Still exploring
</br>

## CDN and Load Balancers

| AWS                                   |       Azure                           |   GCP                             |
:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------:|:-----------------------------------------|
[AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) | [Azure CDN](https://docs.microsoft.com/en-us/azure/cdn/) | ?
| [Elastic Load Balancer(ALB, NLB, Classic)](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html) | [Azure Load Balancer](https://docs.microsoft.com/en-us/azure/load-balancer/) | ?
| [AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html) | [Azure front Door](https://docs.microsoft.com/en-us/azure/frontdoor/) | ?
| [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | [Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/)

__Small Note__: Still exploring
</br>

## Storage (Object Storage) and File Systems

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS S3](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) | [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/) | ?

__Small Note__: Still exploring
</br>

## Databases

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) | [Azure SQL](https://docs.microsoft.com/en-us/azure/azure-sql/) | ?
| [AWS DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) | [Azure CosmosDB](https://docs.microsoft.com/en-us/azure/cosmos-db/) | ?
| [AWS RedShift](https://docs.aws.amazon.com/redshift/latest/gsg/sample-data-load.html) | ? | [Google BigQuery](https://cloud.google.com/bigquery/docs)

__Small Note__: Still exploring
</br>

## Data Analytics AI/ML

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html) | [Azure SQL](https://docs.microsoft.com/en-us/azure/data-factory/) | ?

__Small Note__: Still exploring
</br>

## Conitnous Integration and Continous Delivery

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html) | [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops) | ?

__Small Note__: Still exploring
</br>