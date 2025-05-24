import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { HorariosService } from '../services/horarios.service';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('horarios')
// @UseGuards(JwtAuthGuard) // ✅ Comentado temporalmente para testing
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

  @Get('semana')
  getHorariosSemana() {
    return this.horariosService.getHorariosSemana();
  }

  @Get('ocupacion-aulas')
  getOcupacionAulas() {
    return this.horariosService.getOcupacionAulas();
  }

  @Get('conflictos') // ✅ CORREGIDO - era 'conflicts'
  checkConflictos(
    @Query('dia') dia: string,
    @Query('horaInicio') horaInicio: string,
    @Query('horaFin') horaFin: string,
    @Query('excludeId') excludeId?: number
  ) {
    return this.horariosService.checkConflicts(dia, horaInicio, horaFin, excludeId);
  }

  @Get('grupo/:grupoId')
  findByGrupo(@Param('grupoId', ParseIntPipe) grupoId: number) {
    return this.horariosService.findByGrupo(grupoId);
  }

  @Get('profesor/:profesorId')
  findByProfesor(@Param('profesorId', ParseIntPipe) profesorId: number) {
    return this.horariosService.findByProfesor(profesorId);
  }

  @Get('aula/:aulaId')
  findByAula(@Param('aulaId', ParseIntPipe) aulaId: number) {
    return this.horariosService.findByAula(aulaId);
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
