import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-copilot-table',
  templateUrl: './copilot-table.component.html',
  styleUrls: ['./copilot-table.component.css']
})
export class CopilotTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['date', 'total_suggestions_count', 'total_lines_accepted', 'total_acceptance_count', 'total_lines_suggested', 'total_active_users', 'language', 'editor'];
  dataSource = new MatTableDataSource<any>([
    // Your data here
  ]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.paginator.page.subscribe(() => {
      this.recalculateRowSpans(); // Recalculate row spans when the page changes
    });
  }

  // Function to calculate visible data based on the current page
  visibleData(): any[] {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return this.dataSource.data.slice(startIndex, endIndex);
  }

  // Function to recalculate row spans for visible data
  recalculateRowSpans(): void {
    const visibleData = this.visibleData();
    for (let i = 0; i < visibleData.length; i++) {
      this.getRowSpan(i, 'date');
      this.getRowSpan(i, 'total_suggestions_count');
      this.getRowSpan(i, 'total_lines_accepted');
      this.getRowSpan(i, 'total_acceptance_count');
      this.getRowSpan(i, 'total_lines_suggested');
      this.getRowSpan(i, 'total_active_users');
    }
  }

  // Function to calculate rowspan for each column
  getRowSpan(index: number, key: string): number | null {
    const visibleData = this.visibleData();

    if (index === 0 || visibleData[index][key] !== visibleData[index - 1][key]) {
      let span = 1;
      for (let i = index + 1; i < visibleData.length; i++) {
        if (visibleData[index][key] === visibleData[i][key]) {
          span++;
        } else {
          break;
        }
      }
      visibleData[index][`${key}_rowspan`] = span;
      return span;
    }
    return null; // Return null for subsequent rows in a group
  }
}





[style.display]="getRowSpan(i, 'language') ? '' : 'none'">

getRowSpan(index: number, key: string): number | null {
  if (key === 'date') {
    // Calculate row span for the 'date' column
    if (index === 0 || this.copilotData[index][key] !== this.copilotData[index - 1][key]) {
      let span = 1;
      for (let i = index + 1; i < this.copilotData.length; i++) {
        if (this.copilotData[index][key] === this.copilotData[i][key]) {
          span++;
        } else {
          break;
        }
      }
      return span;
    }
    return null;
  }
  // Return null for the Language and Editor columns (no row span needed)
  return 1;
}



calculateRowSpans(): void {
  const columnKeys = [
    'date',
    'total_suggestions_count',
    'total_lines_accepted',
    'total_acceptance_count',
    'total_lines_suggested',
    'total_active_users',
    'language',
    'editor'
  ];

  columnKeys.forEach((column) => {
    // Initialize each entry in rowSpans as an empty array
    this.rowSpans[column] = [];

    let currentSpan = 1;

    for (let i = 1; i < this.copilotData.filteredData.length; i++) {
      if (this.copilotData.filteredData[i][column] === this.copilotData.filteredData[i - 1][column]) {
        currentSpan++;
      } else {
        this.rowSpans[column][i - currentSpan] = currentSpan;
        for (let j = i - currentSpan + 1; j < i; j++) {
          this.rowSpans[column][j] = 0;
        }
        currentSpan = 1;
      }
    }
    this.rowSpans[column][this.copilotData.filteredData.length - currentSpan] = currentSpan;
    for (let j = this.copilotData.filteredData.length - currentSpan + 1; j < this.copilotData.filteredData.length; j++) {
      this.rowSpans[column][j] = 0;
    }
  });
}




calculateRowSpans(): void {
    const groupedData = this.groupBy(this.copilotData.filteredData, 'day');

    for (let key in groupedData) {
        let group = groupedData[key];

        group.forEach((row, index) => {
            this.rowSpans['day'][this.copilotData.filteredData.indexOf(row)] = index === 0 ? group.length : 0;
            this.rowSpans['total_suggestions_count'][this.copilotData.filteredData.indexOf(row)] = index === 0 ? group.length : 0;
            this.rowSpans['total_acceptances_count'][this.copilotData.filteredData.indexOf(row)] = index === 0 ? group.length : 0;
            this.rowSpans['total_lines_suggested'][this.copilotData.filteredData.indexOf(row)] = index === 0 ? group.length : 0;
            this.rowSpans['total_lines_accepted'][this.copilotData.filteredData.indexOf(row)] = index === 0 ? group.length : 0;
            this.rowSpans['total_active_users'][this.copilotData.filteredData.indexOf(row)] = index === 0 ? group.length : 0;
        });
    }
}

getRowSpan(index: number, column: string): number {
  return this.rowSpans[column] ? this.rowSpans[column][index] : 1;
}

groupBy(array: any[], key: string): { [key: string]: any[] } {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}
