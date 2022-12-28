import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Passport JWT strategy configuration to secure endpoints by requesting a valid JWT token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // delegate expiration validation to Passport module.
      secretOrKey: configService.get<string>('JWT_SECRET'), // common secret with the jWT signature process.
    });
  }

  /**
   * From the decoded JSON given by Passport (after signature validation), construct and
   * return the user object that will be attached to the Request object of the API route.
   * @param payload Decoded JSON given by Passport.
   * @returns The user object.
   */
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
