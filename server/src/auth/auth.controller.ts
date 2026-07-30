import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async google(@Body() dto: GoogleAuthDto) {
    const payload = await this.authService.verifyGoogleIdToken(dto.idToken);

    // Upsert : recherche par googleId === payload.sub, sinon par email, sinon création
    // avec userId = payload.sub (cohérent avec le front qui pose userId = googleId).
    let user = await this.authService.findUserByGoogleId(payload.sub);
    if (!user) {
      user = await this.authService.findUserByEmail(payload.email);
    }
    if (!user) {
      user = await this.authService.createUserFromGoogle(payload);
    }

    return this.authService.issueJwt(user);
  }
}