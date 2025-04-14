import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostUseCase } from '../../../domain/users/user-cases/post.use-case';
import { Post } from '../../../domain/users/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private postUseCase: PostUseCase) {}

  getAllPosts(): Observable<Post[]> {
    return this.postUseCase.getPosts();
  }

  getPost(id: string): Observable<Post> {
    return this.postUseCase.getPostById(id);
  }

  addPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.postUseCase.createPost(post);
  }

  updatePost(id: string, post: Partial<Post>): Observable<Post> {
    return this.postUseCase.updatePost(id, post);
  }

  removePost(id: string): Observable<void> {
    return this.postUseCase.deletePost(id);
  }
}