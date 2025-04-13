import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/core/decorator/current-user-.decorator';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('preferences')
export class PreferencesController {
    constructor(private preferencesService: PreferencesService) { }

    @Get()
    getPreferences(@CurrentUser() user: any) {
        return this.preferencesService.getPreferences(user.userId);
    }

    @Post()
    updatePreferences(@CurrentUser() user: any, @Body() body: UpdatePreferencesDto) {
        return this.preferencesService.updatePreferences(user.userId, body);
    }
}
