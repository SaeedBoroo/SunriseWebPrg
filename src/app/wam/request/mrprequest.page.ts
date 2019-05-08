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
import { DateTime, DateTimeFormat } from '../../shared/util/DateTime';
import { debug } from 'util';
import { Notify } from '../../shared/util/Dialog';
import { PermissionPurchasePage } from './permissionpurchase.page';
import { DemisPopupService } from '../../shared/components/popup/demis-popup-service';
import { IndustryWarehousePage } from './industrywarehouse.page';
const TEST = new WeakMap();
@Component({
  selector: 'wam-page-mrprequest',
  templateUrl: './mrprequest.page.html',
  providers: [ServiceCaller]
})
export class WAMMRPRequestPage extends BasePage implements OnInit {

  costCenterFilter: { WRHS_BRANCH_ID: any; };
  ngOnInit() {

  }
  @ViewChild('grid') dataGrid: DxDataGridComponent;
  @ViewChild(DxValidationGroupComponent) form: DxValidationGroupComponent;

  itemsLength: Number = 0;
  //
  insertItem: any = {};
  editRow: any = {};
  localData: any = [];
  dataSource: any = {};
  infoPopupVisibile: boolean = false;
  //filters
  itemUnitFilter: any = {};
  warehouseFilter: any = {};
  warehouseHeaderFilter: any = {};
  warehouseTargetFilter: any = {};
  headerWarehouseTargetFilter: any = {};
  warehouseWipFilter: any = {};

  type: string;
  typeId: string = Guid.empty;
  typeIdWarehouse: string = Guid.empty;
  typeIdWarehouseWIP: string = Guid.empty;
  typeDescription: string;
  //reffrenceMovementTypeID: string;
  RelationType: Number;
  ReffrenceType: Number;
  ReffrenceTypeSecond: Number;
  refName: string = null;
  refMovementType: string;
  filter: any = {};
  typeFilter: any = {};
  warehouseItemFilter: any = {};
  inventoryFilter: any = {};
  itemTypeFilter: any = {};

  //Context Parameters
  flgSupplier: boolean = false;
  flgPerson: boolean = false;
  flgCustomer: boolean = false;
  flgCostCenter: boolean = false;
  flgWorkOrder: boolean = false;
  flgWarehouseTarget: boolean = false;
  flgSupplierVisible: boolean = false;
  flgPersonVisible: boolean = false;
  flgCustomerVisible: boolean = false;
  flgCostCenterVisible: boolean = false;
  flgWorkOrderVisible: boolean = false;
  flgWarehouseTargetVisible: boolean = false;
  flgWarehouse: boolean = false;
  flgMovement: boolean = false;
  flgRequest: boolean = false;
  flgMovementVisible: boolean = false;
  flgRequestVisible: boolean = false;
  flgPurOrder: boolean = false;
  flgSalOrder: boolean = false;
  flgDate: boolean = false;
  flgTextNote: boolean = false;
  flgEmergencyType: boolean = false;

  rowIndex: number;

  flgMovementRequired: any = {};
  flgRequestRequired: any = {};

  flgUpdateCode: boolean = false;
  flgUpdateWarehouse: boolean = false;
  flgUpdateWarehouseTarget: boolean = false;
  flgUpdateWarehouseWIP: boolean = false;

  readonly: boolean = false;

  scale: any = 0;
  commercialScale: any = 0;

  lovIttp: any = {};

  costCenterWarehouseID: string;
  costCenterWarehouseDescription: string;

  movementPopup: boolean = false;

  itemSelectedKeys: any = [];
  selectedRow: any = {};

  mrpRequest: boolean = false;
  warehouseTarget: boolean = false;

  flagSimpleMode: boolean = true;

  menuItems: any[] = [
    {
      name: "New",
      icon: "fa fa-plus green",
      text: this.translate.instant("NEW"),
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
      text: this.translate.instant("REQUEST_SEARCH"),
      visible: true,
      disabled: false
    },
    {
      name: "Confirm",
      icon: "fa fa-check",
      text: this.translate.instant("PUB_CONFIRM"),
      visible: true,
      disabled: false
    },
    {
      name: "otherAction",
      icon: 'fa fa-bars',
      text: "سایر عملیات",
      visible: true,
      items: [

        {
          name: "Close",
          icon: "fa fa-hourglass-end",
          text: this.translate.instant("WAM_CLOSE_RQIT"),
          visible: true,
          disabled: false
        },
        // {
        //   name: "BackToConfirm",
        //   icon: "fa fa-undo",
        //   text: this.translate.instant("WAM_BACK_CONFIRM"),
        //   visible: true,
        //   disabled: false
        // },
        {
          name: "BackToClose",
          icon: "fa fa-hourglass-start",
          text: this.translate.instant("WAM_BACK_CLOSE_RQIT"),
          visible: true,
          disabled: false
        },
        {
          name: "PermissionPurchase",
          icon: "fa fa-hourglass-start",
          text: this.translate.instant("WAM_Save_Permission_Purchase"),
          visible: true,
          disabled: false

        },
        {
          name: "SaveIndustryWarehouse",
          icon: "fa fa-floppy-o green",
          text: this.translate.instant("WAM_SAVE_INDUSTRY_WAREHOUSE"),
          visible: true,
          disabled: false

        }
      ]
    }
    // {
    //   name: "Choose",
    //   //icon: "fa fa-barcode",
    //   icon: "fa fa-tags",
    //   text: this.translate.instant("SELECT_TAG"),
    //   visible: true,
    //   disabled: false
    // },
    //{
    //  name: "Send",
    //  icon: "fa fa-share-square-o blue",
    //  text: this.translate.instant("SEND_TO_INDUSTRY"),
    //  visible: true,
    //  disabled: false
    //},

  ];

  gridItems: any[] = [
    {
      name: "DX-MOVEMENT",
      icon: "fa fa-file-code-o green",
      text: 'حواله های انبار',
      visible: true
    },
    {
      name: "DXConfirm",
      icon: "fa fa-check",
      text: this.translate.instant("PUB_CONFIRM"),
      visible: true
    },
    {
      name: "DXClose",
      icon: "fa fa-hourglass-end",
      text: this.translate.instant("WAM_CLOSE_RQIT"),
      visible: true
    },
    {
      name: "DXBackToConfirm",
      icon: "fa fa-undo",
      text: this.translate.instant("WAM_BACK_CONFIRM"),
      visible: true
    },
    {
      name: "DXBackToClose",
      icon: "fa fa-hourglass-start",
      text: this.translate.instant("WAM_BACK_CLOSE_RQIT"),
      visible: true
    },
    ,
    {
      name: "DXCancel",
      icon: "fa fa-hourglass-start",
      text: this.translate.instant("WAM_CANCEL_RQIT"),
      visible: true
    }
  ];


  headerMenuItems: any[] = [
    {
      name: "DX-STATUS",
      icon: "fa fa-file-code-o green",
      text: this.translate.instant("PUB_CONFIRM"),
      visible: true
    }
  ];

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private popup: DemisPopupService, ) {
    super(translate);
    TEST.set(WAMMRPRequestPage, this);
    //this.typeFilter.Code = '262';
    // this.service.get("/WAM/MovementType/List", (data) => {
    //   this.insertItem.MovementTypeId = data[0].MovementTypeId;
    //   this.insertItem.RequestTypeDes = data[0].Description;
    //   this.typeId = data[0].ID;
    //   //this.warehouseFilter = { MVTP_ID: this.typeId };
    //   this.typeDescription = data[0].Description;
    //   this.RelationType = data[0].RelationType;
    //   this.ReffrenceType = data[0].ReffrenceType;
    //   this.ReffrenceTypeSecond = data[0].ReffrenceTypeSecond;
    //   this.setLayaoutAndValidation();
    // }, this.typeFilter)

    let typeFilterSec: any = {};
    typeFilterSec.Code = '253';
    this.service.get("/WAM/MovementType/List", (data) => {
      this.typeIdWarehouse = data[0].ID;

    }, typeFilterSec)
    let typeFilterWip: any = {};
    typeFilterWip.Code = '153';
    this.service.get("/WAM/MovementType/List", (data) => {
      this.typeIdWarehouseWIP = data[0].ID;
      //this.
      this.warehouseWipFilter = {BSUN_ID: this.branchId};
    }, typeFilterWip)
    
    
    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      insert: (values) => {

        var detailInsert: any = [];
        let deferred: Deferred<any> = new Deferred<any>();
        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;
        values.ItemId = this.editRow.ItemId;
        values.UnitId = this.editRow.UnitId;
        values.ItemTypeId = this.editRow.ItemTypeId;
        values.WarehouseId = this.editRow.WarehouseId;
        values.WarehouseTargetId = this.editRow.WarehouseTargetId;
        values.WIPWarehouseId = this.editRow.WIPWarehouseId;
        values.ProjectId = this.editRow.ProjectId;
        values.CentricAccountId = this.editRow.CentricAccountId;
        values.Inventory = this.editRow.Inventory;
        values.Status = 10;

        Object.assign(values, { Flag: 1 }) as any;
        this.localData.push(values);
        deferred.resolve(true);
        return deferred.promise;

      },
      update: (key, values) => {

        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.localData.filter(c => c.ID == key)[0];
        updatedItem.Flag = 2;
        //if ((this.editRow.SecondQuantityCommercial != null) && (updatedItem.SecondQuantityCommercial == null || (updatedItem.SecondQuantityCommercial != null && updatedItem.SecondQuantityCommercial != this.editRow.SecondQuantityCommercial)))
        //    updatedItem.SecondQuantityCommercial = this.editRow.SecondQuantityCommercial;
        //if ((this.editRow.QuantityCommercial != null) && (updatedItem.QuantityCommercial == null || (updatedItem.QuantityCommercial != null && updatedItem.QuantityCommercial != this.editRow.QuantityCommercial)))
        //    updatedItem.QuantityCommercial = this.editRow.QuantityCommercial;
        //if ((this.editRow.Quantity != null) && (updatedItem.Quantity == null || (updatedItem.Quantity != null && updatedItem.Quantity != this.editRow.Quantity)))
        //    updatedItem.Quantity = this.editRow.Quantity;
        if ((this.editRow.ItemId != null) && (updatedItem.ItemId == null || (updatedItem.ItemId != null && updatedItem.ItemId != this.editRow.ItemId)))
          updatedItem.ItemId = this.editRow.ItemId;
        if ((this.editRow.UnitId != null) && (updatedItem.UnitId == null || (updatedItem.UnitId != null && updatedItem.UnitId != this.editRow.UnitId)))
          updatedItem.UnitId = this.editRow.UnitId;
        if ((this.editRow.ItemTypeId != null) && (updatedItem.ItemTypeId == null || (updatedItem.ItemTypeId != null && updatedItem.ItemTypeId != this.editRow.ItemTypeId)))
          updatedItem.ItemTypeId = this.editRow.ItemTypeId;
        if ((this.editRow.WarehouseId != null) && (updatedItem.WarehouseId == null || (updatedItem.WarehouseId != null && updatedItem.WarehouseId != this.editRow.WarehouseId)))
          updatedItem.WarehouseId = this.editRow.WarehouseId;
        if ((this.editRow.WarehouseTargetId != null) && (updatedItem.WarehouseTargetId == null || (updatedItem.WarehouseTargetId != null && updatedItem.WarehouseTargetId != this.editRow.WarehouseTargetId)))
          updatedItem.WarehouseTargetId = this.editRow.WarehouseTargetId;
        if ((this.editRow.WIPWarehouseId != null) && (updatedItem.WIPWarehouseId == null || (updatedItem.WIPWarehouseId != null && updatedItem.WIPWarehouseId != this.editRow.WIPWarehouseId)))
          updatedItem.WIPWarehouseId = this.editRow.WIPWarehouseId;
        if ((this.editRow.ProjectId != null) && (updatedItem.ProjectId == null || (updatedItem.ProjectId != null && updatedItem.ProjectId != this.editRow.ProjectId)))
          updatedItem.ProjectId = this.editRow.ProjectId;
        if ((this.editRow.CentricAccountId != null) && (updatedItem.CentricAccountId == null || (updatedItem.CentricAccountId != null && updatedItem.CentricAccountId != this.editRow.CentricAccountId)))
          updatedItem.CentricAccountId = this.editRow.CentricAccountId;
        if ((this.editRow.Inventory != null) && (updatedItem.Inventory == null || (updatedItem.Inventory != null && updatedItem.Inventory != this.editRow.Inventory)))
          updatedItem.Inventory = this.editRow.Inventory;

        Object.assign(updatedItem, values);
        deferred.resolve(true);
        return deferred.promise;
        //let deferred: Deferred<any> = new Deferred<any>();
        //values.ItemId = this.editRow.ItemId;
        //values.UnitId = this.editRow.UnitId;
        //Object.assign(this.localData.filter(c => c.ID == key)[0], values);
        //deferred.resolve(true);
        //return deferred.promise;
      },
      remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.localData.filter(c => c.ID == key)[0].Flag = 3;
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['ID'] != null && params['ID'] != "") {
        var param: any = {};
        param.ID = params['ID'];
        this.service.get("/WAM/Request/List", (data) => {
          if (data.length > 0) {
            this.editRow.ID = data.ID;
            Object.assign(this.insertItem, data[0]);
            this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId}
            this.localData = data[0].Items;
            this.dataGrid.instance.refresh();
            this.itemsLength = this.localData.length;
            this.setContext();
            this.enableConfirm();
          }
        }, param);
      }
      else {
        this.clearForm();
        if (params['WorkOrderID'] != null) {
          this.insertItem.WorkOrderID = params['WorkOrderID'];
          this.insertItem.WorkOrderNumber = params['WorkOrderNumber'];
        }
        //this.dataGrid.instance.refresh();
      }
    });

    this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })

  }

  formatProgress(ratio, value) {
    return "  (" + Math.round(ratio * 100) + "%)  " + value;
  }

  onEditorPreparingItemsGrid(e) {

    if (e.parentType === "dataRow" && (e.dataField == "ItemDescription" || e.dataField == "ItemDescriptionLatin" || e.dataField == "UnitDescription" || e.dataField == "Quantity" || e.dataField == "ItemCode" || e.dataField == "Sequence" || e.dataField == "QuantityDelivered" || e.dataField == "LocationDescription" || (e.dataField == "ItemTypeId" && this.flgUpdateCode) || (e.dataField == "WarehouseTargetDescription" && this.editRow.BusinessUnitId == this.insertItem.BusinessUnitID)))
      e.editorOptions.readOnly = true;
    if (e.row != undefined)
      this.editRow.Inventory = e.row.data.Inventory;
  }

  onMenuItemClick(name) {
    switch (name) {
      case "New": {
        this.clearForm();
        this.itemsLength = 0;
        this.setContext();
        //this.insertItem.MovementTypeID = this.typeId;
        break;
      }
      case "Search": {
        this.router.navigate(["wam/request/mrprequestsearch"], { queryParams: { ReffrenceType: 1 } });
        break;
      }
      case "Save": {
        this.insertItem.RequestTypeID = this.typeId;
        console.log('this.insertItem.RequestTypeID');
        console.log(this.insertItem.RequestTypeID);
        this.saveAll();
        this.setContext();
        break;
      }
      case "Confirm": {
        if (this.insertItem.Status < 20)
          this.insertItem.Status = 20;
        else
          this.insertItem.Status = 15;
        this.setStatus();
        //this.setContext();
        break;
      }
      case "Close": {
        this.insertItem.Status = 30;
        this.setStatus();
        //this.setContext();
        break;
      }
      case "BackToConfirm": {
        this.insertItem.Status = 15;
        this.setStatus();
        //this.setContext();
        break;
      }
      case "BackToClose": {
        this.insertItem.Status = 20;
        this.setStatus();
        //this.setContext();
        break;
      }
      case 'UserInfo':
        this.infoPopupVisibile = true;
        break;
      case "PermissionPurchase":
        this.popup.open(PermissionPurchasePage, {
          width: '900',
          height: '600',
          title: 'ثبت براساس مجوز خرید',
          data: { requestId: this.insertItem.ID },
        }).then(res => {
          this.localData = res;
          this.dataGrid.instance.refresh();

        })
        break;
      case "SaveIndustryWarehouse":
        this.popup.open(IndustryWarehousePage, {
          width: '600',
          height: '200',
          title: 'ثبت انبار صنعت',
          data: { requestId: this.insertItem.ID },
        }).then(res => {
          this.localData = res;
          this.dataGrid.instance.refresh();

        })
        break;
      default:
    }
  }



  itemInserted() {
    let i = 1;
    this.localData.forEach(element => {
      element.Sequence = i;
      i = i + 1;
    });
    this.saveAll();
  }
  clearForm() {
    this.insertItem = {};
    this.insertItem = { Status: 10, RequestTypeID: this.typeId, RequestTypeDes: this.typeDescription, EmergencyType: 1 };
    this.insertItem.Date = DateTime.convertForRemote(DateTime.now);
    this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId}
    this.localData = [];
    this.readonly = false;
    if (this.dataGrid != undefined)
      this.dataGrid.instance.refresh();
    this.enableConfirm();
  }

  RequesttTypeChanged(data) {

    this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId};
    this.type = data.Code;
    if (this.insertItem.RequestTypeID == null || this.insertItem.RequestTypeID == undefined)
      this.readonly = false;
    else
      this.readonly = true;
    if (this.type == '262') {//SEND TO WIP WITH TRANSFER
      this.mrpRequest = true;//WIP NEEDED
      this.warehouseTarget = true;//BRANCH NEEDED
    }
    else if (this.type == '264') {//SEND TO COST CENTER WITH TRANSFER
      this.mrpRequest = false;//NO WIP
      this.warehouseTarget = true;//BRANCH NEEDED
    }
    else if (this.type == '261') {//SEND TO WIP
      this.mrpRequest = true;//WIP NEEDED
      this.warehouseTarget = false;//NO BRANCH
    }
    else {
      this.mrpRequest = false;//NO WIP
      this.warehouseTarget = false;//NO BRANCH
    }
debugger;
    this.menuItems[4].items[3].visible = this.warehouseTarget;
    this.typeId = Guid.empty;
    this.disableAllHeaderFields();
    this.invisibleAllHeaderVariables();
    this.setContext();
  }

  setWrhsHeaderFilter() {
    if (this.warehouseTarget) {
      this.warehouseHeaderFilter = { MVTP_ID: this.typeId, WRHS_ID: this.insertItem.WarehouseTargetID,  BRANCH_ID: null };
    }
    else {
      this.warehouseHeaderFilter = { MVTP_ID: this.typeId, WRHS_ID: this.insertItem.WarehouseTargetID, BRANCH_ID: this.branchId };
    }
  }

  setWrhsFilter() {
    if (this.warehouseTarget) {
      this.warehouseFilter = { MVTP_ID: this.typeIdWarehouse, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, WRHS_ID: this.insertItem.WarehouseTargetID};
    }
    else {
      this.warehouseFilter = { MVTP_ID: this.typeId, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, WRHS_ID: this.insertItem.WarehouseTargetID};
    }
  }

  workOrderChanged(e) { }

  onCellUnitChanged(data, cell) {
    this.editRow.UnitId = data.ID;
    this.editRow.UnitDescriptionCommercial = data.Title;
    if (data.Scale != 0 && data.Scale != null)
      this.scale = data.Scale;
    else
      this.scale = 1;
    if (data.CommercialScale != 0 && data.CommercialScale != null)
      this.commercialScale = data.CommercialScale;
    else
      this.commercialScale = 1;
    cell.setValue(data.Code);
  }

  setCellValueOfItemCode(newData, value, currentRowData) {
    let that = TEST.get(WAMMRPRequestPage);
    console.log(that.editRow);
    console.log(that.editRow);
    newData.ItemCode = value;
    newData.ItemDescription = that.editRow.ItemDescription;
    newData.ItemDescriptionLatin = that.editRow.ItemDescriptionLatin;
    newData.UnitDescriptionCommercial = that.editRow.UnitDescriptionCommercial;
    newData.ItemTypeDescription = that.editRow.ItemTypeDescription;
    newData.ItemTypeId = that.editRow.ItemTypeId;

    if (that.editRow.WarehouseId != Guid.empty &&
      that.editRow.WarehouseId != undefined &&
      that.editRow.ItemId != Guid.empty &&
      that.editRow.ItemId != undefined) {
      that.service.get("/WAM/Inventory/GetItemTypeInventory",
        (data) => {
          //this.editRow.Inventory = data;
          that.editRow.Inventory = data;
          newData.Inventory = data;
        },
        that.inventoryFilter)
    }
    newData.Inventory = that.editRow.Inventory;
    //newData.Inventory = that.editRow.Inventory;
  }



  onCellRequestItemWarehouseCode(data, cell) {
    this.editRow.WarehouseDescription = data.Code;
    this.editRow.WarehouseCode = data.Code;
    this.editRow.WarehouseId = data.ID;
    this.editRow.BusinessUnitId = data.BusinessUnitId;
    if (data.BusinessUnitId == this.branchId)
      this.flgUpdateWarehouseTarget = true;
    else
      this.flgUpdateWarehouseTarget = false;
    //this.inventoryFilter = {
    //  WarehouseID: this.editRow.WarehouseId,
    //  ItemId: this.editRow.ItemId,
    //  Date: this.insertItem.Date
    //};
    //if (this.editRow.WarehouseId != Guid.empty &&
    //  this.editRow.WarehouseId != undefined &&
    //  this.editRow.ItemId != Guid.empty &&
    //  this.editRow.ItemId != undefined) {
    //  this.service.get("/WAM/Inventory/GetItemInventory",
    //    (data) => {
    //      this.editRow.Inventory = data;
    //    },
    //    this.inventoryFilter)
    //}
    cell.setValue(data.Code);
  }

  onCellRequestItemWarehouseTargetCode(data, cell) {
    this.editRow.WarehouseTargetDescription = data.Code;
    this.editRow.WarehouseTargetId = data.ID;
    cell.setValue(data.Code);
  }

  onCellRequestItemWarehouseWIPCode(data, cell) {

    this.editRow.WIPWarehouseDescription = data.Code;
    this.editRow.WIPWarehouseId = data.ID;
    cell.setValue(data.Code);
  }

  onCentricChanged(data, cell) {
    this.editRow.CentricAccountName = data.Title;
    this.editRow.CentricAccountId = data.ID;
    cell.setValue(data.Title);
  }


  setCellValueOfWarehouse(newData, value, currentRowData) {
    let that = TEST.get(WAMMRPRequestPage);
    newData.WarehouseDescription = that.editRow.WarehouseDescription;
    newData.WarehouseCode = that.editRow.WarehouseCode;
    if (that.editRow.WarehouseId != Guid.empty &&
      that.editRow.WarehouseId != undefined &&
      that.editRow.ItemId != Guid.empty &&
      that.editRow.ItemId != undefined) {
      that.service.get("/WAM/Inventory/GetItemTypeInventory",
        (data) => {
          //this.editRow.Inventory = data;
          that.editRow.Inventory = data;
          newData.Inventory = data;
        },
        that.inventoryFilter)
    }
    newData.Inventory = that.editRow.Inventory;
  }

  setCellValueOfUnitCommercial(newData, value, currentRowData) {
    let that = TEST.get(WAMMRPRequestPage);
    newData.UnitDescriptionCommercial = that.editRow.UnitDescriptionCommercial;
    newData.SecondQuantityCommercial = null;
    newData.Quantity = null;
    newData.Inventory = that.editRow.Inventory;
  }
  setCellValueOfSecondQuantityCommercial(newData, value, currentRowData) {
    let that = TEST.get(WAMMRPRequestPage);
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
    newData.Inventory = that.editRow.Inventory;
  }
  saveAll() {

    var result = this.form.instance.validate();
    if (result.isValid) {
      var param = this.insertItem;
      var detailInsert: any = [];
      var detailUpdate: any = [];
      var detailDelete: any = [];
      //Insert
      this.localData.filter(i => i.Flag == 1).forEach(t =>
        detailInsert.push({
          Quantity: t.Quantity,
          Inventory: t.Inventory,
          SecondQuantityCommercial: t.SecondQuantityCommercial,
          QuantityCommercial: t.QuantityCommercial,
          QuantityCommercialDetail: t.QuantityCommercialDetail,
          Sequence: t.Sequence,
          //RequestItemId: t.RequestItemId,
          WarehouseId: t.WarehouseId,
          WarehouseTargetId: t.WarehouseTargetId,
          WIPWarehouseId: t.WIPWarehouseId,
          ProjectId: t.ProjectId,
          CentricAccountId: t.CentricAccountId,
          ItemId: t.ItemId,
          ItemTypeId: t.ItemTypeId,
          PurchaseOrderItemId: t.PurchaseOrderItemId,
          //RefMovementItemId: t.RefMovementItemId,
          SaleOrderItemId: t.SaleOrderItemId,
          UnitId: t.UnitId,
          TextNote: t.TextNote,
          Status: t.Status
        }));
      //Update
      this.localData.filter(i => i.Flag == 2).forEach(t =>
        detailUpdate.push({
          ID: t.ID,
          Quantity: t.Quantity,
          Inventory: t.Inventory,
          SecondQuantityCommercial: t.SecondQuantityCommercial,
          QuantityCommercial: t.QuantityCommercial,
          QuantityCommercialDetail: t.QuantityCommercialDetail,
          Sequence: t.Sequence,
          //MovementItemId: t.MovementItemId,
          WarehouseId: t.WarehouseId,
          WarehouseTargetId: t.WarehouseTargetId,
          WIPWarehouseId: t.WIPWarehouseId,
          ProjectId: t.ProjectId,
          CentricAccountId: t.CentricAccountId,
          ItemId: t.ItemId,
          ItemTypeId: t.ItemTypeId,
          PurchaseOrderItemId: t.PurchaseOrderItemId,
          SaleOrderItemId: t.SaleOrderItemId,
          UnitId: t.UnitId,
          TextNote: t.TextNote,
          Status: t.Status,
        }));
      //Delete
      this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
      var Items: any = {};
      Items.InsertedItems = detailInsert;
      Items.UpdatedItems = detailUpdate;
      Items.DeletedItems = detailDelete;
      param.Items = Items;
      this.service.post("/WAM/Request/Save", (data) => {
        if (data != null) {
          this.insertItem = data;
          this.localData = data.Items;
          this.dataGrid.instance.refresh();
          this.itemsLength = this.localData.length;
          this.setContext();
          this.enableConfirm();
          this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId}

          //this.requestItemFilter = { RequestID: this.insertItem.RequestID }
          //this.saveParams = { MovementId: this.insertItem.ID }
          //this.loadParams = { MovementId: this.insertItem.ID }
          //notify({
          //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
          //  type: "success",
          //  width: 400
          //});
          Notify.success('PUB_ACTION_SUCCESS_MSG');
        }
      }, param);
    }
  }
  //enableConfirm() {
  //    if (this.insertItem.Status >= 20 || this.insertItem.ID == Guid.empty || this.insertItem.ID == null)
  //        this.menuItems[3].disabled = true;
  //    else
  //        this.menuItems[3].disabled = false;
  //}

  setStatus() {
    var result = this.form.instance.validate();
    if (result.isValid) {

      this.service.post("/WAM/Requset/SetStatus", (data) => {
        if (data != null) {
          this.insertItem = data;
          this.localData = data.Items;
          this.dataGrid.instance.refresh();
          this.itemsLength = this.localData.length;
          this.setContext();
          this.enableConfirm();
          this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId}
          //this.requestItemFilter = { RequestID: this.insertItem.RequestID }
          //this.saveParams = { MovementId: this.insertItem.ID }
          //this.loadParams = { MovementId: this.insertItem.ID }
          //notify({
          //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
          //  type: "success",
          //  width: 400
          //});
          Notify.success('PUB_ACTION_SUCCESS_MSG');
        }
      }, this.insertItem);
    }
  }

  enableConfirm() {
    if (this.insertItem.Status >= 20)
      this.menuItems[3].text = this.translate.instant("WAM_MODIFY");
    else
      this.menuItems[3].text = this.translate.instant("PUB_CONFIRM");
    if (this.insertItem.ID == Guid.empty || this.insertItem.ID == null)
      this.menuItems[3].disabled = true;
    else
      this.menuItems[3].disabled = false;
  }

  setContext() {
    this.costCenterFilter = { WRHS_BRANCH_ID: this.branchId };
    if (this.typeId == Guid.empty) {
      this.typeFilter.Code = this.type;
      if (this.typeFilter.Code == 262) {

      }
      this.service.get("/WAM/MovementType/List", (data) => {
        //this.insertItem.RequestTypeID = data[0].RequestTypeID;
        this.typeId = data[0].ID;
        this.setWrhsHeaderFilter();
        //this.reffrenceMovementTypeID = data[0].ReffresnceMovementTypeID;
        //this.reffrenceMovementFilter = { MVTP_ID: this.reffrenceMovementTypeID };
        this.RelationType = data[0].RelationType;
        this.ReffrenceType = data[0].ReffrenceType;
        this.ReffrenceTypeSecond = data[0].ReffrenceTypeSecond;
        this.setLayaoutAndValidation();
      }, this.typeFilter)
    }
    else
      this.setLayaoutAndValidation();
  }

  setLayaoutAndValidation() {
    switch (this.RelationType) {
      case 1:
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgCostCenter = true;
          this.flgCostCenterVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgCostCenterVisible = true;
          break;
        }
        break;
      case 2:
        break;
      case 3:
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgSupplier = true;
          this.flgSupplierVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgSupplierVisible = true;
          break;
        }
        break;
      case 7:
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgPerson = true;
          this.flgPersonVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgPersonVisible = true;
          break;
        }
        break;
      case 4:
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgCustomer = true;
          this.flgCustomerVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgCustomerVisible = true;
          break;
        }
        break;
      case 5:
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgWarehouseTarget = true;
          this.flgWarehouseTargetVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
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
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgRequest = true;
          this.flgRequestRequired = true;
          this.flgRequestVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 2:
        hasReffrence = 1;
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgMovement = true;
          this.flgMovementVisible = true;
          this.flgMovementRequired = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 3:
        hasReffrence = 1;
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          //this.flgPurchaseOrderVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 4:
        hasReffrence = 1;
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          //this.flgSalOrderVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 7:
        if (this.insertItem.Status < 20 && this.itemsLength == 0) {
          this.flgWorkOrder = true;
          this.flgWorkOrderVisible = true;
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgWorkOrderVisible = true;
          break;
        }
      default:
    }

    switch (this.ReffrenceTypeSecond) {
      case 1:
        hasReffrence = 1;
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgRequest = true;
          this.flgRequestRequired = true;
          this.flgRequestVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 2:
        hasReffrence = 1;
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgMovement = true;
          this.flgMovementVisible = true;
          this.flgMovementRequired = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 3:
        hasReffrence = 1;
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          //this.flgPurchaseOrderVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 4:
        hasReffrence = 1;
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          //this.flgSalOrderVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 7:
        if ((this.insertItem.Status == 10 || this.insertItem.Status == 15) && (this.itemsLength == 0 || this.dataGrid.instance.totalCount() == 0)) {
          this.flgWorkOrder = true;
          this.flgWorkOrderVisible = true;
          break;
        }
        if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgWorkOrderVisible = true;
          break;
        }
      default:
    }

    //if (hasReffrence == 0) {
    //  this.flgWarehouseItemVisible = true;
    //}
    //this.enableGeneralValues();
  }

  //setLayaoutAndValidation() {
  //  switch (this.RelationType) {
  //    case 1:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgCostCenter = true;
  //        this.flgCostCenterVisible = true;
  //        this.enableGeneralValues();
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        this.flgCostCenterVisible = true;
  //        break;
  //      }
  //      break;
  //    case 2:
  //      break;
  //    case 3:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgSupplier = true;
  //        this.flgSupplierVisible = true;
  //        this.enableGeneralValues();
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        this.flgSupplierVisible = true;
  //        break;
  //      }
  //      break;
  //    case 4:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgCustomer = true;
  //        this.flgCustomerVisible = true;
  //        this.enableGeneralValues();
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        this.flgCustomerVisible = true;
  //        break;
  //      }
  //      break;
  //    case 5:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgWarehouseTarget = true;
  //        this.flgWarehouseTargetVisible = true;
  //        this.enableGeneralValues();
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        this.flgWarehouseTargetVisible = true;
  //        break;
  //      }
  //      break;
  //    case 9:
  //      break;
  //    default:
  //  }
  //  switch (this.ReffrenceType) {
  //    case 1:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgRequest = true;
  //        this.flgRequestRequired = true;
  //        this.flgRequestVisible = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    case 2:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgMovement = true;
  //        this.flgMovementVisible = true;
  //        this.flgMovementRequired = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    case 3:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgPurOrder = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    case 4:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgSalOrder = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    default:
  //  }
  //  switch (this.ReffrenceTypeSecond) {
  //    case 1:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgRequest = true;
  //        this.flgRequestRequired = true;
  //        this.flgRequestVisible = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    case 2:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgMovement = true;
  //        this.flgMovementVisible = true;
  //        this.flgMovementRequired = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    case 3:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgPurOrder = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    case 4:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgSalOrder = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    case 7:
  //      if (this.insertItem.Status < 20 && this.itemsLength == 0) {
  //        this.flgWorkOrder = true;
  //        this.flgWorkOrderVisible = true;
  //        break;
  //      }
  //      if (this.insertItem.Status >= 20 || this.itemsLength > 0) {
  //        this.disableAllHeaderFields();
  //        break;
  //      }
  //    default:
  //  }
  //}

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
    this.flgSalOrder = false;
    this.flgDate = false;
    this.flgTextNote = false;
    this.flgEmergencyType = false;
    this.flgWorkOrder = false;
    if (this.insertItem.RequestTypeID != null || this.insertItem.RequestTypeID != undefined)
      this.readonly = true;
    else
      this.readonly = false;
  }
  invisibleAllHeaderVariables() {
    this.flgSupplierVisible = false;
    this.flgPersonVisible = false;
    this.flgCustomerVisible = false;
    this.flgCostCenterVisible = false;
    this.flgWorkOrderVisible = false;
    this.flgWarehouseTargetVisible = false;
  }
  enableGeneralValues() {
    this.flgWarehouse = true;
    this.flgDate = true;
    this.flgTextNote = true;
    this.flgEmergencyType = true;
    // if (this.insertItem.ID == Guid.empty || this.insertItem.ID == undefined)
    //   this.readonly = false;
    // else
    //   this.readonly = true;
  }

  onGridWarehouseItemMenuClick(e) {
    if (e.name == "DXInsert") {
      var result = this.form.instance.validate();
      debugger;
      if ((this.insertItem.ID == null || this.insertItem.ID == undefined)&& !result.isValid) {
        e.handled = true;
        Notify.error("WAM_RQST_HEADER_INCOMPLETE");
      }
      else {
        debugger;
        this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId}
        this.flgUpdateCode = false;
        //this.flgUpdateWarehouse = false;
        if (this.insertItem.WarehouseID != Guid.empty && this.insertItem.WarehouseID != undefined)
          this.flgUpdateWarehouse = true;
        else
          this.flgUpdateWarehouse = false;

        this.flgUpdateWarehouseTarget = false;
        this.flgUpdateWarehouseWIP = false;
        if (this.insertItem.Status >= 20) {
          //notify({
          //  message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          //  type: "error",
          //  width: 400
          //});
          Notify.error('WAM_INVALID_UPDATE_MSG');
          e.handled = true;
        }
        this.onCanceledItemRowGrid(e);
        this.disableAllHeaderFields();
      }
    }
    if (this.selectedRow.QuantityDelivered > 0 && (e.name == 'DXEdit' || e.name == 'DXDelete')) {
      Notify.error('WAM_MOVEMENT_ITEM_USED');
      e.handled = true;
    } else {
      if (e.name == 'DXEdit') {
        this.flgUpdateCode = true;
        this.flgUpdateWarehouse = true;
        this.flgUpdateWarehouseTarget = false;
        this.flgUpdateWarehouseWIP = true;
        //if (this.insertItem.WarehouseID != Guid.empty && this.insertItem.WarehouseID != undefined)
        //  this.flgUpdateWarehouse = true;
        //else
        //  this.flgUpdateWarehouse = false;
        //this.flgUpdateCode = true;
        this.itemUnitFilter = { ITEM_ID: e.data.ItemId };
        console.log('this.editRow');
        console.log(this.editRow);
        if (this.insertItem.Status >= 20) {
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
        if (this.insertItem.Status >= 20) {
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
    }
    if (e.name == "DXSelectedDelete") {
      if (this.insertItem.Status >= 20) {
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
    if (e.name == "DX-MOVEMENT") {
      this.movementPopup = true;
    }
    if (e.name == "DXConfirm") {
      if (this.selectedRow.Status != 35) {
        this.selectedRow.Status = 20;
        this.service.post("/WAM/RequestItem/SetStatus", (data) => {
          var updatedItem = this.localData.filter(c => c.ID == this.selectedRow.ID)[0];
          //Object.assign(updatedItem, values);
          updatedItem.Status = 20;
          updatedItem.StatusDes = 'تایید';
          this.dataGrid.instance.refresh();
        }, this.selectedRow);
        this.dataGrid.instance.refresh();
      }
    }
    if (e.name == "DXClose") {
      if (this.selectedRow.Status != 35) {
        this.selectedRow.Status = 30;
        this.service.post("/WAM/RequestItem/SetStatus", (data) => {
          var updatedItem = this.localData.filter(c => c.ID == this.selectedRow.ID)[0];
          //Object.assign(updatedItem, values);
          updatedItem.Status = 30;
          updatedItem.StatusDes = 'مختومه';
          this.dataGrid.instance.refresh();
        }, this.selectedRow);
        this.dataGrid.instance.refresh();
      }
    }
    if (e.name == "DXCancel") {
      if (this.selectedRow.Status != 35) {
        this.selectedRow.Status = 35;
        this.service.post("/WAM/RequestItem/SetStatus", (data) => {
          var updatedItem = this.localData.filter(c => c.ID == this.selectedRow.ID)[0];
          //Object.assign(updatedItem, values);
          updatedItem.Status = 35;
          updatedItem.StatusDes = 'ابطال';
          this.dataGrid.instance.refresh();
        }, this.selectedRow);
        this.dataGrid.instance.refresh();
      }
    }
    if (e.name == "DXBackToConfirm") {
      if (this.selectedRow.Status != 35) {
        if (this.selectedRow.QuantityDelivered > 0) {
          Notify.error('WAM_MOVEMENT_ITEM_USED');
        } else {
          this.selectedRow.Status = 10;
          this.service.post("/WAM/RequestItem/SetStatus", (data) => {
            var updatedItem = this.localData.filter(c => c.ID == this.selectedRow.ID)[0];
            //Object.assign(updatedItem, values);
            updatedItem.Status = 10;
            updatedItem.StatusDes = 'ایجاد';
            this.dataGrid.instance.refresh();
          }, this.selectedRow);
          this.dataGrid.instance.refresh();
        }
      }
    }
    if (e.name == "DXBackToClose") {
      if (this.selectedRow.Status != 35) {
        this.selectedRow.Status = 20;
        this.service.post("/WAM/RequestItem/SetStatus", (data) => {
          var updatedItem = this.localData.filter(c => c.ID == this.selectedRow.ID)[0];
          //Object.assign(updatedItem, values);
          updatedItem.Status = 20;
          updatedItem.StatusDes = 'تایید';
          this.dataGrid.instance.refresh();
        }, this.selectedRow);
        this.dataGrid.instance.refresh();
      }
    }
  }

  onCanceledItemRowGrid(e) {
    this.editRow = {};
    if (this.dataGrid.instance.totalCount() > 0)
      this.disableAllHeaderFields();
    else
      this.setLayaoutAndValidation();
  }
  enableHeader(e) {
    if (this.dataGrid.instance.totalCount() == 0)
      this.setLayaoutAndValidation();
  }

  onItemTypeChanged(data, cell) {
    this.editRow.ItemTypeId = data.ID;
    //this.saveParams.ItemTypeId = data.ID;
    this.editRow.ItemTypeDescription = data.Title;
    //this.warehouseFilter = { MVTP_ID: this.typeIdWarehouse, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, WRHS_ID: this.insertItem.WarehouseTargetID };
    this.setWrhsFilter();
    cell.setValue(data.Title);
  }



  onCellWarehouseItemCodeChanged(data, cell) {
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemDescriptionLatin = data.LatinDescription;
    this.editRow.ItemId = data.ID;
    this.editRow.ItemTypeId = data.ItemTypeId;
    this.setWrhsFilter();
    //this.warehouseFilter = { MVTP_ID: this.typeIdWarehouse, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, WRHS_ID: this.insertItem.WarehouseTargetID };    
    this.warehouseTargetFilter = { MVTP_ID: this.typeIdWarehouseWIP, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, BSUN_ID: this.branchId };
    //this.warehouseWipFilter = { MVTP_ID: this.typeIdWarehouseWIP, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId };
    this.warehouseWipFilter = {BSUN_ID: this.branchId};
   
     

    //this.service.loadLovData("LOV-WAM-024", (dataT) => { this.lovIttp = dataT; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
    this.editRow.UnitId = data.UnitID;
    this.editRow.UnitDescriptionCommercial = data.UnitDescription;
    this.editRow.ItemTypeDescription = data.ItemTypeDescription;
    this.scale = 1;
    this.commercialScale = 1;
    this.editRow
    this.itemUnitFilter = { ITEM_ID: data.ID };
    this.inventoryFilter = {
      WarehouseID: this.editRow.WarehouseId,
      ItemId: this.editRow.ItemId,
      typeId: this.editRow.ItemTypeId,
      //Date: DateTime.now,//this.insertItem.Date
      Date: this.insertItem.Date
    };

    //if (this.editRow.WarehouseId != Guid.empty &&
    //  this.editRow.WarehouseId != undefined &&
    //  this.editRow.ItemId != Guid.empty &&
    //  this.editRow.ItemId != undefined) {
    //  this.service.get("/WAM/Inventory/GetItemInventory",
    //    (data) => {
    //      this.editRow.Inventory = data;
    //    },
    //    this.inventoryFilter)
    //}

    cell.setValue(data.Code);
    //
  }

  CostCenterChanged(data) {
    this.costCenterWarehouseID = data.WarehouseID;
    this.costCenterWarehouseDescription = data.WarehouseDescription;
  //sthis.warehouseHeaderFilter = { MVTP_ID: this.typeIdWarehouse, WRHS_ID: this.insertItem.WarehouseTargetID, BRANCH_ID: data.BranchId };
  }

  PersonChanged(data) { }



  itemGridOnInitNewRow(e) {
    let max = 0;
    this.localData.forEach(element => {
      if (element.Sequence > max)
        max = element.Sequence;
    });
    e.data.Sequence = max + 1;
    //let x = Math.max(null, this.localData['Sequence']);
    console.log(e.rowIndex);
    //this.editRow.WarehouseDescription = this.insertItem.WarehouseID;
    if (this.insertItem.WarehouseID != undefined && this.insertItem.WarehouseID != null) {
      this.editRow.WarehouseId = this.insertItem.WarehouseID;
      e.data.WarehouseCode = this.insertItem.WareHouseCode;
    }
    //e.Sequence = Math.max.apply(null, this.localData.Sequence);
    //else {
    //  this.editRow.WarehouseId = this.costCenterWarehouseID;
    //  e.data.WarehouseDescription = this.costCenterWarehouseDescription;
    //  this.flgUpdateWarehouseTarget = true;
    //}

  }

  warehouseChanged(e) {
    this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId}
    this.headerWarehouseTargetFilter = { WRHS_ID: this.insertItem.WarehouseID };
    this.insertItem.WareHouseCode = e.Code;
    this.costCenterFilter = { WRHS_BRANCH_ID: e.BranchId };
  }


  warehouseTargetChanged(e) {
    this.warehouseFilter = { MVTP_ID: this.typeIdWarehouse, WRHS_ID: this.insertItem.WarehouseTargetID };
    //this.warehouseHeaderFilter = { MVTP_ID: this.typeIdWarehouse, WRHS_ID: this.insertItem.WarehouseTargetID };
    this.setWrhsHeaderFilter();
  }

  selectionChangedHandler() {
    if (this.itemSelectedKeys.length == 0) {
      this.itemSelectedKeys = {};
    }
    else if (this.itemSelectedKeys.length == 1) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.selectedRow = {};
    }
  }

  onGridItemClick(e) {
    if (e.name == "DX-MOVEMENT") {
      this.movementPopup = true;
    }
  }

  onCellChanged(data, cell) {
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemId = data.ID;
    this.warehouseFilter = { MVTP_ID: this.typeIdWarehouse, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, WRHS_ID: this.insertItem.WarehouseTargetID };
    this.warehouseTargetFilter = { MVTP_ID: this.typeIdWarehouseWIP, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, BSUN_ID: this.branchId };
    //this.warehouseWipFilter = { MVTP_ID: this.typeIdWarehouseWIP, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId };
    this.warehouseWipFilter = {BSUN_ID: this.branchId};
    this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    cell.setValue(data.Code);
  }

  onCellItemCodeChanged(data, cell) {
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemId = data.ID;
    this.warehouseTargetFilter = { MVTP_ID: this.typeIdWarehouseWIP, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId, BSUN_ID: this.branchId };
    //this.warehouseWipFilter = { MVTP_ID: this.typeIdWarehouseWIP, ITEM_ID: this.editRow.ItemId, ITTP_ID: this.editRow.ItemTypeId };
    this.warehouseWipFilter = {BSUN_ID: this.branchId};
    this.service.loadLovData("LOV-WAM-024", (dataT) => { this.lovIttp = dataT; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    this.itemTypeFilter = { TYPE_ITEM_ID: this.editRow.ItemId };
    this.setWrhsFilter();

    this.setWrhsHeaderFilter();
    this.editRow.UnitDescription = data.UnitDescription;
    this.scale = 1;
    this.commercialScale = 1;
    this.itemUnitFilter = { ITEM_ID: data.ItemId };
    console.log('this.itemUnitFilter');
    console.log(this.itemUnitFilter);
    cell.setValue(data.Code);
    //
  }

}
