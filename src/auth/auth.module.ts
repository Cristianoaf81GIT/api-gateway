import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AwsModule  } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [AuthController],
})
export class AuthModule {}
