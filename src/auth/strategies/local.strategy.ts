import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Passport custom local strategy to validate user according to their email and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // Passport strategy options
  }

  /**
   * Validate a user credentials.
   * @param email User email.
   * @param password User password.
   * @returns The user informations from the database or
   * raise an UnauthorizedException if not found.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(
      email.toLowerCase(),
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
