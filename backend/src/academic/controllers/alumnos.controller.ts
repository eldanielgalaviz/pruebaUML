import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AlumnosService } from '../services/alumnos.service';
import { CreateAlumnoAcademicDto } from '../dto/create-alumno-academic.dto';
import { UpdateAlumnoAcademicDto } from '../dto/update-alumno-academic.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('academic/alumnos')
@UseGuards(JwtAuthGuard)
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoAcademicDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  @Get()
  findAll() {
    return this.alumnosService.findAll();
  }

  @Get('sin-grupo')
  findAlumnosSinGrupo() {
    return this.alumnosService.findAlumnosSinGrupo();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alumnosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAlumnoDto: UpdateAlumnoAcademicDto) {
    return this.alumnosService.update(id, updateAlumnoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alumnosService.remove(id);
  }

  @Get(':id/horarios')
  getHorariosDelAlumno(@Param('id', ParseIntPipe) id: number) {
    return this.alumnosService.getHorariosDelAlumno(id);
  }
}