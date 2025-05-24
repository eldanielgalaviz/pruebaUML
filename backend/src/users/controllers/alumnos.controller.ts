import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AlumnosService } from '../services/alumnos.service';
import { CreateAlumnoDto } from '../dto/create-alumno.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('alumnos')
@UseGuards(JwtAuthGuard)
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<CreateAlumnoDto>) {
    return this.alumnosService.update(id, updateData);
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