import * as cdk from '@aws-cdk/core';
import * as cognito from "@aws-cdk/aws-cognito"
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as neptune from '@aws-cdk/aws-neptune'
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  


    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'NeptuneAPI',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
        
          authorizationType: appsync.AuthorizationType.API_KEY
        },
      },
      logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
      xrayEnabled: true,
    })

    const vpc = new ec2.Vpc(this, 'NeptuneVPC')

    const lambdaFn = new lambda.Function(this, 'Lambda Function', {
      runtime: lambda.Runtime.NODEJS_14_X,
       handler: 'main.handler',
       code: lambda.Code.fromAsset('lambda-fns'),
       memorySize: 1024,
       vpc
     })
     
     // set the new Lambda function as a data source for the AppSync API
     const lambdaDs = api.addLambdaDataSource('lambdaDatasource', lambdaFn);
 
     lambdaDs.createResolver({
       typeName: "Query",
       fieldName: "listPerson"
     })
     lambdaDs.createResolver({
       typeName: "Mutation",
       fieldName: "addPerson"
     })
     lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addRestaurant"
    })

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addReview"
    })
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addCuisine"
    })


 
     const cluster = new neptune.DatabaseCluster(this, 'NeptuneCluster', {
       vpc,
       instanceType: neptune.InstanceType.R5_LARGE
     })
 
     cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world')
 
     const writeAddress = cluster.clusterEndpoint.socketAddress;
 
     new cdk.CfnOutput(this, 'writeaddress', {
       value: writeAddress
     })
 
     const readAddress = cluster.clusterReadEndpoint.socketAddress
 
     new cdk.CfnOutput(this, 'readaddress', {
       value: readAddress
     })
 
     lambdaFn.addEnvironment('WRITER', writeAddress)
     lambdaFn.addEnvironment('READER', readAddress)
 


       


  }
}
