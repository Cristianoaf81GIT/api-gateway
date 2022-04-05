import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class ProxyrmqService {
  constructor(private configService: ConfigService) {}

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Number(this.configService.get<string>('TRANSPORT_LOCAL')),
      options: {
        urls: [`${this.configService.get<string>('SERVER_URL_LOCAL')}`],
        queue: `${this.configService.get<string>('QUEUE_NAME_LOCAL')}`,
      },
    });
  }

  getClientProxyDesafiosInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Number(this.configService.get<string>('TRANSPORT_LOCAL')),
      options: {
        urls: [`${this.configService.get<string>('SERVER_URL_LOCAL')}`],
        queue: `${this.configService.get<string>('CHALLENGES_QUEUE_NAME')}`,
      },
    });
  }
}
