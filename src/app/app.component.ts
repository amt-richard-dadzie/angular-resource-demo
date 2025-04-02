import { Component, ResourceStatus, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { API_URL, User } from './app.model';
import { httpResource } from '@angular/common/http';

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
    }

    <section class="actions">
      <button (click)="users.reload()">Reload</button>
      <button (click)="addUser()">Add User</button>
      <button (click)="users.set([])">Clear</button>
    </section>

    <ul>
      @for (user of users.value(); track $index) {
      <li>{{ user.name }}</li>
      }@empty {
      <li class="no-data">Nothing to show</li>
      }
    </ul>`,
})
export class AppComponent {
  query = signal('');
  status = ResourceStatus;
  users = httpResource<User[]>(() => `${API_URL}?name_like=${this.query()}`);

  addUser() {
    const user = { id: Date.now(), name: 'Richard Dadzie' };
    this.users.update((users) => (users ? [user, ...users] : [user]));
  }
}
