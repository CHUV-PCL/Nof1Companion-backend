import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PhysiciansService } from '../persons/physicians/physicians.service';

/**
 * Service managing user registration, authentication and validation.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly physiciansService: PhysiciansService,
  ) {}

  /**
   * Upon successful authentication, generate and return a JWT token from the user
   * properties and user information.
   * @param user User identified.
   * @returns An object containing the JWT token and user information.
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const userInfos = await this.physiciansService.findByEmail(user.email);
    return {
      access_token: this.jwtService.sign(payload),
      user: userInfos.response,
    };
  }

  /**
   * Register a new user into the database.
   * The user's password is hashed before storing it.
   * @param userDto User to register.
   * @returns An object containing the JWT token and user information, upon
   * successful registration, otherwise a BadRequestException.
   */
  async register(userDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);
    // Create an entry for further authentication.
    const user = await this.usersService.create(userDto.email, hashedPassword);
    // Store user's information in the database.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPwd } = userDto;
    try {
      const userInfos = await this.physiciansService.createPhysician(
        userWithoutPwd,
      );
      const payload = { email: userDto.email, sub: userInfos._id };
      return {
        access_token: this.jwtService.sign(payload),
        user: userInfos,
      };
    } catch (error) {
      await this.usersService.remove(user._id);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Validate a user authentication informations by comparing them
   * with the ones stored in the database.
   * @param email User email.
   * @param password User password.
   * @returns User informations without the password, or null if credentials are not valid.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return { email: user.email, id: user._id };
      }
    }
    return null;
  }
}
