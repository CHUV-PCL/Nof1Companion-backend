import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Authentication Guard, determining whether a request will be handled by the route handler or not.
 * Passing the strategy name directly to the AuthGuard(), in the "@UseGuards" decorator from
 * login route, introduces magic strings in the codebase. So we create this class to avoid that.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
