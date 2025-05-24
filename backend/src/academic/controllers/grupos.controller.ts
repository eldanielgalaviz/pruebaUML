import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GruposService } from '../services/grupos.service';
import { CreateGrupoDto } from '../dto/create-grupo.dto';
import { UpdateGrupoDto } from '../dto/update-grupo.dto';
import { AsignAlumnoGrupoDto } from '../dto/asign-alumno-grupo.dto';

@Controller('academic/grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.gruposService.create(createGrupoDto);
  }

  @Get()
  findAll() {
    return this.gruposService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.gruposService.update(id, updateGrupoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.remove(id);
  }

  @Post(':grupoId/alumnos')
  asignarAlumno(
    @Param('grupoId', ParseIntPipe) grupoId: number,
    @Body() asignAlumnoDto: AsignAlumnoGrupoDto
  ) {
    return this.gruposService.asignarAlumno(grupoId, asignAlumnoDto.alumnoId);
  }

  @Delete(':grupoId/alumnos/:alumnoId')
  removerAlumno(
    @Param('grupoId', ParseIntPipe) grupoId: number,
    @Param('alumnoId', ParseIntPipe) alumnoId: number
  ) {
    return this.gruposService.removerAlumno(grupoId, alumnoId);
  }

  @Get(':id/alumnos')
  getAlumnosDelGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.getAlumnosDelGrupo(id);
  }

  @Get(':id/horarios')
  getHorariosDelGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.getHorariosDelGrupo(id);
  }
}