import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  createdAt?: string;
}

@Component({
  selector: 'app-people-list',
  standalone: false,
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'role', 'actions'];
  form: FormGroup;
  editing: Person | null = null;
  private baseUrl = '/api/people';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.http.get<Person[]>(this.baseUrl).subscribe(x => this.people = x);
  }

  startCreate() {
    this.editing = null;
    this.form.reset({ role: 0 });
  }

  startEdit(p: Person) {
    this.editing = p;
    this.form.setValue({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      role: p.role
    });
  }

  save() {
    if (this.form.invalid) {
      alert('Please fill in all required fields correctly');
      return;
    }
    const payload: Person = this.form.value;
    if (this.editing) {
      this.http.put(`${this.baseUrl}/${this.editing.id}`, payload).subscribe(() => {
        this.load();
        this.editing = null;
        this.form.reset({ role: 0 });
      }, (err: any) => alert(err.error?.message || 'Error'));
    } else {
      this.http.post<Person>(this.baseUrl, payload).subscribe(() => {
        this.load();
        this.form.reset({ role: 0 });
      }, (err: any) => alert(err.error?.message || 'Error'));
    }
  }

  delete(p: Person) {
    if (!p.id) return;
    if (!confirm(`Delete ${p.firstName} ${p.lastName}?`)) return;
    this.http.delete(`${this.baseUrl}/${p.id}`).subscribe(() => this.load(), (err: any) => alert('Error'));
  }

  getRoleName(role: number): string {
    switch(role) {
      case 0: return 'Member';
      case 1: return 'Admin';
      case 2: return 'Coach';
      default: return 'Unknown';
    }
  }
}