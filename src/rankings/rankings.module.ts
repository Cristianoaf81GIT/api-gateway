import { Module } from '@nestjs/common';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [ProxyrmqModule],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
