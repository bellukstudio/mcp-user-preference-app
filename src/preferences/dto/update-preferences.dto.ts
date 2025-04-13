import { IsBoolean, IsString } from 'class-validator';

export class UpdatePreferencesDto {
    @IsString()
    theme: string;

    @IsString()
    language: string;

    @IsBoolean()
    notifications: boolean;
}