import { Injectable  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ICognitoUserPoolData } from 'amazon-cognito-identity-js';

import { AwsConfigObject } from './interfaces/aws-config.interface';

@Injectable()
export class AwsCognitoConfig {
  
  private userPoolId: string;
  private clientId: string;
  private region: string;
  private authority: string;

  constructor(private configService: ConfigService) {
    this.userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get<string>('AWS_COGNITO_USER_POOL_CLIENTID');
    this.region = this.configService.get<string>('AWS_REGION');
    this.authority = this.configService.get<string>('AWS_COGNITO_AUTHORITY_URL');
  }
  
  public cognitoUserPoolConfigData(): ICognitoUserPoolData {
    return {
      ClientId: this.clientId,
      UserPoolId: this.userPoolId
    } 
  }

  public getConfig(): AwsConfigObject {
    return {
      userPoolId: this.userPoolId,
      clientId: this.clientId,
      region: this.region,
      authority: this.authority
    }
  }
}



