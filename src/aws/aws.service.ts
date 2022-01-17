import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);
  public async uploadArquivo(file: any, id: string) {
    const s3 = new aws.S3({
      region: `${process.env.AWS_REGION}`,
      accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
      secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    });

    const fileExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: process.env.AWS_BCKT_NAME,
      Key: urlKey,
      ContentType: file.mimetype,
    };

    try {
      return await s3.upload(params).promise();
    } catch (error) {
      this.logger.debug(`error: ${JSON.stringify(error)}`);
      throw new BadGatewayException('upload file error');
    }
  }
}
