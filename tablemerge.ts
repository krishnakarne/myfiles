  getRowSpan(index: number, key: string): number {
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
