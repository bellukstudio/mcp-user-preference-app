import { Module } from '@nestjs/common';
import { ClaudeController } from './claude.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
    ],
    controllers: [ClaudeController],
})
export class ClaudeModule { }