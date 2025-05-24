import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AulasService } from '../services/aulas.service';
import { CreateAulaDto } from '../dto/create-aula.dto';
import { UpdateAulaDto } from '../dto/update-aula.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('academic/aulas')
@UseGuards(JwtAuthGuard)
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulasService.create(createAulaDto);
  }

  @Get()
  findAll() {
    return this.aulasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulasService.update(id, updateAulaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.remove(id);
  }

  @Get(':id/horarios')
  getHorariosDelAula(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.getHorariosDelAula(id);
  }
}
