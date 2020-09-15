import { BaseEntity } from './base-entity';


export class UserDto extends BaseEntity {
  email: string;

  firstName: string;

  lastName: string;

  password: string;

  photoId?: number;

  darkMode: boolean = true;
  
  zipcode!: string;

  constructor(data?: any) {
    super();
    data = data || {}
    this.email = data.email || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.password = data.password || '';
  }
}

