import { Address, AddressSchema } from './address.schema';
import { Schema } from 'mongoose';

export class Pharmacy {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

/**
 * Schema representing the pharmacy information.
 */
export const PharmacySchema = new Schema<Pharmacy>(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: AddressSchema },
  },
  { versionKey: false, _id: false },
);
