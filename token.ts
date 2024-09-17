<table mat-table [dataSource]="branchSource" class="mat-elevation-z8">
  <!-- Application Name Column -->
  <ng-container matColumnDef="name">
    <td mat-cell *matCellDef="let element">
      <div *ngIf="editingRowId !== element.id">{{ element.name }}</div>
      <div *ngIf="editingRowId === element.id">
        <input matInput [(ngModel)]="element.name" placeholder="Enter Application Name" />
      </div>
    </td>
  </ng-container>

  <!-- URL Column -->
  <ng-container matColumnDef="url">
    <td mat-cell *matCellDef="let element">
      <div *ngIf="editingRowId !== element.id">{{ element.url }}</div>
      <div *ngIf="editingRowId === element.id">
        <input matInput [(ngModel)]="element.url" placeholder="Enter URL" />
      </div>
    </td>
  </ng-container>

  <!-- Location Column -->
  <ng-container matColumnDef="location">
    <td mat-cell *matCellDef="let element">
      <div *ngIf="editingRowId !== element.id">{{ element.location }}</div>
      <div *ngIf="editingRowId === element.id">
        <input matInput [(ngModel)]="element.location" placeholder="Enter Location" />
      </div>
    </td>
  </ng-container>

  <!-- Description Column -->
  <ng-container matColumnDef="description">
    <td mat-cell *matCellDef="let element">
      <div *ngIf="editingRowId !== element.id">{{ element.description }}</div>
      <div *ngIf="editingRowId === element.id">
        <input matInput [(ngModel)]="element.description" placeholder="Enter Description" />
      </div>
    </td>
  </ng-container>

  <!-- Actions Column -->
  <ng-container matColumnDef="actions">
    <td mat-cell *matCellDef="let element">
      <div class="icon-wrapper">
        <button mat-button (click)="toggleEdit(element)">
          <mat-icon *ngIf="editingRowId !== element.id">edit</mat-icon>
          <mat-icon *ngIf="editingRowId === element.id">check</mat-icon>
        </button>
        <button mat-button (click)="deleteRow(element)">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </td>
  </ng-container>

  <!-- Table header and rows -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>

<button (click)="addRow()">Add Row</button>

<mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
