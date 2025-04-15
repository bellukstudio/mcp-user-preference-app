import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) { }

    async register(username: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                username,
                password: hashed,
                preferences: {
                    create: {
                        theme: 'light',
                        language: 'en',
                        notifications: true,
                    },
                },
            },
            include: {
                preferences: true,
            },
        });

        return this.signToken(user.id, user.username);
    }

    async login(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            include: { preferences: true },
        });

        if (!user) throw new NotFoundException('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Wrong password');

        return this.signToken(user.id, user.username);
    }
        
    async signToken(userId: number, username: string) {
        const payload = { sub: userId, username };
        return {
            access_token: this.jwt.sign(payload),
        };
    }
}

