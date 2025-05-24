// backend/src/academic/controllers/asistencias.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AsistenciasService } from '../services/asistencias.service';
import { CreateAsistenciaDto } from '../dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from '../dto/update-asistencia.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('academic/asistencias')
@UseGuards(JwtAuthGuard)
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post()
  create(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciasService.create(createAsistenciaDto);
  }

  @Get()
  findAll(@Query('fecha') fecha?: string, @Query('profesorId') profesorId?: string) {
    return this.asistenciasService.findAll(
      fecha ? new Date(fecha) : undefined,
      undefined,
      profesorId ? parseInt(profesorId, 10) : undefined
    );
  }

  @Get('reporte')
  generateReport(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.asistenciasService.generateReport(
      new Date(fechaInicio),
      new Date(fechaFin)
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asistenciasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAsistenciaDto: UpdateAsistenciaDto) {
    return this.asistenciasService.update(id, updateAsistenciaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asistenciasService.remove(id);
  }
}