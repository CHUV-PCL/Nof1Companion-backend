import { Prop } from '@nestjs/mongoose';
import { encrypt, decrypt, encryptMail } from '../../utils/cipher';
import { Address, AddressSchema } from './address.schema';

/**
 * (Not directly a schema, but used as a basis for Schemas)
 * Class representing a person common information.
 * Base class for PatientSchema and PhysicianSchema.
 */
export class Person {
  @Prop({ required: true, set: encrypt, get: decrypt })
  lastname: string;

  @Prop({ required: true, set: encrypt, get: decrypt })
  firstname: string;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({ required: true, set: encrypt, get: decrypt })
  phone: string;

  @Prop({ required: true, set: encryptMail, get: decrypt })
  email: string;
}
