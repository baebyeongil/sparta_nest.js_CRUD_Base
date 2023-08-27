import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
@Injectable()
export class BoardService {
  private articles = [];

  private articlePasswords = new Map(); // {articleId - password}, {articleId - password}

  getArticles() {
    return this.articles;
  }

  getArticlesById(id: number) {
    const article = this.getArticlesById(id);
    if (_.isNil(article)) {
      throw new NotFoundException('Article not found. id' + id);
    }

    return this.articles.find((article) => {
      return article.id === id;
    });
  }

  createArticles(title: string, content: string, password: number) {
    const articleId = this.articles.length + 1;
    this.articles.push({ id: articleId, title, content });
    this.articlePasswords.set(articleId, password);
    return articleId;
  }

  updateArticles(id: number, title: string, content: string, password: number) {
    const article = this.getArticlesById(id);
    if (_.isNil(article)) {
      throw new NotFoundException('Article not found. id' + id);
    }

    if (this.articlePasswords.get(id) !== password) {
      throw new UnauthorizedException('Password is not correct. id' + id);
    }

    article.title = title;
    article.content = content;
  }

  deleteArticles(id: number, password: number) {
    const article = this.getArticlesById(id);
    if (_.isNil(article)) {
      throw new NotFoundException('Article not found. id' + id);
    }

    if (this.articlePasswords.get(id) !== password) {
      throw new UnauthorizedException('Password is not correct. id' + id);
    }

    this.articles = this.articles.filter((article) => {
      return article.id !== id;
    });
  }
}
