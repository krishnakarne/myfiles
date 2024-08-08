onSearchText(event: Event) {
  const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();

  if (!searchTerm) {
    // If search term is empty, reset the filtered data to original data
    this.filteredTableData = [...this.branchSource.filteredData];
    return;
  }

  this.filteredTableData = this.branchSource.filteredData.filter((item: any) => {
    return this.searchInObject(item, searchTerm);
  });
}

searchInObject(obj: any, searchTerm: string): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined) {
      const value = obj[key].toString().toLowerCase();
      if (value.includes(searchTerm)) {
        return true;
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
