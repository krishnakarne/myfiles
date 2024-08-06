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
