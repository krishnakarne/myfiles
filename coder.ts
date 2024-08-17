toggleRow(element: any, index: number) {
  const name = element.name;

  // Get the URLs from the service, which uses the config map
  const branchDetailsUrl = this.service.getBranchDetailsUrl(name);
  const teamDetailsUrl = this.service.getTeamDetailsUrl(name);

  const headers = new HttpHeaders({
    'X-API-Key': `${environment.ACCESS_TOKEN}`,
  });

  const httpOptions = {
    headers: headers,
  };

  // Show spinner before making the requests
  this.spinner.show();

  // Fetch branch details
  this.service.getBranchDetailsUrl(this.http, name).subscribe(
    (response: any) => {
      console.log('branch details url response:', response);
      this.branchDetails = new MatTableDataSource(response);
      this.cd.detectChanges();

      // Set up paginator and sort
      const branchPaginator = this.paginatorbranch.toArray()[index];
      this.branchDetails.paginator = branchPaginator;
      this.branchDetails.sort = this.innerSort;
      this.spinner.hide();
    },
    (error) => {
      console.error('Error fetching repository branch details:', error);
      this.spinner.hide();
    }
  );

  // Fetch team details
  this.service.getTeamDetailsUrl(this.http, name).subscribe(
    (response: any) => {
      this.teamData = response;
      this.repoTeamDetails = new MatTableDataSource(this.teamData);
      this.cd.detectChanges();

      // Set up paginator and sort
      const teamPaginator = this.paginatorteams.toArray()[index];
      this.repoTeamDetails.paginator = teamPaginator;
      this.repoTeamDetails.sort = this.innerSort;
      this.spinner.hide();
    },
    (error) => {
      console.error('Error fetching repo details:', error);
      this.spinner.hide();
    }
  );
}
