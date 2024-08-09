::ng-deep .mat-mdc-option:hover,
::ng-deep .mat-mdc-option.mat-mdc-option-active {
  background-color: #FF5733 !important; /* Custom hover and active background color */
  color: white !important; /* Custom hover and active text color */
}

::ng-deep .mat-mdc-option.mat-mdc-option-selected:not(.mat-mdc-option-disabled) {
  background-color: #FF5733 !important; /* Custom selected background color */
  color: white !important; /* Custom selected text color */
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
