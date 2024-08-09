::ng-deep .mat-mdc-option:hover,
::ng-deep .mat-mdc-option.mat-mdc-option-active {
  background-color: #FF5733 !important; /* Custom hover and active background color */
  color: white !important; /* Custom hover and active text color */
}

::ng-deep .mat-mdc-option.mat-mdc-option-selected:not(.mat-mdc-option-disabled) {
  background-color: #FF5733 !important; /* Custom selected background color */
  color: white !important; /* Custom selected text color */
}

export class TeamsTableDataComponent implements OnInit {
  branchSource = new MatTableDataSource<any>([]); // Initialize with an empty array or with your data
  filteredTableData: any[] = []; // Holds filtered data
  searchBarValue: string = ''; // For the search input binding

  ngOnInit(): void {
    // Fetch and set your data to branchSource and filteredTableData here
    this.loadData();
  }

  loadData(): void {
    // Assuming you fetch data and assign it to branchSource and filteredTableData
    // For example:
    const responseData = /* Your fetched data here */;
    this.branchSource.data = responseData;
    this.filteredTableData = responseData;
  }

  onSearchText(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchBarValue = input || ''; // Capture the current value of the search bar

    if (this.searchBarValue.length === 0) {
      this.resetData(); // Reset to the full original dataset
    } else {
      this.applySearch();
    }
  }

  applySearch(): void {
    const searchValue = this.searchBarValue.trim().toLowerCase();

    if (searchValue) {
      this.filteredTableData = this.branchSource.data.filter((item: any) => {
        // Adjust the condition below based on the fields you want to search by
        return (
          (item.name && item.name.toLowerCase().includes(searchValue)) ||
          (item.id && item.id.toString().includes(searchValue)) ||
          (item.node_id && item.node_id.toLowerCase().includes(searchValue)) ||
          (item.description && item.description.toLowerCase().includes(searchValue))
        );
      });

      this.branchSource = new MatTableDataSource<any>(this.filteredTableData); // Update the data source to reflect the filtered data
    } else {
      this.resetData(); // Reset to the full original dataset
    }
  }

  resetData(): void {
    this.filteredTableData = this.branchSource.data; // Reset the filtered data to the original dataset
    this.branchSource = new MatTableDataSource<any>(this.filteredTableData); // Update the data source
  }

  clearSearch(): void {
    this.searchBarValue = ''; // Clear the search input
    this.resetData(); // Reset the data
  }
}



// drawio-editor.component.ts
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-drawio-editor',
  templateUrl: './drawio-editor.component.html',
  styleUrls: ['./drawio-editor.component.css']
})
export class DrawioEditorComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.loadDrawio();
  }

  loadDrawio(): void {
    const iframe = document.createElement('iframe');
    iframe.src = 'assets/drawio/index.html';  // Path to the Draw.io editor HTML file
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    document.getElementById('drawio-container')?.appendChild(iframe);
  }

  saveDiagram(): void {
    // Logic to interact with the iframe and save the diagram
  }
}



<!-- drawio-editor.component.html -->
<div id="drawio-container" style="width: 100%; height: 80vh;"></div>
<button (click)="saveDiagram()">Save</button>
