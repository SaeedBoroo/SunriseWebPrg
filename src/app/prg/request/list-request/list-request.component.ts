import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BasePage } from '../../../shared/BasePage';
import { TranslateService } from '../../../shared/services/TranslateService';
import { Router } from '@angular/router';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../../shared/util/Dialog';
import { PermissionService } from '../../../shared/permission';

@Component({
  selector: 'app-root-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.scss']
})
export class ListRequestComponent extends BasePage implements AfterViewInit,OnInit {
  ngOnInit(): void {
    ///چک دسترسی ایجاد درخواست بدون تکمیل فرم اطلاعات تکمیلی
    this.allow_PRG_REQ_003 = this.permissionService.hasDefined('PRG-REQ-003')
  }
  ngAfterViewInit(): void {
    this.menuItems[1].visible = false;
    if (this.jasem.length > 0) {
      this.selectionChangedHandler();
    }
  }
  constructor(public translate: TranslateService, public router: Router, public service: ServiceCaller,public permissionService: PermissionService) {
    super(translate);
  }
  @ViewChild('grid') dataGrid: DxDataGridComponent;
  allow_PRG_REQ_003 : boolean=false;
  jasem: any = [];
  selectedRow: any = {};
  PRG_USER_FURTHER_INFORMATION_EXISTS : Boolean=false;
  
  menuItems = [
    {
      name: "New",
      icon: "fa fa-plus green",
      text: 'جدید',
      visible: true
    },
    {
      name: "Edit",
      icon: "fa fa-edit green",
      text: 'ویرایش',
      visible: true
    }
  ]

  onMenuItemClick(name ) {
    let ds: any = {};
    ds = this.dataGrid.instance.getDataSource().items();
    if (name == "New") 
    {
      debugger
      if (! this.allow_PRG_REQ_003) {///چک دسترسی ایجاد درخواست بدون تکمیل فرم اطلاعات تکمیلی

          //////چک کردن این موضوع که آیا اطلعات تکمیلی کاربر وارد شده است یا خیر
          this.service.get("/PRG/USER_FURTHER_INFORMATION/List", (data) => {
            
            if (data != null)
              this.PRG_USER_FURTHER_INFORMATION_EXISTS=true;
            else   
              this.PRG_USER_FURTHER_INFORMATION_EXISTS=false;

              if (ds.filter(x => x.REQ_Status != 3).length > 0) 
              {
                Notify.info("PRG_REQUEST_CREATE_LIMITED");
              } 
              else if (!this.PRG_USER_FURTHER_INFORMATION_EXISTS)
              {
                Notify.info("PRG_REQUEST_NO_PRG_USER_FURTHER_INFORMATION");
              }
              else
                this.router.navigate(["prg/request"], { queryParams: { ID: "" } });

          }, {});
        }
       else {
        this.router.navigate(["prg/request"], { queryParams: { ID: "" } });
       }

      //////    

    } 
    else if (name == "Edit") {
      console.log("this.selectedRow", this.selectedRow);
      if (ds.filter(x => x.REQ_Status == 0).length > 0)
        this.router.navigate(["prg/request"], { queryParams: { ID: this.selectedRow } });
        else
        Notify.info("PRG_REQUEST_EDIT_LIMITED");
    }
  }
  
  selectionChangedHandler() {
    console.log("selectekey", this.jasem);
    console.log("len", this.jasem.length);

    if (this.jasem.length == 0) {
      this.menuItems[1].visible = false;
     
    } else if (this.jasem.length == 1) {
      this.menuItems[1].visible = true;
      
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0].ID;
    } else {
      this.selectedRow = {};
      this.menuItems[1].visible = false;
      
    }
 
 
    }
}
