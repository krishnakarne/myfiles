ngOnInit(): void {
  let xml = "<mxGraphModel dx=\"1038\" dy=\"381\" grid=\"1\" gridSize=\"10\" guides=\"1\" tooltips=\"1\" connect=\"1\" arrows=\"1\" fold=\"1\" page=\"1\" pageScale=\"1\" pageWidth=\"850\" pageHeight=\"1100\"><root></root></mxGraphModel>";

  this.graphEditor.initialized(this.container.nativeElement, this.mxgraphScriptsContainer.nativeElement, {
    actions: {
      subMenu: {
        save: (xml: GraphXmlData | GraphEditorSVG): Promise<GraphEditorOut> => {
          return this.customSaveLogic(xml);
        },
        rename: (xml: GraphXmlData | GraphEditorSVG): Promise<GraphEditorOut> => {
          return this.customRenameLogic(xml);
        }
      }
    }
  } as GraphInitConfig).then(resolve => {
    console.log(resolve);
    this.graphEditor.setGrapheditorData({ xml: xml } as GraphXmlData).then(resolve => {
      console.log("setGraphEditor", resolve);
    });
  });
}

customSaveLogic(xml: GraphXmlData | GraphEditorSVG): Promise<GraphEditorOut> {
  return new Promise((resolve, reject) => {
    // Custom save logic, possibly including custom dialog modifications
    console.log('Saving with custom logic', xml);

    // Optionally use native file dialog for saving
    const blob = new Blob([xml.xml], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = xml.name ? xml.name : 'Untitled Diagram.drawio';
    a.click();
    window.URL.revokeObjectURL(url);

    resolve({
      status: "Saved",
      graphData: xml
    });
  });
}

customRenameLogic(xml: GraphXmlData | GraphEditorSVG): Promise<GraphEditorOut> {
  return new Promise((resolve, reject) => {
    const newName = prompt('Rename diagram', xml.name);
    if (newName) {
      xml.name = newName;
    }
    resolve({
      status: "Renamed",
      graphData: xml
    });
  });
}
