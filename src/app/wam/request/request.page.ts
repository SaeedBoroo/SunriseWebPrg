import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { Guid } from '../../shared/types/GUID';
const TEST = new WeakMap();
@Component({
  selector: 'wam-page-request',
  templateUrl: './request.page.html',
  providers: [ServiceCaller]
})
export class WAMRequestPage extends BasePage implements OnInit {
  ngOnInit() {

  }
  @ViewChild('grid') dataGrid: DxDataGridComponent;
  @ViewChild(DxValidationGroupComponent) form: DxValidationGroupComponent;


  flagSimpleMode: boolean = true;

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

  type: string;
  typeId: string = Guid.empty;
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

  //Context Parameters
  flgSupplier: boolean = false;
  flgCustomer: boolean = false;
  flgCostCenter: boolean = false;
  flgWorkOrder: boolean = false;
  flgWarehouseTarget: boolean = false;
  flgSupplierVisible: boolean = false;
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

  flgMovementRequired: any = {};
  flgRequestRequired: any = {};

  flgUpdateCode: boolean = false;
  flgUpdateWarehouse: boolean = false;

  readonly: boolean = false;

  scale: any = 0;
  commercialScale: any = 0;

  lovIttp: any = {};

  movementPopup: boolean = false;

  costCenterWarehouseID: string;
  costCenterWarehouseDescription: string;

  selectedKeys: any = [];
  selectedRow: any = {};

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
      name: "DXTag",
      icon: "fa fa-tags",
      text: this.translate.instant("SELECT_TAG"),
      visible: true
    }
  ];

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute) {
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
    TEST.set(WAMRequestPage, this);
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
        values.ProjectId = this.editRow.ProjectId;
        values.WarehouseId = this.editRow.WarehouseId;
        values.Inventory = this.editRow.Inventory;

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
        if ((this.editRow.WarehouseId != null) && (updatedItem.WarehouseId == null || (updatedItem.WarehouseId != null && updatedItem.WarehouseId != this.editRow.WarehouseId)))
          updatedItem.WarehouseId = this.editRow.WarehouseId;
        if ((this.editRow.Inventory != null) && (updatedItem.Inventory == null || (updatedItem.Inventory != null && updatedItem.Inventory != this.editRow.Inventory)))
          updatedItem.Inventory = this.editRow.Inventory;
        if ((this.editRow.ProjectId != null) && (updatedItem.ProjectId == null || (updatedItem.ProjectId != null && updatedItem.ProjectId != this.editRow.ProjectId)))
          updatedItem.ProjectId = this.editRow.ProjectId;

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
      if (params['ID'] != null) {
        var param: any = {};
        param.ID = params['ID'];
        this.service.get("/WAM/Request/List", (data) => {
          this.editRow.ID = data.ID;
          Object.assign(this.insertItem, data[0]);
          this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 2 }
          this.localData = data[0].Items;
          this.dataGrid.instance.refresh();
          this.itemsLength = this.localData.length;
          this.setContext();
          this.enableConfirm();
        }, param);
      }
      else {
        this.clearForm();
        //this.dataGrid.instance.refresh();
      }
    });

    this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })
  }

  formatProgress(ratio, value) {
    return "  (" + Math.round(ratio * 100) + "%)  " + value;
  }

  onEditorPreparingItemsGrid(e) {

    if (e.parentType === "dataRow" && (e.dataField == "ItemDescription" || e.dataField == "UnitDescription" || e.dataField == "Quantity" || e.dataField == "ItemCode" || e.dataField == "Sequence" || e.dataField == "QuantityDelivered" || e.dataField == "LocationDescription"))
      e.editorOptions.readOnly = true;

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
        this.router.navigate(["wam/request/requestsearch"], { queryParams: { type: this.type } }, );
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
        this.setContext();
        break;
        // if (this.insertItem.Status < 20)
        //   this.insertItem.Status = 20;
        // else
        //   this.insertItem.Status = 15;
        // this.saveAll();
        // this.setContext();
        // break;
      }
      //case "Confirm": {
      //    this.insertItem.Status = 20;
      //    this.saveAll();
      //    this.setContext();
      //    break;
      //}
      case 'UserInfo':
        this.infoPopupVisibile = true;
        break;
      default:
    }
  }
  clearForm() {
    this.insertItem = {};
    this.insertItem = { Status: 10, RequestTypeID: this.typeId };
    this.warehouseItemFilter = {};
    this.localData = [];
    if (this.dataGrid != undefined)
      this.dataGrid.instance.refresh();
    this.enableConfirm();
  }

  RequesttTypeChanged(data) {
    this.type = data.Code;
    this.typeId = Guid.empty;
    this.disableAllHeaderFields();
    this.invisibleAllHeaderVariables();
    this.setContext();
  }

  onCellChanged(data, cell) {
     
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemId = data.ID;
    this.warehouseFilter = { MVTP_ID: this.typeId, ITEM_ID: this.editRow.ItemId };
    this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    cell.setValue(data.Code);
  }
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
  onCellItemCodeChanged(data, cell) {
     
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemId = data.ID;
    this.editRow.UnitDescription = data.UnitDescription;
    this.warehouseFilter = { MVTP_ID: this.typeId, ITEM_ID: this.editRow.ItemId };
    this.service.loadLovData("LOV-WAM-024", (dataT) => { this.lovIttp = dataT; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    this.scale = 1;
    this.commercialScale = 1;
    this.itemUnitFilter = { ITEM_ID: data.ItemId };
    console.log('this.itemUnitFilter');
    console.log(this.itemUnitFilter);
    cell.setValue(data.Code);
    //
  }
  setCellValueOfItemCode(newData, value, currentRowData) {
     
    let that = TEST.get(WAMRequestPage);
    console.log(that.editRow);
    console.log(that.editRow);
    newData.ItemCode = value;
    newData.ItemDescription = that.editRow.ItemDescription;
    newData.UnitDescriptionCommercial = that.editRow.UnitDescriptionCommercial;
    //newData.
    newData.Inventory = that.editRow.Inventory;
    //newData.ItemDescription = 
  }



  onCellRequestItemWarehouseCode(data, cell) {
    this.editRow.WarehouseDescription = data.Code;
    this.editRow.WarehouseCode = data.Code;
    this.editRow.WarehouseId = data.ID;
    //this.editRow.BusinessUnitId = data.BusinessUnitId;
    // 
    //this.editRow.WarehouseDescription = data.Title;
    //this.editRow.WarehouseId = data.ID;

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

  setCellValueOfWarehouse(newData, value, currentRowData) {
     
    let that = TEST.get(WAMRequestPage);
    newData.WarehouseDescription = that.editRow.WarehouseDescription;
    newData.WarehouseCode = that.editRow.WarehouseCode;
    if (that.editRow.WarehouseId != Guid.empty &&
      that.editRow.WarehouseId != undefined &&
      that.editRow.ItemId != Guid.empty &&
      that.editRow.ItemId != undefined) {
      that.service.get("/WAM/Inventory/GetItemInventory",
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
     
    let that = TEST.get(WAMRequestPage);
    newData.UnitDescriptionCommercial = that.editRow.UnitDescriptionCommercial;
    newData.SecondQuantityCommercial = null;
    newData.Quantity = null;
    newData.Inventory = that.editRow.Inventory;
  }
  setCellValueOfSecondQuantityCommercial(newData, value, currentRowData) {
     
    let that = TEST.get(WAMRequestPage);
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
          ItemId: t.ItemId,
          PurchaseOrderItemId: t.PurchaseOrderItemId,
          //RefMovementItemId: t.RefMovementItemId,
          SaleOrderItemId: t.SaleOrderItemId,
          UnitId: t.UnitId,
          TextNote: t.TextNote,
          ItemTypeId: t.ItemTypeId,
          ProjectId: t.ProjectId,
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
          ItemId: t.ItemId,
          PurchaseOrderItemId: t.PurchaseOrderItemId,
          SaleOrderItemId: t.SaleOrderItemId,
          UnitId: t.UnitId,
          TextNote: t.TextNote,
          ItemTypeId: t.ItemTypeId,
          ProjectId: t.ProjectId,
        }));
      //Delete
      this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
      var Items: any = {};
      Items.InsertedItems = detailInsert;
      Items.UpdatedItems = detailUpdate;
      Items.DeletedItems = detailDelete;
      param.Items = Items;
      this.service.post("/WAM/Request/Save", (data) => {
        this.insertItem = data;
        this.localData = data.Items;
        this.dataGrid.instance.refresh();
        this.itemsLength = this.localData.length;
        this.setContext();
        this.enableConfirm();
        this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 2 }
        //this.requestItemFilter = { RequestID: this.insertItem.RequestID }
        //this.saveParams = { MovementId: this.insertItem.ID }
        //this.loadParams = { MovementId: this.insertItem.ID }
        notify({
          message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
          type: "success",
          width: 400
        });
      }, param);
    }
  }
  //enableConfirm() {
  //    if (this.insertItem.Status >= 20 || this.insertItem.ID == Guid.empty || this.insertItem.ID == null)
  //        this.menuItems[3].disabled = true;
  //    else
  //        this.menuItems[3].disabled = false;
  //}
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
    if (this.typeId == Guid.empty) {
      this.typeFilter.Code = this.type;
      this.service.get("/WAM/MovementType/List", (data) => {
        //this.insertItem.RequestTypeID = data[0].RequestTypeID;
        this.typeId = data[0].ID;
        //this.warehouseFilter = { MVTP_ID: this.typeId };
        this.warehouseFilter = { MVTP_ID: this.typeId, ITEM_ID: this.editRow.ItemId };
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
    this.readonly = true;
  }
  invisibleAllHeaderVariables() {
    this.flgSupplierVisible = false;
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
    if (this.insertItem.ID == Guid.empty || this.insertItem.ID == undefined)
      this.readonly = false;
    else
      this.readonly = true;
  }

  onGridWarehouseItemMenuClick(e) {
    if (e.name == "DXInsert") {
      this.flgUpdateCode = false;
      //this.flgUpdateWarehouse = false;
      if (this.insertItem.WarehouseID != Guid.empty && this.insertItem.WarehouseID != undefined)
        this.flgUpdateWarehouse = true;
      else
        this.flgUpdateWarehouse = false;
      if (this.insertItem.Status >= 20) {
        notify({
          message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          type: "error",
          width: 400
        });
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
      this.disableAllHeaderFields();
    }
    if (e.name == 'DXEdit') {
      this.flgUpdateCode = true;
      this.flgUpdateWarehouse = true;
      //if (this.insertItem.WarehouseID != Guid.empty && this.insertItem.WarehouseID != undefined)
      //  this.flgUpdateWarehouse = true;
      //else
      //  this.flgUpdateWarehouse = false;
      //this.flgUpdateCode = true;
      this.itemUnitFilter = { ITEM_ID: e.data.ItemId };
      console.log('this.editRow');
      console.log(this.editRow);
      if (this.insertItem.Status >= 20) {
        notify({
          message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          type: "error",
          width: 400
        });
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXDelete") {
      if (this.insertItem.Status >= 20) {
        notify({
          message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          type: "error",
          width: 400
        });
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DXSelectedDelete") {
      if (this.insertItem.Status >= 20) {
        notify({
          message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
          type: "error",
          width: 400
        });
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    if (e.name == "DX-MOVEMENT") {
      this.movementPopup = true;
    }
  }

  onCanceledItemRowGrid(e) {
     
    this.editRow = {};
  }
  enableHeader(e) {
     
    if (this.dataGrid.instance.totalCount() == 0)
      this.setLayaoutAndValidation();
  }
  onCellWarehouseItemCodeChanged(data, cell) {
     
    this.editRow.ItemDescription = data.Description;
    this.editRow.ItemId = data.ID;
    this.editRow.UnitId = data.UnitID;
    this.editRow.UnitDescriptionCommercial = data.UnitDescription;
     
    this.warehouseFilter = { MVTP_ID: this.typeId, ITEM_ID: this.editRow.ItemId };
    this.service.loadLovData("LOV-WAM-024", (dataT) => { this.lovIttp = dataT; }, { TYPE_ITEM_ID: this.editRow.ItemId })
    this.scale = 1;
    this.commercialScale = 1;
    this.itemUnitFilter = { ITEM_ID: data.ID };
    this.inventoryFilter = {
      WarehouseID: this.editRow.WarehouseId,
      ItemId: this.editRow.ItemId,
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
  }

  itemGridOnInitNewRow(e) {
    let max = 0;
    this.localData.forEach(element => {
      if (element.Sequence > max)
        max = element.Sequence;
    });
    e.data.Sequence = max + 1;
    //this.editRow.WarehouseDescription = this.insertItem.WarehouseID;
    if (this.insertItem.WarehouseID != undefined && this.insertItem.WarehouseID != null) {
      this.editRow.WarehouseId = this.insertItem.WarehouseID;
      e.data.WarehouseCode = this.insertItem.WareHouseCode;
    }
    else {
      this.editRow.WarehouseId = this.costCenterWarehouseID;
      e.data.WarehouseDescription = this.costCenterWarehouseDescription;
    }

  }

  warehouseChanged(e) {
    this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 2 }
  }

  selectionChangedHandler() {
    if (this.selectedKeys.length == 0) {
      this.selectedKeys = {};
    }
    else if (this.selectedKeys.length == 1) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.selectedRow = {};
    }
  }

  setStatus() {
    var result = this.form.instance.validate();
    if (result.isValid) {

      this.service.post("/WAM/Requset/SetStatus", (data) => {
        this.insertItem = data;
        this.localData = data.Items;
        this.dataGrid.instance.refresh();
        this.itemsLength = this.localData.length;
        this.setContext();
        this.enableConfirm();
        this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 2 }
        //this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 }
        //this.requestItemFilter = { RequestID: this.insertItem.RequestID }
        //this.saveParams = { MovementId: this.insertItem.ID }
        //this.loadParams = { MovementId: this.insertItem.ID }
        notify({
          message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
          type: "success",
          width: 400
        });
      }, this.insertItem);
    }
  }

  onProjectChanged(data, cell) {
    this.editRow.ProjectName = data.Title;
    this.editRow.ProjectId = data.ID;
    cell.setValue(data.Title);
  }

}
