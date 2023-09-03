import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwt.config.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // @nestjs/config = .env 사용
    ConfigModule.forRoot({ isGlobal: true }),
    // 데이터베이스 설정 관련 내용
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      // AuthMilddleware에서도 사용할 수 있게 import
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    CacheModule.register({
      ttl: 60000, // 데이터 캐싱 시간(밀리 초 단위, 1000 = 1초)
      max: 100, // 최대 캐싱 개수
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // ttl 동안 limit 만큼의 요청만 받는다.
    }),
    BoardModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthMiddleware,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  // NestModule 인터페이스 구현
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // 미들웨어 적용!
      .forRoutes({ path: 'user/update', method: RequestMethod.PUT });
  }
}
