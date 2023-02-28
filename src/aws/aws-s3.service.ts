import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';


@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);

  constructor(private awsS3Config: AwsS3Config) {}

  public async uploadArquivo(file: any, id: string) {
    const s3 = new aws.S3({
      region: this.awsS3Config.AWS_REGION, //`${process.env.AWS_REGION}`,
      accessKeyId: this.awsS3Config.AWS_ACCESS_KEY_ID, //`${process.env.AWS_ACCESS_KEY_ID}`,
      secretAccessKey: this.awsS3Config.AWS_SECRET_ACCESS_KEY, //`${process.env.AWS_SECRET_ACCESS_KEY}`,
    });

    const fileExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: this.awsS3Config.AWS_S3_BUCKET_NAME, //process.env.AWS_BCKT_NAME,
      Key: urlKey,
      ContentType: file.mimetype,
    };

    try {
      return await s3.upload(params).promise();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      throw new BadGatewayException('upload file error');
    }
  }
}
