import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GruposService } from '../services/grupos.service';
import { CreateGrupoDto } from '../dto/create-grupo.dto';
import { UpdateGrupoDto } from '../dto/update-grupo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('grupos')
// @UseGuards(JwtAuthGuard) // ✅ Comentado temporalmente para testing
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    console.log('Creando grupo:', createGrupoDto);
    return this.gruposService.create(createGrupoDto);
  }

  @Get()
  findAll() {
    console.log('Obteniendo todos los grupos');
    return this.gruposService.findAll();
  }

  @Get('disponibles')
  getGruposDisponibles() {
    return this.gruposService.getGruposDisponibles();
  }

  @Get('estadisticas') // ✅ NUEVO ENDPOINT
  getEstadisticasGrupos() {
    return { message: 'Estadísticas de grupos - En desarrollo' };
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

  // ✅ ASIGNACIONES DE ALUMNOS
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
