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
- [Identity Access Management(IAM) & Security](#identity-and-access-managementiam-and-security)
- [Networking](#networking)
- [Compute](#compute-container-orchestration-and-serverless)
- [CDN and Load Balancer](#cdn-and-load-balancers)
- [Storage and Messaging](#storage-and-messaging)
- [Databases](#databasesdata-stores-oltp-and-olap)
- [Continous Integration and Continous Delivery](#continous-integration-and-continous-delivery)
- [Data Engineering](#data-analytics-aiml)
- [Observability](#observability-logging-monitoring-and-distributed-tracing)
- [Learning Resources](#learning-resources)

## Learning Resources

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS Solution Implementations](https://aws.amazon.com/solutions/campaign-implementations/) | [Azure Solution Ideas](https://docs.microsoft.com/en-us/azure/architecture/solution-ideas/articles/advanced-analytics-on-big-data) | ?
| [AWS Reference Architecture Diagrams](https://aws.amazon.com/architecture/reference-architecture-diagrams/) | [Reference architectures on Azure](https://docs.microsoft.com/en-us/azure/architecture/browse/?filter=reference-architecture) | ?
| ? | [Industry Solutions with Azure](https://docs.microsoft.com/en-us/azure/architecture/industries/healthcare) | ?
| [AWS DevOps](https://aws.amazon.com/devops/resources/) | [Azure DevOps Product](https://azure.microsoft.com/en-gb/solutions/devops/#products) | ?
| [Well-Architected Framework Pillars on AWS](https://aws.amazon.com/blogs/apn/the-6-pillars-of-the-aws-well-architected-framework/) | [Well-Architected Framework Pillars on Azure](https://docs.microsoft.com/en-us/azure/architecture/framework/) | ?
</br>

## Infrastructure as Code
| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS Cloudformation template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) | [Azure template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/) | [Google Deployment Manager](https://cloud.google.com/deployment-manager/docs)
| [AWS Serverles Architecture model(SAM)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) | ? | ?
| AWS CDK | ? | ?
| [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) | [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) | [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

__Small Note__: While I think Azure use json for IaC, I know AWS have option for YAML and JSON and I personally do prefer YAML in a lot of times. Likewise, AWS have much tooling for IaC other than Cloudformation template includding CDK, SAM

</br>

## Identity and Access Management(IAM) and Security

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) | [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/) | ?
| [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) | ? | ?
| [KMS Keys](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) | ? | ?
| [SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) | ? | ?
| [Secret Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) | ? |

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
| [Elastic Kubernetes Service(EKS)](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) | [Azure kubernetes Engine(AKS)](https://docs.microsoft.com/en-us/azure/aks/) & [Service Fabric](https://docs.microsoft.com/en-us/azure/service-fabric/) | [Google Kubernetes Engine(GKE)](https://cloud.google.com/kubernetes-engine/docs)
| [Elastic Container Service(ECS)](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)  | [Azure Container Instance](https://docs.microsoft.com/en-us/azure/container-instances/) | ?
| [EC2 Instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) | [Azure Virtual Machine](https://docs.microsoft.com/en-us/azure/virtual-machines/) | [Compute Engine](https://cloud.google.com/compute/docs)
| [Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) | [Azure functions](https://docs.microsoft.com/en-us/azure/azure-functions/) | [Cloud Functions](https://cloud.google.com/functions)
| [AWS Amplify](https://docs.amplify.aws/) | [Azure app services](https://docs.microsoft.com/en-us/azure/app-service/) | ?
| [AutoScaling Group(ASG) for EC2 Instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) | [Azure Virtual Machine Scaling](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview) | ?
| [AWS Batch](https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html) | [Azure Batch](https://docs.microsoft.com/en-us/azure/batch/batch-technical-overview) | ?
| [Elastic Container Registry(ECR)](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) | [Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/) | ?

__Small Note__: Still exploring
</br>

## CDN and Load Balancers

| AWS                                   |       Azure                           |   GCP                             |
:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------:|:-----------------------------------------|
[AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) | [Azure CDN](https://docs.microsoft.com/en-us/azure/cdn/) | ?
| [Elastic Load Balancer(ALB, NLB, Classic)](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html) | [Azure Load Balancer](https://docs.microsoft.com/en-us/azure/load-balancer/) | ?
| [AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html) | [Azure front Door](https://docs.microsoft.com/en-us/azure/frontdoor/) | ?
| [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | [Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/)
| [AWS Route53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html) | [Azure DNS](https://docs.microsoft.com/en-us/azure/dns/) | ?
| ? | [Azure traffic manager](https://docs.microsoft.com/en-us/azure/traffic-manager/) | ?

__Small Note__: Still exploring
</br>

## Storage and Messaging

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS S3](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) | [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/) | [Cloud Storage](https://cloud.google.com/storage/docs)
| [AWS EFS](https://docs.aws.amazon.com/efs/) | [Azure Files](https://azure.microsoft.com/en-us/services/storage/files/) |
| [EBS Volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html) | [Azure managed Disks](https://docs.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview) | ?
| [AWS Backups](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html) | [Azure Backups](https://docs.microsoft.com/en-us/azure/backup/) | ?
| [AWS SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html) | [Queue Storage](https://docs.microsoft.com/en-us/azure/storage/queues/storage-nodejs-how-to-use-queues?tabs=javascript) | ?
| [AWS SNS](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) |  [Service Bus](https://azure.microsoft.com/en-us/services/service-bus/) | ?
| [Amazon EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html) |  [Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/overview) | ?
| [Amazon Kinesis](https://docs.aws.amazon.com/kinesis/index.html) | [Azure Event Hub](https://docs.microsoft.com/en-us/azure/event-hubs/) | ?
| [Apache Managed Service for Kafka(MSK)](https://docs.aws.amazon.com/msk/latest/developerguide/getting-started.html) | [Apache kafka on Azure HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/kafka/apache-kafka-introduction) | ?

__Small Note__: Still exploring
</br>

## Databases(Data Stores): OLTP and OLAP

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) | [Azure SQL](https://docs.microsoft.com/en-us/azure/azure-sql/) | [Cloud SQL](https://cloud.google.com/sql/docs)
| [AWS DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) | [Azure CosmosDB](https://docs.microsoft.com/en-us/azure/cosmos-db/) | [Real-time Firebase & Firestore](https://cloud.google.com/firestore)
| [AWS RedShift](https://docs.aws.amazon.com/redshift/latest/gsg/sample-data-load.html) | [Azure Synapse Analytics](https://docs.microsoft.com/en-us/azure/synapse-analytics/) | [Google BigQuery](https://cloud.google.com/bigquery/docs)
| [ElasticCache for Redis](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/SelectEngine.html) | [Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/) | ?

__Small Note__: Still exploring
</br>

## Data Analytics, AI/ML

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html) | [Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/) | ?
| [AWS QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/welcome.html) | [Power BI on Azure](https://docs.microsoft.com/en-us/power-bi/guidance/) | ?

__Small Note__: Still exploring
</br>

## Continous Integration and Continous Delivery

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html) | [Azure Pipeline](https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops) | ?
| [AWS CodeCommit](https://docs.aws.amazon.com/codecommit/latest/userguide/welcome.html) | [Azure Repos](https://docs.microsoft.com/en-us/azure/devops/repos/?view=azure-devops) | ?
| [AWS Code Build](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html) | ? | ? 
| [AWS Code Deploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html) | ? | ?
| ? | [Azure Boards](https://azure.microsoft.com/en-gb/services/devops/boards/) | ? 

__Small Note__: [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops) Is a package of tools that includes Azure Pipeline, Azure Repo etc for DevOps practices on Azure. While on AWS,[AWS DevOps](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/welcome.html) have CodePipeline, Code Build, Code Deploy and Code Commit for all CI/CD Operations and DevOps Practices
</br>

## Observability: Logging, Monitoring and Distributed Tracing

| AWS                               | Azure                             | GCP                               |
:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------:|:----------------------------------|
| [AWS CloudWatch](https://docs.aws.amazon.com/cloudwatch/index.html) & [X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) | [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/) | ?

__Small Note__: Still exploring
</br>
