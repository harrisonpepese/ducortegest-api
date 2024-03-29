import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FuncionarioDto } from './funcionario.dto';
import { FuncionarioService } from './funcionario.service';
import { Funcionario } from './funcionario.entity';
import ICrudController from 'src/interfaces/controller/icrudcontroller';
import { InjectMapper, MapPipe } from '@automapper/nestjs';
import { addProfile, Mapper } from '@automapper/core';
import { FuncionarioProfile } from './funcionario.profile';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('funcionario')
@UseGuards(JwtAuthGuard)
export class FuncionarioController
  implements ICrudController<Funcionario, FuncionarioDto>
{
  constructor(
    private funcionarioService: FuncionarioService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly funcionarioProfile: FuncionarioProfile,
  ) {
    addProfile(mapper, funcionarioProfile.profile);
  }

  @Get()
  async find(): Promise<FuncionarioDto[]> {
    const result = await this.funcionarioService.find();
    return this.mapper.mapArray(result, Funcionario, FuncionarioDto);
  }
  @Get('/query')
  async findQuery(@Query('filter') filter: string): Promise<FuncionarioDto[]> {
    const result = await this.funcionarioService.findQuery(filter);
    return this.mapper.mapArray(result, Funcionario, FuncionarioDto);
  }
  @Post()
  async create(
    @Body(MapPipe(FuncionarioDto, Funcionario)) funcionarioDto: Funcionario,
  ): Promise<FuncionarioDto> {
    const result = await this.funcionarioService.create(funcionarioDto);
    return this.mapper.map(result, Funcionario, FuncionarioDto);
  }
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<FuncionarioDto> {
    const result = await this.funcionarioService.findById(id);
    return this.mapper.map(result, Funcionario, FuncionarioDto);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(MapPipe(FuncionarioDto, Funcionario)) funcionarioDto: Funcionario,
  ): Promise<FuncionarioDto> {
    return await this.funcionarioService.update(id, funcionarioDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.funcionarioService.delete(id);
  }
}
