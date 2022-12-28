import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { decrypt, encryptMail } from '../../utils/cipher';
import mongooseLeanGetters from 'mongoose-lean-getters';

type UserDoc = User & Document;

/**
 * Schema representing a user.
 */
@Schema({
  versionKey: false,
  // Enable to use getters on almost all queries:
  toObject: { getters: true },
  toJSON: { getters: true },
})
class User {
  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
    set: encryptMail,
    get: decrypt,
    lowercase: true,
  })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongooseLeanGetters);

export { UserSchema, User, UserDoc };
