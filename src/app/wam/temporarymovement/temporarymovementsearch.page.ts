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
import { Notify } from '../../shared/util/Dialog';

@Component({
  selector: 'wam-page-temporarymovementsearch',
  templateUrl: './temporarymovementsearch.page.html',
  providers: [ServiceCaller]
})

export class WAMTemporaryMovementSearchPage extends BasePage implements OnInit {
  ngOnInit() {
  }
  //@ViewChild('datagrid') dataGrid: DxDataGridComponent;
  @ViewChild('movementGrid') movementGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;

  menuItems = [
    {
      name: "Search",
      icon: "fa fa-search blue",
      text: "جستجو",
      visible: true
    },
    {
      name: "Edit",
      text: "انتخاب",
      icon: "fa fa-edit yellow",
      visible: true
    },
    {
      name: "Back",
      icon: "fa fa-arrow-left",
      text: this.translate.instant("بازگشت"),
      visible: true
    },
  ];
  //LOV
  items: any = {};
  units: any = {};
  itemUnitFilter: any = {};
  lovItemSettingFilter: any = {};
  reffrenceMovementFilter: any = { WRHS_ID: null, MVTP_ID: null };
  MovementFilter: any = { WRHS_ID: null, MVTP_ID: null };
  requestFilter: any = { WRHS_ID: null };
  movementItemFilter: any = {};
  requestItemFilter: any = {};


  itemSelectedKeys: any = [];
  selectedRow: any = {};
  editRow: any = {};
  infoPopupVisibile: boolean = false;
  refMvmnData: any = {};

  headerItem: any = {};
  dataSource: any = {};
  localData: any[] = [];
  headerItemsConfig: any = {};
  itemsLength: Number = 0;

  Name: string = null;
  type: string;
  tempType: string;
  typeId: string = Guid.empty;
  reffrenceMovementTypeID: string;
  RelationType: Number;
  ReffrenceType: Number;
  refName: string = null;
  refMovementType: string;
  filter: any = {};
  typeFilter: any = {};

  //Context Parameters
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
  flgPurOrder: boolean = false;
  flgSalOrder: boolean = false;
  flgDate: boolean = false;
  flgTextNote: boolean = false;
  flgWorkOrderVisible: boolean = false;
  flgPurchaseOrderVisible: boolean = false;
  flgSalOrderVisible: boolean = false;
  flgTextNoteVisible: boolean = false;

  flgMovementRequired: any = {};
  flgRequestRequired: any = {};

  readonly: boolean = true;

  checkQuantityCommercial: Boolean = false;
  scale: any = {};
  commercialScale: any = {};
  //filters
  //filter: any = {};
  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    //this.type = this.route.snapshot.data["type"];
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.filter.TypeCode = this.type;
    });
    this.clearForm();
    this.setContext();

    this.service.loadLovData("LOV-WAM-004", (data) => { this.items = data; }, { ITEM_ITCT_FILTER: null, ITEM_ITCT_FILTER_ALLOW: null });
    service.get("/SYS/FORMS/List", (data) => {
      this.units = data.Data;
    }, { Code: "LOV-WAM-005" });
  }
  clearForm() {
    this.headerItem = {};
    this.headerItem = { Status: 10, MovementTypeID: this.typeId };
    this.localData = [];
  }
  setContext() {
    if (this.typeId == Guid.empty) {
      this.typeFilter.Code = 131;
      debugger;
      this.service.get("/WAM/MovementType/List", (data) => {
        debugger;
        this.headerItem.MovementTypeID = data[0].ID;
        this.typeId = data[0].ID;
        this.filter.MovementTypeID = this.typeId;
        this.reffrenceMovementTypeID = data[0].ReffresnceMovementTypeID;
        this.reffrenceMovementFilter = { MVTP_ID: this.reffrenceMovementTypeID };
        //this.filter = { TypeID:}
        //
        this.MovementFilter = { MVTP_ID: this.typeId };
        this.RelationType = data[0].RelationType;
        this.ReffrenceType = data[0].ReffrenceType;
        this.setLayaoutAndValidation();
        //
        //this.movementGrid.instance.refresh();
      }, this.typeFilter)
    }
    else
      this.setLayaoutAndValidation();
  }

  setLayaoutAndValidation() {
    switch (this.RelationType) {
      case 1:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
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
      case 2:
        break;
      case 3:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
          this.flgSupplier = true;
          this.flgSupplierVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgSupplierVisible = true;
          break;
        }
      case 4:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
          this.flgCustomer = true;
          this.flgCustomerVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgCustomerVisible = true;
          break;
        }

      case 5:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
          this.flgWarehouseTarget = true;
          this.flgWarehouseTargetVisible = true;
          this.enableGeneralValues();
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          this.flgWarehouseTargetVisible = true;
          break;
        }
      case 9:
        break;
      default:
    }
    switch (this.ReffrenceType) {
      case 1:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
          this.flgRequest = true;
          this.flgRequestRequired = true;
          this.flgRequestVisible = true;
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 2:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
          this.flgMovement = true;
          this.flgMovementVisible = true;
          this.flgMovementRequired = true;
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 3:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
          this.flgPurOrder = true;
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      case 4:
        if (this.headerItem.Status == 10 && this.itemsLength == 0) {
          this.flgSalOrder = true;
          break;
        }
        if (this.headerItem.Status >= 20 || this.itemsLength > 0) {
          this.disableAllHeaderFields();
          break;
        }
      default:
    }
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
    this.flgTextNote = false;
  }
  enableGeneralValues() {
    this.flgWarehouse = true;
    this.flgDate = true;
    this.flgTextNote = true;

  }
  selectionChangedHandler() {

    if (this.itemSelectedKeys.length == 0) {
      this.itemSelectedKeys = {};
    }
    else if (this.itemSelectedKeys.length == 1) {
      this.itemSelectedKeys = this.movementGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.itemSelectedKeys = {};
    }
  }

  movementTypeChanged(data) {
    this.type = data.Code;
    this.filter.MovementTypeValueID = data.ID;
    this.typeId = Guid.empty;
    this.invisibleAllHeaderVariables();
    this.setContext();
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

  onMenuItemClick(name) {
    {
      switch (name) {
        case 'Search': {
          this.movementGrid.instance.refresh();
          //this.loadData();
          break;
        }
        case "Back": {
          this.router.navigate(["wam/temporarymovement/temporarymovement"], { queryParams: { type: this.type } });
          break;
        }

        case 'Edit': {

          var selectedID: any = this.movementGrid.instance.getSelectedRowsData()[0].ID;
          var selectedTempType: any = this.movementGrid.instance.getSelectedRowsData()[0].TempMovementTypeCode;

          console.log('selectedID');
          console.log(selectedID);
          if (selectedID == null) {
            //notify("لطفا گردش موردنظرانتخاب شود.", "error", 1000);
            Notify.error('لطفا گردش موردنظرانتخاب شود');
          }
          else {
            this.router.navigate(['wam/temporarymovement/temporarymovement'], { queryParams: { ID: selectedID, type: selectedTempType } });
          }

        }
      }
    }


  }
  onRowDbClick(e) {
     
    var selectedID: any = this.movementGrid.instance.getSelectedRowsData()[0].ID;
    debugger;
    var selectedTempType: any = this.type;//this.movementGrid.instance.getSelectedRowsData()[0].TempMovementTypeCode;

    var selectedID: any = this.movementGrid.instance.getSelectedRowsData()[0].ID;
    this.router.navigate(['wam/temporarymovement/temporarymovement'], { queryParams: { ID: selectedID, type: selectedTempType } });
}
}
