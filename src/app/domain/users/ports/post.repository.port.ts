import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { InjectionToken } from '@angular/core';

export const POST_REPOSITORY_PORT = new InjectionToken<PostRepositoryPort>('PostRepositoryPort');

export interface PostRepositoryPort {
  getAll(): Observable<Post[]>;
  getById(id: string): Observable<Post>;
  create(post: Omit<Post, 'id'>): Observable<Post>;
  update(id: string, post: Partial<Post>): Observable<Post>;
  delete(id: string): Observable<void>;
}