// backend/src/academic/controllers/horarios.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { HorariosService } from '../services/horarios.service';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('academic/horarios')
@UseGuards(JwtAuthGuard)
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horariosService.create(createHorarioDto);
  }

  @Get()
  findAll() {
    return this.horariosService.findAll();
  }

  @Get('by-grupo/:grupoId')
  findByGrupo(@Param('grupoId', ParseIntPipe) grupoId: number) {
    return this.horariosService.findByGrupo(grupoId);
  }

  @Get('by-profesor/:profesorId')
  findByProfesor(@Param('profesorId', ParseIntPipe) profesorId: number) {
    return this.horariosService.findByProfesor(profesorId);
  }

  @Get('by-aula/:aulaId')
  findByAula(@Param('aulaId', ParseIntPipe) aulaId: number) {
    return this.horariosService.findByAula(aulaId);
  }

  @Get('conflicts')
  checkConflicts(@Query('dia') dia: string, @Query('horaInicio') horaInicio: string, @Query('horaFin') horaFin: string) {
    return this.horariosService.checkConflicts(dia, horaInicio, horaFin);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.horariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horariosService.update(id, updateHorarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.horariosService.remove(id);
  }
}