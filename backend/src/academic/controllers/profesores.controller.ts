import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProfesoresService } from '../services/profesores.service';
import { CreateProfesorDto } from '../dto/create-profesor.dto';
import { UpdateProfesorDto } from '../dto/update-profesor-dto';
// import { UpdateProfesorDto } from '../dto/update-profesor.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('academic/profesores')
@UseGuards(JwtAuthGuard)
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProfesorDto: UpdateProfesorDto) {
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