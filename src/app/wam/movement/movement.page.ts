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
import { Notify, Dialog } from '../../shared/util/Dialog';
import { DateTime } from '../../shared/util/DateTime';
import { DXLovComponent } from '../../shared/components/dx-lov.component';
import { DemisPopupService } from '../../shared/components/popup/demis-popup-service';
import { WAMItemInfoPage } from '../coding/iteminfo.page';

import notify from 'devextreme/ui/notify';
const TEST = new WeakMap();
@Component({
  selector: 'wam-page-movement',
  templateUrl: './movement.page.html',
  providers: [ServiceCaller]
})

export class WAMMovementPage extends BasePage implements OnInit {

  TempRequired: boolean;
  authorized: boolean;
  lastClosedDate: any;
  lastInsertedId: any;
  flgPurchaseOrderRequired: boolean;
  ngOnInit() {
  }
  @ViewChild('itemGrid') itemGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;
  @ViewChild('requestItemLovComponent') requestItemLovComponent: DXLovComponent;
  @ViewChild('movementItemLovComponent') movementItemLovComponent: DXLovComponent;
  /////////////////////////////////////SERIAL
  @ViewChild('traceGrid') traceGrid: DxDataGridComponent;
  @ViewChild('lotGrid') lotGrid: DxDataGridComponent;
  /////////////////////////////////////SERIAL

  /////////////////////////////////////SERIAL
  CentricAccountFilter: any = {};
  traceLoadParam: any = {};
  lotLoadParam: any = {};
  lotSaveParam: any = {};

  traceSelectedKeys: any = [];
  lotSelectedKeys: any = [];

  traceSelectedRow: any = {};
  lotSelectedRow: any = {};

  tagEditRow: any = {};

  lotFilter: any = {};

  groupLotSaveParam: any = [];

  createTagData: any = {};

  model: any = {};
  /////////////////////////////////////SERIAL

  //LOV

  ////
  items: any = {};
  units: any = {};
  itemUnitFilter: any = {};
  lovItemSettingFilter: any = {};
  reffrenceMovementFilter: any = { WRHS_ID: null, MVTP_ID: null };
  requestFilter: any = { WRHS_ID: null };
  movementItemFilter: any = {};
  requestItemFilter: any = {};
  warehouseItemFilter: any = {};
  purchaseOrderFilter: any = {};
  warehouseFilter: any = {};

  warehouseTargetFilter: any = {};


  rqstItemLov: any = {};
  mvmnItemLov: any = {};

  //fa fa-angle-down
  moreLessIcon: string = "fa fa-angle-down";

  itemSelectedKeys: any = [];
  itemSelectedRow: any = {};
  editRow: any = {};
  infoPopupVisibile: boolean = false;
  refMvmnData: any = {};

  //itemSelectedRow:any = {};

  headerItem: any = {};
  dataSource: any = {};
  localData: any[] = [];
  headerItemsConfig: any = {};
  itemsLength: Number = 0;
  saveParams: any = {};
  loadParams: any = {};

  Name: string = null;
  type: string;
  typeId: string = Guid.empty;
  reffrenceMovementTypeID: string;
  RelationType: Number;
  ReffrenceType: Number;
  secondReffrenceType: Number;
  refName: string = null;
  refMovementType: string;
  flgNoReffrenceAllowed: boolean;
  //noReffrence: boolean;
  filter: any = {};
  typeFilter: any = {};

  //Context Parameters
  flgSupplier: boolean = false;
  flgPerson: boolean = false;
  flgCustomer: boolean = false;
  flgCostCenter: boolean = false;
  flgWarehouseTarget: boolean = false;
  flgSupplierVisible: boolean = false;
  flgPersonVisible: boolean = false;
  flgCustomerVisible: boolean = false;
  flgCostCenterVisible: boolean = false;
  flgWarehouseTargetVisible: boolean = false;
  flgWarehouse: boolean = false;
  flgMovement: boolean = false;
  flgRequest: boolean = false;
  flgPurchaseOrder: boolean = false;
  flgSaleOrder: boolean = false;
  flgMovementVisible: boolean = false;
  flgRequestVisible: boolean = false;
  flgWarehouseItemVisible: boolean = false;
  flgPurchaseOrderVisible: boolean = false;
  flgSalOrderVisible: boolean = false;
  flgTextNoteVisible: boolean = false;
  flgTextNoteSecVisible: boolean = false;
  flgPurOrder: boolean = false;
  flgSalOrder: boolean = false;
  flgDate: boolean = false;
  flgTextNote: boolean = false;
  flgTextNoteSec: boolean = false;

  itemTypeFilter: any = {};

  flgWorkOrderVisible: boolean = false;
  flgWorkOrder: boolean = false;

  flgMore: boolean = false;

  lovIttp: any = {};

  MovementType: string;

  flgMovementRequired: any = false;
  flgRequestRequired: any = false;

  projectSetup: any = {};

  readonly: boolean = true;

  flgUpdateCode: boolean = false;

  flgType: boolean = false;

  flgReturnVisible: boolean = true;

  inputParam: any = {};

  serialPopup: boolean = false;
  flgCreateTag: boolean = true;

  tagRelatedData: any = {};

  checkQuantityCommercial: Boolean = false;
  scale: any = 0;
  commercialScale: any = 0;

  flagSimpleMode: boolean = true;
  flagCentricBase: boolean = true;


  filterReport: any = {};

  menuItems: any[] = [
    {
      name: "New",
      icon: "fa fa-plus green",
      text: this.translate.instant("NEW"),
      visible: true,
      disabled: false
    },
    {
      name: "InsertRows",
      icon: "fa fa-magic",
      text: this.translate.instant("WAM_AUTO_INSERT_MOVEMENT_ITEM"),
      visible: true,
      disabled: false
    },
    {
      name: "Save",
      icon: "fa fa-floppy-o green",
      text: this.translate.instant("SAVE"),
      visible: true,
      disabled: false
    },
    {
      name: "Search",
      icon: "fa fa-search",
      text: this.translate.instant("MOVEMENT_SEARCH"),
      visible: true,
      disabled: false
    },
    // {
    //   name: "Confirm",
    //   icon: "fa fa-check",
    //   text: this.translate.instant("PUB_CONFIRM"),
    //   visible: true,
    //   disabled: false
    // },
    {
      name: "Return",
      icon: "fa fa-arrow-circle-right",
      text: this.translate.instant("PUB_RETURN"),
      visible: false,
      disabled: false
    },
    {
      name: "SingleDetail",
      icon: "fa fa-tags yellow",
      text: this.translate.instant("PUR_SINGLE_ORDER_ITEMS"),
      visible: true,
      disabled: false
    },
    // ,
    // {
    //   name: "Delete",
    //   icon: "fa fa-trash red",
    //   text: this.translate.instant("PUB_DELETE"),
    //   visible: true,
    //   disabled: false
    // }
    //,
    //{
    //    name: "Delete",
    //    icon: "fa fa-trash-alt",
    //    text: this.translate.instant("PUB_DELETE"),
    //    visible: true,
    //    disabled: false
    //}
  ];

  gridItems: any[] = [
    {
      name: "DXTag",
      icon: "fa fa-tags",
      text: this.translate.instant("SELECT_TAG"),
      visible: true
    },
    {
      name: "DXCardex",
      icon: "far fa-chart-bar",
      text: this.translate.instant("WAM_SHOW_CARDEX"),
      visible: true
    },
    {
      name: "DXInfo",
      icon: "fa fa-info",
      text: this.translate.instant("WAM_SHOW_INFO"),
      visible: true
    }
  ];

  constructor(public service: ServiceCaller, private popup: DemisPopupService, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    let Config: any = {};
    Config.ConfigMode = 1;
    Config.key = 'WAM_FLG_SIMPLE_MODE';
    this.service.get("/ADM/Config/List", (data) => {
      if (data == 0)
        this.flagSimpleMode = false;
      else if (data == 1)
        this.flagSimpleMode = true;
    }, Config);

    let centricBaseConfig: any = {};
    centricBaseConfig.ConfigMode = 1;
    centricBaseConfig.key = 'WAM_FLG_CENTRIC_BASE';
    this.service.get("/ADM/Config/List", (data) => {
      if (data == 0)
        this.flagCentricBase = false;
      else if (data == 1)
        this.flagCentricBase = true;
    }, centricBaseConfig);

    TEST.set(WAMMovementPage, this);
    this.gridItems[0].visible = !this.flagSimpleMode;
    //this.setProject();
    this.type = this.route.snapshot.data["type"];
    if (this.type == null) {
      this.route.queryParams.subscribe(params => {
        this.type = params['type'];
        this.filter.ID = params['ID'];
        this.inputParam = params;
        //this.inputParam.sourceForem = params['sourceForem'];
      });
    }
    if (this.inputParam.sourceForem == 'CARDEX') {//CARDEX
      this.menuItems[4].visible = true;
    }
    else {
      this.menuItems[4].visible = false;
    }
    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.localData.filter(c => c.ID == key)[0];
        updatedItem.Flag = 2;
        // if ((this.editRow.SecondQuantityCommercial != null) && (updatedItem.SecondQuantityCommercial == null || (updatedItem.SecondQuantityCommercial != null && updatedItem.SecondQuantityCommercial != this.editRow.SecondQuantityCommercial)))
        //   updatedItem.SecondQuantityCommercial = this.editRow.SecondQuantityCommercial;
        // if ((this.editRow.QuantityCommercial != null) && (updatedItem.QuantityCommercial == null || (updatedItem.QuantityCommercial != null && updatedItem.QuantityCommercial != this.editRow.QuantityCommercial)))
        //   updatedItem.QuantityCommercial = this.editRow.QuantityCommercial;
        // if ((this.editRow.Quantity != null) && (updatedItem.Quantity == null || (updatedItem.Quantity != null && updatedItem.Quantity != this.editRow.Quantity)))
        //   updatedItem.Quantity = this.editRow.Quantity;
        if ((this.editRow.ItemId != null) && (updatedItem.ItemId == null || (updatedItem.ItemId != null && updatedItem.ItemId != this.editRow.ItemId)))
          updatedItem.ItemId = this.editRow.ItemId;
        if ((this.editRow.RefMovementItemId != null) && (updatedItem.RefMovementItemId == null || (updatedItem.RefMovementItemId != null && updatedItem.RefMovementItemId != this.editRow.RefMovementItemId)))
          updatedItem.RefMovementItemId = this.editRow.RefMovementItemId;
        if ((this.editRow.RequestItemId != null) && (updatedItem.RequestItemId == null || (updatedItem.RequestItemId != null && updatedItem.RequestItemId != this.editRow.RequestItemId)))
          updatedItem.RequestItemId = this.editRow.RequestItemId;
        if ((this.editRow.SaleOrderItemId != null) && (updatedItem.SaleOrderItemId == null || (updatedItem.SaleOrderItemId != null && updatedItem.SaleOrderItemId != this.editRow.SaleOrderItemId)))
          updatedItem.SaleOrderItemId = this.editRow.SaleOrderItemId;
        if ((this.editRow.PurchaseOrderItemId != null) && (updatedItem.PurchaseOrderItemId == null || (updatedItem.PurchaseOrderItemId != null && updatedItem.PurchaseOrderItemId != this.editRow.PurchaseOrderItemId)))
          updatedItem.PurchaseOrderItemId = this.editRow.PurchaseOrderItemId;
        if ((this.editRow.UnitId != null) && (updatedItem.UnitId == null || (updatedItem.UnitId != null && updatedItem.UnitId != this.editRow.UnitId)))
          updatedItem.UnitId = this.editRow.UnitId;
        if ((this.editRow.ItemTypeId != null) && (updatedItem.ItemTypeId == null || (updatedItem.ItemTypeId != null && updatedItem.ItemTypeId != this.editRow.ItemTypeId)))
          updatedItem.ItemTypeId = this.editRow.ItemTypeId;
        if ((this.editRow.UnitDescription != null) && (updatedItem.UnitDescription == null || (updatedItem.UnitDescription != null && updatedItem.UnitDescription != this.editRow.UnitDescription)))
          updatedItem.UnitDescription = this.editRow.UnitDescription
        if ((this.editRow.ProjectId != null) && (updatedItem.ProjectId == null || (updatedItem.ProjectId != null && updatedItem.ProjectId != this.editRow.ProjectId)))
          updatedItem.ProjectId = this.editRow.ProjectId
        if ((this.editRow.LocationId != null) && (updatedItem.LocationId == null || (updatedItem.LocationId != null && updatedItem.LocationId != this.editRow.LocationId)))
          updatedItem.LocationId = this.editRow.LocationId
        if ((this.editRow.RequestCentricAccountId != null) && (updatedItem.RequestCentricAccountId == null || (updatedItem.RequestCentricAccountId != null && updatedItem.RequestCentricAccountId != this.editRow.RequestCentricAccountId)))
          updatedItem.RequestCentricAccountId = this.editRow.RequestCentricAccountId
        if ((this.editRow.SerialControlType != null) && (updatedItem.SerialControlType == null || (updatedItem.SerialControlType != null && updatedItem.SerialControlType != this.editRow.SerialControlType)))
          updatedItem.SerialControlType = this.editRow.SerialControlType
        //this.editRow.SerialControlType
        //RequestCentricAccountId
        Object.assign(updatedItem, values);
        deferred.resolve(true);
        return deferred.promise;
      },
      insert: (values) => {
        var detailInsert: any = [];
        let deferred: Deferred<any> = new Deferred<any>();
        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;
        this.lastInsertedId = insertedItem.ID;

        //values.SecondQuantityCommercial = this.editRow.SecondQuantityCommercial;
        //values.QuantityCommercial = this.editRow.QuantityCommercial;
        //values.Quantity = this.editRow.Quantity;
        values.AutomaticTagFlag = this.flgCreateTag;
        values.ItemId = this.editRow.ItemId;
        values.RefMovementItemId = this.editRow.RefMovementItemId;
        values.RequestItemId = this.editRow.RequestItemId;
        values.PurchaseOrderItemId = this.editRow.PurchaseOrderItemId;
        values.SaleOrderItemId = this.editRow.SaleOrderItemId;
        values.UnitId = this.editRow.UnitId;
        values.ItemTypeId = this.editRow.ItemTypeId;
        //values.UnitDescription = this.editRow.UnitDescription;
        //values.ItemDescription = this.editRow.ItemDescription;
        values.ProjectId = this.editRow.ProjectId;
        values.LocationId = this.editRow.LocationId;
        values.RequestCentricAccountId = this.editRow.RequestCentricAccountId;
        values.SerialControlType = this.editRow.SerialControlType;
        values.MovementTypeId = this.typeId;

        Object.assign(values, { Flag: 1 }) as any;
        this.localData.push(values);
        deferred.resolve(true);
        return deferred.promise;
      }
      , remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.localData.filter(c => c.ID == key)[0].Flag = 3;
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      }
    });
    this.clearForm();
    if (this.type != undefined || this.type != null) {
      this.setContext();
      if (this.filter.ID != Guid.empty && this.filter.ID != null && this.filter.ID != undefined)
        this.loadData();
    }
    else {
      this.setType();
    }


    //LOV

    this.service.loadLovData("LOV-WAM-004", (data) => { this.items = data; }, { ITEM_ITCT_FILTER: null, ITEM_ITCT_FILTER_ALLOW: null });
    service.get("/SYS/FORMS/List", (data) => {
      this.units = data.Data;
    }, { Code: "LOV-WAM-005" });
    this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })
  }

  setType() {
    var filter = { MovementId: this.filter.ID };
    this.service.get("/WAM/Movement/GetType", (data) => {
      this.type = data;
      this.setContext();
      if (this.filter.ID != Guid.empty && this.filter.ID != null && this.filter.ID != undefined)
        this.loadData();
    }, filter)
  }
  onMvmnLovChange() {
    if (this.headerItem.RefMovementID != null) {

      alert("filled");
      var fillDate = this.headerItem.RefMovementDate;
    }
  }

  onMovmentChanged(e) {
    console.log(e);
  }
  CostCenterChanged(data) {
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, type: this.type }
    this.reffrenceMovementFilter = { WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType }
  };
  onCellMovementItemCodeChanged(data, cell) {
    this.editRow.ItemDescription = data.ItemDescription;
    this.editRow.ItemDescriptionLatin = data.ItemDescriptionLatin;
    this.editRow.ItemId = data.ItemId;
    this.editRow.ItemCode = data.ItemCode;
    this.saveParams.ItemId = data.ItemId;
    this.editRow.RefMovementItemId = data.MovementItemId;
    this.saveParams.RefMovementItemId = data.MovementItemId;
    this.editRow.UnitDescription = data.UnitDescription;
    this.editRow.UnitId = data.UnitId;
    this.saveParams.UnitId = data.UnitId;
    this.editRow.ProjectId = data.ProjectId;
    this.saveParams.ProjectId = data.ProjectId;
    this.editRow.ProjectName = data.ProjectName;
    this.editRow.LocationDescription = data.LocationDescription;
    this.editRow.LocationId = data.LocationId;
    this.editRow.ReffrenceMovementNumber = data.MovementNumber;
    this.editRow.SerialControlType = data.SerialControlType;
    if (data.QuantityRemainder > data.Inventory && this.MovementType == '2')
      this.editRow.SecondQuantityCommercial = data.Inventory;
    else
      this.editRow.SecondQuantityCommercial = data.QuantityRemainder;
    this.scale = data.scale;
    this.commercialScale = data.commercialScale;
    this.itemUnitFilter = { ITEM_ID: data.ItemId };
    //this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
    if (data.ItemTypeId != null && data.ItemTypeId != undefined && data.ItemTypeId != Guid.empty) {
      this.flgType = true;
      this.editRow.ItemTypeId = data.ItemTypeId;
      this.editRow.ItemTypeDescription = data.TypeDescription;
    }
    else
      this.flgType = false;
    cell.setValue(data.ItemId);
    //
  }

  onCellReQuestItemCodeChanged(data, cell) {
    this.editRow.ItemDescription = data.ItemDescription;
    this.editRow.ItemDescriptionLatin = data.ItemDescriptionLatin;
    this.editRow.ItemId = data.ItemId;
    this.saveParams.ItemId = data.ItemId;
    this.editRow.ItemCode = data.ItemCode;
    this.editRow.RequestItemId = data.RequestItemId;
    this.saveParams.RequestItemId = data.RequestItemId;
    this.editRow.PurchaseOrderItemId = data.PurchaseOrderItemId;
    this.saveParams.PurchaseOrderItemId = data.PurchaseOrderItemId;
    this.editRow.SaleOrderItemId = data.SaleOrderItemId;
    this.saveParams.SaleOrderItemId = data.SaleOrderItemId;
    this.editRow.UnitDescription = data.UnitDescription;
    this.editRow.RequestNumber = data.REQUESTNUMBER;
    //this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
    this.editRow.UnitId = data.UnitId;
    this.saveParams.UnitId = data.UnitId;
    this.editRow.ProjectId = data.ProjectId;
    this.saveParams.ProjectId = data.ProjectId;
    this.editRow.ProjectName = data.ProjectName;
    this.editRow.LocationDescription = data.LocationDescription;
    this.editRow.LocationId = data.LocationId;
    this.editRow.SerialControlType = data.SerialControlType;
    this.editRow.RequestCentricAccountId = data.RequestCentricAccountId;

    if (data.QuantityRemainder > data.Inventory && this.MovementType == '2')
      this.editRow.SecondQuantityCommercial = data.Inventory;
    else
      this.editRow.SecondQuantityCommercial = data.QuantityRemainder;


    this.scale = data.scale;
    this.commercialScale = data.commercialScale;

    this.itemUnitFilter = { ITEM_ID: data.ItemId };
    if (data.ItemTypeId != null && data.ItemTypeId != undefined && data.ItemTypeId != Guid.empty) {
      this.flgType = true;
      this.editRow.ItemTypeId = data.ItemTypeId;
      this.editRow.ItemTypeDescription = data.ItemTypeDescription;
    }
    else
      this.flgType = false;
    cell.setValue(data.ItemId);
    //
  }


  setCellValueOfItemCode(newData, value, currentRowData) {
    let that = TEST.get(WAMMovementPage);
    console.log(that.editRow);
    console.log(that.editRow);
    newData.ItemCode = that.editRow.ItemCode;
    newData.ItemDescription = that.editRow.ItemDescription;
    newData.ItemDescriptionLatin = that.editRow.ItemDescriptionLatin;
    newData.UnitDescriptionCommercial = that.editRow.UnitDescription;
    newData.RequestNumber = that.editRow.RequestNumber;
    newData.ItemTypeId = that.editRow.ItemTypeId;
    newData.ItemTypeDescription = that.editRow.ItemTypeDescription;
    newData.ProjectName = that.editRow.ProjectName;
    newData.ReffrenceMovementNumber = that.editRow.ReffrenceMovementNumber;
    newData.LocationDescription = that.editRow.LocationDescription;
    newData.SecondQuantityCommercial = that.editRow.SecondQuantityCommercial;
    debugger;
    let vScale = that.scale;///
    if (that.scale == 0)
      newData.Quantity = newData.SecondQuantityCommercial * currentRowData.UnitScale;
    else
      newData.Quantity = newData.SecondQuantityCommercial * that.scale;
    if (that.commercialScale == 0)
      newData.QuantityCommercial = newData.SecondQuantityCommercial * currentRowData.CommercialUnitScale;
    else
      newData.QuantityCommercial = newData.SecondQuantityCommercial * that.commercialScale;
    //newData.
    //newData.ItemDescription = 
  }

  onCellWarehouseItemCodeChanged(data, cell) {
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemDescriptionLatin = data.ItemDescriptionLatin;
    this.editRow.ItemId = data.ID;
    this.editRow.ItemCode = data.Code;
    this.saveParams.ItemId = data.ID;
    this.editRow.UnitDescription = data.UnitDescription;
    this.editRow.UnitId = data.UnitId;
    this.saveParams.UnitId = data.UnitId;
    this.scale = data.scale;
    this.commercialScale = data.commercialScale;
    this.editRow.LocationDescription = data.LocationDescription;
    this.editRow.LocationId = data.LocationId;
    this.itemUnitFilter = { ITEM_ID: data.ID };

    this.editRow.ItemTypeId = data.ItemTypeId;
    this.editRow.ItemTypeDescription = data.ItemTypeDescription;
    this.editRow.SerialControlType = data.SerialControlType;
    //this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
    //console.log('this.itemUnitFilter');
    //console.log(this.itemUnitFilter);
    cell.setValue(data.ItemId);
    //
  }


  clearForm() {
    //this.headerItem = {};
    //if (this.headerItem.Status != 10)
    this.headerItem.ID = null;
    this.headerItem.Status = 10;//{ Status: 10};//, MovementTypeID: this.typeId };
    debugger;
    this.headerItem.Date = DateTime.convertForRemote(DateTime.now);
    this.headerItem.WarehouseID = null;
    this.headerItem.WarehouseDescription = null;
    this.headerItem.Number = null;
    this.headerItem.VisibleNumber = null;
    this.headerItem.SupplierID = null;
    this.headerItem.SupplierNam = null;
    this.headerItem.CentricAccountId = null;
    this.headerItem.CentricAccountName = null;
    this.headerItem.CustomerID = null;
    this.headerItem.CustomerNam = null;
    this.headerItem.BusinessUnitID = null;
    this.headerItem.BusinessUnitName = null;
    this.headerItem.WarehouseTargetID = null;
    this.headerItem.WareHouseDesTarget = null;
    this.headerItem.RequestID = null;
    this.headerItem.RequestNumber = null;
    this.headerItem.RefMovementID = null;
    this.headerItem.RefMovementNumber = null;
    this.headerItem.PurchaseOrderId = null;
    this.headerItem.PurchaseOrderNumber = null;
    this.headerItem.SalOrderID = null;
    this.headerItem.WorkOrderID = null;
    this.headerItem.WorkOrderNumber = null;
    this.headerItem.TextNote = null;
    this.headerItem.NoReffrence = false;
    this.localData = [];
    this.movementItemFilter = {};
    this.requestItemFilter = {};
    this.warehouseItemFilter = {};
    this.loadParams = {};
    this.refreshGrid();
    this.enableConfirm();
  }
  onQtyValueChange() {
    this.checkQuantityCommercial = false;
  }
  onMenuItemClick(name) {
    switch (name) {
      case "New": {
        this.clearForm();
        this.itemsLength = 0;
        this.setContext();
        //this.headerItem.MovementTypeID = this.typeId;
        break;
      }
      case "InsertRows": {
        this.insertRows();
        break;
      }
      case "Search": {
        this.router.navigate(["wam/movement/movementsearch"], { queryParams: { type: this.type } }, );
        break;
      }
      case "Save": {
        //this.headerItem.MovementTypeID = this.typeId;
        //console.log('this.headerItem.MovementTypeID');
        //console.log(this.headerItem.MovementTypeID);
        this.saveAll();
        this.setContext();
        break;
      }
      case "Confirm": {
        if (this.headerItem.Status == 10 || this.headerItem.Status == 15)
          this.headerItem.Status = 20;
        else
          this.headerItem.Status = 15;
        this.saveAll();
        this.setContext();
        break;
      }
      case 'Return': {
        this.return();
        break;
      }
      case "SingleDetail": {
        if (this.headerItem.Status < 20)
          this.singleRecordChoosing();
        else
          Notify.error('WAM_INVALID_UPDATE_MSG');

        break;
      }
      case "Delete": {
        this.deleteAll();
        this.setContext();
        break;
      }
      case 'UserInfo':
        this.infoPopupVisibile = true;
        break;
      default:
    }
    //
  }


  onItemsClick(data) {


    if (data != [] && data.length > 0) {
      // this.localDataWorkStation = [];
      let count: any = {};
      count = this.localData.filter(i => i.Flag == 2).length;
      data.forEach(t => {
        this.localData.push({
          Flag: 1,
          Quantity: t.QuantityRemainder,
          QuantityCommercial: t.QuantityRemainder,
          SecondQuantityCommercial: t.QuantityRemainder,
          //QuantityCommercialDetail: t.QuantityCommercialDetail,
          Sequence: count + 1,
          //MovementItemId: t.MovementItemId,
          ItemId: t.ItemId,
          ItemTypeId: t.ItemTypeId,
          PurchaseOrderItemId: t.PurchaseOrderItemId,
          RefMovementItemId: t.MovementItemId,
          RequestItemId: t.RequestItemId,
          AutomaticTagFlag: t.AutomaticTagFlag,
          SaleOrderItemId: t.SaleOrderItemId,
          UnitId: t.UnitId,
          ProjectId: t.ProjectId,
          LocationId: t.LocationId,
          TextNote: t.TextNote,
          MovementTypeId: this.typeId
        });
        count = count + 1;
      });
      // this.localDataWorkStation = local;
    }
    this.saveAll();
    //this.dataGrid.instance.refresh();
  }

  singleRecordChoosing() {

    this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
    this.requestItemFilter = {
      RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId
    }
    if (this.flgRequestVisible) {
      if (this.headerItem.RequestID != null && this.headerItem.RequestID != undefined) {
        //this.rqstItemLov.param = { OrderId: this.insertItem.PurchaseOrderId };
        this.requestItemLovComponent.show();
      }

      else
        Notify.error('PUB_NO_RECORD_LOADED');
    }
    if (this.flgMovementVisible) {
      if (this.headerItem.RefMovementID != null && this.headerItem.RefMovementID != undefined) {
        //this.rqstItemLov.param = { OrderId: this.insertItem.PurchaseOrderId };
        this.movementItemLovComponent.show();
      }

      else
        Notify.error('PUB_NO_RECORD_LOADED');
    }
  }

  movementTypeChanged(data) {
    this.headerItem.MovementTypeDes = data.Title
  }

  statusChanged(data) {
    this.headerItem.StatusDes = data.Title
  }

  warehouseChanged(data) {

    this.headerItem.WareHouseDes = data.Title;
    this.assignReffrenceMovementFilter(this.headerItem.WarehouseID);
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type };
    this.warehouseTargetFilter = { WRHS_ID: this.headerItem.WarehouseID };

    let closedDateFilter: any = {};
    closedDateFilter.WarehouseID = data.ID;
    if (data.ID == null || data.ID == undefined || data.ID == Guid.empty) {
      this.service.get("/WAM/Movement/LastClosedDate", (data) => {
        this.lastClosedDate = data;
        this.checkDate();
      }, closedDateFilter)
    }

  }
  assignReffrenceMovementFilter(P_WRHS_ID) {
    this.reffrenceMovementFilter = { WRHS_ID: P_WRHS_ID, MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType }
  }
  movementChanged(data) {
    if (this.headerItem.ID == null || this.headerItem.ID == undefined || this.headerItem.ID == Guid.empty) {
      this.headerItem.RefMovementNumber = data.Title;


      // if ((data.ID != null && data.ID != undefined && data.ID != Guid.empty) || (this.headerItem.RequestID != null && this.headerItem.RequestID != undefined && this.headerItem.RequestID != Guid.empty)) {
      //   this.flgWarehouse = false;
      //   this.flgWarehouseTarget = false;
      //   this.flgCostCenter = false;
      // }
      // else if ((data.ID == null || data.ID == undefined || data.ID == Guid.empty) && (this.headerItem.RequestID == null || this.headerItem.RequestID == undefined || this.headerItem.RequestID == Guid.empty)) {
      //   this.flgWarehouse = true;
      //   this.flgWarehouseTarget = true;
      // }



      if ((data.ID != null && data.ID != undefined && data.ID != Guid.empty) || (this.headerItem.RefMovementID != null && this.headerItem.RefMovementID != undefined && this.headerItem.RefMovementID != Guid.empty)) {
        this.flgWarehouse = false;
        this.flgPurchaseOrder = false;
        this.flgSaleOrder = false;
        this.flgWarehouseTarget = false;
        this.flgCostCenter = false;
      }
      else if ((data.ID == null || data.ID == undefined || data.ID == Guid.empty) && (this.headerItem.RefMovementID == null || this.headerItem.RefMovementID == undefined || this.headerItem.RefMovementID == Guid.empty)) {
        this.flgWarehouse = true;
        this.flgPurchaseOrder = true;
        this.flgSaleOrder = true;
        this.flgWarehouseTarget = true;
        this.flgCostCenter = true;
      }

      if (data.WarehouseID != null && data.WarehouseID != undefined && data.WarehouseID != Guid.empty) {
        this.headerItem.WarehouseTargetID = data.WarehouseID;
        this.flgWarehouseTarget = false
      }
      else
        this.flgWarehouseTarget = true;

      if (data.BusinessUnitID != null && data.BusinessUnitID != undefined && data.BusinessUnitID != Guid.empty) {
        this.headerItem.BusinessUnitID = data.BusinessUnitID;
        this.headerItem.BusinessUnitName = data.Title;
        this.flgCostCenter = false;
      }
      else if (data.BusinessUnitID == null || data.BusinessUnitID == undefined || data.BusinessUnitID == Guid.empty) {
        this.flgCostCenter = true;
      }

      if (data.SupplierID != null && data.SupplierID != undefined && data.SupplierID != Guid.empty) {
        this.headerItem.SupplierID = data.SupplierID;
        this.headerItem.SupplierNam = data.Title;
        this.flgSupplier = false;
      }
      else if (data.SupplierID == null || data.SupplierID == undefined || data.SupplierID == Guid.empty) {
        this.flgSupplier = true;
      }

      if (data.CentricAccountId != null && data.CentricAccountId != undefined && data.CentricAccountId != Guid.empty) {
        this.headerItem.CentricAccountId = data.CentricAccountId;
        this.headerItem.CentricAccountName = data.Title;
        this.flgPerson = false;
      }
      else if (data.CentricAccountId == null || data.CentricAccountId == undefined || data.CentricAccountId == Guid.empty) {
        this.flgPerson = true;
      }

      if (data.CustomerID != null && data.CustomerID != undefined && data.CustomerID != Guid.empty) {
        this.headerItem.CustomerID = data.CustomerID;
        this.headerItem.CustomerNam = data.Title;
        this.flgCustomer = false;
      }
      else if (data.CustomerID == null || data.CustomerID == undefined || data.CustomerID == Guid.empty)
        this.flgCustomer = true;
    }
  }

  warehouseTargetChanged(data) {
    this.headerItem.WareHouseDesTarget = data.Title;
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type, RQST_WRHS_ID_FROM: this.headerItem.WarehouseTargetID }
  }

  SupplierChanged(data) {
    //this.headerItem.RequestNumber = null;
    //this.headerItem.RequestID = null;
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type, SUPL_ID: this.headerItem.SupplierID }
    this.purchaseOrderFilter = { SUPL_ID: this.headerItem.SupplierID }

  }

  PersonChanged(data) {
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type, CNAC_ID: this.headerItem.CentricAccountId }
  }

  CustomerChanged(data) {
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type, CSTM_ID: this.headerItem.CustomerID }
  }
  requestChanged(data) {
    if (this.headerItem.ID == null || this.headerItem.ID == undefined || this.headerItem.ID == Guid.empty) {
      this.headerItem.RequestNumber = data.Number;
      //this.headerItem.BusinessUnitID = data.BusinessUnitID;
      //this.headerItem.PurchaseOrderId = data.PurchaseOrderID;
      //this.headerItem.SalOrderID = data.SaleOrderID;
      this.headerItem.WarehouseTargetID = data.WarehouseID;

      if ((data.ID != null && data.ID != undefined && data.ID != Guid.empty) || (this.headerItem.RefMovementID != null && this.headerItem.RefMovementID != undefined && this.headerItem.RefMovementID != Guid.empty)) {
        this.flgWarehouse = false;
        this.flgPurchaseOrder = false;
        this.flgSaleOrder = false;
      }
      else if ((data.ID == null || data.ID == undefined || data.ID == Guid.empty) && (this.headerItem.RefMovementID == null || this.headerItem.RefMovementID == undefined || this.headerItem.RefMovementID == Guid.empty)) {
        this.flgWarehouse = true;
        this.flgPurchaseOrder = true;
        this.flgSaleOrder = true;
      }

      if (data.BusinessUnitID != null && data.BusinessUnitID != undefined && data.BusinessUnitID != Guid.empty) {
        this.headerItem.BusinessUnitID = data.BusinessUnitID;
        this.headerItem.BusinessUnitName = data.Title;
        //this.flgSupplier = false;
        this.flgCostCenter = false;
      }
      else if (data.BusinessUnitID == null || data.BusinessUnitID == undefined || data.BusinessUnitID == Guid.empty) {
        this.flgCostCenter = true;
      }

      if (data.SupplierID != null && data.SupplierID != undefined && data.SupplierID != Guid.empty) {
        this.headerItem.SupplierID = data.SupplierID;
        this.headerItem.SupplierNam = data.Title;
        this.flgSupplier = false;
      }
      else if (data.SupplierID == null || data.SupplierID == undefined || data.SupplierID == Guid.empty) {
        this.flgSupplier = true;
      }

      if (data.CentricAccountId != null && data.CentricAccountId != undefined && data.CentricAccountId != Guid.empty) {
        this.headerItem.CentricAccountId = data.CentricAccountId;
        this.headerItem.CentricAccountName = data.Title;
        this.flgPerson = false;
      }
      else if (data.CentricAccountName == null || data.CentricAccountName == undefined || data.CentricAccountName == Guid.empty) {
        this.flgPerson = true;
      }


      if (data.CustomerID != null && data.CustomerID != undefined && data.CustomerID != Guid.empty) {
        this.headerItem.CustomerID = data.CustomerID;
        this.headerItem.CustomerNam = data.Title;
        this.flgCustomer = false;
      }
      else if (data.CustomerID == null || data.CustomerID == undefined || data.CustomerID == Guid.empty)
        this.flgCustomer = true;

      //this.headerItem.PurchaseOrderNumber = data.RefNum;
      //this.headerItem.SalOrderNumber = data.RefNum;

      if (data.PurchaseOrderID != null && data.PurchaseOrderID != undefined && data.PurchaseOrderID != Guid.empty) {
        this.headerItem.PurchaseOrderId = data.PurchaseOrderID;
        this.headerItem.PurchaseOrderNumber = data.RefNum;
        this.flgPurchaseOrder = false;
      }
      else if (data.PurchaseOrderID == null || data.PurchaseOrderID == undefined || data.PurchaseOrderID == Guid.empty) {
        this.flgPurchaseOrder = true;
      }
    }
    this.enableConfirm();
  }


  PurchaseOrderChanged(data) {
    this.headerItem.PurchaseOrderNumber = data.Number;
    //this.headerItem.SupplierID = data.SupplierID;
    //this.headerItem.SupplierNam = data.SupplierName;
    if (data.SupplierID != null && data.SupplierID != undefined && data.SupplierID != Guid.empty) {
      this.headerItem.SupplierID = data.SupplierID;
      //this.headerItem.SupplierNam = data.SupplierName;
      this.flgSupplier = false;
    }
    else if (data.SupplierID == null || data.SupplierID == undefined || data.SupplierID == Guid.empty) {
      this.flgSupplier = true;
    }
  }


  onCellUnitChanged(data, cell) {
    this.editRow.UnitId = data.ID;
    this.saveParams.UnitId = data.ID;
    this.editRow.UnitDescriptionCommercial = data.Title;
    this.scale = data.Scale;
    this.commercialScale = data.CommercialScale;
    cell.setValue(data.Title);
    //
  }

  onItemTypeChanged(data, cell) {
    this.editRow.ItemTypeId = data.ID;
    this.saveParams.ItemTypeId = data.ID;
    this.editRow.ItemTypeDescription = data.Title;
    cell.setValue(data.Title);
  }

  setCellValueOfUnitCommercial(newData, value, currentRowData) {
    let that = TEST.get(WAMMovementPage);
    newData.UnitDescriptionCommercial = that.editRow.UnitDescriptionCommercial;
    newData.SecondQuantityCommercial = null;
    newData.Quantity = null;
  }

  onCanceledItemRowGrid(e) {
    this.editRow = {};
    if (this.itemGrid != undefined
      && this.itemGrid.instance != undefined
      && this.itemGrid.instance.totalCount() > 0)
      this.disableAllHeaderFields();
    else
      this.setLayaoutAndValidation();
  }
  onGridItemClick(e) { }

  onButtonClick(name) {
    switch (name) {
      case "New":
        if (this.itemGrid != undefined && this.itemGrid.instance != undefined)
          this.itemGrid.instance.addRow();
        break;
      case "Delete": {
        this.itemSelectedKeys.forEach(s => {
          this.localData.filter(c => c.ID == s)[0].Flag = 3;
        })
        this.refreshGrid();
        break;
      }
      default:
    }
  }
  selectionChangedHandler() {
    if (this.itemSelectedKeys.length == 0) {
      this.itemSelectedRow = {};
    }
    else if (this.itemSelectedKeys != undefined && this.itemSelectedKeys != null && this.itemSelectedKeys.length == 1) {
      this.itemSelectedRow = this.itemGrid.instance.getSelectedRowsData()[0];
      let inventoryFilter = {
        WarehouseID: this.headerItem.WarehouseId,
        ItemId: this.itemSelectedRow.ItemId,
        typeId: this.itemSelectedRow.ItemTypeId,
        //Date: DateTime.now,//this.insertItem.Date
        Date: this.headerItem.Date
      };
      this.service.get("/WAM/Inventory/GetItemTypeInventory",
        (data) => {
          this.itemSelectedRow.Inventory = data;
        },
        inventoryFilter)
      //////
      let allInventoryFilter = {
        ItemId: this.itemSelectedRow.ItemId,
        typeId: this.itemSelectedRow.ItemTypeId,
        Date: this.headerItem.Date
      };
      this.service.get("/WAM/Inventory/GetItemTypeInventory",
        (data) => {
          this.itemSelectedRow.AllInventory = data;
        },
        allInventoryFilter)
    }
    else {
      this.itemSelectedRow = {};
    }
  }

  setContext() {
    if (this.typeId == Guid.empty) {
      this.typeFilter.Code = this.type;
      this.service.get("/WAM/MovementType/List", (data) => {
        this.headerItem.MovementTypeId = data[0].MovementTypeId;
        this.typeId = data[0].ID;
        this.MovementType = data[0].MovementType;
        this.warehouseFilter = { MVTP_ID: this.typeId };
        this.reffrenceMovementTypeID = data[0].ReffrenceMovementTypeID;
        this.reffrenceMovementFilter = { MVTP_ID: this.reffrenceMovementTypeID };
        this.RelationType = data[0].RelationType;
        this.ReffrenceType = data[0].ReffrenceType;
        this.secondReffrenceType = data[0].ReffrenceTypeSecond;
        this.flgCreateTag = data[0].AutomaticTagFlag;
        this.flgNoReffrenceAllowed = data[0].NoReffrenceAllowed;
        this.TempRequired = data[0].TempRequired;
        //this.headerItem.NoReffrence = false;
        this.setLayaoutAndValidation();
      }, this.typeFilter)
    }
    else
      this.setLayaoutAndValidation();
  }

  setLayaoutAndValidation() {

    switch (this.RelationType) {
      case 1:
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgCostCenter = true;
          this.flgCostCenterVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgCostCenterVisible = true;
          break;
        }
        break;
      case 2:
        break;
      case 3:
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          if ((this.headerItem.RequestID != null && this.headerItem.RequestID != undefined && this.headerItem.RequestID != Guid.empty)
            || (this.headerItem.PurchaseOrderId != null && this.headerItem.PurchaseOrderId != undefined && this.headerItem.PurchaseOrderId != Guid.empty)) {
            this.flgSupplier = false;
          }
          else if (this.headerItem.RequestID == null || this.headerItem.RequestID == undefined || this.headerItem.RequestID == Guid.empty)
            this.flgSupplier = true;
          //this.flgSupplier = true;
          this.flgSupplierVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgSupplierVisible = true;
          break;
        }
        break;
      case 4:
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          if ((this.headerItem.RequestID != null && this.headerItem.RequestID != undefined && this.headerItem.RequestID != Guid.empty)
            || (this.headerItem.SaleOrderId != null && this.headerItem.SaleOrderId != undefined && this.headerItem.SaleOrderId != Guid.empty)) {
            this.flgCustomer = false;
          }
          else if (this.headerItem.RequestID == null || this.headerItem.RequestID == undefined || this.headerItem.RequestID == Guid.empty)
            this.flgCustomer = true;
          //this.flgCustomer = true;
          this.flgCustomerVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgCustomerVisible = true;
          break;
        }
        break;
      case 5:
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          if (this.headerItem.RefMovementID != null && this.headerItem.RefMovementID != undefined && this.headerItem.RefMovementID != Guid.empty) {
            this.flgWarehouseTarget = false;
          }
          else if (this.headerItem.RefMovementID == null || this.headerItem.RefMovementID == undefined || this.headerItem.RefMovementID == Guid.empty)
            this.flgWarehouseTarget = true;
          //this.flgWarehouseTarget = true;
          this.flgWarehouseTargetVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgWarehouseTargetVisible = true;
          break;
        }
        break;
      case 7:
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          if ((this.headerItem.RequestID != null && this.headerItem.RequestID != undefined && this.headerItem.RequestID != Guid.empty)
            || (this.headerItem.PurchaseOrderId != null && this.headerItem.PurchaseOrderId != undefined && this.headerItem.PurchaseOrderId != Guid.empty)) {
            this.flgPerson = false;
          }
          else if (this.headerItem.RequestID == null || this.headerItem.RequestID == undefined || this.headerItem.RequestID == Guid.empty)
            this.flgPerson = true;
          //this.flgSupplier = true;
          this.flgPersonVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgPersonVisible = true;
          break;
        }
        break;
      case 9:
        break;
      default:
    }
    let hasReffrence = 0;
    //if (!this.headerItem.NoReffrence) {
    switch (this.ReffrenceType) {
      case 1:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {

          //if (this.projectSetup.Value == '1') {
          this.flgRequest = (true && !this.headerItem.NoReffrence);
          this.flgRequestRequired = (true && !this.headerItem.NoReffrence);
          this.flgRequestVisible = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          //} else {
          //  this.flgRequest = false;
          //  this.flgRequestRequired = false;
          //  this.flgRequestVisible = false;
          //  this.enableGeneralValues();
          //}
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 8:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {

          //if (this.projectSetup.Value == '1') {
          this.flgRequest = (true && !this.headerItem.NoReffrence);
          this.flgRequestRequired = (true && !this.headerItem.NoReffrence);
          this.flgRequestVisible = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          //} else {
          //  this.flgRequest = false;
          //  this.flgRequestRequired = false;
          //  this.flgRequestVisible = false;
          //  this.enableGeneralValues();
          //}
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 2:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgMovement = (true && !this.headerItem.NoReffrence);
          this.flgMovementVisible = (true && !this.headerItem.NoReffrence);
          this.flgMovementRequired = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 3:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgPurchaseOrderVisible = (true && !this.headerItem.NoReffrence);
          this.flgPurchaseOrder = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 4:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgSalOrderVisible = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 7:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgWorkOrderVisible = (true && !this.headerItem.NoReffrence);
          this.flgWorkOrder = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      default:
    }

    switch (this.secondReffrenceType) {
      case 1:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgRequest = (true && !this.headerItem.NoReffrence);
          this.flgRequestRequired = (true && !this.headerItem.NoReffrence);
          this.flgRequestVisible = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 8:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgRequest = (true && !this.headerItem.NoReffrence);
          this.flgRequestRequired = (true && !this.headerItem.NoReffrence);
          this.flgRequestVisible = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 2:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgMovement = (true && !this.headerItem.NoReffrence);
          this.flgMovementVisible = (true && !this.headerItem.NoReffrence);
          this.flgMovementRequired = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 3:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgPurchaseOrderVisible = (true && !this.headerItem.NoReffrence);
          this.flgPurchaseOrder = (true && !this.headerItem.NoReffrence);
          this.flgPurchaseOrderRequired = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 4:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgSalOrderVisible = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 7:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
          this.flgWorkOrderVisible = (true && !this.headerItem.NoReffrence);
          this.flgWorkOrder = (true && !this.headerItem.NoReffrence);
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      default:
    }

    //}
    if (hasReffrence == 0) {
      this.flgWarehouseItemVisible = (true && !this.headerItem.NoReffrence);
      if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0))) {
        this.enableGeneralValues();
      }
      if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
        this.disableAllHeaderFields();
      }
    }
    //this.flgRequestVisible = true;
    //this.flgMovementVisible = true;
    //this.enableGeneralValues();
    if (this.TempRequired) {
      this.disableAllHeaderFields();
      this.menuItems[0].disabled = true;
      this.menuItems[1].disabled = true;
      this.menuItems[2].disabled = true;
      this.menuItems[5].disabled = true;
    }
  }

  disableAllHeaderFields() {
    this.flgSupplier = false;
    this.flgPerson = false;
    this.flgCustomer = false;
    this.flgCostCenter = false;
    this.flgWarehouse = false;
    this.flgWarehouseTarget = false;
    this.flgMovement = false;
    this.flgRequest = false;
    this.flgPurOrder = false;
    this.flgPurchaseOrder = false;
    this.flgSalOrder = false;
    this.flgDate = false;
    //this.flgTextNote = false;
    //this.flgPurchaseOrder = false;
    this.flgSaleOrder = false;
    this.flgWorkOrder = false;
    //if (this.flgPurchaseOrderVisible || this.flgSalOrderVisible) {
    //  this.flgTextNote = true;
    //  this.flgTextNoteSec = false;
    //}
    //else {
    //  this.flgTextNote = false;
    //  this.flgTextNoteSec = true;
    //}
  }
  enableGeneralValues() {
    if (this.headerItem.ID == null ||
      this.headerItem.ID == undefined ||
      this.headerItem.ID == Guid.empty) {
      if ((this.headerItem.RequestID != null && this.headerItem.RequestID != undefined && this.headerItem.RequestID != Guid.empty) || (this.headerItem.RefMovementID != null && this.headerItem.RefMovementID != undefined && this.headerItem.RefMovementID != Guid.empty)) {
        this.flgWarehouse = false;
      }
      else if ((this.headerItem.RequestID == null ||
        this.headerItem.RequestID == undefined ||
        this.headerItem.RequestID == Guid.empty) && (this.headerItem.RefMovementID == null ||
          this.headerItem.RefMovementID == undefined ||
          this.headerItem.RefMovementID == Guid.empty)) {
        this.flgWarehouse = true;
      }
      this.flgDate = true;
    }
    this.flgTextNote = true;
    if (this.flgPurchaseOrderVisible || this.flgSalOrderVisible) {
      this.flgTextNoteVisible = true;
      this.flgTextNoteSecVisible = false;
    }
    else {
      this.flgTextNoteVisible = false;
      this.flgTextNoteSecVisible = true;
    }
  }
  refreshGrid() {
    if (this.itemGrid != undefined && this.itemGrid.instance != undefined)
      this.itemGrid.instance.refresh();
  }
  loadData() {
    this.filter.TypeCode = this.type;
    this.service.get("/WAM/Movement/List", (data) => {
      debugger;
      if (data[0].ID != Guid.empty) {
        this.fillHeaderItem(data[0]);
        //this.headerItem = data[0];
        this.localData = data[0].Items;
        this.itemsLength = this.localData.length;
        console.log('this.localData = data[0].Items');
        console.log(this.localData = data[0].Items);
        this.refreshGrid();

        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = {
          RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId
        }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.editRow = { MovementId: this.headerItem.ID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.loadParams = { MovementId: this.headerItem.ID }
        this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })

        this.filterReport.MVMN_ID = this.headerItem.ID;
        this.setContext();
        this.enableConfirm();
      }
      else {
        this.clearForm;
      }
    }, this.filter);
  }

  fillHeaderItem(data) {
    this.headerItem.ID = data.ID;
    this.headerItem.Status = data.Status;//{ Status: 10};//, MovementTypeID: this.typeId };
    this.headerItem.Date = data.Date;
    this.headerItem.WarehouseID = data.WarehouseID;
    this.headerItem.WarehouseDescription = data.WarehouseDescription;
    this.headerItem.Number = data.Number;
    this.headerItem.VisibleNumber = data.VisibleNumber;
    this.headerItem.SupplierID = data.SupplierID;
    this.headerItem.SupplierNam = data.SupplierNam;
    this.headerItem.CentricAccountId = data.CentricAccountId;
    this.headerItem.CentricAccountName = data.CentricAccountName;
    this.headerItem.CustomerID = data.CustomerID;
    this.headerItem.CustomerNam = data.CustomerNam;
    this.headerItem.BusinessUnitID = data.BusinessUnitID;
    this.headerItem.BusinessUnitName = data.BusinessUnitName;
    this.headerItem.WarehouseTargetID = data.WarehouseTargetID;
    this.headerItem.WareHouseDesTarget = data.WareHouseDesTarget;
    this.headerItem.RequestID = data.RequestID;
    this.headerItem.RequestNumber = data.RequestNumber;
    this.headerItem.RefMovementID = data.RefMovementID;
    this.headerItem.RefMovementNumber = data.RefMovementNumber;
    this.headerItem.PurchaseOrderId = data.PurchaseOrderId;
    this.headerItem.PurchaseOrderNumber = data.PurchaseOrderNumber;
    this.headerItem.SalOrderID = data.SalOrderID;
    this.headerItem.WorkOrderID = data.WorkOrderID;
    this.headerItem.WorkOrderNumber = data.WorkOrderNumber;
    this.headerItem.TextNote = data.TextNote;
    this.headerItem.NoReffrence = data.NoReffrence;
    this.headerItem.RefMovementNumberTemp = data.RefMovementNumberTemp;
  }

  showTagPopupOnMenuClick() {
    //this.tagRelatedData = this.itemSelectedRow;
    this.createTagData = {};
    this.groupLotSaveParam = [];
    var updatedItem = this.localData.filter(c => c.ID == this.itemSelectedRow.ID)[0];
    updatedItem.Flag = 2;
    this.tagRelatedData.CentricAccountId = this.itemSelectedRow.RequestCentricAccountId;
    this.tagRelatedData.LocationID = this.itemSelectedRow.LocationID;
    this.tagRelatedData.MovementItemId = this.itemSelectedRow.ID;
    this.tagRelatedData.SecondQuantityCommercial = this.itemSelectedRow.SecondQuantityCommercial;
    this.tagRelatedData.ItemId = this.itemSelectedRow.ItemId;
    this.tagRelatedData.ReffrenceMovementItemId = this.itemSelectedRow.RefMovementItemId;
    this.tagRelatedData.ID = this.itemSelectedRow.ID;
    //this.tagRelatedData.ID = this.itemSelectedRow.ID;
    //this.tagRelatedData.ID = this.itemSelectedRow.ID;

    this.tagRelatedData.WarehouseID = this.headerItem.WarehouseID;
    this.tagRelatedData.Date = this.headerItem.Date;
    this.tagRelatedData.reffrenceMovementTypeID = this.reffrenceMovementTypeID;
    //this.tagRelatedData.CentricAccountId = this.itemSelectedRow.this.tagRelatedData.CentricAccountId;
    this.serialPopup = true;
  }

  onGridRequsetItemMenuClick(e) {

    if (e.name == "DXTag") {
      this.showTagPopupOnMenuClick();
      //this.flgCreateTag = true;
    }
    //DXCardex
    if (e.name == "DXCardex") {
      this.router.navigate(["wam/inventory/cardex"], { queryParams: { WarehouseID: this.headerItem.WarehouseID, ItemID: this.itemSelectedRow.ItemId } });
    }
    if (e.name == "DXInfo") {
      this.popup.open(WAMItemInfoPage, {
        width: '900',
        height: '300',
        title: this.translate.instant("WAM_ITEM"),
        data: { ItemId: this.itemSelectedRow.ItemId, ItemTypeId: this.itemSelectedRow.ItemTypeId, WarehouseID: this.headerItem.WarehouseID, Date: DateTime.convertForRemote(DateTime.now) },
      });
    }
    if (e.name == "DXInsert") {
      this.itemSelectedRow = {};
      var result = this.form.instance.validate();
      if (this.headerItem.ID == null && !result.isValid) {
        e.handled = true;
        if (!this.flgMore)
          this.onMoreClick();
        Notify.error("WAM_MVMN_HEADER_INCOMPLETE");

      }
      else {
        //this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, type: this.type, SUPL_ID: this.headerItem.SupplierID,CNAC_ID:this.headerItem.CentricAccountId, CSTM_ID: this.headerItem.CustomerID }
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = {
          RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId
        }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.flgUpdateCode = false;
        if (this.headerItem.Status >= 20) {
          //notify({
          //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          //  type: "error",
          //  width: 400
          //});
          Notify.error('WAM_INVALID_UPDATE_MSG');
          e.handled = true;
        }
        // if (this.headerItem.ID == null) {
        //   //notify({
        //   //  message: this.translate.instant("WAM_MOVEMENT_NULL"),
        //   //  type: "error",
        //   //  width: 400
        //   //});
        //   Notify.error('WAM_MOVEMENT_NULL');
        //   e.handled = true;
        // }
        // else
        this.onCanceledItemRowGrid(e);
        this.disableAllHeaderFields();
      }
    }
    if (e.name == 'DXEdit') {
      this.flgUpdateCode = true;
      //////////
      this.itemUnitFilter = { ITEM_ID: e.data.ItemId };

      console.log('this.editRow');
      console.log(this.editRow);
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXDelete") {
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXSelectedDelete") {
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    // if (e.name == "DXSave"){
    //   this.saveAll();
    // }
  }

  enableHeader() {
    if (this.itemGrid != undefined && this.itemGrid.instance != undefined && this.itemGrid.instance.totalCount() == 0)
      this.setLayaoutAndValidation();
    this.itemInserted();
  }


  onGridMovementItemMenuClick(e) {
    if (e.name == "DXTag") {
      this.showTagPopupOnMenuClick();
      //this.flgCreateTag = true;
    }
    if (e.name == "DXInfo") {
      this.popup.open(WAMItemInfoPage, {
        width: '900',
        height: '300',
        title: this.translate.instant("WAM_ITEM"),
        data: { ItemId: this.itemSelectedRow.ItemId, ItemTypeId: this.itemSelectedRow.ItemTypeId, WarehouseID: this.headerItem.WarehouseID, Date: DateTime.convertForRemote(DateTime.now) },
      });
    }
    if (e.name == "DXCardex") {
      this.router.navigate(["wam/inventory/cardex"], { queryParams: { WarehouseID: this.headerItem.WarehouseID, ItemID: this.itemSelectedRow.ItemId } });
    }
    if (e.name == "DXInsert") {
      this.itemSelectedRow = {};
      var result = this.form.instance.validate();
      if (this.headerItem.ID == null && !result.isValid) {
        e.handled = true;
        if (!this.flgMore)
          this.onMoreClick();
        Notify.error("WAM_MVMN_HEADER_INCOMPLETE");
      }
      else {
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = {
          RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId
        }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.flgUpdateCode = false;
        if (this.headerItem.Status >= 20) {
          //notify({
          //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          //  type: "error",
          //  width: 400
          //});
          Notify.error('WAM_INVALID_UPDATE_MSG');
          e.handled = true;
        }
        // if (this.headerItem.ID == null) {
        //   //notify({
        //   //  message: this.translate.instant("WAM_MOVEMENT_NULL"),
        //   //  type: "error",
        //   //  width: 400
        //   //});
        //   Notify.error('WAM_MOVEMENT_NULL');
        //   e.handled = true;
        // }
        // else
        this.onCanceledItemRowGrid(e);
        this.disableAllHeaderFields();
      }
    }
    if (e.name == 'DXEdit') {
      this.flgUpdateCode = true;
      this.itemUnitFilter = { ITEM_ID: e.data.ItemId };
      console.log('this.editRow');
      console.log(this.editRow);
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXDelete") {
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXSelectedDelete") {
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    // if (e.name == "DXSave"){
    //   this.saveAll();
    // }
  }

  onGridWarehouseItemMenuClick(e) {
    if (e.name == "DXTag") {
      this.showTagPopupOnMenuClick();
      this.serialPopup = true;
      //this.flgCreateTag = true;
    }
    if (e.name == "DXInfo") {
      this.popup.open(WAMItemInfoPage, {
        width: '900',
        height: '300',
        title: this.translate.instant("WAM_ITEM"),
        data: { ItemId: this.itemSelectedRow.ItemId, ItemTypeId: this.itemSelectedRow.ItemTypeId, WarehouseID: this.headerItem.WarehouseID, Date: DateTime.convertForRemote(DateTime.now) },
      });
    }
    if (e.name == "DXCardex") {
      this.router.navigate(["wam/inventory/cardex"], { queryParams: { WarehouseID: this.headerItem.WarehouseID, ItemID: this.itemSelectedRow.ItemId } });
    }
    if (e.name == "DXInsert") {
      this.itemSelectedRow = {};
      var result = this.form.instance.validate();
      if (this.headerItem.ID == null && !result.isValid) {
        e.handled = true;
        if (!this.flgMore)
          this.onMoreClick();
        Notify.error("WAM_MVMN_HEADER_INCOMPLETE");
      }
      else {
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = {
          RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId
        }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.flgUpdateCode = false;
        if (this.headerItem.Status >= 20) {
          //notify({
          //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          //  type: "error",
          //  width: 400
          //});
          Notify.error('WAM_INVALID_UPDATE_MSG');
          e.handled = true;
        }
        // if (this.headerItem.ID == null) {
        //   //notify({
        //   //  message: this.translate.instant("WAM_MOVEMENT_NULL"),
        //   //  type: "error",
        //   //  width: 400
        //   //});
        //   Notify.error('WAM_MOVEMENT_NULL');
        //   e.handled = true;
        // }
        // else
        this.onCanceledItemRowGrid(e);
        this.disableAllHeaderFields();
      }
    }
    if (e.name == 'DXEdit') {
      this.flgUpdateCode = true;
      this.itemUnitFilter = { ITEM_ID: e.data.ItemId };
      console.log('this.editRow');
      console.log(this.editRow);
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXDelete") {
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXSelectedDelete") {
      if (this.headerItem.Status >= 20) {
        //notify({
        //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
        //  type: "error",
        //  width: 400
        //});
        Notify.error('WAM_INVALID_UPDATE_MSG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    // if (e.name == "DXSave"){
    //   this.saveAll();
    // }  
  }

  itemInserted() {
    debugger;
    // let i = 1;
    // this.localData.forEach(element => {
    //   element.Sequence = i;
    //   i = i + 1;
    // });
    if (((this.editRow.SerialControlType == 1 && this.itemSelectedRow.SerialControlType == undefined) || (this.editRow.SerialControlType == undefined && this.itemSelectedRow.SerialControlType == 1)) || !this.flagCentricBase) {
      if (!this.flagSimpleMode) {
        this.createTagData.CentricAccountId = (this.editRow.RequestCentricAccountId != undefined) ? this.editRow.RequestCentricAccountId : this.itemSelectedRow.RequestCentricAccountId;
        this.createTagData.BusinessUnitID = this.branchId;
        this.createTagData.LocationID = (this.editRow.LocationID != undefined) ? this.editRow.LocationID : this.itemSelectedRow.LocationID;
        this.createTagData.Quantity = (this.editRow.SecondQuantityCommercial != undefined) ? this.editRow.SecondQuantityCommercial : this.itemSelectedRow.SecondQuantityCommercial;
        this.createTagData.ItemId = (this.editRow.ItemId != undefined) ? this.editRow.ItemId : this.itemSelectedRow.ItemId;

        var updatedItem = this.localData.filter(c => c.ID == ((this.itemSelectedRow.ID != undefined) ? this.itemSelectedRow.ID : this.lastInsertedId))[0];
        //updatedItem.Flag = (updatedItem.Flag == 1)?1:;
        updatedItem.SerialData = this.createTagData;
        //updatedItem.LotNumbers = this.groupLotSaveParam;
        this.saveAll();
      }
      else {
        this.saveAll();
      }
    }
    else {
      if (!this.flagSimpleMode) {
        this.createTagData = {};
        this.groupLotSaveParam = [];
        this.tagRelatedData.CentricAccountId = this.editRow.RequestCentricAccountId;
        this.tagRelatedData.LocationID = this.editRow.LocationID;
        //if(this.itemSelectedRow.ID is null)
        //this.tagRelatedData.MovementItemId = this.editRow.ID;
        this.tagRelatedData.MovementItemId = this.itemSelectedRow.ID;
        this.tagRelatedData.SecondQuantityCommercial = this.editRow.SecondQuantityCommercial;
        this.tagRelatedData.ItemId = this.editRow.ItemId;
        this.tagRelatedData.ReffrenceMovementItemId = this.editRow.RefMovementItemId;
        this.tagRelatedData.ID = this.itemSelectedRow.ID;

        this.tagRelatedData.WarehouseID = this.headerItem.WarehouseID;
        this.tagRelatedData.Date = this.headerItem.Date;
        this.tagRelatedData.reffrenceMovementTypeID = this.reffrenceMovementTypeID;
        this.serialPopup = true;
      }
      else {
        this.saveAll();
      }
    }
  }

  enableConfirm() {
    if (this.headerItem.Status >= 20) {
      //this.menuItems[4].text = this.translate.instant("WAM_MODIFY");
      this.menuItems[1].disabled = true;
      //this.menuItems[6].disabled = true;
    }
    else {
      //this.menuItems[4].text = this.translate.instant("PUB_CONFIRM");
      this.menuItems[1].disabled = false;
      //this.menuItems[6].disabled = false;
    }
    if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null) {
      //this.menuItems[4].disabled = true;
      //this.menuItems[1].disabled = true;
      //this.menuItems[6].disabled = true;
      this.menuItems[2].disabled = true;
    }
    else {
      //this.menuItems[4].disabled = false;
      if (this.headerItem.Status < 20)
        this.menuItems[2].disabled = false;
      if (this.headerItem.Status < 20 && ((this.headerItem.RequestID != Guid.empty && this.headerItem.RequestID != null && this.headerItem.RequestID != undefined) || (this.headerItem.RefMovementID != Guid.empty && this.headerItem.RefMovementID != null && this.headerItem.RefMovementID != undefined)))
        this.menuItems[1].disabled = false;
    }
    // if (this.itemGrid != undefined) {
    //   if (this.itemGrid.instance.totalCount() > 0)
    //     this.menuItems[6].disabled = true;
    //   else
    //     this.menuItems[6].disabled = false;
    // }
  }

  saveAll() {
    let i = 1;
    this.localData.forEach(element => {
      if (element.Flag != 3) {
        element.Sequence = i;
        i = i + 1;
      }
    });
    //let i = 1;
    // this.localData.forEach(element => {
    //   if (element.Flag != 3) {
    //     element.Sequence = i;
    //     if (element.Flag != 1) {
    //       element.Flag = 2;
    //     }
    //     i = i + 1;
    //   }
    // });
    var result = this.form.instance.validate();
    if (result.isValid) {
      var param = this.headerItem;
      var detailInsert: any = [];
      var detailUpdate: any = [];
      var detailDelete: any = [];
      if (this.createTagData.InsertTag != 1) {
        this.createTagData = {};
        this.groupLotSaveParam = [];
      }
      //Insert
      this.localData.filter(i => i.Flag == 1).forEach(t =>
        detailInsert.push({
          Quantity: t.Quantity,
          QuantityCommercial: t.QuantityCommercial,
          SecondQuantityCommercial: t.SecondQuantityCommercial,
          //QuantityCommercialDetail: t.QuantityCommercialDetail,
          Sequence: t.Sequence,
          MovementItemId: t.MovementItemId,
          ItemId: t.ItemId,
          ItemTypeId: t.ItemTypeId,
          PurchaseOrderItemId: t.PurchaseOrderItemId,
          RefMovementItemId: t.RefMovementItemId,
          RequestItemId: t.RequestItemId,
          AutomaticTagFlag: t.AutomaticTagFlag,
          SaleOrderItemId: t.SaleOrderItemId,
          UnitId: t.UnitId,
          ProjectId: t.ProjectId,
          LocationId: t.LocationId,
          TextNote: t.TextNote,
          MovementTypeId: t.MovementTypeId,
          SerialData: t.SerialData,
          LotNumbers: t.LotNumbers,
          NoReffrence: this.headerItem.NoReffrence,
          WarehouseID: this.headerItem.WarehouseID,
          Date: this.headerItem.Date,
          RequestCentricAccountId: t.RequestCentricAccountId,
          Authorized: this.authorized,
        }));
      //Update
      this.localData.filter(i => i.Flag == 2).forEach(t =>
        detailUpdate.push({
          ID: t.ID,
          Quantity: t.Quantity,
          QuantityCommercial: t.QuantityCommercial,
          SecondQuantityCommercial: t.SecondQuantityCommercial,
          //QuantityCommercialDetail: t.QuantityCommercialDetail,
          Sequence: t.Sequence,
          MovementItemId: t.MovementItemId,
          ItemId: t.ItemId,
          ItemTypeId: t.ItemTypeId,
          PurchaseOrderItemId: t.PurchaseOrderItemId,
          RefMovementItemId: t.RefMovementItemId,
          RequestItemId: t.RequestItemId,
          SaleOrderItemId: t.SaleOrderItemId,
          UnitId: t.UnitId,
          ProjectId: t.ProjectId,
          LocationId: t.LocationId,
          TextNote: t.TextNote,
          MovementTypeId: this.typeId,
          SerialData: t.SerialData,
          LotNumbers: t.LotNumbers,
          //SerialData: this.createTagData,
          //LotNumbers: this.groupLotSaveParam,
          NoReffrence: this.headerItem.NoReffrence,
          WarehouseID: this.headerItem.WarehouseID,
          Date: this.headerItem.Date,
          RequestCentricAccountId: t.RequestCentricAccountId,
          Authorized: this.authorized,
        }));
      //Delete
      this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
      var Items: any = {};
      Items.InsertedItems = detailInsert;
      Items.UpdatedItems = detailUpdate;
      Items.DeletedItems = detailDelete;
      param.Items = Items;

      this.service.postPromise("/WAM/Movement/Save", param).then((data) => {
        this.fillHeaderItem(data);
        // if (this.createTagData.InsertTag == 1) {
        //   //this.createTagData.MovementItemId = this.tagRelatedData.ID;
        //   this.createTagData.MovementItemId = data.Items.filter(c => c.ItemId == this.tagRelatedData.ItemId)[0].ID;
        //   this.createTagData.Amount = 1;
        //   this.service.post("/WAM/MovementTrace/AutomaticInsert", (data) => {
        //     this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
        //     // this.lotLoadParam.MovementItemId = this.selectedRow.ID;
        //     // this.lotLoadParam.MovementTraceId = this.selectedRow.ID;
        //     this.traceGrid.instance.refresh();
        //     this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
        //     this.lotGrid.instance.refresh();
        //     Notify.success('PUB_ACTION_SUCCESS_MSG');
        //   }, this.createTagData);
        // }
        //this.headerItem = data;
        // this.InsertTag();
        this.localData = data.Items;
        this.itemsLength = this.localData.length;
        this.createTagData = {};
        this.groupLotSaveParam = [];
        this.refreshGrid();
        this.traceLoadParam.MovementItemId = data.Items.filter(c => c.ItemId == this.tagRelatedData.ItemId)[0].ID;
        this.traceGrid.instance.refresh();
        this.lotLoadParam = { MovementItemId: data.Items.filter(c => c.ItemId == this.tagRelatedData.ItemId)[0].ID, MovementTraceId: this.traceSelectedRow.ID }
        this.lotGrid.instance.refresh();
        this.setContext();
        this.enableConfirm();
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.editRow = { MovementId: this.headerItem.ID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.loadParams = { MovementId: this.headerItem.ID }
        this.serialPopup = false;
        //notify({
        //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
        //  type: "success",
        //  width: 400
        //});
        Notify.success('PUB_ACTION_SUCCESS_MSG');
      }).catch((err) => {
        if (err == 'WAM_LOT_QUANTITY') {
          Dialog.confirm('', ' مقدار ردیف با مجموع مقادیر سریال ها مغایرت دارد. در صورت تایید مقدار ردیف بر اساس مجموع مقادیر سریال ها بروز رسای می  ').okay(() => { this.authorized = true; this.saveAll(); }).cancel(() => {
            this.authorized = false; this.localData.forEach(element => {
              if (element.Flag == 3)
                element.Flag = null;
              this.refreshGrid();
              this.setContext();
            });
          }).final(() => {
            this.authorized = false; this.localData.forEach(element => {
              if (element.Flag == 3)
                element.Flag = null;
              this.refreshGrid();
              this.setContext();
            });
          });
        }

      });
    }
    else {
      if (!this.flgMore)
        this.onMoreClick();
    }
  }


  deleteAll() {
    var deleteList: Guid = [];
    let list: any[] = [];
    list.push(this.headerItem.ID);
    this.service.post("/WAM/Movement/Delete", (result) => {
      this.clearForm();
      Notify.success('PUB_ACTION_SUCCESS_MSG');
    }, list, (error) => {
    });
  }
  onEditorPreparingItemsGrid(e) {
    if (e.parentType === "dataRow" && (e.dataField == "ItemDescription" || e.dataField == "ItemDescriptionLatin" || e.dataField == "UnitDescription" || e.dataField == "Quantity" || e.dataField == "ItemCode" || (e.dataField == "ItemTypeId" && (this.flgUpdateCode || this.flgType) && (this.headerItem.ID != null && this.headerItem.ID != undefined && this.headerItem.ID != Guid.empty)) || e.dataField == "Sequence" || e.dataField == "RequestNumber"))
      e.editorOptions.readOnly = true;
  }
  setCellValueOfSecondQuantityCommercial(newData, value, currentRowData) {
    let that = TEST.get(WAMMovementPage);
    newData.SecondQuantityCommercial = value;
    let vScale = that.scale;///
    if (that.scale == 0)
      newData.Quantity = value * currentRowData.UnitScale;
    else
      newData.Quantity = value * that.scale;
    if (that.commercialScale == 0)
      newData.QuantityCommercial = value * currentRowData.CommercialUnitScale;
    else
      newData.QuantityCommercial = value * that.commercialScale;

    that.editRow.SecondQuantityCommercial = value;
  }


  itemGridOnInitNewRow(e) {
    let max = 0;
    this.localData.forEach(element => {
      if (element.Sequence > max)
        max = element.Sequence;
    });
    e.data.Sequence = max + 1;
    // this.itemsLength = Number.parseInt(this.itemsLength.toString()) + 1;
    // e.data.Sequence = Number.parseInt(this.itemsLength.toString());
  }

  return() {
    if (this.inputParam.sourceForem == 'CARDEX') {
      this.router.navigate(["wam/inventory/cardex"], { queryParams: { WarehouseID: this.inputParam.WarehouseID, ItemID: this.inputParam.ItemID, DateFrom: this.inputParam.DateFrom, DateTo: this.inputParam.DateTo } });
    }
  }
  insertRows() {
    var result = this.form.instance.validate();
    if (result.isValid) {
      if (this.flgRequestRequired) {
        this.service.postPromise("/WAM/Movement/Save", this.headerItem).then((data) => {
          //this.fillHeaderItem(data);
          this.headerItem.ID = data.ID;
          this.service.post("/WAM/Movement/AutomaticInsertRequest", (data) => {
            this.fillHeaderItem(data);
            //this.headerItem = data;
            this.localData = data.Items;
            this.refreshGrid();
            this.setContext();
            this.enableConfirm();
            this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
            this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId }
            this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
            this.editRow = { MovementId: this.headerItem.ID }
            this.saveParams = { MovementId: this.headerItem.ID }
            this.loadParams = { MovementId: this.headerItem.ID }
            //notify({
            //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
            //  type: "success",
            //  width: 400
            //});
            Notify.success('PUB_ACTION_SUCCESS_MSG');
          }, this.headerItem);
        }).catch((err) => {
          this.localData.forEach(element => {
            if (element.Flag == 3)
              element.Flag = null;
            this.refreshGrid();
            this.setContext();
          });
        });
        // this.service.post("/WAM/Movement/AutomaticInsertRequest", (data) => {
        //   this.fillHeaderItem(data);
        //   //this.headerItem = data;
        //   this.localData = data.Items;
        //   this.refreshGrid();
        //   this.setContext();
        //   this.enableConfirm();
        //   this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID,CNAC_ID:this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        //   this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID,CNAC_ID:this.headerItem.CentricAccountId, MVTP_ID: this.typeId }
        //   this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        //   this.editRow = { MovementId: this.headerItem.ID }
        //   this.saveParams = { MovementId: this.headerItem.ID }
        //   this.loadParams = { MovementId: this.headerItem.ID }
        //   //notify({
        //   //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
        //   //  type: "success",
        //   //  width: 400
        //   //});
        //   Notify.success('PUB_ACTION_SUCCESS_MSG');
        // }, this.headerItem);
      }
      else if (this.flgMovementRequired) {
        this.service.postPromise("/WAM/Movement/Save", this.headerItem).then((data) => {
          //this.fillHeaderItem(data);
          this.headerItem.ID = data.ID;
          this.service.postPromise("/WAM/Movement/AutomaticInsertMovement", this.headerItem).then((data) => {
            this.fillHeaderItem(data);
            //this.headerItem = data;
            this.localData = data.Items;
            this.refreshGrid();
            this.setContext();
            this.enableConfirm();
            this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, CNAC_ID: this.headerItem.CentricAccountId, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
            this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId }
            this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
            this.editRow = { MovementId: this.headerItem.ID }
            this.saveParams = { MovementId: this.headerItem.ID }
            this.loadParams = { MovementId: this.headerItem.ID }
            //notify({
            //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
            //  type: "success",
            //  width: 400
            //});
            Notify.success('PUB_ACTION_SUCCESS_MSG');
          }).catch((err) => {


          });
        }).catch((err) => {
          this.localData.forEach(element => {
            if (element.Flag == 3)
              element.Flag = null;
            this.refreshGrid();
            this.setContext();
          });
        });
      }
    }
    else {
      if (!this.flgMore)
        this.onMoreClick();
    }
  }

  onMoreClick() {
    this.flgMore = !this.flgMore;
    if (this.flgMore)
      this.moreLessIcon = "fa fa-angle-up";
    else
      this.moreLessIcon = "fa fa-angle-down";

  }

  onProjectChanged(data, cell) {
    this.editRow.ProjectName = data.Title;
    this.editRow.ProjectId = data.ID;
    this.saveParams.ProjectId = data.ID;
    cell.setValue(data.Title);
  }

  onRequestChanged(data, cell) {
    if (data.ID != null && data.ID != undefined && data.ID != Guid.empty)
      this.requestItemFilter = {
        RequestID: data.ID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, CNAC_ID: this.headerItem.CentricAccountId, MVTP_ID: this.typeId
      }
    cell.setValue(data.Number);
  }

  dateChanged(e) {

    this.checkDate();
  }
  checkDate() {
    if (this.headerItem.Date <= this.lastClosedDate && (this.headerItem.ID == null || this.headerItem.ID == undefined || this.headerItem.ID == Guid.empty)) {
      Notify.error('WAM_DAT_MVMN_BEFORE_CLOSED');
      //Notify.error(DateTime.convertToLocal(this.lastClosedDate));
      let currentDate = DateTime.convertForRemote(DateTime.now);
      this.headerItem.Date = null;
    }
  }


  setProject() {
    let projectSetupFilter: any = { Code: 'PROJECT_NAME' };
    this.service.get("/WAM/WamProjectSetup/Get",
      (data) => {
        this.projectSetup = data;
      },
      projectSetupFilter)
  }

  onRefAllowedChanged() {
    if (this.headerItem.NoReffrence) {
      this.flgRequestVisible = false;
      this.flgMovementVisible = false;
      this.flgWarehouseItemVisible = true;
      this.setContext();
    }
    else {
      this.flgRequestVisible = false;
      this.flgMovementVisible = false;
      this.flgWarehouseItemVisible = false;
      this.setContext();
    }
  }
  //setCellValueOfWarehouseItemCode(newData, value, currentRowData) {
  //    let that = TEST.get(WAMMovementPage);
  //    console.log(that.editRow);
  //    console.log(that.editRow);
  //    newData.ItemCode = value;
  //    newData.ItemDescription = that.editRow.ItemDescription;
  //    newData.UnitDescription = that.editRow.UnitDescription;
  //}
  ///////////////////////////////////////////////////////////////////SERIAL
  onCancelSerialPopup() {
    this.serialPopup = false;
  }

  onFormSubmit() {
    let MvitId = this.tagRelatedData.ID;
    this.service.get("/WAM/MovementTrace/Confirm", (data) => {
      if (data)
        this.serialPopup = false;
      else
        Notify.error('PUB_LOT_QTY_ERROR');
    }, { MvitID: MvitId });
  }

  onAddClick() {
    let lotQty = 0;
    this.model.Details.forEach(d => {
      lotQty = lotQty + d.Quantity;
      //this.lotSaveParam.WarehouseDescription += d.Title + ',';
    });
    this.model.Details.push([{ Quantity: this.tagRelatedData.SecondQuantityCommercial - lotQty, CentricAccountId: this.tagRelatedData.CentricAccountId }]);
  }

  onCreateClick() {
    debugger;
    if (this.itemSelectedRow.ID != undefined) {
      var updatedItem = this.localData.filter(c => c.ID == this.itemSelectedRow.ID)[0];
      updatedItem.Flag = 2;
      //SerialData: this.createTagData,
      //LotNumbers: this.groupLotSaveParam,
      updatedItem.SerialData = this.createTagData;
      updatedItem.LotNumbers = this.groupLotSaveParam;
    }
    else {
      var updatedItem = this.localData.filter(c => c.ID == this.lastInsertedId)[0];
      updatedItem.Flag = 1;
      updatedItem.SerialData = this.createTagData;
      updatedItem.LotNumbers = this.groupLotSaveParam;
    }
    let lotQty = 0;
    this.model.Details.forEach(d => {
      lotQty = lotQty + d.Quantity;
      //this.lotSaveParam.WarehouseDescription += d.Title + ',';
    });
    // if (lotQty != this.tagRelatedData.SecondQuantityCommercial || this.createTagData.Quantity != this.tagRelatedData.SecondQuantityCommercial) {
    //   Notify.error('PUB_LOT_QTY_ERROR');
    // }
    // else {      
    this.createTagData.InsertTag = 1;
    this.saveAll();
    // this.createTagData.MovementItemId = this.tagRelatedData.ID;      
    // this.service.post("/WAM/MovementTrace/AutomaticInsert", (data) => {
    //   this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
    //   // this.lotLoadParam.MovementItemId = this.selectedRow.ID;
    //   // this.lotLoadParam.MovementTraceId = this.selectedRow.ID;
    //   this.traceGrid.instance.refresh();
    //   this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
    //   this.lotGrid.instance.refresh();
    //   Notify.success('PUB_ACTION_SUCCESS_MSG');
    // }, this.createTagData);
    //}
  }
  onShow(e) {
    this.createTagData.CentricAccountId = this.tagRelatedData.CentricAccountId;
    this.createTagData.BusinessUnitID = this.branchId;
    this.createTagData.LocationID = this.tagRelatedData.LocationId;
    this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
    this.createTagData.Quantity = this.tagRelatedData.SecondQuantityCommercial;
    this.createTagData.ItemId = this.tagRelatedData.ItemId;
    this.traceGrid.instance.refresh();
    this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
    this.lotGrid.instance.refresh();
    this.lotFilter = { ITEM_ID: this.tagRelatedData.ItemId, WRHS_ID: this.tagRelatedData.WarehouseID, Date: this.tagRelatedData.Date, reffrenceMovementTypeID: this.tagRelatedData.reffrenceMovementTypeID, MVIT_MVIT_ID: this.tagRelatedData.ReffrenceMovementItemId, CNAC_ID: this.tagRelatedData.CentricAccountId };
    this.model.Details = [{ Quantity: this.tagRelatedData.SecondQuantityCommercial, CentricAccountId: this.tagRelatedData.CentricAccountId }];
  }

  traceSelectionChangedHandler() {

    if (this.traceSelectedKeys.length == 1) {
      this.traceSelectedRow = this.traceGrid.instance.getSelectedRowsData()[0];
      this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
      this.lotGrid.instance.refresh();
    }
    else {
      this.traceSelectedRow = {};
    }
  }

  lotSelectionChangedHandler() {

    if (this.lotSelectedKeys.length == 1) {
      //this.lotSelectedRow = this.lotGrid.instance.getSelectedRowsData()[0];
      //this.lotLoadParam = {MovementItemId : this.selectedRow.ID, MovementTraceId: this.lotSelectedRow.ID }
      //this.traceGrid.instance.refresh();
    }
    else {
      this.lotSelectedRow = {};
    }
  }
  onGridLotClick(e) {
    if (e.name == "DXInsert") {
      if (this.flgCreateTag) {
        Notify.error('WAM_INVALID_INSERT_TAG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    else if (e.name == "DXSave") {
      if (this.itemSelectedRow.ID != undefined) {
        var updatedItem = this.localData.filter(c => c.ID == this.itemSelectedRow.ID)[0];
        updatedItem.Flag = 2;
        updatedItem.SerialData = this.createTagData;
        updatedItem.LotNumbers = this.groupLotSaveParam;
      }
      else {
        var updatedItem = this.localData.filter(c => c.ID == this.lastInsertedId)[0];
        updatedItem.Flag = 1;
        updatedItem.SerialData = this.createTagData;
        updatedItem.LotNumbers = this.groupLotSaveParam;
      }
      let lotQty = 0;
      this.model.Details.forEach(d => {
        lotQty = lotQty + d.Quantity;
        //this.lotSaveParam.WarehouseDescription += d.Title + ',';
      });
      // if (lotQty != this.tagRelatedData.SecondQuantityCommercial || this.createTagData.Quantity != this.tagRelatedData.SecondQuantityCommercial) {
      //   Notify.error('PUB_LOT_QTY_ERROR');
      // }
      // else {      
      this.createTagData.InsertTag = 1;
      this.saveAll();
      // if (!this.tagRelatedData.tagRequired) {
      //   this.service.post("/WAM/MovementLot/GroupSave", (data) => {
      //     this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
      //     this.traceGrid.instance.refresh();
      //     this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
      //     this.lotGrid.instance.refresh();
      //     Notify.success('PUB_ACTION_SUCCESS_MSG');
      //   }, this.groupLotSaveParam);
      //   this.groupLotSaveParam = [];
      // }
      // else if (this.tagRelatedData.tagRequired) {
      //   this.service.post("/WAM/MovementLot/SaveWithMVIT", (data) => {
      //     this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
      //     this.traceGrid.instance.refresh();
      //     this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
      //     this.lotGrid.instance.refresh();
      //     Notify.success('PUB_ACTION_SUCCESS_MSG');
      //   }, this.groupLotSaveParam);
      //   this.groupLotSaveParam = [];
      // }
    }
    if (e.name == 'DXEdit') {
      //if (this.flgCreateTagVisible) {
      //   Notify.error('WAM_INVALID_INSERT_TAG');
      //   e.handled = true;
      // }
      // else
      this.onCanceledItemRowGrid(e);
    }
    // if (e.name == "DXDelete") {
    //   if (this.flgCreateTagVisible) {
    //     Notify.error('WAM_INVALID_UPDATE_MSG');
    //     e.handled = true;
    //   }
    //   else
    //     this.onCanceledItemRowGrid(e);
    // }

    if (e.name == "DXSelectedDelete") {
      if (this.lotSelectedKeys.length > 0) {
        let delData: any = [];
        delData = this.lotSelectedKeys;
        // let result = confirm(this.translate.instant("PUB_CONFIRM_DELETE"), this.translate.instant("PUB_CONFIRM"));
        // result.then((dialogResult) => {
        //   if (dialogResult)
        //     this.service.post("/WAM/MovementLot/Delete", (data) => {
        //       this.lotSelectedKeys = [];
        //       this.lotGrid.instance.refresh();
        //     }, delData);
        // });
        Dialog.delete().done(() => {
          this.service.post("/WAM/MovementLot/Delete", (data) => {
            this.lotSelectedKeys = [];
            this.lotGrid.instance.refresh();
          }, delData);
        });
      }
    }
    // if (e.name == "DXSelectedDelete") {
    //   e.handled = true;

    // }
    // if (e.name == "DXSelectedDelete") {
    //   if (this.flgCreateTagVisible) {
    //     Notify.error('WAM_INVALID_UPDATE_MSG');
    //     e.handled = true;
    //   }
    //   else
    //     this.onCanceledItemRowGrid(e);
    // }
  }
  // onCanceledItemRowGrid(e) {
  //   this.tagEditRow = {};
  // }

  // onEditorPreparingItemsGrid(e) {
  //   //if (e.parentType === "dataRow" )
  //   //e.editorOptions.readOnly = true;
  // }

  onCellTraceChanged(data, cell) {
    this.traceLoadParam.TraceCode = data.Code;
    this.traceLoadParam.TraceId = data.ID;
    //this.editItem.MovementItemId = 
  }

  onCellLotChanged(e, cell) {

    this.lotSaveParam.LotIDList = [];
    //this.lotSaveParam.WarehouseDescription = "";
    if (e.constructor == Array) {
      e.forEach(d => {
        this.groupLotSaveParam.push({ LotNumberId: d.ID, MovementItemId: this.tagRelatedData.ID, CentricAccountId: d.CentricAccountId, LocationID: d.LocationID });
        //this.lotSaveParam.WarehouseDescription += d.Title + ',';
      });
    }

    //this.createTagData.MovementItemId = this.tagRelatedData.ID;
    // this.service.post("/WAM/MovementLot/GroupSave", (data) => {
    //   this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
    //   this.traceGrid.instance.refresh();
    //   this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
    //   this.lotGrid.instance.refresh();
    //   Notify.success('PUB_ACTION_SUCCESS_MSG');
    // }, this.groupLotSaveParam);
    // this.groupLotSaveParam = [];
    //  
    // this.lotSaveParam.LotNumberId = data.ID;
    // this.lotSaveParam.CentricAccountId = data.CentricAccountId;
    // this.lotSaveParam.LocationID = data.LocationID;
    // this.lotSaveParam.CentricAccountName = data.CentricAccountName;
    // this.lotSaveParam.LocationDescription = data.LocationDescription;
    // this.lotSaveParam.CentricAccountTypeDescription = data.CentricAccountTypeDescription;
    // this.lotSaveParam.MovementItemId = this.tagRelatedData.ID;
  }
  setCellValueOfLot(newData, value, currentRowData) {
    let that = TEST.get(WAMMovementPage);

    newData.CentricAccountName = that.lotSaveParam.CentricAccountName;
    newData.CentricAccountTypeDescription = that.lotSaveParam.CentricAccountTypeDescription;
    newData.LocationDescription = that.lotSaveParam.LocationDescription;
  }
  lotInserted() {
    this.traceGrid.instance.refresh();
  }

  onCellAccountTypeChanged(data, cell) {
    this.CentricAccountFilter = { TypeId: data.ID };
    cell.setValue(data.Title);
  }


  onCellCentricAccountChanged(data, cell) {
    this.lotSaveParam.CentricAccountId = data.ID;
    cell.setValue(data.Title);
  }


  onCellLocationChanged(data, cell) {
    this.lotSaveParam.LocationID = data.ID;
    cell.setValue(data.Title);
  }

  setCellValueOfAccountType(newData, value, currentRowData) {
    // let that = TEST.get(WAMSerialPopupPage);
    // newData.CentricAccountName = that.editRow.CentricAccountName;
  }
  setCellValueOfCentricAccount(newData, value, currentRowData) {
    let that = TEST.get(WAMMovementPage);
    newData.CentricAccountName = that.tagEditRow.CentricAccountName;
    newData.CentricAccountId = that.lotSaveParam.CentricAccountId;
  }
  setCellValueOfLocation(newData, value, currentRowData) {
    let that = TEST.get(WAMMovementPage);
    newData.LocationDescription = that.tagEditRow.LocationDescription;
    newData.LocationID = that.lotSaveParam.LocationID;
  }

  onLotQuantityChange(e) {
    this.createTagData.Quantity = e;
  }

}
