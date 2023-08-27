import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DeleteArticleDto } from './dto/delete-article.dto';

@Controller('board') // routing path is /board => http://localhost:3000/board
export class BoardController {
  // 서비스 주입
  constructor(private readonly boardService: BoardService) {}

  // 게시물 목록 조회 API
  @Get('/articles')
  getArticles() {
    return this.boardService.getArticles();
  }

  // 게시물 상세 조회 API
  @Get('/articles/:id')
  getArticlesById(@Param('id') articleId: number) {
    return this.boardService.getArticlesById(articleId);
  }

  // 게시물 작성 API
  @Post('/articles')
  createArticles(@Body() data: CreateArticleDto) {
    return this.boardService.createArticles(
      data.title,
      data.content,
      data.password,
    );
  }

  // 게시물 수정 API
  @Put('/articles/:id')
  updateArticles(
    @Param('id') articleId: number,
    @Body() data: UpdateArticleDto,
  ) {
    return this.boardService.updateArticles(
      articleId,
      data.title,
      data.content,
      data.password,
    );
  }

  // 게시물 삭제 API
  @Delete('/articles/:id')
  deleteArticles(
    @Param('id') articleId: number,
    @Body() data: DeleteArticleDto,
  ) {
    return this.boardService.deleteArticles(articleId, data.password);
  }
}
