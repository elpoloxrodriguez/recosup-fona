import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EmailService } from 'app/main/email/email.service';


@Component({
  selector: 'app-email-sidebar',
  templateUrl: './email-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EmailSidebarComponent implements OnInit {

    // Public
    public folders = [
      {
        id: 0,
        handle: 'inbox',
        title: 'Inbox',
        icon: 'mail'
      },
      {
        id: 1,
        handle: 'sent',
        title: 'Sent',
        icon: 'send'
      },
      {
        id: 2,
        handle: 'draft',
        title: 'Draft',
        icon: 'edit-2'
      },
      {
        id: 3,
        handle: 'spam',
        title: 'Spam',
        icon: 'info'
      },
      {
        id: 4,
        handle: 'trash',
        title: 'Trash',
        icon: 'trash'
      }
    ];
    public labels = [
      {
        id: 0,
        handle: 'personal',
        title: 'Personal',
        color: 'bullet-success'
      },
      {
        id: 1,
        handle: 'company',
        title: 'Company',
        color: 'bullet-primary'
      },
      {
        id: 2,
        handle: 'important',
        title: 'Important',
        color: 'bullet-warning'
      },
      {
        id: 3,
        handle: 'private',
        title: 'Private',
        color: 'bullet-danger'
      }
    ];
    public openComposeRef;
    public draftCount;
    public unReadInboxCount;
  
    // Private
    private _unsubscribeAll: Subject<any>;
  
    /**
     *
     * @param {EmailService} _emailService
     * @param {CoreSidebarService} _coreSidebarService
     */
    constructor(
      // private _emailService: EmailService, 
      private _coreSidebarService: CoreSidebarService
      ) {
      this._unsubscribeAll = new Subject();
    }
  
    // Public Methods
    // -----------------------------------------------------------------------------------------------------
  
    /**
     * Open Compose & Update Value in Service
     */
    openCompose() {
      this.openComposeRef = true;
      // this._emailService.composeEmail(this.openComposeRef);
      // this._coreSidebarService.getSidebarRegistry('email-sidebar').toggleOpen();
    }
  
    /**
     * Toggle Sidebar
     *
     * @param nameRef
     */
    toggleSidebar(nameRef): void {
      // this._coreSidebarService.getSidebarRegistry(nameRef).toggleOpen();
    }
  
    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
  
    /**
     * On init
     */
    ngOnInit(): void {
      // Subscribe to Folder
      // this._emailService.onFoldersChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      //   this.folders = response;
      // });
  
  
      // Subscribe to Draft and Unread Mail Count
      // this._emailService.onDraftCountChanged
      //   .pipe(takeUntil(this._unsubscribeAll))
      //   .subscribe(response => (this.draftCount = response));
  
      // this._emailService.onUnreadInboxCountChanged
      //   .pipe(takeUntil(this._unsubscribeAll))
      //   .subscribe(response => (this.unReadInboxCount = response));

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
  