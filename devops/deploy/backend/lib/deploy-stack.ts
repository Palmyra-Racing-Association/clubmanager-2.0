import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export class DeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const account = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    const vpc = ec2.Vpc.fromLookup(this, 'ImportVPC',{isDefault: true});

    const alb = elbv2.ApplicationLoadBalancer.fromLookup(this, 'alb', {
      loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:425610073499:loadbalancer/app/4343HogbackHill-lb/2bd650d93825f0dd',
    });

    const listener = alb.addListener('Listener', {
      port: 4443,
      open: true,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [elbv2.ListenerCertificate.fromArn('arn:aws:acm:us-east-1:425610073499:certificate/eca2cbf8-247e-4edc-86fb-99c8f28c9dd7')],
    });

    const dockerReg = `${account}.dkr.ecr.${region}.amazonaws.com`;
    const dockerImg = `${dockerReg}/pra/trackbossapi:latest`;

    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo su',
      'yum install -y awscli',
      'aws s3 cp s3://praconfig/tbenv-test /home/ec2-user',
      `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${dockerReg}`,
      `docker pull ${dockerImg}`,
      `docker run -p 3000:3000 --env-file /home/ec2-user/tbenv-test ${dockerImg}`,
    );

    const asg = new autoscaling.AutoScalingGroup(this, 'asg', {
      vpc,
      autoScalingGroupName: `${process.env.TRACKBOSS_ENVIRONMENT_NAME}-backend-asg`,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      // see https://aws.amazon.com/ec2/pricing/on-demand/ for this number. This should be checked against
      // instance classes every once in a while to make sure that this is optimal.
      spotPrice: '0.0084',      
      keyName: 'prakeyz',
      role: iam.Role.fromRoleName(this, 'ec2-role', 'ec2_aws_access'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      userData,
      minCapacity: 1,
      maxCapacity: 1,
    });

    listener.addTargets('trackboss-api', {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [asg],
      priority: 1,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['trackbosstestapi.palmyramx.com']),
      ],
      healthCheck: {
        path: '/api/health',
        unhealthyThresholdCount: 2,
        healthyThresholdCount: 5,
        interval: cdk.Duration.seconds(30),
      },
    });

    listener.addAction('trackboss', {
      // priority: 5,
      // conditions: [elbv2.ListenerCondition.pathPatterns(['/static'])],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/html',
        messageBody: '<h1>TrackBoss API</h1>',
      }),
    });

    new cdk.CfnOutput(this, 'albDNS', {
      value: alb.loadBalancerDnsName,
    });
  }
}