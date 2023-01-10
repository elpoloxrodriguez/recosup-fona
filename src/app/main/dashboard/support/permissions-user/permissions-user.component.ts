import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-permissions-user',
  templateUrl: './permissions-user.component.html',
  styleUrls: ['./permissions-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PermissionsUserComponent implements OnInit {

  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public selectRole: any = [
    { name: 'All', value: '' },
    { name: 'Admin', value: 'Admin' },
    { name: 'Author', value: 'Author' },
    { name: 'Editor', value: 'Editor' },
    { name: 'Maintainer', value: 'Maintainer' },
    { name: 'Subscriber', value: 'Subscriber' }
  ];

  public selectPlan: any = [
    { name: 'All', value: '' },
    { name: 'Basic', value: 'Basic' },
    { name: 'Company', value: 'Company' },
    { name: 'Enterprise', value: 'Enterprise' },
    { name: 'Team', value: 'Team' }
  ];

  public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'Pending' },
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' }
  ];

  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public searchValue = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;


  constructor(
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    var ok = [
      {
        id: 1,
        fullName: 'Galen Slixby',
        company: 'Yotz PVT LTD',
        role: 'Editor',
        username: 'gslixby0',
        country: 'El Salvador',
        contact: '(479) 232-9151',
        email: 'gslixby0@abc.net.au',
        currentPlan: 'Enterprise',
        status: 'inactive',
        avatar: ''
      },
      {
        id: 2,
        fullName: 'Halsey Redmore',
        company: 'Skinder PVT LTD',
        role: 'Author',
        username: 'hredmore1',
        country: 'Albania',
        contact: '(472) 607-9137',
        email: 'hredmore1@imgur.com',
        currentPlan: 'Team',
        status: 'pending',
        avatar: ''
      },
    ]
    this.rows = ok
    this.tempData = this.rows
  }

    /**
   * filterUpdate
   *
   * @param event
   */
     filterUpdate(event) {
      // Reset ng-select on search
      this.selectedRole = this.selectRole[0];
      this.selectedPlan = this.selectPlan[0];
      this.selectedStatus = this.selectStatus[0];
  
      const val = event.target.value.toLowerCase();
  
      // Filter Our Data
      const temp = this.tempData.filter(function (d) {
        return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
      });
  
      // Update The Rows
      this.rows = temp;
      // Whenever The Filter Changes, Always Go Back To The First Page
      this.table.offset = 0;
    }

  
    /**
     * Filter By Roles
     *
     * @param event
     */
    filterByRole(event) {
      const filter = event ? event.value : '';
      this.previousRoleFilter = filter;
      this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter);
      this.rows = this.temp;
    }
  
    /**
     * Filter By Plan
     *
     * @param event
     */
    filterByPlan(event) {
      const filter = event ? event.value : '';
      this.previousPlanFilter = filter;
      this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter);
      this.rows = this.temp;
    }
  
    /**
     * Filter By Status
     *
     * @param event
     */
    filterByStatus(event) {
      const filter = event ? event.value : '';
      this.previousStatusFilter = filter;
      this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, filter);
      this.rows = this.temp;
    }
  
    /**
     * Filter Rows
     *
     * @param roleFilter
     * @param planFilter
     * @param statusFilter
     */
    filterRows(roleFilter, planFilter, statusFilter): any[] {
      // Reset search on select change
      this.searchValue = '';
  
      roleFilter = roleFilter.toLowerCase();
      planFilter = planFilter.toLowerCase();
      statusFilter = statusFilter.toLowerCase();
  
      return this.tempData.filter(row => {
        const isPartialNameMatch = row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
        const isPartialGenderMatch = row.currentPlan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
        const isPartialStatusMatch = row.status.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
        return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch;
      });
    }


    AddRegister(modal) {
      this.modalService.open(modal,{
        centered: true,
        size: 'lg',
        backdrop: false,
        keyboard: false,
        windowClass: 'fondo-modal',
      });
    }
    
      /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
