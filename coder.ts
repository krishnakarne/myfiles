addEventListener('message', ({ data }) => {
  const { searchTerm, data: records } = data;

  const filteredData = records.filter((item: any) => {
    return Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(searchTerm)
    );
  });

  postMessage(filteredData);
});



applyFilter(searchTerm: string) {
  if (!searchTerm) {
    this.filteredTableData = [...this.branchSource.filteredData];
    this.branchSource = new MatTableDataSource<any>(this.filteredTableData);
    return;
  }

  // Using a Web Worker for heavy filtering operation
  const worker = new Worker(new URL('./filter.worker', import.meta.url));
  
  worker.onmessage = ({ data }) => {
    this.filteredTableData = data;
    this.branchSource = new MatTableDataSource<any>(this.filteredTableData);
  };

  worker.postMessage({ data: this.branchSource.filteredData, searchTerm });
}





import { debounceTime, Subject } from 'rxjs';

// Inside your component class
searchSubject = new Subject<string>();

ngOnInit() {
  this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
    this.applyFilter(searchTerm);
  });
}

onSearchText(event: Event) {
  const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.searchSubject.next(searchTerm);
}

applyFilter(searchTerm: string) {
  if (!searchTerm) {
    this.filteredTableData = [...this.branchSource.filteredData]; // Reset to full data
    this.branchSource = new MatTableDataSource<any>(this.filteredTableData);
    return;
  }

  this.filteredTableData = this.branchSource.filteredData.filter((item: any) => {
    return this.searchInObject(item, searchTerm);
  });

  this.branchSource = new MatTableDataSource<any>(this.filteredTableData);
}
---------------------------
  searchInObject(obj: any, searchTerm: string): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] != null && obj[key] != undefined) {
      const value = obj[key].toString().toLowerCase();
      if (value.includes(searchTerm)) {
        return true; // Early exit if a match is found
      }
    }
  }
  return false;
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
