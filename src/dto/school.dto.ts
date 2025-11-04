export class CreateSchoolDto {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export class UpdateSchoolDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}
