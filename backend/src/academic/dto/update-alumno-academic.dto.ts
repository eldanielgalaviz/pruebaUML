import { PartialType } from '@nestjs/mapped-types';
import { CreateAlumnoAcademicDto } from './create-alumno-academic.dto';

export class UpdateAlumnoAcademicDto extends PartialType(CreateAlumnoAcademicDto) {}
