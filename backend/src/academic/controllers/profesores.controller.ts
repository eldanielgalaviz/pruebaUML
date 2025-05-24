import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProfesoresService } from '../services/profesores.service';
import { CreateProfesorAcademicDto } from '../dto/create-profesor.dto';
import { UpdateProfesorAcademicDto } from '../dto/update-profesor-academic.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('academic/profesores')
@UseGuards(JwtAuthGuard)
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorAcademicDto) {
    return this.profesoresService.create(createProfesorDto);
  }

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProfesorDto: UpdateProfesorAcademicDto) {
    return this.profesoresService.update(id, updateProfesorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.remove(id);
  }

  @Get(':id/horarios')
  getHorariosDelProfesor(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.getHorariosDelProfesor(id);
  }
}