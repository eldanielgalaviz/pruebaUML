// backend/src/users/controllers/grupos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GruposService } from '../services/grupos.service';
import { CreateGrupoDto } from '../dto/create-grupo.dto';
import { UpdateGrupoDto } from '../dto/update-grupo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('grupos')
@UseGuards(JwtAuthGuard)
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

  @Get('disponibles')
  getGruposDisponibles() {
    return this.gruposService.getGruposDisponibles();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.findOne(id);
  }

  @Get(':id/alumnos')
  getAlumnosDelGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.getAlumnosDelGrupo(id);
  }

  @Get(':id/horarios')
  getHorariosDelGrupo(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.getHorariosDelGrupo(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.gruposService.update(id, updateGrupoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.remove(id);
  }

  @Post(':grupoId/alumnos/:alumnoId')
  asignarAlumno(
    @Param('grupoId', ParseIntPipe) grupoId: number,
    @Param('alumnoId', ParseIntPipe) alumnoId: number
  ) {
    return this.gruposService.asignarAlumno(grupoId, alumnoId);
  }

  @Delete(':grupoId/alumnos/:alumnoId')
  removerAlumno(
    @Param('grupoId', ParseIntPipe) grupoId: number,
    @Param('alumnoId', ParseIntPipe) alumnoId: number
  ) {
    return this.gruposService.removerAlumno(grupoId, alumnoId);
  }
}