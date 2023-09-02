import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // @nestjs/config = .env 사용
    ConfigModule.forRoot({ isGlobal: true }),
    // 데이터베이스 설정 관련 내용
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
