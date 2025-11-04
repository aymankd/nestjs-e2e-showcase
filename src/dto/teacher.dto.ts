export class CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  schoolId?: number;
}

export class UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  schoolId?: number;
}
