import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { POST_REPOSITORY_PORT, PostRepositoryPort } from '../ports/post.repository.port';
@Injectable({
  providedIn: 'root'
})
export class PostUseCase {
  constructor( @Inject(POST_REPOSITORY_PORT) private postRepository: PostRepositoryPort) {}

  getPosts(): Observable<Post[]> {
    return this.postRepository.getAll();
  }

  getPostById(id: string): Observable<Post> {
    return this.postRepository.getById(id);
  }

  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.postRepository.create(post);
  }

  updatePost(id: string, post: Partial<Post>): Observable<Post> {
    return this.postRepository.update(id, post);
  }

  deletePost(id: string): Observable<void> {
    return this.postRepository.delete(id);
  }
}