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

@Component({
  selector: 'wam-page-movementstatusdetail',
  templateUrl: './movementstatusdetail.page.html',
  providers: [ServiceCaller]
})

export class WAMMovementStatusDetailPage extends BasePage implements OnInit {
  filter: any = {};
  movementErrorFilter: any = {};

  ngOnInit() {
  }
  @ViewChild('movementStatusGrid') movementStatusGrid: DxDataGridComponent;
  @ViewChild('ErrorGrid') ErrorGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;


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
    {
      name: "Return",
      icon: "fa fa-arrow-circle-right",
      text: this.translate.instant("PUB_RETURN"),
      visible: true,
      disabled: false
    },
  ];
  dataSource: any = {};
  gridItems: any[] = [
    {
      name: "dx-view",
      icon: "fa fa-eye green",
      text: 'مشاهده',
    }
  ];

  headerItem: any = {};
  PeriodDateEnd: Date;

  //LOV
  warehouseLov: any = [];
  listWarehouseID: any = [];

  selectedKeys: any = [];
  selectedRow: any = {};
  errorSelectedKeys: any = [];
  errorSelectedRow: any = {};

  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    this.filter.PeriodID = [];
    this.filter.PeriodID.push(Guid.empty);
    this.filter.FlagHasError = true;
    this.service.loadLovData("LOV-WAM-003", (data) => {
      this.warehouseLov = data;
    });

  }
  onMenuItemClick(e) {//
    debugger;
    if (e == "Return") {
      this.router.navigate(["wam/closingdocuments/movementstatus"]);
    }
  }
  financialPeriodChanged(data) {
    this.PeriodDateEnd = data.EndDate;
  }
  onWarehouseValueChanged(e) {

    var prId: any = [];
    var noId: any = [];
    e.previousValue.forEach(f => prId.push(f.ID));
    e.value.forEach(f => noId.push(f.ID));
    if (prId.length > noId.length)//pop
    {
      prId.forEach(s => {
        if (noId.filter(c => c != s).length > 0) {
          this.listWarehouseID.pop(s);
        }
      })

    }
    else//push
      this.listWarehouseID.push(e.value[e.value.length - 1].ID);

  }

  onShowClick() {
    //
    var result = this.form.instance.validate();
    if (result.isValid) {
      this.headerItem.WarehouseID = [];
      debugger;
      //this.headerItem.WarehouseID.push(this.headerItem.WarehouseIDList);
      this.headerItem.WarehouseID = this.headerItem.WarehouseIDList;
      this.headerItem.PeriodDateEnd = this.PeriodDateEnd;
      this.service.post("/WAM/MovementStatus/FetchData", (data) => {
        this.filter.PeriodID = data;
        if (this.movementStatusGrid != undefined)
          this.movementStatusGrid.instance.refresh();
      }, this.headerItem);
    }
  }

  onFetchClick() {
    //
    //this.headerItem.WarehouseID = [];
    //
    var result = this.form.instance.validate();
    if (result.isValid) {
      this.headerItem.WarehouseID = this.headerItem.WarehouseIDList;
      this.headerItem.PeriodDateEnd = this.PeriodDateEnd;
      this.service.post("/WAM/MovementStatus/FetchMovementsData", (data) => {
        this.filter.PeriodID = data;
        if (this.movementStatusGrid != undefined)
          this.movementStatusGrid.instance.refresh();
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
      this.selectedRow = this.movementStatusGrid.instance.getSelectedRowsData()[0];
      this.movementErrorFilter = { MovementStatusId: this.selectedRow.ID }
      if (this.ErrorGrid != undefined)
        this.ErrorGrid.instance.refresh();
    }
    else {
      this.selectedRow = {};
    }
  }

  errorSelectionChangedHandler() {

    if (this.errorSelectedKeys.length == 1) {
      this.errorSelectedRow = this.ErrorGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.selectedRow = {};
    }
  }

  onErrorMenuItemClick(e) {
    if (e.name == "dx-view") {
      this.router.navigate(["wam/movement/movement"], { queryParams: { ID: this.errorSelectedRow.MovementId, type: this.errorSelectedRow.MovementTypeCode, sourceForem: 'STATUS' } });
    }
  }
}
