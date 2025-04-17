import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';


@Controller('claude')
export class ClaudeController {
    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
    ) { }

    @Post()
    async sendToClaude(@Body() body: { message: string }) {
        const apiKey = this.config.get<string>('CLAUDE_API_KEY');
        if (!apiKey) throw new HttpException('Missing API key', 500);

        try {
            const res = await this.http.axiosRef.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: 'claude-3-7-sonnet-20250219',
                    max_tokens: 1024,
                    temperature: 0.5,
                    messages: [
                        {
                            role: 'user',
                            content: `You are an AI assistant that manages user preferences. Extract commands like { "theme": "dark" } from: "${body.message}"`
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                },
            );

            return res.data;
        } catch (err) {
            console.error("Claude API ERROR:", err?.response?.data || err.message || err);
            throw new HttpException('Claude request failed', 500);
        }
    }
}
