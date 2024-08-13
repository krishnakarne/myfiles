saveDiagram(xml: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            // Parse the XML and try to find the diagram name
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'application/xml');

            // Attempt to find the name attribute in any element that might represent the diagram
            let diagramName = 'diagram'; // Default name
            const diagramElements = xmlDoc.getElementsByTagName('*'); // Get all elements

            for (let i = 0; i < diagramElements.length; i++) {
                const element = diagramElements[i];
                if (element.hasAttribute('name')) {
                    diagramName = element.getAttribute('name')!;
                    break;
                }
            }

            // Store diagram data in local storage
            localStorage.setItem('unsavedDiagram', xml);

            // Trigger download of the diagram with the extracted name
            const blob = new Blob([xml], { type: 'text/xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${diagramName}.xml`;  // Use the extracted diagram name
            a.click();
            window.URL.revokeObjectURL(url);

            resolve();
        } catch (error) {
            console.error('Save failed', error);
            reject(error);
        }
    });
}









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



import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-teams-table-data',
  templateUrl: './teams-table-data.component.html',
  styleUrls: ['./teams-table-data.component.css']
})
export class TeamsTableDataComponent implements OnInit {
  branchSource = new MatTableDataSource<any>([]);
  originalData: any[] = [];
  searchBarValue: string = '';
  private searchSubject: Subject<string> = new Subject();

  ngOnInit(): void {
    // Load your data
    this.service.getRepoFromDatabase(this.http).subscribe((item: any) => {
      const data = item.filter(repo => !repo.name.startsWith('sdop') && !repo.topics.includes('sdop'));
      this.originalData = data; // Store original data
      this.branchSource = new MatTableDataSource<any>(this.originalData);
      this.branchSource.sort = this.sort;
      this.branchSource.paginator = this.batchPaginator;
    });

    // Debounced search
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchText => {
      this.applySearch(searchText);
    });
  }

  onSearchText(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchBarValue = input || '';
    this.searchSubject.next(this.searchBarValue);
  }

  applySearch(searchValue: string): void {
    if (!searchValue) {
      this.resetData();
    } else {
      this.branchSource.data = this.originalData.filter((item: any) => {
        return (
          (item.name && item.name.toLowerCase().includes(searchValue)) ||
          (item.id && item.id.toString().includes(searchValue)) ||
          (item.defaultbranch && item.defaultbranch.toLowerCase().includes(searchValue)) ||
          (item.fullname && item.fullname.toLowerCase().includes(searchValue))
        );
      });
    }
  }

  resetData(): void {
    this.branchSource.data = [...this.originalData]; // Reset the data source to the full original dataset
  }

  clearSearch(): void {
    this.searchBarValue = '';
    this.resetData();
  }
}

