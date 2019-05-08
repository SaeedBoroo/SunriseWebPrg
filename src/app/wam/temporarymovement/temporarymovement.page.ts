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
  selector: 'wam-page-temporarymovement',
  templateUrl: './temporarymovement.page.html',
  providers: [ServiceCaller]
})

export class WAMTemporaryMovementPage extends BasePage implements OnInit {

  authorized: any;
  lastInsertedId: any;
  requestTitle: string = " ";
  ngOnInit() {

  }
  @ViewChild('requestitemGrid') requestitemGrid: DxDataGridComponent;
  @ViewChild('movementitemGrid') movementitemGrid: DxDataGridComponent;
  @ViewChild('warehouseitemGrid') warehouseitemGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;
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

  flagSimpleMode: boolean = true;

  //LOV
  lovIttp: any = {};
  MovementType: string;
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
  MovementTypeValueFilter: any = {};
  warehouseTargetFilter: any = {};
  purchaseOrderFilter: any = {};
  warehouseFilter: any = {};

  lastClosedDate: any;

  mainMvtpId: string = Guid.empty;

  itemSelectedKeys: any = [];
  itemSelectedRow: any = {};
  selectedRow: any = {};
  editRow: any = {};
  infoPopupVisibile: boolean = false;
  refMvmnData: any = {};

  headerItem: any = {};
  dataSource: any = {};
  localData: any[] = [];
  headerItemsConfig: any = {};
  itemsLength: Number = 0;
  saveParams: any = {};
  requestloadParams: any = {};
  movementloadParams: any = {};
  warehouseloadParams: any = {};

  Name: string = null;
  type: string;
  typeId: string = Guid.empty;
  reffrenceMovementTypeID: string;
  RelationType: Number;
  ReffrenceType: Number;
  secondReffrenceType: Number;
  refName: string = null;
  refMovementType: string;
  filter: any = {};
  typeFilter: any = {};

  //Context Parameters

  flgPurchaseOrder: boolean = false;

  flgSaleOrder: boolean = false;

  flgSupplier: boolean = false;
  flgCustomer: boolean = false;
  flgCostCenter: boolean = false;
  flgWarehouseTarget: boolean = false;
  flgSupplierVisible: boolean = false;
  flgCustomerVisible: boolean = false;
  flgCostCenterVisible: boolean = false;
  flgWarehouseTargetVisible: boolean = false;
  flgWarehouse: boolean = false;
  flgMovement: boolean = false;
  flgRequest: boolean = false;
  flgMovementVisible: boolean = false;
  flgRequestVisible: boolean = false;
  flgWarehouseItemVisible: boolean = false;
  flgPurchaseOrderVisible: boolean = false;
  flgSalOrderVisible: boolean = false;
  flgPurOrder: boolean = false;
  flgSalOrder: boolean = false;
  flgDate: boolean = false;
  flgTextNoteVisible: boolean = false;
  flgTextNoteSecVisible: boolean = false;
  flgTextNote: boolean = false;

  flgWorkOrderVisible: boolean = false;

  flgMovementRequired: any = false;
  flgRequestRequired: any = false;

  readonly: boolean = false;

  flgUpdateCode: boolean = false;

  flgType: boolean = false;

  flgReturnVisible: boolean = true;

  inputParam: any = {};
  itemTypeFilter: any = {};

  serialPopup: boolean = false;
  flgCreateTag: boolean = true;

  tagRelatedData: any = {};

  checkQuantityCommercial: Boolean = false;
  scale: any = 0;
  commercialScale: any = 0;
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
    {
      name: "Confirm",
      icon: "fa fa-check",
      text: this.translate.instant("PUB_CONFIRM"),
      visible: false,
      disabled: false
    },
    {
      name: "SetPermanent",
      icon: "fa fa-check",
      text: this.translate.instant("WAM_SETPERMANENT"),
      visible: true,
      disabled: false
    },
    {
      name: "Return",
      icon: "fa fa-arrow-circle-right",
      text: this.translate.instant("PUB_RETURN"),
      visible: false,
      disabled: false
    },
    {
      name: "ShowPermanent",
      icon: "fa fa-arrow-circle-left",
      text: this.translate.instant("WAM_SHOW_PRMNT"),
      visible: true,
      disabled: false
    }
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
    }
  ];
  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute, private popup: DemisPopupService) {
    
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

    TEST.set(WAMTemporaryMovementPage, this);
    this.gridItems[0].visible = !this.flagSimpleMode;
    if (this.type == null) {
      this.route.queryParams.subscribe(params => {
        this.type = params['type'];
        this.filter.ID = params['ID'];
        this.filter.RequestID = params['MVMN_RQST_ID'];
        this.inputParam = params;
        //this.inputParam.sourceForem = params['sourceForem'];
      });
    }
    //this.type = '131';
    //if (this.type == null) {
    //this.route.queryParams.subscribe(params => {
    //  this.filter.ID = params['ID'];
    //  this.inputParam = params;
    //});
    //}
    if (this.inputParam.sourceForem == 'CARDEX') {//CARDEX
      this.menuItems[6].visible = true;
    }
    else {
      this.menuItems[6].visible = false;
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
        updatedItem.SerialControlType = this.editRow.SerialControlType;         
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
        values.MovementTypeId = this.mainMvtpId;//this.typeId;  
        values.Status = 10;          
        //values.MovementTypeId = this.typeId;        

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
    this.MovementTypeValueFilter = { MODE: 1 };//validation
    if (this.filter.ID != Guid.empty && this.filter.ID != null && this.filter.ID != undefined) {
      this.MovementTypeValueFilter = { MODE: 2 };//query
      this.loadData();
    }

    //LOV

    this.service.loadLovData("LOV-WAM-004", (data) => { this.items = data; }, { ITEM_ITCT_FILTER: null, ITEM_ITCT_FILTER_ALLOW: null });
    service.get("/SYS/FORMS/List", (data) => {
      this.units = data.Data;
    }, { Code: "LOV-WAM-005" });

    //this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })

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
    console.log('this.requestFilter');
    console.log(this.requestFilter);
  };
  // onCellMovementItemCodeChanged(data, cell) {
  //   this.editRow.ItemDescription = data.ItemDescription;
  //   this.editRow.ItemId = data.ItemId;
  //   this.saveParams.ItemId = data.ItemId;
  //   this.editRow.RefMovementItemId = data.MovementItemId;
  //   this.saveParams.RefMovementItemId = data.MovementItemId;
  //   this.editRow.UnitDescription = data.UnitDescription;
  //   this.itemUnitFilter = { ITEM_ID: data.ItemId };
  //   console.log('this.itemUnitFilter');
  //   console.log(this.itemUnitFilter);
  //   cell.setValue(data.ItemCode);
  //   //
  // }

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
    this.scale = 1;
    this.commercialScale = 1;
    this.itemUnitFilter = { ITEM_ID: data.ItemId };
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
    //this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
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

  // onCellReQuestItemCodeChanged(data, cell) {
  //   this.editRow.ItemDescription = data.ItemDescription;
  //   this.editRow.ItemId = data.ItemId;
  //   this.saveParams.ItemId = data.ItemId;
  //   this.editRow.RequestItemId = data.RequestItemId;
  //   this.saveParams.RequestItemId = data.RequestItemId;
  //   this.saveParams.PurchaseOrderItemId = data.PurchaseOrderItemId;
  //   this.saveParams.SaleOrderItemId = data.SaleOrderItemId;
  //   this.editRow.UnitDescription = data.UnitDescription;
  //   this.itemUnitFilter = { ITEM_ID: data.ItemId };
  //   this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
  //   console.log('this.itemUnitFilter');
  //   console.log(this.itemUnitFilter);
  //   cell.setValue(data.ItemCode);
  //   //
  // }

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


    this.scale = 1;
    this.commercialScale = 1;

    this.itemUnitFilter = { ITEM_ID: data.ItemId };
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
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

  // onCellWarehouseItemCodeChanged(data, cell) {
  //   this.editRow.ItemDescription = data.Description;
  //   //this.editRow.ItemId = data.ID;
  //   this.saveParams.ItemId = data.ID;
  //   //this.editRow.RequestItemId = data.RequestItemId;
  //   //this.saveParams.RequestItemId = data.RequestItemId;
  //   //this.editRow.UnitDescription = data.UnitDescription;
  //   this.itemUnitFilter = { ITEM_ID: data.ID };
  //   //console.log('this.itemUnitFilter');
  //   //console.log(this.itemUnitFilter);
  //   cell.setValue(data.Code);
  //   //
  // }

  onCellWarehouseItemCodeChanged(data, cell) {
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemDescriptionLatin = data.ItemDescriptionLatin;
    this.editRow.ItemId = data.ID;
    this.editRow.ItemCode = data.Code;
    this.saveParams.ItemId = data.ID;
    this.editRow.UnitDescription = data.UnitDescription;
    this.editRow.UnitId = data.UnitId;
    this.saveParams.UnitId = data.UnitId;
    this.scale = 1;
    this.commercialScale = 1;
    this.editRow.LocationDescription = data.LocationDescription;
    this.editRow.LocationId = data.LocationId;
    this.itemUnitFilter = { ITEM_ID: data.ID };
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
    this.editRow.ItemTypeId = data.ItemTypeId;    
    this.editRow.ItemTypeDescription = data.ItemTypeDescription;
    //this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    //console.log('this.itemUnitFilter');
    //console.log(this.itemUnitFilter);
    cell.setValue(data.ItemId);
    //
  }


  // setCellValueOfItemCode(newData, value, currentRowData) {
  //   let that = TEST.get(WAMTemporaryMovementPage);
  //   console.log(that.editRow);
  //   console.log(that.editRow);
  //   newData.ItemCode = value;
  //   newData.ItemDescription = that.editRow.ItemDescription;
  //   newData.UnitDescription = that.editRow.UnitDescription;
  //   //newData.ItemDescription = 
  // }


  setCellValueOfItemCode(newData, value, currentRowData) {
    let that = TEST.get(WAMTemporaryMovementPage);
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

  // clearForm() {
  //   this.headerItem = {};
  //   this.typeId = Guid.empty;
  //   this.MovementTypeValueFilter = { MODE: 1 };
  //   //if (this.headerItem.Status != 10)

  //   //this.headerItem = { Status: 10, MovementTypeValueID: null };
  //   this.headerItem.Status = 10;
  //   this.readonly = false;
  //   this.localData = [];
  //   this.movementItemFilter = {};
  //   this.requestItemFilter = {};
  //   this.warehouseItemFilter = {};
  //   this.loadParams = {};
  //   if (this.itemGrid != undefined)
  //     this.itemGrid.instance.refresh();
  //   this.enableConfirm();
  // }


  clearForm() {
    this.typeId = Guid.empty;
    this.MovementTypeValueFilter = { MODE: 1 };
    this.headerItem.ID = null;
    this.readonly = false;
    this.headerItem.Status = 10;//{ Status: 10};//, MovementTypeID: this.typeId };
    this.headerItem.Date = DateTime.convertForRemote(DateTime.now);
    this.headerItem.WarehouseID = null;
    this.headerItem.WarehouseDescription = null;
    this.headerItem.Number = null;
    this.headerItem.VisibleNumber = null;
    this.headerItem.SupplierID = null;
    this.headerItem.SupplierNam = null;
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
    this.localData = [];
    this.movementItemFilter = {};
    this.requestItemFilter = {};
    this.warehouseItemFilter = {};
    //this.loadParams = {};
    this.requestloadParams = {};
    this.movementloadParams = {};
    this.warehouseloadParams = {};
    this.refreshGrid(1);
    this.enableConfirm();
  }
  refreshGrid(mode) {
    this.requestloadParams = {};
    this.movementloadParams = {};
    this.warehouseloadParams = {};
    // if (mode = 1) {
    //   this.flgRequestVisible = true;
    //   this.flgMovementVisible = true;
    //   this.flgWarehouseItemVisible = true;
    // }
    if (this.movementitemGrid != undefined)
      this.movementitemGrid.instance.refresh();
    if (this.warehouseitemGrid != undefined)
      this.warehouseitemGrid.instance.refresh();
    if (this.requestitemGrid != undefined)
      this.requestitemGrid.instance.refresh();
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
      case "Search":
        {
          this.router.navigate(["wam/temporarymovement/temporarymovementsearch"], 
          { queryParams: { type: 131 } }, 
        );
          break;
        }
      case "Save": {
        this.headerItem.MovementTypeID = this.typeId;
        console.log('this.headerItem.MovementTypeID');
        console.log(this.headerItem.MovementTypeID);
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
      case "SetPermanent": {
        this.setPermanent();
        break;
      }
      case 'Return': {
        this.return();
        break;
      }
      case 'ShowPermanent':{
        this.showPermanent();
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

  onItemTypeChanged(data, cell) {
    this.editRow.ItemTypeId = data.ID;
    this.saveParams.ItemTypeId = data.ID;
    this.editRow.ItemTypeDescription = data.Title;
    cell.setValue(data.Title);
  }

  movementTypeChanged(data) {
    this.type = data.Code;
    this.headerItem.MovementTypeValueID = data.ID;
    this.mainMvtpId = data.MainMovementTypeId;
    this.saveParams.MovementTypeID = data.MainMovementTypeId;
    if (this.headerItem.MovementTypeValueID == null || this.headerItem.MovementTypeValueID == undefined)
      this.readonly = false;
    else
      this.readonly = true;
    this.typeId = Guid.empty;
    this.disableAllHeaderFields();
    this.invisibleAllHeaderVariables();
    this.setContext();
  }

  statusChanged(data) {
    this.headerItem.StatusDes = data.Title;
  }

  warehouseChanged(data) {
    this.headerItem.WareHouseDes = data.Title;
    this.assignReffrenceMovementFilter(this.headerItem.WarehouseID);
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type }
    this.warehouseTargetFilter = { WRHS_ID: this.headerItem.WarehouseID };

    let closedDateFilter: any = {};
    closedDateFilter.WarehouseID = data.ID;
    if (data.ID != null && data.ID != undefined && data.ID != Guid.empty) {
      this.service.get("/WAM/Movement/LastClosedDate", (data) => {
        this.lastClosedDate = data;
        if (this.headerItem.Date <= this.lastClosedDate && (this.headerItem.ID == null || this.headerItem.ID == undefined || this.headerItem.ID == Guid.empty)) {
          Notify.error('WAM_DAT_MVMN_BEFORE_CLOSED');
          //Notify.error(DateTime.convertToLocal(this.lastClosedDate));
          this.headerItem.Date = DateTime.convertForRemote(DateTime.now);
        }
      }, closedDateFilter)
    }
  }
  // assignReffrenceMovementFilter(P_WRHS_ID) {
  //   this.reffrenceMovementFilter = { WRHS_ID: P_WRHS_ID, MVTP_ID: this.reffrenceMovementTypeID }
  // }
  assignReffrenceMovementFilter(P_WRHS_ID) {
    this.reffrenceMovementFilter = { WRHS_ID: P_WRHS_ID, MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType }
  }
  // movementChanged(data) {
  //   this.headerItem.RefMovementNumber = data.Title
  //   this.headerItem.WarehouseTargetID = data.WarehouseID;
  // }
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
  }
  SupplierChanged(data) {
    //this.headerItem.RequestNumber = null;
    //this.headerItem.RequestID = null;
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type, SUPL_ID: this.headerItem.SupplierID }
    this.purchaseOrderFilter = { SUPL_ID: this.headerItem.SupplierID }

  }

  CustomerChanged(data) {
    this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type, CSTM_ID: this.headerItem.CustomerID }
  }

  // requestChanged(data) {
  //   this.headerItem.RequestNumber = data.Number;
  //   this.headerItem.BusinessUnitID = data.BusinessUnitID;
  //   this.headerItem.PurchaseOrderId = data.PurchaseOrderID;
  //   this.headerItem.SalOrderID = data.SaleOrderID;
  // }

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
        this.flgSupplier = false;
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
  }

  PurchaseOrderChanged(data) {
    this.headerItem.PurchaseOrderNumber = data.Number;
    //this.headerItem.SupplierID = data.SupplierID;
    //this.headerItem.SupplierNam = data.SupplierName;
    if (data.SupplierID != null && data.SupplierID != undefined && data.SupplierID != Guid.empty) {
      this.headerItem.SupplierID = data.SupplierID;
      this.headerItem.SupplierNam = data.SupplierName;
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
  setCellValueOfUnitCommercial(newData, value, currentRowData) {
    let that = TEST.get(WAMTemporaryMovementPage);
    newData.UnitDescriptionCommercial = that.editRow.UnitDescriptionCommercial;
    newData.SecondQuantityCommercial = null;
    newData.Quantity = null;
  }

  onRequestCanceledItemRowGrid(e) {
    this.editRow = {};
    if (this.requestitemGrid.instance.totalCount() > 0)
      this.disableAllHeaderFields();
    else
      this.setLayaoutAndValidation();
  }
  onMovementCanceledItemRowGrid(e) {
    this.editRow = {};
    if (this.movementitemGrid.instance.totalCount() > 0)
      this.disableAllHeaderFields();
    else
      this.setLayaoutAndValidation();
  }
  onwarehouseCanceledItemRowGrid(e) {
    this.editRow = {};
    if (this.warehouseitemGrid.instance.totalCount() > 0)
      this.disableAllHeaderFields();
    else
      this.setLayaoutAndValidation();
  }
  onGridItemClick(e) { }

  // onButtonClick(name) {
  //   switch (name) {
  //     case "New":
  //       this.itemGrid.instance.addRow();
  //       break;
  //     case "Delete": {
  //       this.itemSelectedKeys.forEach(s => {
  //         this.localData.filter(c => c.ID == s)[0].Flag = 3;
  //       })
  //       this.itemGrid.instance.refresh();
  //       break;
  //     }
  //     default:
  //   }
  // }
  requestSelectionChangedHandler() {
    if (this.itemSelectedKeys.length == 0) {
      this.itemSelectedRow = {};
    }
    else if (this.itemSelectedKeys.length == 1) {
      this.itemSelectedRow = this.requestitemGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.itemSelectedRow = {};
    }
  }

  movementSelectionChangedHandler() {
    if (this.itemSelectedKeys.length == 0) {
      this.itemSelectedRow = {};
    }
    else if (this.itemSelectedKeys.length == 1) {
      this.itemSelectedRow = this.movementitemGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.itemSelectedRow = {};
    }
  }

  warehouseSelectionChangedHandler() {
    if (this.itemSelectedKeys.length == 0) {
      this.itemSelectedRow = {};
    }
    else if (this.itemSelectedKeys.length == 1) {
      this.itemSelectedRow = this.warehouseitemGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.itemSelectedRow = {};
    }
  }

  setContext() {
    if (this.typeId == Guid.empty) {
      let tempTypefilter: any = {};
      tempTypefilter.Code = '131';
      this.service.get("/WAM/MovementType/List",
        (data) => {
          this.headerItem.MovementTypeID = data[0].MovementTypeId;
          this.typeId = data[0].ID;
          
        },
        tempTypefilter);
      this.typeFilter.Code = this.type;
      this.service.get("/WAM/MovementType/List", (data) => {
        this.warehouseFilter = { MVTP_ID: this.typeId };
        this.mainMvtpId = data[0].ID;
        this.saveParams.MovementTypeID = data[0].ID;
        this.reffrenceMovementTypeID = data[0].ReffrenceMovementTypeID;
        this.reffrenceMovementFilter = { MVTP_ID: this.reffrenceMovementTypeID };
        this.RelationType = data[0].RelationType;
        this.ReffrenceType = data[0].ReffrenceType;
        this.secondReffrenceType = data[0].ReffrenceTypeSecond;
        this.flgCreateTag = data[0].AutomaticTagFlag;
        debugger;
        if(data[0].ReffrenceType == "1"){
          this.requestTitle = "درخواست";
        }
        else{
          this.requestTitle = "مجوز";
        }
        this.setLayaoutAndValidation();
      }, this.typeFilter)
    }
    else
      this.setLayaoutAndValidation();
  }

  // setLayaoutAndValidation() {
  //   switch (this.RelationType) {
  //     case 1:
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgCostCenter = true;
  //         this.flgCostCenterVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.disableAllHeaderFields();
  //         this.flgCostCenterVisible = true;
  //         break;
  //       }
  //       break;
  //     case 2:
  //       break;
  //     case 3:
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgSupplier = true;
  //         this.flgSupplierVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.disableAllHeaderFields();
  //         this.flgSupplierVisible = true;
  //         break;
  //       }
  //       break;
  //     case 4:
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgCustomer = true;
  //         this.flgCustomerVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.disableAllHeaderFields();
  //         this.flgCustomerVisible = true;
  //         break;
  //       }
  //       break;
  //     case 5:
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgWarehouseTarget = true;
  //         this.flgWarehouseTargetVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.disableAllHeaderFields();
  //         this.flgWarehouseTargetVisible = true;
  //         break;
  //       }
  //       break;
  //     case 9:
  //       break;
  //     default:
  //   }
  //   let hasReffrence = 0;
  //   switch (this.ReffrenceType) {
  //     case 1:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgRequest = true;
  //         this.flgRequestRequired = true;
  //         this.flgRequestVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.disableAllHeaderFields();
  //         this.flgRequestVisible = true;
  //         break;
  //       }
  //     case 2:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgMovement = true;
  //         this.flgMovementVisible = true;
  //         this.flgMovementRequired = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.disableAllHeaderFields();
  //         this.flgMovementVisible = true;
  //         break;
  //       }
  //     case 3:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgPurchaseOrderVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.flgPurchaseOrderVisible = true;
  //         this.disableAllHeaderFields();

  //         break;
  //       }
  //     case 4:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgSalOrderVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.flgSalOrderVisible = true;
  //         this.disableAllHeaderFields();

  //         break;
  //       }
  //     default:
  //   }

  //   switch (this.secondReffrenceType) {
  //     case 1:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgRequest = true;
  //         this.flgRequestRequired = true;
  //         this.flgRequestVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {

  //         this.disableAllHeaderFields();
  //         this.flgRequestVisible = true;
  //         break;
  //       }
  //     case 2:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgMovement = true;
  //         this.flgMovementVisible = true;
  //         this.flgMovementRequired = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {

  //         this.disableAllHeaderFields();
  //         this.flgMovementVisible = true;
  //         break;
  //       }
  //     case 3:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgPurchaseOrderVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.flgPurchaseOrderVisible = true;
  //         this.disableAllHeaderFields();

  //         break;
  //       }
  //     case 4:
  //       hasReffrence = 1;
  //       if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
  //         this.flgSalOrderVisible = true;
  //         this.enableGeneralValues();
  //         break;
  //       }
  //       if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
  //         this.flgSalOrderVisible = true;
  //         this.disableAllHeaderFields();

  //         break;
  //       }
  //     default:
  //   }

  //   if (hasReffrence == 0) {
  //     this.flgWarehouseItemVisible = true;
  //   }
  //   //this.enableGeneralValues();
  // }

  getGridCount(gridType) {
    // if (gridType == 'R') {
    //   if (this.requestitemGrid != undefined) {
    //     if (this.requestitemGrid.instance != undefined) {
    //       return this.requestitemGrid.instance.totalCount();
    //     }
    //   }
    //   else {
    //     return this.itemsLength;
    //   }
    // }
    // if (gridType == 'M') {
    //   if (this.movementitemGrid != undefined) {
    //     if (this.movementitemGrid.instance != undefined) {
    //       return this.movementitemGrid.instance.totalCount();
    //     }
    //   }
    //   else {
    //     return this.itemsLength;
    //   }
    // }
    // if (gridType == 'W') {
    //   if (this.warehouseitemGrid != undefined) {
    //     if (this.warehouseitemGrid.instance != undefined) {
    //       return this.warehouseitemGrid.instance.totalCount();
    //     }
    //   }
    //   else {
    //     return this.itemsLength;
    //   }
    // }
    return this.itemsLength;
  }

  setLayaoutAndValidation() {
    this.flgRequestVisible = false;
    this.flgMovementVisible = false;
    this.flgWarehouseItemVisible = false;
    switch (this.RelationType) {
      case 1:
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
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
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
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
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
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
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
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
      case 9:
        break;
      default:
    }
    let hasReffrence = 0;
    switch (this.ReffrenceType) {
      case 1:
        hasReffrence = 1;
        this.flgRequestVisible = true;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {

          //if (this.projectSetup.Value == '1') {
          this.flgRequest = true;
          this.flgRequestRequired = true;
          //this.flgRequestVisible = true;
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
        this.flgRequestVisible = true;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {

          //if (this.projectSetup.Value == '1') {
          this.flgRequest = true;
          this.flgRequestRequired = true;
          //this.flgRequestVisible = true;
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
        this.flgMovementVisible = true;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgMovement = true;
          //this.flgMovementVisible = true;
          this.flgMovementRequired = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 3:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgPurchaseOrderVisible = true;
          this.flgPurchaseOrder = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 4:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgSalOrderVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      // case 7:
      //   hasReffrence = 1;
      //   if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
      //     this.flgWorkOrderVisible = true;
      //     this.flgWorkOrder = true;
      //     this.enableGeneralValues();
      //     break;
      //   }
      //   if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
      //     this.disableAllHeaderFields();
      //     break;
      //   }
      default:
    }

    switch (this.secondReffrenceType) {
      case 1:
        hasReffrence = 1;
        this.flgRequestVisible = true;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgRequest = true;
          this.flgRequestRequired = true;
          //this.flgRequestVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 8:
        hasReffrence = 1;
        this.flgRequestVisible = true;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgRequest = true;
          this.flgRequestRequired = true;
          //this.flgRequestVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 2:
        hasReffrence = 1;
        this.flgMovementVisible = true;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgMovement = true;
          //this.flgMovementVisible = true;
          this.flgMovementRequired = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 3:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgPurchaseOrderVisible = true;
          this.flgPurchaseOrder = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 4:
        hasReffrence = 1;
        if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
          this.flgSalOrderVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      // case 7:
      //   hasReffrence = 1;
      //   if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.itemsLength == 0 || this.itemGrid.instance.totalCount() == 0)) {
      //     this.flgWorkOrderVisible = true;
      //     this.flgWorkOrder = true;
      //     this.enableGeneralValues();
      //     break;
      //   }
      //   if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
      //     this.disableAllHeaderFields();
      //     break;
      //   }
      default:
    }

    if (hasReffrence == 0) {
      this.flgWarehouseItemVisible = true;
      if ((this.headerItem.Status == 10 || this.headerItem.Status == 15) && (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)) {
        this.enableGeneralValues();
      }
      if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
        this.disableAllHeaderFields();
      }
    }
    else if (hasReffrence == 1)
      this.flgWarehouseItemVisible = false;
    //this.flgRequestVisible = true;
    //this.flgMovementVisible = true;
    //this.enableGeneralValues();
  }

  disableAllHeaderFields() {
    this.flgSupplier = false;
    this.flgCustomer = false;
    this.flgCostCenter = false;
    this.flgWarehouse = false;
    this.flgWarehouseTarget = false;
    this.flgMovement = false;
    this.flgRequest = false;
    this.flgPurOrder = false;
    this.flgSalOrder = false;
    this.flgDate = false;
    if (this.headerItem.MovementTypeValueID != null || this.headerItem.MovementTypeValueID != undefined)
      this.readonly = true;
    else
      this.readonly = false;
    this.flgTextNote = true;
    //this.flgTextNote = false;
    //this.flgRequestVisible = false;
    //this.flgMovementVisible = false;
    //if (this.flgPurchaseOrderVisible || this.flgSalOrderVisible) {
    //  this.flgTextNoteVisible = true;
    //  this.flgTextNoteSecVisible = false;
    //}
    //else {
    //  this.flgTextNoteVisible = false;
    //  this.flgTextNoteSecVisible = true;
    //}
  }

  enableGeneralValues() {
    //this.flgWarehouse = true;
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
    //this.flgDate = true;
    this.flgTextNote = false;
    if (this.flgPurchaseOrderVisible || this.flgSalOrderVisible) {
      this.flgTextNoteVisible = true;
      this.flgTextNoteSecVisible = false;
    }
    else {
      this.flgTextNoteVisible = false;
      this.flgTextNoteSecVisible = true;
    }

  }

  invisibleAllHeaderVariables() {
    this.flgSupplierVisible = false;
    this.flgCustomerVisible = false;
    this.flgCostCenterVisible = false;
    this.flgWorkOrderVisible = false;
    this.flgWarehouseTargetVisible = false;
    this.flgPurchaseOrderVisible = false;
    this.flgSalOrderVisible = false;
    this.flgTextNoteVisible = false;
  }

  loadData() {
    this.filter.TypeCode = '131';
    this.MovementTypeValueFilter = { MODE: 1 };//validation
    if (this.filter.ID != Guid.empty && this.filter.ID != null && this.filter.ID != undefined) {
      this.MovementTypeValueFilter = { MODE: 2 };//query
    }
    this.service.getPromise("/WAM/Movement/List", this.filter).then(data => {
      if (data[0].ID != Guid.empty) {
        //this.headerItem = data[0];
        this.fillHeaderItem(data[0]);
        //this.mainMvtpId = data.
        this.localData = data[0].Items;
        this.refreshGrid(2);
        // if (this.itemGrid != undefined)
        //   this.itemGrid.instance.refresh();
        this.itemsLength = this.localData.length;
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID }
        this.requestItemFilter = {
          RequestID: this.headerItem.RequestID,
          MVMN_ID: this.headerItem.ID,
          WRHS_ID: this.headerItem.WarehouseID
        }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.requestloadParams = { MovementId: this.headerItem.ID }
        this.movementloadParams = { MovementId: this.headerItem.ID }
        this.warehouseloadParams = { MovementId: this.headerItem.ID }
        this.enableConfirm();
      } else {
        this.clearForm;
      }
    });

  }

  fillHeaderItem(data) {
    this.headerItem.ID = data.ID;
    this.headerItem.MovementTypeValueID = data.MovementTypeValueID;
    this.headerItem.Status = data.Status;//{ Status: 10};//, MovementTypeID: this.typeId };
    this.headerItem.Date = data.Date;
    this.headerItem.WarehouseID = data.WarehouseID;
    this.headerItem.WarehouseDescription = data.WarehouseDescription;
    this.headerItem.Number = data.Number;
    this.headerItem.VisibleNumber = data.VisibleNumber;
    this.headerItem.SupplierID = data.SupplierID;
    this.headerItem.SupplierNam = data.SupplierNam;
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
  }

  onGridRequsetItemMenuClick(e) {
    if (e.name == "DXTag") {
      this.showTagPopupOnMenuClick();
      // this.tagRelatedData = this.itemSelectedRow;
      // this.tagRelatedData.WarehouseID = this.headerItem.WarehouseID;
      // this.tagRelatedData.Date = this.headerItem.Date;
      // this.tagRelatedData.reffrenceMovementTypeID = this.reffrenceMovementTypeID;
      // //this.tagRelatedData.CentricAccountId = this.itemSelectedRow.this.tagRelatedData.CentricAccountId;

      // this.serialPopup = true;
      // //this.flgCreateTag = true;
    }
    if (e.name == "DXInsert") {
      this.flgUpdateCode = false;
        this.requestItemFilter = {
        RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID,CNAC_ID:this.headerItem.CentricAccountId, MVTP_ID: this.mainMvtpId
      }      
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
        this.onRequestCanceledItemRowGrid(e);
      this.disableAllHeaderFields();
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
        this.onRequestCanceledItemRowGrid(e);
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
        this.onRequestCanceledItemRowGrid(e);
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
        this.onRequestCanceledItemRowGrid(e);
    }
  }

  onGridMovementItemMenuClick(e) {
    if (e.name == "DXTag") {
      this.showTagPopupOnMenuClick();
      // this.tagRelatedData = this.itemSelectedRow;
      // this.tagRelatedData.WarehouseID = this.headerItem.WarehouseID;
      // this.tagRelatedData.Date = this.headerItem.Date;
      // this.tagRelatedData.reffrenceMovementTypeID = this.reffrenceMovementTypeID;
      // //this.tagRelatedData.CentricAccountId = this.itemSelectedRow.this.tagRelatedData.CentricAccountId;

      // this.serialPopup = true;
      //this.flgCreateTag = true;
    }
    if (e.name == "DXInsert") {
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
      else
        this.onMovementCanceledItemRowGrid(e);
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
        this.onMovementCanceledItemRowGrid(e);
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
        this.onMovementCanceledItemRowGrid(e);
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
        this.onMovementCanceledItemRowGrid(e);
    }
  }

  onGridWarehouseItemMenuClick(e) {
    if (e.name == "DXTag") {
      this.showTagPopupOnMenuClick();
    //   this.tagRelatedData = this.itemSelectedRow;
    //   this.tagRelatedData.WarehouseID = this.headerItem.WarehouseID;
    //   this.tagRelatedData.Date = this.headerItem.Date;
    //   this.tagRelatedData.reffrenceMovementTypeID = this.reffrenceMovementTypeID;
    //   //this.tagRelatedData.CentricAccountId = this.itemSelectedRow.this.tagRelatedData.CentricAccountId;

    //   this.serialPopup = true;
      //this.flgCreateTag = true;
    }
    if (e.name == "DXInsert") {
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
      else
        this.onwarehouseCanceledItemRowGrid(e);
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
        this.onwarehouseCanceledItemRowGrid(e);
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
        this.onwarehouseCanceledItemRowGrid(e);
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
        this.onwarehouseCanceledItemRowGrid(e);
    }
  }

  // itemInserted() {
  //   let i = 1;
  //   this.localData.forEach(element => {
  //     element.Sequence = i;
  //     i = i + 1;
  //   });
  //   this.saveAll();
  // }

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
    // if (this.headerItem.Status >= 20) {
    //   this.menuItems[4].text = this.translate.instant("WAM_MODIFY");
    //   this.menuItems[1].disabled = true;
    // }
    // else {
    //   this.menuItems[4].text = this.translate.instant("PUB_CONFIRM");
    //   this.menuItems[1].disabled = false;
    // }
    // if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null) {
    //   this.menuItems[4].disabled = true;
    //   this.menuItems[1].disabled = true;
    // }
    // else {
    //   this.menuItems[4].disabled = false;
    //   if (this.headerItem.Status < 20)
    //     this.menuItems[1].disabled = false;
    // }
  }

  saveAll() {
    debugger;
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
          Status: t.Status,
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
          MovementTypeId: this.mainMvtpId,
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
      // //Insert
      // this.localData.filter(i => i.Flag == 1).forEach(t =>
      //   detailInsert.push({
      //     Quantity: t.Quantity,
      //     SecondQuantityCommercial: t.SecondQuantityCommercial,
      //     QuantityCommercial: t.QuantityCommercial,
      //     //QuantityCommercialDetail: t.QuantityCommercialDetail,
      //     Sequence: t.Sequence,
      //     MovementItemId: t.MovementItemId,
      //     ItemId: t.ItemId,
      //     ItemTypeId: t.ItemTypeId,
      //     PurchaseOrderItemId: t.PurchaseOrderItemId,
      //     RefMovementItemId: t.RefMovementItemId,
      //     RequestItemId: t.RequestItemId,
      //     SaleOrderItemId: t.SaleOrderItemId,
      //     UnitId: t.UnitId,
      //     AutomaticTagFlag: t.AutomaticTagFlag,
      //     TextNote: t.TextNote,
      //     MovementTypeId: t.MovementTypeId
      //   }));
      // //Update
      // this.localData.filter(i => i.Flag == 2).forEach(t =>
      //   detailUpdate.push({
      //     ID: t.ID,
      //     Quantity: t.Quantity,
      //     QuantityCommercial: t.QuantityCommercial,
      //     QuantityCommercialDetail: t.QuantityCommercialDetail,
      //     Sequence: t.Sequence,
      //     MovementItemId: t.MovementItemId,
      //     ItemId: t.ItemId,
      //     ItemTypeId: t.ItemTypeId,
      //     PurchaseOrderItemId: t.PurchaseOrderItemId,
      //     RefMovementItemId: t.RefMovementItemId,
      //     RequestItemId: t.RequestItemId,
      //     SaleOrderItemId: t.SaleOrderItemId,
      //     UnitId: t.UnitId,
      //     AutomaticTagFlag: t.AutomaticTagFlag,
      //     TextNote: t.TextNote,
      //     MovementTypeId: this.typeId,
      //   }));
      //Delete
      this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
      var Items: any = {};
      Items.InsertedItems = detailInsert;
      Items.UpdatedItems = detailUpdate;
      Items.DeletedItems = detailDelete;
      param.Items = Items;
      // this.service.post("/WAM/Movement/Save", (data) => {
      //   //this.headerItem = data;
      //   this.fillHeaderItem(data);
      //   this.localData = data.Items;
      //   this.itemsLength = this.localData.length;
      //   this.refreshGrid();
      //   this.setContext();
      //   this.enableConfirm();
      //   this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID , WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
      //   this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID , PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, MVTP_ID: this.typeId }
      //   this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
      //   this.saveParams = { MovementId: this.headerItem.ID }
      //   this.loadParams = { MovementId: this.headerItem.ID }
      //   //notify({
      //   //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
      //   //  type: "success",
      //   //  width: 400
      //   //});
      //   Notify.success('PUB_ACTION_SUCCESS_MSG');
      // }, param);
      this.service.postPromise("/WAM/Movement/Save", param).then((data) => {
        this.fillHeaderItem(data);
        //this.headerItem = data;
        // this.InsertTag();
        this.localData = data.Items;
        this.itemsLength = this.localData.length;
        this.refreshGrid(2);
        this.setContext();
        this.enableConfirm();
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, MVTP_ID: this.typeId }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.editRow = { MovementId: this.headerItem.ID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.requestloadParams = { MovementId: this.headerItem.ID }
        this.movementloadParams = { MovementId: this.headerItem.ID }
        this.warehouseloadParams = { MovementId: this.headerItem.ID }
        //notify({
        //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
        //  type: "success",
        //  width: 400
        //});
        this.serialPopup = false;
        Notify.success('PUB_ACTION_SUCCESS_MSG');
      }).catch((err) => {
        if(err == 'WAM_LOT_QUANTITY'){
          Dialog.confirm('', ' مقدار ردیف با مجموع مقادیر سریال ها مغایرت دارد. در صورت تایید مقدار ردیف بر اساس مجموع مقادیر سریال ها بروز رسای می  ').okay(() => 
          {this.authorized = true; this.saveAll(); }).cancel(() => 
          {    this.authorized = false;     
            this.localData.forEach(element => {
            if (element.Flag == 3)
              element.Flag = null;
            this.refreshGrid(2);
            this.setContext();
          });}).final(() => {     this.authorized = false;   this.localData.forEach(element => {
            if (element.Flag == 3)
              element.Flag = null;
            this.refreshGrid(2);
            this.setContext();
          }); });
        }

      });
      this.service.postPromise("/WAM/Movement/Save", param).then((data) => {
        this.fillHeaderItem(data);
        //this.headerItem = data;
        // this.InsertTag();
        this.localData = data.Items;
        this.itemsLength = this.localData.length;
        this.refreshGrid(2);
        this.setContext();
        this.enableConfirm();
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, MVTP_ID: this.typeId }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.editRow = { MovementId: this.headerItem.ID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.requestloadParams = { MovementId: this.headerItem.ID }
        this.movementloadParams = { MovementId: this.headerItem.ID }
        this.warehouseloadParams = { MovementId: this.headerItem.ID }
        //notify({
        //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
        //  type: "success",
        //  width: 400
        //});
        Notify.success('PUB_ACTION_SUCCESS_MSG');
      }).catch((err) => {
        this.localData.forEach(element => {
          if (element.Flag == 3)
            element.Flag = null;
          this.refreshGrid(2);
          this.setContext();
        });
      });
    }
  }

  deleteAll() {
    /*this.service.post("/WAM/Movement/Delete", (data) => {
        this.headerItem = data;
        this.localData = data.Items;
        this.setContext();
        this.enableConfirm();
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID }
        this.requestItemFilter = { RequestID: this.headerItem.RequestID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.loadParams = { MovementId: this.headerItem.ID }
        notify({
            message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
            type: "success",
            width: 400
        });
    },);*/
  }
  onEditorPreparingItemsGrid(e) {
    if (e.parentType === "dataRow" && (e.dataField == "ItemDescription" || e.dataField == "ItemDescriptionLatin" || e.dataField == "UnitDescription" || e.dataField == "Quantity" || e.dataField == "ItemCode" || (e.dataField == "ItemTypeId" && (this.flgUpdateCode || this.flgType) && (this.headerItem.ID != null && this.headerItem.ID != undefined && this.headerItem.ID != Guid.empty)) || e.dataField == "Sequence" || e.dataField == "RequestNumber"|| e.dataField == "QuantityOK"|| e.dataField == "QuantityScrap"|| e.dataField == "QuantityScrap"))
      e.editorOptions.readOnly = true;
  }
  setCellValueOfSecondQuantityCommercial(newData, value, currentRowData) {
    let that = TEST.get(WAMTemporaryMovementPage);
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
  showPermanent(){
    let permanentId: any;
    this.service.get("/WAM/Movement/List",
    (data) => {
      debugger;
      if(data.length > 0){
      permanentId = data[0].ID;
      this.router.navigate(['wam/movement/movement'], { queryParams: { ID: permanentId, type: this.type } });      
      }
      else{
        Notify.info('هیچ رسید دائمی برای این رسید موقت ثبت نشده است');
      }
    },
    {RefMovementID:this.headerItem.ID});    
  }
  // insertRows() {
  //   if (this.flgRequestRequired) {
  //     this.service.post("/WAM/Movement/AutomaticInsertRequest", (data) => {
  //       this.headerItem = data;
  //       this.localData = data.Items;
  //       this.itemGrid.instance.refresh();
  //       this.setContext();
  //       this.enableConfirm();
  //       this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID }
  //       this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID }
  //       this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
  //       this.saveParams = { MovementId: this.headerItem.ID }
  //       this.loadParams = { MovementId: this.headerItem.ID }
  //       //notify({
  //       //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
  //       //  type: "success",
  //       //  width: 400
  //       //});
  //       Notify.success('PUB_ACTION_SUCCESS_MSG');
  //     }, this.headerItem);
  //   }
  //   else if (this.flgMovementRequired) {
  //     this.service.post("/WAM/Movement/AutomaticInsertMovement", (data) => {
  //       this.headerItem = data;
  //       this.localData = data.Items;
  //       this.itemGrid.instance.refresh();
  //       this.setContext();
  //       this.enableConfirm();
  //       this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID }
  //       this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID }
  //       this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
  //       this.saveParams = { MovementId: this.headerItem.ID }
  //       this.loadParams = { MovementId: this.headerItem.ID }
  //       //notify({
  //       //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
  //       //  type: "success",
  //       //  width: 400
  //       //});
  //       Notify.success('PUB_ACTION_SUCCESS_MSG');
  //     }, this.headerItem);
  //   }

  // }

  insertRows() {
    if (this.flgRequestRequired) {
      this.service.post("/WAM/Movement/AutomaticInsertRequest", (data) => {
        this.fillHeaderItem(data);
        //this.headerItem = data;
        this.localData = data.Items;
        this.refreshGrid(2);
        this.setContext();
        this.enableConfirm();
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, MVTP_ID: this.typeId }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.editRow = { MovementId: this.headerItem.ID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.requestloadParams = { MovementId: this.headerItem.ID }
        this.movementloadParams = { MovementId: this.headerItem.ID }
        this.warehouseloadParams = { MovementId: this.headerItem.ID }
        //notify({
        //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
        //  type: "success",
        //  width: 400
        //});
        Notify.success('PUB_ACTION_SUCCESS_MSG');
      }, this.headerItem);
    }
    else if (this.flgMovementRequired) {
      this.service.post("/WAM/Movement/AutomaticInsertMovement", (data) => {
        this.fillHeaderItem(data);
        //this.headerItem = data;
        this.localData = data.Items;
        this.refreshGrid(2);
        this.setContext();
        this.enableConfirm();
        this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
        this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, MVTP_ID: this.typeId }
        this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
        this.editRow = { MovementId: this.headerItem.ID }
        this.saveParams = { MovementId: this.headerItem.ID }
        this.requestloadParams = { MovementId: this.headerItem.ID }
        this.movementloadParams = { MovementId: this.headerItem.ID }
        this.warehouseloadParams = { MovementId: this.headerItem.ID }
        //notify({
        //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
        //  type: "success",
        //  width: 400
        //});
        Notify.success('PUB_ACTION_SUCCESS_MSG');
      }, this.headerItem);
    }

  }
  setPermanent() {
    this.service.postPromise("/WAM/Movement/ConvertTemporary", this.headerItem).then(data => {
      //this.headerItem = data;
      this.fillHeaderItem(data);
      this.localData = data.Items;
      this.refreshGrid(2);
      this.setContext();
      this.enableConfirm();
      this.movementItemFilter = { MovementId: this.headerItem.RefMovementID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, BSUN_ID: this.headerItem.BusinessUnitID, REF_MVTP_ID: this.reffrenceMovementTypeID, RelationType: this.RelationType, MVTP_ID: this.typeId }
      this.requestItemFilter = { RequestID: this.headerItem.RequestID, MVMN_ID: this.headerItem.ID, WRHS_ID: this.headerItem.WarehouseID, PUOR_ID: this.headerItem.PurchaseOrderId, BSUN_ID: this.headerItem.BusinessUnitID, WRHS_ID_FROM: this.headerItem.WarehouseTargetID, MVTP_ID: this.typeId }
      this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
      this.editRow = { MovementId: this.headerItem.ID }
      this.saveParams = { MovementId: this.headerItem.ID }
      this.requestloadParams = { MovementId: this.headerItem.ID }
      this.movementloadParams = { MovementId: this.headerItem.ID }
      this.warehouseloadParams = { MovementId: this.headerItem.ID }
      //notify({
      //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
      //  type: "success",
      //  width: 400
      //});
      Notify.success('PUB_ACTION_SUCCESS_MSG');
    });
  }
  enableHeader(e) {
    if (this.getGridCount('R') == 0 && this.getGridCount('M') == 0 && this.getGridCount('W') == 0)
      this.setLayaoutAndValidation();
  }

  itemInserted() {
    debugger;
    let i = 1;
    this.localData.forEach(element => {
      element.Sequence = i;
      i = i + 1;
    });
    if (((this.editRow.SerialControlType == 1 && this.itemSelectedRow.SerialControlType == undefined) || (this.editRow.SerialControlType == undefined && this.itemSelectedRow.SerialControlType == 1))) {   
      this.createTagData.CentricAccountId = (this.editRow.RequestCentricAccountId != undefined)? this.editRow.RequestCentricAccountId : this.itemSelectedRow.RequestCentricAccountId;
      this.createTagData.BusinessUnitID = this.branchId;
      this.createTagData.LocationID = (this.editRow.LocationID != undefined)?this.editRow.LocationID : this.itemSelectedRow.LocationID ;
      this.createTagData.Quantity = (this.editRow.SecondQuantityCommercial != undefined)?this.editRow.SecondQuantityCommercial : this.itemSelectedRow.SecondQuantityCommercial;
      this.createTagData.ItemId = (this.editRow.ItemId != undefined)?this.editRow.ItemId : this.itemSelectedRow.ItemId;      

      var updatedItem = this.localData.filter(c => c.ID == ((this.itemSelectedRow.ID != undefined)?this.itemSelectedRow.ID:this.lastInsertedId))[0];
      //updatedItem.Flag = (updatedItem.Flag == 1)?1:;
      updatedItem.SerialData = this.createTagData;
      //updatedItem.LotNumbers = this.groupLotSaveParam;
      this.saveAll();
    }
    else {
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
  }

    onProjectChanged(data, cell) {
    this.editRow.ProjectName = data.Title;
    this.editRow.ProjectId = data.ID;
    this.saveParams.ProjectId = data.ID;
    cell.setValue(data.Title);
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
    this.tagRelatedData.ReffrenceMovementItemId = this.itemSelectedRow.ReffrenceMovementItemId;
    this.tagRelatedData.ID = this.itemSelectedRow.ID;
    //this.tagRelatedData.ID = this.itemSelectedRow.ID;
    //this.tagRelatedData.ID = this.itemSelectedRow.ID;

    this.tagRelatedData.WarehouseID = this.headerItem.WarehouseID;
    this.tagRelatedData.Date = this.headerItem.Date;
    this.tagRelatedData.reffrenceMovementTypeID = this.reffrenceMovementTypeID;
    //this.tagRelatedData.CentricAccountId = this.itemSelectedRow.this.tagRelatedData.CentricAccountId;
    this.serialPopup = true;
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
      // else
      //   this.onCanceledItemRowGrid(e);
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
      //this.onCanceledItemRowGrid(e);
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
    let that = TEST.get(WAMTemporaryMovementPage);

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
    let that = TEST.get(WAMTemporaryMovementPage);
    newData.CentricAccountName = that.tagEditRow.CentricAccountName;
    newData.CentricAccountId = that.lotSaveParam.CentricAccountId;
  }
  setCellValueOfLocation(newData, value, currentRowData) {
    let that = TEST.get(WAMTemporaryMovementPage);
    newData.LocationDescription = that.tagEditRow.LocationDescription;
    newData.LocationID = that.lotSaveParam.LocationID;
  }

  onLotQuantityChange(e) {
    this.createTagData.Quantity = e;
  }
}
