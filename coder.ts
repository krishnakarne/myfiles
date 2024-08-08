onSearchText(event: Event) {
  const input = (event.target as HTMLInputElement);
  if (event.type !== 'keyup') return;

  this.searchBarValue = input.value.toLowerCase() || "";
  this.filteredTableData = this.searchBarValue.length === 0 
    ? this.branchSource.filteredData 
    : this.applySearch();
}

applySearch() {
  return this.branchSource.filteredData.filter((data: any) => {
    return Object.values(data).some(val => 
      val !== null && val.toString().toLowerCase().includes(this.searchBarValue)
    );
  });
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
