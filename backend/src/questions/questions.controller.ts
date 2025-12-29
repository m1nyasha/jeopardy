import { Controller, Get, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('api/questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get('categories')
  async findAllCategories() {
    return this.questionsService.findAllCategories();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.questionsService.findQuestionById(parseInt(id));
  }
}

