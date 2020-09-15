import { BaseService } from './base-service';
import { UserDto } from '../store/entities/user-dto';

export class UsersService extends BaseService<UserDto> {
  constructor() { 
    super('users');
  }
}

const userService = new UsersService();
export default userService; 