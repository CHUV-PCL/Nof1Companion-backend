import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../utils/customDecorators/publicEndpoint';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller managing users endpoints.
 */
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Check if a user with the provided email exists.
   * @param email User's email.
   * @returns An object { userExists: boolean } indicating existence.
   */
  @Public()
  @Get(':email')
  exists(@Param('email') email: string) {
    return this.usersService.exists(email);
  }

  /**
   * Update a user email.
   * @param updateUserDto Dto containing user update infos.
   * @returns A message indicating a successful update or a BadRequest message.
   */
  @Patch()
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateEmail(
      updateUserDto.email,
      updateUserDto.newEmail,
    );
  }

  /**
   * Changes a user's password.
   * @param body User's id and new password.
   * @returns A message indicating a successful update or a BadRequest exception.
   */
  @Patch('reset-password')
  resetPassword(@Body() body: { id: string; newPwd: string }) {
    return this.usersService.resetPassword(body.id, body.newPwd);
  }

  /**
   * Delete a user by email.
   * @param email User email.
   * @returns An object indicating the delete count.
   */
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }
}
