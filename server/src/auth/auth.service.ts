import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface GooglePayload {
  sub: string;
  email: string;
  name?: string;
}

export interface JwtPayload {
  sub: string;
  userId: string;
}

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    @Inject('GOOGLE_CLIENT_ID') private readonly googleClientId: string,
  ) {
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async verifyGoogleIdToken(idToken: string): Promise<GooglePayload> {
    // [NON VÉRIFIÉ: signature exacte verifyIdToken — API google-auth-library standard.
    //  Vérifier la version installée au runtime ; adapter si l'API diffère.]
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid Google id_token payload');
      }
      return { sub: payload.sub, email: payload.email, name: payload.name };
    } catch (err) {
      throw new UnauthorizedException(
        `Google id_token verification failed: ${(err as Error).message}`,
      );
    }
  }

  async issueJwt(user: User): Promise<{ accessToken: string; user: User }> {
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, userId: user.userId } satisfies JwtPayload,
      { expiresIn: '7d' },
    );
    return { accessToken, user };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: payload.sub } });
  }

  findUserByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  findUserByEmail(email: string): Promise<User | null> {
    // email n'est pas @unique dans le schéma -> findFirst (pas findUnique).
    return this.prisma.user.findFirst({ where: { email } });
  }

  createUserFromGoogle(payload: GooglePayload): Promise<User> {
    return this.prisma.user.create({
      data: {
        userId: payload.sub,
        googleId: payload.sub,
        email: payload.email,
        username: payload.name ?? payload.email,
      },
    });
  }
}