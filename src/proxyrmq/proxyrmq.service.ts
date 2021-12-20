import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class ProxyrmqService {
  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Number(process.env.TRANSPORT_LOCAL),
      options: {
        urls: [`${process.env.SERVER_URL_LOCAL}`],
        queue: `${process.env.QUEUE_NAME_LOCAL}`,
      },
    });
  }
}
