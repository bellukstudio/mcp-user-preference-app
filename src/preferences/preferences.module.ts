import { Module } from '@nestjs/common';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule, PassportModule, JwtModule],
  controllers: [PreferencesController],
  providers: [PreferencesService]
})
export class PreferencesModule {}
