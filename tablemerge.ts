import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-copilot-details',
  templateUrl: './copilot-details.component.html',
  styleUrls: ['./copilot-details.component.scss']
})
export class CopilotDetailsComponent {
  accessToken: string;
  copilotData: MatTableDataSource<any> = new MatTableDataSource();
  p: number = 1;
  @ViewChild(MatPaginator, { static: true }) batchPaginator: MatPaginator;
  rowSpans: { [key: string]: number[] } = {};

  columnsToDisplay = [
    'day',
    'total_suggestions_count',
    'total_acceptances_count',
    'total_lines_suggested',
    'total_lines_accepted',
    'total_active_users',
    'language',
    'editor'
  ];

  constructor(public http: HttpClient) {}

  ngOnInit() {
    this.getRepoInfoData();
  }

  getCopiloturl =
    'https://devsecops-github-control-center-backend.apps.sov01.sov.dev.mx1.paas.cloudcenter.corp/fetchcopilotdeatils';

  getRepoInfoData() {
    this.http.get<any[]>(this.getCopiloturl).subscribe((response: any) => {
      this.copilotData = new MatTableDataSource<any>(
        response.flatMap((data: any) =>
          data.breakdown.map((breakdown: any) => ({
            day: data.day,
            total_suggestions_count: data.total_suggestions_count,
            total_acceptances_count: data.total_acceptances_count,
            total_lines_suggested: data.total_lines_suggested,
            total_lines_accepted: data.total_lines_accepted,
            total_active_users: data.total_active_users,
            language: breakdown.language,
            editor: breakdown.editor
          }))
        )
      );

      this.calculateRowSpans();
      this.copilotData.paginator = this.batchPaginator;
    });
  }

  calculateRowSpans(): void {
    const columnKeys = this.columnsToDisplay;

    columnKeys.forEach((column) => {
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

  getRowSpan(index: number, column: string): number {
    return this.rowSpans[column] ? this.rowSpans[column][index] : 1;
  }
}
