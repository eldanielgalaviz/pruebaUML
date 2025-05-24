// backend/src/users/controllers/aulas.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AulasService } from '../services/aulas.service';
import { CreateAulaDto } from '../dto/create-aula.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('aulas')
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

  @Get('disponibles')
  getAulasDisponibles() {
    return this.aulasService.getAulasDisponibles();
  }

  @Get('estadisticas')
  getEstadisticasOcupacion() {
    return this.aulasService.getEstadisticasOcupacion();
  }

  @Get('numero/:numero')
  findByNumero(@Param('numero') numero: string) {
    return this.aulasService.findByNumero(numero);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAulaDto: Partial<CreateAulaDto>) {
    return this.aulasService.update(id, updateAulaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.remove(id);
  }
}

