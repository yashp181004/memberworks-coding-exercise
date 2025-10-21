import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Program } from '../models/program.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  base = '/api/programs';
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<Program[]> {
    return this.http.get<Program[]>(this.base);
  }

  create(program: Program) {
    return this.http.post<Program>(this.base, program);
  }

  update(id: number, program: Program) {
    return this.http.put(`${this.base}/${id}`, program);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  assign(programId: number, personIds: number[]) {
    return this.http.post(`${this.base}/${programId}/assign`, personIds);
  }

  remove(programId: number, personId: number) {
    return this.http.delete(`${this.base}/${programId}/remove/${personId}`);
  }
}