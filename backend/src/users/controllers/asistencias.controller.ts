import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AsistenciasService } from '../services/asistencias.service';
import { CreateAsistenciaDto } from '../dto/create-asistencia.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('asistencias')
@UseGuards(JwtAuthGuard)
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post()
  create(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciasService.create(createAsistenciaDto);
  }

  @Get()
  findAll(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('profesorId') profesorId?: string
  ) {
    return this.asistenciasService.findAll(
      fechaInicio ? new Date(fechaInicio) : undefined,
      fechaFin ? new Date(fechaFin) : undefined,
      profesorId ? parseInt(profesorId) : undefined
    );
  }

  @Get('profesor/:profesorId')
  getAsistenciasPorProfesor(
    @Param('profesorId', ParseIntPipe) profesorId: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    return this.asistenciasService.getAsistenciasPorProfesor(
      profesorId,
      fechaInicio ? new Date(fechaInicio) : undefined,
      fechaFin ? new Date(fechaFin) : undefined
    );
  }

  @Post('marcar')
  marcarAsistencia(@Body() body: {
    profesorId: number;
    fecha: string;
    hora: string;
    asistio: boolean;
    horarioId?: number;
    observaciones?: string;
  }) {
    return this.asistenciasService.marcarAsistencia(
      body.profesorId,
      new Date(body.fecha),
      body.hora,
      body.asistio,
      body.horarioId,
      body.observaciones
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asistenciasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<CreateAsistenciaDto>) {
    return this.asistenciasService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asistenciasService.remove(id);
  }
}