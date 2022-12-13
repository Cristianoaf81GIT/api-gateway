
/*
 * @interface AwsConfigObject
 * @typedef AwsConfigObject
 * @member {string} userPoolId - aws user pool id
 * @member {string} clientId - aws client id
 * @member {string} region - aws region 
 * @member {string} authority - aws cognito user pool authority url
* */
export interface AwsConfigObject {  
  userPoolId: string;
  clientId: string;
  region: string;
  authority: string; 
}
