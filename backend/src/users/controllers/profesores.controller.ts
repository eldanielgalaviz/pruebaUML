import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProfesoresService } from '../services/profesores.service';
import { CreateProfesorDto } from '../dto/create-profesor.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('profesores')
// @UseGuards(JwtAuthGuard) // ✅ Comentado temporalmente para testing
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
    console.log('Creando profesor:', createProfesorDto);
    return this.profesoresService.create(createProfesorDto);
  }

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get('disponibles')
  getProfesoresDisponibles() {
    return this.profesoresService.getProfesoresDisponibles();
  }

  @Get('estadisticas')
  getEstadisticasCarga() {
    return this.profesoresService.getEstadisticasCarga();
  }

  @Get('id-profesor/:idProfesor')
  findByIdProfesor(@Param('idProfesor') idProfesor: string) {
    return this.profesoresService.findByIdProfesor(idProfesor);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProfesorDto: Partial<CreateProfesorDto>) {
    return this.profesoresService.update(id, updateProfesorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.remove(id);
  }
}