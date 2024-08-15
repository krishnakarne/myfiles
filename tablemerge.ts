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
