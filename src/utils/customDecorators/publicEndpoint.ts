import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'; // metadata key
// Decorator for public endpoints (not requiring a JWT token)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
