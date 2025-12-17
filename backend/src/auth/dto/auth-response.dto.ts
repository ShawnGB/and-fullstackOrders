import { Exclude } from 'class-transformer';

export class AuthResponseDto {
  id: string;
  name: string;
  email: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;
}
