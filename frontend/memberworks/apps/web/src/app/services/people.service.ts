import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '../models/person.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  base = '/api/people';
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.base);
  }

  create(person: Person) {
    return this.http.post<Person>(this.base, person);
  }

  update(id: number, person: Person) {
    return this.http.put(`${this.base}/${id}`, person);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}