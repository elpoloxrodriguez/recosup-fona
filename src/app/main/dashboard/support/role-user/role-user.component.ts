import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoleUserComponent implements OnInit {
  private tempDataRol = [];
  private tempDataUsers = [];

  // public
  public rowsRol: any;
  public rowsUsers: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public editingName = {};
  public editingStatus = {};
  public editingAge = {};
  public editingSalary = {};

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor() { }

  ngOnInit(): void {
    var ok = [
      {
        responsive_id: '',
        id: 1,
        avatar: 'logo.png',
        full_name: "Korrie O'Crevy",
        post: 'Nuclear Power Engineer',
        email: 'kocrevy0@thetimes.co.uk',
        city: 'Krasnosilka',
        start_date: '09/23/2016',
        salary: '$23896.35',
        age: '61',
        experience: '1 Year',
        status: 2
      },
      {
        responsive_id: '',
        id: 2,
        avatar: 'logo.png',
        full_name: 'Bailie Coulman',
        post: 'VP Quality Control',
        email: 'bcoulman1@yolasite.com',
        city: 'Hinigaran',
        start_date: '05/20/2018',
        salary: '$13633.69',
        age: '63',
        experience: '3 Years',
        status: 2
      },
      
    ];
    this.rowsRol = ok;
    this.tempDataRol = this.rowsRol;
    // 
    this.rowsUsers = ok;
    this.tempDataUsers = this.rowsUsers;

  }

  filterUpdateListRol(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempDataRol.filter(function (d) {
      return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rowsRol = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filterUpdateListUsers(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempDataUsers.filter(function (d) {
      return d.age.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rowsUsers = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
