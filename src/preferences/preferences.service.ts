import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PreferencesService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getPreferences(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { preferences: true }

        });

        if (!user) throw new NotFoundException("user not found");
        return user.preferences;
    }

    async updatePreferences(userId: number, data: any) {
        return this.prisma.preference.update({
            where: { userId },
            data,
        });
    }
}
