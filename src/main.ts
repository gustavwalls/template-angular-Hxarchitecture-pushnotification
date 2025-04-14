import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import {  provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app/app.routes';
import { POST_REPOSITORY_PORT } from './app/domain/users/ports/post.repository.port';
import { PostRepositoryAdaptar } from './app/infrastructure/users/adapters/post-repository-adaptar.service';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: POST_REPOSITORY_PORT, useClass: PostRepositoryAdaptar },
  ],
}).catch((err) => console.error(err));
