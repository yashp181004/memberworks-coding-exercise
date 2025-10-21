import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export type Role = 'Admin' | 'Member' | 'Coach';

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Program {
  id?: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  assignedPersonIds?: number[];
}

@Component({
  selector: 'app-programs-list',
  standalone: false,
  template: `
    <mat-toolbar color="accent">
      <span>Programs</span>
    </mat-toolbar>

    <div class="container">
      <form [formGroup]="form" (ngSubmit)="save()" class="program-form">
        <mat-form-field>
          <input matInput placeholder="Program name" formControlName="name" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Description" formControlName="description" />
        </mat-form-field>

        <mat-form-field>
          <input matInput [matDatepicker]="start" placeholder="Start date" formControlName="startDate" />
          <mat-datepicker-toggle matSuffix [for]="start"></mat-datepicker-toggle>
          <mat-datepicker #start></mat-datepicker>
          <mat-error *ngIf="form.get('startDate')?.hasError('required')">
            Start date is required
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <input matInput [matDatepicker]="end" placeholder="End date" formControlName="endDate" />
          <mat-datepicker-toggle matSuffix [for]="end"></mat-datepicker-toggle>
          <mat-datepicker #end></mat-datepicker>
          <mat-error *ngIf="form.get('endDate')?.hasError('required')">
            End date is required
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">
          {{ editing ? 'Update' : 'Create' }}
        </button>
        <button mat-button type="button" (click)="cancel()" *ngIf="editing">Cancel</button>
      </form>

      <table mat-table [dataSource]="programs" class="mat-elevation-z8">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let p">{{p.id}}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let p">{{p.name}}</td>
        </ng-container>

        <ng-container matColumnDef="startDate">
          <th mat-header-cell *matHeaderCellDef>Start</th>
          <td mat-cell *matCellDef="let p">{{p.startDate | date}}</td>
        </ng-container>

        <ng-container matColumnDef="endDate">
          <th mat-header-cell *matHeaderCellDef>End</th>
          <td mat-cell *matCellDef="let p">{{p.endDate | date}}</td>
        </ng-container>

        <ng-container matColumnDef="assigned">
          <th mat-header-cell *matHeaderCellDef>Assigned</th>
          <td mat-cell *matCellDef="let p">
            <ng-container *ngIf="p.assignedPersonIds && p.assignedPersonIds.length; else none">
              <span *ngFor="let pid of p.assignedPersonIds; let i = index">
                <ng-container *ngFor="let person of getPersonsById([pid])">
                  {{person.firstName}} {{person.lastName}}
                  <button mat-icon-button color="warn" (click)="removeAssignment(p.id!, person.id!)">
                    <mat-icon>remove_circle</mat-icon>
                  </button>
                </ng-container>
                <span *ngIf="i < p.assignedPersonIds.length - 1">, </span>
              </span>
            </ng-container>
            <ng-template #none>—</ng-template>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let p">
            <button mat-icon-button (click)="openAssign(p)"><mat-icon>group_add</mat-icon></button>
            <button mat-icon-button (click)="edit(p)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="delete(p)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div *ngIf="assigningProgram" class="assign-panel">
        <h3>Assign people to: {{assigningProgram.name}}</h3>
        <div *ngFor="let person of people">
          <label>
            <input type="checkbox" [value]="person.id" (change)="togglePersonSelection(person.id!, $event)" />
            {{person.firstName}} {{person.lastName}} ({{person.role}})
          </label>
        </div>

        <button mat-raised-button color="primary" (click)="assignSelected()">
          Assign selected
        </button>
        <button mat-button (click)="cancelAssign()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
    }

    .program-form {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    mat-form-field {
      width: 200px;
    }

    .assign-panel {
      margin-top: 16px;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .assign-panel label {
      display: block;
      margin-bottom: 8px;
    }
  `]
})
export class ProgramsListComponent implements OnInit {
  programs: Program[] = [];
  people: Person[] = [];
  displayedColumns = ['id', 'name', 'startDate', 'endDate', 'assigned', 'actions'];
  form: FormGroup;
  editing: Program | null = null;
  assigningProgram: Program | null = null;
  selectedPersonIds: number[] = [];
  private programsUrl = '/api/programs';
  private peopleUrl = '/api/people';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
    this.http.get<Person[]>(this.peopleUrl).subscribe(x => this.people = x);
  }

  load() {
    this.http.get<Program[]>(this.programsUrl).subscribe(x => this.programs = x);
  }

  save() {
    if (this.form.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const p: Program = {
      name: this.form.value.name,
      description: this.form.value.description,
      startDate: new Date(this.form.value.startDate).toISOString(),
      endDate: new Date(this.form.value.endDate).toISOString()
    };

    if (this.editing) {
      // Update existing program
      this.http.put(`${this.programsUrl}/${this.editing.id}`, p).subscribe(() => {
        this.load();
        this.cancel();
      }, (err: any) => alert(err.error?.message || 'Error updating program'));
    } else {
      // Create new program
      this.http.post<Program>(this.programsUrl, p).subscribe(() => {
        this.load();
        this.form.reset();
      }, (err: any) => alert(err.error?.message || 'Error creating program'));
    }
  }

  edit(program: Program) {
    this.editing = program;
    this.form.patchValue({
      name: program.name,
      description: program.description,
      startDate: new Date(program.startDate),
      endDate: new Date(program.endDate)
    });
  }

  cancel() {
    this.editing = null;
    this.form.reset();
  }

  delete(program: Program) {
    if (!program.id) return;
    if (!confirm(`Delete program ${program.name}?`)) return;
    this.http.delete(`${this.programsUrl}/${program.id}`).subscribe(() => this.load(), (err: any) => alert('Error deleting program'));
  }

  openAssign(program: Program) {
    this.assigningProgram = program;
    this.selectedPersonIds = [];
  }

  togglePersonSelection(personId: number, event: any) {
    if (event.target.checked) {
      this.selectedPersonIds.push(personId);
    } else {
      this.selectedPersonIds = this.selectedPersonIds.filter(id => id !== personId);
    }
  }

  assignSelected() {
  if (!this.assigningProgram?.id || this.selectedPersonIds.length === 0) {
    alert('Please select at least one person');
    return;
  }
  this.http.post(`${this.programsUrl}/${this.assigningProgram.id}/assign`, this.selectedPersonIds).subscribe(
    (response: any) => {
      this.load();
      this.assigningProgram = null;
      this.selectedPersonIds = [];
      
      // Show message if there were duplicates
      if (response && response.message) {
        alert(response.message);
      }
    }, 
    (err: any) => {
      alert(err.error?.message || 'Error assigning people');
    }
  );
}

  removeAssignment(programId: number, personId: number) {
    if (!confirm('Remove this person from program?')) return;
    this.http.delete(`${this.programsUrl}/${programId}/remove/${personId}`).subscribe(() => this.load(), (err: any) => alert('Error removing assignment'));
  }

  cancelAssign() {
    this.assigningProgram = null;
    this.selectedPersonIds = [];
  }

  getPersonsById(ids: number[]): Person[] {
    return this.people.filter(p => ids.includes(p.id!));
  }
}