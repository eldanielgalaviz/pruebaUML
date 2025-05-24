// backend/src/academic/controllers/grupos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GruposService } from '../services/grupos.service';
import { CreateGrupoDto } from '../dto/create-grupo.dto';
import { UpdateGrupoDto } from '../dto/update-grupo.dto';
import { AsignAlumnoGrupoDto } from '../dto/asign-alumno-grupo.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Comentado temporalmente

@Controller('academic/grupos')
// @UseGuards(JwtAuthGuard) // Comentado temporalmente para debug
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    console.log('Controlador - Creando grupo:', createGrupoDto);
    return this.gruposService.create(createGrupoDto);
  }

  @Get()
  findAll() {
    console.log('Controlador - Obteniendo todos los grupos');
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

  // Asignar alumno a grupo
  @Post(':grupoId/alumnos')
  asignarAlumno(
    @Param('grupoId', ParseIntPipe) grupoId: number,
    @Body() asignAlumnoDto: AsignAlumnoGrupoDto
  ) {
    return this.gruposService.asignarAlumno(grupoId, asignAlumnoDto.alumnoId);
  }

  // Remover alumno de grupo
  @Delete(':grupoId/alumnos/:alumnoId')
  removerAlumno(
    @Param('grupoId', ParseIntPipe) grupoId: number,
    @Param('alumnoId', ParseIntPipe) alumnoId: number
  ) {
    return this.gruposService.removerAlumno(grupoId, alumnoId);
  }

  // Obtener alumnos de un grupo
  @Get(':id/alumnos')
  getAlumnosDelGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.getAlumnosDelGrupo(id);
  }

  // Obtener horarios de un grupo
  @Get(':id/horarios')
  getHorariosDelGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.getHorariosDelGrupo(id);
  }
}