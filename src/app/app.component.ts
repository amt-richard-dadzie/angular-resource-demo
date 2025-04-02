import {
  Component,
  effect,
  resource,
  ResourceStatus,
  signal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { API_URL, User } from './app.model';

@Component({
  selector: 'app-root',
  imports: [MatProgressBarModule, FormsModule],
  template: ` <div>
      <label>Users Search</label>
      <input placeholder="Search user by name" [(ngModel)]="query" />
    </div>

    @if(users.isLoading()){
    <mat-progress-bar mode="query" />
    } @if (users.status() === status.Error) {
    <span class="error">{{ users.error() }}</span>
    <button>Retry</button>
    }

    <section class="actions">
      <button>Add User</button>
      <button>Clear</button>
    </section>

    <ul>
      @for (user of users.value(); track user.id) {
      <li>{{ user.name }}</li>
      }@empty {
      <li class="no-data">Nothing to show</li>
      }
    </ul>`,
})
export class AppComponent {
  query = signal('');
  status = ResourceStatus;
  users = resource<User[], { query: string }>({
    request: () => ({ query: this.query() }),
    loader: async ({ request, abortSignal }) => {
      const response = await fetch(`${API_URL}?name_like=^${request.query}`, {
        signal: abortSignal,
      });
      if (!response.ok) {
        throw new Error('Network error');
      }
      return await response.json();
    },
  });

  constructor() {
    effect(() => {
      console.log('Status:', this.users.status());
      console.log('Query:', this.query());
    });
  }
}
