import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesorAcademicDto } from './create-profesor.dto';

export class UpdateProfesorAcademicDto extends PartialType(CreateProfesorAcademicDto) {}