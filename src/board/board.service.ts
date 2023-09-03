import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Cache } from 'cache-manager';
import { ArticleRepository } from './article.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class BoardService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private articleRepository: ArticleRepository,
  ) {}

  async getArticles() {
    const cachedArticles = await this.cacheManager.get('articles');
    if (!_.isNil(cachedArticles)) {
      return cachedArticles;
    }

    const articles = await this.articleRepository.find({
      where: { deletedAt: null },
      select: ['author', 'title', 'updatedAt'],
    });
    await this.cacheManager.set('articles', articles);
    return articles;
  }

  async getArticlesById(id: number) {
    return await this.articleRepository.findOne({
      where: { id, deletedAt: null },
      select: ['author', 'title', 'content', 'createdAt', 'updatedAt'],
    });
  }

  // 일반 리포지토리엔 없는 커스텀 리포지터리에만 있는 함수!
  async getHotArticles() {
    return await this.articleRepository.getArticlesByViewCount();
  }

  createArticles(
    title: string,
    content: string,
    password: number,
    view: number,
  ) {
    return this.articleRepository.insert({
      author: 'test',
      title,
      content,
      password: password.toString(),
      view,
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
