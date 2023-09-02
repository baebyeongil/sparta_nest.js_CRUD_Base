import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async getArticles() {
    return await this.articleRepository.find({
      where: { deletedAt: null },
      select: ['id', 'author', 'title', 'createdAt'],
    });
  }

  async getArticlesById(id: number) {
    return await this.articleRepository.findOne({
      where: { id, deletedAt: null },
      select: ['author', 'title', 'content', 'createdAt', 'updatedAt'],
    });
  }

  createArticles(title: string, content: string, password: number) {
    return this.articleRepository.insert({
      author: 'test',
      title,
      content,
      password: password.toString(),
    });
  }

  async updateArticles(
    id: number,
    title: string,
    content: string,
    password: number,
  ) {
    await this.veriftPassword(id, password);

    this.articleRepository.update(id, { title, content });
  }

  async deleteArticles(id: number, password: number) {
    await this.veriftPassword(id, password);

    this.articleRepository.softDelete(id);
  }

  private async veriftPassword(id: number, password: number) {
    const article = await this.articleRepository.findOne({
      where: { id, deletedAt: null },
      select: ['password'],
    });

    if (_.isNil(article)) {
      throw new NotFoundException('Article not found. id' + id);
    }

    if (article.password !== password.toString()) {
      throw new UnauthorizedException(`Password is not corrected, id: ${id}`);
    }
  }
}
