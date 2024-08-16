ngOnInit(): void {
  // Show the spinner at the start
  this.spinner.show();

  // Fetch the main data from the service
  this.service.getRepoFromDatabase(this.http).subscribe((items: any[]) => {
    const data = items.filter(repo => 
      repo.name.startsWith('sdop-') || 
      repo.topics.includes('sdop-devops') || 
      repo.topics.includes('sdop-group')
    );
    this.originalData = data;
    this.branchSource = new MatTableDataSource<any>(this.originalData);
    this.branchSource.sort = this.sort;
    this.branchSource.paginator = this.batchPaginator;

    // Prepare an array of observables for all HTTP requests
    const allRequests = this.originalData.map((item) => {
      const teamDetailUrl = `https://devsecops-github-control-center-backend.apps.sov01.sov.dev.mxi.paas.cloudcenter.corp/api/fetchrepoteampermissions?reponame=${item.name}`;
      const branchDetailUrl = `https://devsecops-github-control-center-backend.apps.sov01.sov.dev.mxi.paas.cloudcenter.corp/api/fetchbranches?reponame=${item.name}`;

      const headers = new HttpHeaders({
        'X-API-Key': `${environment.ACCESS_TOKEN}`,
      });

      const httpOptions = {
        headers: headers,
      };

      // Perform both HTTP calls and merge their results
      return forkJoin([
        this.http.get(teamDetailUrl, httpOptions).pipe(
          tap((teamData: any) => {
            item.teamDetails = teamData;
            item.teamName = teamData.map((team: any) => team.name).join(', ');
          })
        ),
        this.http.get(branchDetailUrl, httpOptions).pipe(
          tap((branchData: any) => {
            item.branchDetails = branchData;
            item.branchNames = branchData.map((branch: any) => branch.name).join(', ');
          })
        )
      ]);
    });

    // Execute all requests and only hide the spinner when they are all complete
    forkJoin(allRequests).subscribe(
      () => {
        this.spinner.hide(); // Hide the spinner after all operations are complete
        this.cd.detectChanges(); // Trigger change detection to update the view
        console.log('All data fetched successfully');
      },
      (error) => {
        this.spinner.hide(); // Hide the spinner in case of any error
        console.error('Error fetching data:', error);
      }
    );
  });
}
