import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { Guid } from '../../shared/types/GUID';
import { DateTime } from '../../shared/util/DateTime';
import { Notify } from '../../shared/util/Dialog';

@Component({
  selector: 'wam-page-movementstatus',
  templateUrl: './movementstatus.page.html',
  providers: [ServiceCaller]
})

export class WAMMovementStatusPage extends BasePage implements OnInit {
  headerItem: any = {};
  localData: any = [];
  selectedRowID: any = {};
  selectedKeys: any = [];
  dataSource: any = {};
  movementIds: any = [];
  @ViewChild('form') form: DxValidationGroupComponent;
  @ViewChild('dataGrid') dataGrid: DxDataGridComponent;
  ngOnInit(): void {
    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        // let param:any={WarehouseID:[],FinishDate:null};
        //  if( this.headerItem.WarehouseIDList==null)
        //  this.headerItem.WarehouseIDList=[];
        this.headerItem.WarehouseID = [];
        if (this.headerItem.WarehouseIDList != undefined)
          this.headerItem.WarehouseID = this.headerItem.WarehouseIDList;
        this.service.post("/WAM/MovementStatus/Get", (data) => {
          deferred.resolve(data);
        }, this.headerItem);
        return deferred.promise;

      }
    });
  }
  menuItems = [

    {
      icon: "fa fa-plus",
      text: 'عملیات',
      items: [
        {
          name: "Close",
          // icon: 'fa fa-bar-chart green',
          text: "قطعی نمودن"
        },
        {
          name: "Open",
          // icon: 'fa fa-pencil-square-o green',
          text: "غیرقطعی نمودن"

        },
      ]
      
    },

  ];
  onShowClick() {
    if (this.headerItem.FinishDate == null)
      this.headerItem.FinishDate = DateTime.convertForRemote(DateTime.now);
    let result = this.form.instance.validate();
    if (result.isValid)           
       this.dataGrid.instance.refresh();
    else
      Notify.error('WAM_SELECT_AT_LEAST_ONE_WAREHOUSE');

  }
  onMenuItemClick(name) {
    if (name == "Close") {


      this.headerItem.MovementStatusId = this.movementIds;

      this.service.post("/WAM/MovementStatus/Confirm", (data) => {

        if (data = "false")
          this.router.navigate(["wam/closingdocuments/movementstatusdetail"]);

        this.dataGrid.instance.refresh();
      }, this.headerItem);
    }
    if (name == "Open") {
      this.headerItem.MovementStatusId = this.movementIds;

      this.service.post("/WAM/MovementStatus/Unconfirm", (data) => {

        this.dataGrid.instance.refresh();
      }, this.headerItem);
    }

  }

  warehouseChanged(e) {
    this.headerItem.WarehouseIDList = [];
    this.headerItem.WarehouseDescription = "";
    if (e.constructor == Array) {
      e.forEach(d => {
        this.headerItem.WarehouseIDList.push(d.ID);
        this.headerItem.WarehouseDescription += d.Title + ',';
      });
    }
    else {
      this.headerItem.WarehouseIDList.push(e.ID);
      this.headerItem.WarehouseDescription = e.Title;
    }
  }
  selectionChangedHandler() {
    if (this.selectedKeys.length == 1) {
      this.selectedRowID = this.dataGrid.instance.getSelectedRowsData()[0].ID;
      this.movementIds.push(this.selectedRowID);
    }

  }



  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);

  }
}
