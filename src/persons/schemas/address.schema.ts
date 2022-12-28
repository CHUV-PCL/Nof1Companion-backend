import { Schema } from 'mongoose';
import { encrypt, decrypt } from '../../utils/cipher';

export class Address {
  street: string;
  zip: string;
  city: string;
  country: string;
}

/**
 * Schema representing address information.
 */
export const AddressSchema = new Schema<Address>(
  {
    street: {
      type: String,
      get: decrypt,
      set: encrypt,
      default: '',
    },
    zip: {
      type: String,
      get: decrypt,
      set: encrypt,
      default: '',
    },
    city: {
      type: String,
      get: decrypt,
      set: encrypt,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false,
    _id: false,
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);
