import {
  ClientProvider,
  ClientsModuleOptionsFactory,
} from '@nestjs/microservices';

export class DesafiosServiceConfig implements ClientsModuleOptionsFactory {
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    return {
      transport: Number(`${process.env.TRANSPORT_LOCAL}`),
      options: {
        urls: [`${process.env.SERVER_URL_LOCA}`],
        queue: `${process.env.CHALLENGES_QUEUE_NAME}`,
      },
    };
  }
}
