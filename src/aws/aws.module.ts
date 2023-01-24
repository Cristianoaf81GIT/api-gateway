import { Module } from '@nestjs/common';

import { AwsS3Service } from './aws-s3.service';
import { AwsCognitoConfig } from './aws-cognito-config';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsS3Config } from './aws-s3.config';

@Module({
  providers: [AwsS3Config, AwsS3Service, AwsCognitoConfig, AwsCognitoService],
  exports: [AwsS3Service, AwsCognitoConfig, AwsCognitoService, AwsS3Config],
})
export class AwsModule {}
