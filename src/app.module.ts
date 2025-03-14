import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from 'auth/strategy/jwt.strategy';
import { LogginMiddleware } from './logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>({
        type: 'postgres',
        url: configService.get('DB_URL'),
        port: configService.get<number>('DB_PORT'),
        synchronize: configService.get<boolean>('DB_SYNC'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        entities: [__dirname+'/**/*.entity{.ts,.js}'],
        logging:false
      })
    }),
    AuthModule,
    
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogginMiddleware)
      .forRoutes('*');
  }
}
