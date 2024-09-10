import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  age: number;
}

@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss'],
})
export class EditableTableComponent {
  // Data source for the table
  dataSource = new MatTableDataSource<PeriodicElement>([
    { name: 'John', age: 25 },
    { name: 'Doe', age: 30 },
  ]);

  displayedColumns: string[] = ['name', 'age', 'actions'];

  // Variables to track editing states
  editingElement: PeriodicElement | null = null;
  editingField: string | null = null;

  // Start editing a cell
  startEditing(element: PeriodicElement, field: string) {
    this.editingElement = element;
    this.editingField = field;
  }

  // Save changes and exit editing
  saveChanges() {
    this.editingElement = null;
    this.editingField = null;
  }

  // Add a new row to the table
  addRow() {
    const newRow: PeriodicElement = { name: '', age: 0 };
    this.dataSource.data = [...this.dataSource.data, newRow];
  }

  // Delete a row from the table
  deleteRow(element: PeriodicElement) {
    this.dataSource.data = this.dataSource.data.filter((el) => el !== element);
  }
}
