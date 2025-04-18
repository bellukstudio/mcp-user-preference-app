import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PreferencesModule } from './preferences/preferences.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core/constants';
import { AllExceptionsFilter } from './core/filters/all-exception.filter';
import { ResponseTransformInterceptor } from './core/interceptor/response-api.interceptor';
import { ClaudeModule } from './claude/claude.module';
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    PreferencesModule,
    PrismaModule,
    ClaudeModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor
    },
    {
      provide: APP_FILTER, useClass: AllExceptionsFilter
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
