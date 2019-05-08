import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { Guid } from '../../shared/types/GUID';
import { Notify } from '../../shared/util/Dialog';
import { DXLovComponent } from '../../shared/components/dx-lov.component';
import { DemisPopupService } from '../../shared/components/popup/demis-popup-service';
import { AssignItemWarehousePage } from './assignitemwarehouse.page';
import { WAMItemGroupLovPage } from '../itemgroup/itemgroupTreeLov.page';
import { WAMWarehouseLocationPage } from '../warehouselocation/warehouselocation.page';
import { DefinitionCategories } from '../categories/DefinitionCategories.page';


@Component({
  selector: 'wam-page-item',
  templateUrl: './item.page.html'
})
export class WAMItemPage extends BasePage implements OnInit {

  ngOnInit() {

  }
  @ViewChild('versionListGrid') versionListGrid: DxDataGridComponent;
  @ViewChild('unitsGrid') unitsGrid: DxDataGridComponent;
  @ViewChild('locationGrid') locationGrid: DxDataGridComponent;
  @ViewChild('typeGrid') typeGrid: DxDataGridComponent;
  @ViewChild('ItemInProdGrid') ItemInProdGrid: DxDataGridComponent;
  @ViewChild('businesUnitGrid') businesUnitGrid: DxDataGridComponent;
  @ViewChild('catalogueGrid') catalogueGrid: DxDataGridComponent;//
  @ViewChild('searchDataGrid') searchDataGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;
  @ViewChild('fastSearchLov') fastSearchLov: DXLovComponent;
  @ViewChild('InventoryWarehouseGrid') InventoryWarehouseGrid: DxDataGridComponent;

  menuItems: any[] = [
    {
      name: "New",
      icon: "fa fa-plus green",
      // text: this.translate.instant("NEW"),
      visible: true,
      disabled: false
    },
    {
      name: "Save",
      icon: "fa fa-floppy-o green",
      //  text: this.translate.instant("SAVE"),
      visible: true,
      disabled: false
    },


    {
      name: "Search",
      icon: "fa fa-search",
      tooltip: this.translate.instant("PUB_SEARCH"),
      visible: true,
      disabled: false,
      items: [
        {
          name: "FastSearch",
          icon: "fa fa-bolt",
          text: this.translate.instant("PUB_FAST_SEARCH"),
          visible: true,
          disabled: false
        },
        {
          name: "AdvanceSearch",
          icon: "fa fa-tasks",
          text: this.translate.instant("ADVANCED_SEARCH"),
          visible: true,
          disabled: false
        }
      ]
    },
    {
      name: "OtherOprations",
      text: this.translate.instant('PUB_OTHER_CASES'),
      icon: "fa fa-bars",
      visible: true,
      disabled: false,
      items: [
        {
          name: "AssignUnit",
          icon: "fa fa-sitemap blue",
          text: this.translate.instant("WAM_BUSINESS_UNIT"),
          visible: true,
          disabled: false
        },
        {
          name: "Location",
          icon: "fa fa-map-marker blue",
          text: this.translate.instant("WAM_LOCATION"),
          visible: true,
          disabled: false
        }
        ,
        {
          name: "Type",
          icon: "fa fa-list-ol red",
          text: this.translate.instant("WAM_ITEM_TYPE"),
          visible: true,
          disabled: false
        }
        ,
        {
          name: "VersionList",
          text: this.translate.instant("BOM_VERSION_LIST"),
          icon: "fa fa-list-ul red",
          visible: true,
          disabled: false

        }
        ,
        {
          name: "SerialPrameters",
          text: this.translate.instant("WAM_SERIAL_PARAMETERS"),
          icon: "fa fa-arrow-circle-down",
          visible: true

        }
        ,
        {
          name: "AssignToWarehouse",
          text: this.translate.instant("Assign_Warehouse"),
          icon: "fa fa-arrow-circle-down",
          visible: true

        },
        {
          name: "ItemInProd",
          text: this.translate.instant("WAM_ITEM_IN_PROD"),
          icon: "fa fa-info-circle green",
          visible: true

        },
        {
          name: "ItemInventoryWarehouse",
          text: this.translate.instant("WAM_INVENTORY_WAREHOUSE"),
          icon: "fa fa-info-circle green",
          visible: true

        }
      ]
    }

  ];

  tabItems = [
    {
      id: 0,
      text: this.translate.instant("WAM_ITEM_UNITS"),
      icon: "fa fa-balance-scale",

    },
    {
      id: 1,
      text: this.translate.instant("WAM_ITEM_CATALOGUES"),
      icon: "fa fa-id-card",
    },
  ]
  versionsGridItems = [
    {
      name: "Attachments",
      icon: "fa fa-upload blue",
      text: this.translate.instant("BOM_ATTACHMENTS"),
      visible: true,
    },
    {
      name: "ShowAttachments",
      icon: "fa fa-eye",
      text: this.translate.instant("PUB_VIEW_ATTACH"),
      visible: true,
    }
  ];
  //LOV
  codeType: any = {};
  method: any = {};
  units: any = {};
  parameters: any = {};
  patternParameterFilter: any = {};
  patternId: string;
  serialPatternId: string;
  patternFlag: boolean = false;
  code: string = "";
  code1: string = "";
  //LovFilter
  categoryFilter: any = {};
  catalogueFilter: any = {};
  CmmUnitFilter: any = {};
  //Variables
  selectedTab = 0;
  revisionStatusLov: any = {};
  showVersionPopup: boolean = false;
  versionGridMode: any = {};
  loadVersionListGrid: any = {};
  selectedKeys: any = [];
  typeSelectedKeys: any = [];
  unitSelectedKeys: any = [];
  versionSelectedKeys: any = [];
  unitSelectedRow: any = {};
  searchSelectedKeys: any = [];
  searchSelectedRow: any = {};
  itemRevisionsParams: any = {};
  setItemPatternPopup = false;
  setSerialPatternPopup = false;
  infoPopupVisibile: boolean = false;
  selecPatterntButton: string = this.translate.instant("WAM_PATTERN_SELECT");
  readonly: boolean = false;
  patternType: boolean = true;
  catalogueLength: Number = 4;
  revisionReadOnly: boolean;
  businessUnitPopup: boolean = false;
  locationPopup: boolean = false;
  typePopup: boolean = false;
  ItemInProdPopup: boolean = false;
  ItemInvWarehousePopup: boolean = false;
  //DataCotainers
  headerItem: any = {};
  unitDataSource: any = {};
  catalogueDataSource: any = {};
  unitLocalData: any[] = [];
  catalogueLocalData: any[] = [];
  filter: any = {};
  popupFilter: any = {};
  patternFilter: any = {};
  serialPatternFilter: any = {};
  editRow: any = {};
  model: any = {};
  patternValues: any = [];
  serialPatternValues: any = [];
  saveLoadParams: any = {};
  locationSaveLoadParams: any = {};
  typeSaveLoadParams: any = {};
  ItemInProdParam: any = {};
  InventoryWarehouseParam: any = {};
  allMain: boolean = true;

  formConfig: any = {};

  flagSimpleMode: boolean = true;

  //..
  constructor(public service: ServiceCaller, private popup: DemisPopupService, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    //
    let Config: any = {};
    Config.ConfigMode = 1;
    Config.key = 'WAM_FLG_SIMPLE_MODE';
    this.service.getPromise("/ADM/Config/List", Config).then((data) => {
      if (data == 0)
        this.flagSimpleMode = false;
      else if (data == 1)
        this.flagSimpleMode = true;
      this.menuItems[3].visible = !this.flagSimpleMode;
      //this.menuItems[5].visible = !this.flagSimpleMode;
      //this.menuItems[6].visible = !this.flagSimpleMode;
      //this.menuItems[7].visible = !this.flagSimpleMode;
    });


    this.route.queryParams.subscribe(params => {
      this.filter.ItemId = params['itemID'];
      //this.headerItem.code = params['code'];
    });
    this.formConfig.searchPanel = false;//!this.formConfig.searchPanel;
    if (this.filter.ItemId != null)
      this.loadData();
    this.setMenuItems();
    this.unitDataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.unitLocalData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.unitLocalData.filter(c => c.ID == key)[0];
        updatedItem.Flag = 2;
        Object.assign(updatedItem, values);
        deferred.resolve(true);
        return deferred.promise;
      },
      insert: (values) => {
        var detailInsert: any = [];
        let deferred: Deferred<any> = new Deferred<any>();
        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;
        Object.assign(values, { Flag: 1 }) as any;
        this.unitLocalData.push(values);
        deferred.resolve(true);
        return deferred.promise;
      }
      , remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.unitLocalData.filter(c => c.ID == key)[0].Flag = 3;
        deferred.resolve(this.unitLocalData.filter(s => s.Flag != 3));
        return deferred.promise;
      }
    });
    this.catalogueDataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.catalogueLocalData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.catalogueLocalData.filter(c => c.ID == key)[0];
        updatedItem.Flag = 2;
        if (updatedItem.CatalogueElementId == null)
          updatedItem.CatalogueElementId = this.editRow.CatalogueElementId;
        if (updatedItem.MeasurementUnitId == null)
          updatedItem.MeasurementUnitId = this.editRow.MeasurementUnitId;
        Object.assign(updatedItem, values);
        deferred.resolve(true);
        return deferred.promise;
      },
      insert: (values) => {
        var detailInsert: any = [];
        let deferred: Deferred<any> = new Deferred<any>();
        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;
        Object.assign(values, { Flag: 1 }) as any;
        values.CatalogueElementId = this.editRow.CatalogueElementId;
        values.MeasurementUnitId = this.editRow.MeasurementUnitId;
        this.catalogueLocalData.push(values);
        deferred.resolve(true);
        return deferred.promise;
      }
      , remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.catalogueLocalData.filter(c => c.ID == key)[0].Flag = 3;
        deferred.resolve(this.catalogueLocalData.filter(s => s.Flag != 3));
        return deferred.promise;
      }
    });

    this.route.queryParams.subscribe(params => {
    });
    this.headerItem.IsActive = true;

    //LOV
    this.categoryFilter = { ITCT_FILTER: null };
    this.service.loadLovData("LOV-WAM-005", (data) => { this.units = data; });
    service.get("/SYS/FORMS/List", (data) => {
      this.revisionStatusLov = data.Data;
    }, { Code: "LOV-WAM-028" });
  }
  refreshVersionListGrid() {
    if (this.versionListGrid != undefined && this.versionListGrid.instance != undefined)
      this.versionListGrid.instance.refresh();
  }
  refreshItemInProdGrid() {
    if (this.ItemInProdGrid != undefined && this.ItemInProdGrid.instance != undefined)
      this.ItemInProdGrid.instance.refresh();
  }

  refreshInventoryWarehouseGrid() {
    if (this.InventoryWarehouseGrid != undefined && this.InventoryWarehouseGrid.instance != undefined)
      this.InventoryWarehouseGrid.instance.refresh();
  }

  onEditorPreparingVersionsGrid(e) {
    if (e.parentType === "dataRow") {
      if (e.dataField == "ItemRevisionDate" && this.versionGridMode == "edit") {
        e.editorOptions.readOnly = true;
        this.revisionReadOnly = true;
      }
      if (e.dataField == "RevisionStatus")
        e.editorOptions.readOnly = true;
    }


  }
  onEditorPreparingTypeGrid(e) {


  }

  versionGridOnInitNewRow(e) {
    e.data.RevisionStatus = 10;
    e.data.ItemRevisionNum = this.versionListGrid.instance.totalCount() + 1;

  }
  typeGridOninitNewRow(e) {

    e.data.Code = this.typeGrid.instance.totalCount() + 1;
  }
  onVersionListReturnClick() {
    this.showVersionPopup = false;
  }
  onConfirmVersionClick(cell, e) {

    if (this.headerItem.bomAbleFlag)
      Notify.error("WAM_THIS_OPRATION_ONLY_IN_STRUCTURE_FORM");
    else
      if (cell.data.RevisionStatus != 10)
        Notify.error('MRP_MPS_ONLY_CREATE_VERSION_CAN_CONFIRM');
      else {
        let param = Object.assign({}, cell.data);
        param.RevisionStatus = 30;
        this.service.post("/WAM/ItemRevision/Save",
          (data) => {
            Notify.success('PUB_ACTION_SUCCESS_MSG');
            this.refreshVersionListGrid();
          },
          param);
      }
  }

  onVersionGridClick(e) {
    if (this.headerItem.bomAbleFlag)
      if (e.name == "DXSelectedDelete" || e.name == "DXInsert" || e.name == 'DXEdit' || e.name == 'DXDelete' || e.name == 'Attachments') {
        e.handled = true;
        Notify.error("WAM_THIS_OPRATION_ONLY_IN_STRUCTURE_FORM");
      }
      else {
        if (e.name == "DXInsert") {
          this.versionGridMode = "insert";
        }

        if (e.name == 'DXEdit') {

          this.versionGridMode = "edit";
        }
        if (e.name == 'DXDelete') {
          if (e.data.RevisionStatus == 30) {
            e.handled = true;
            Notify.error("BOM_DELETE_ONLY_IN_CREATE_MODE");

          }
        }
        //if (e.name == 'Attachments') {
        //  if (e.data.RevisionStatus == 30) {
        //    Notify.error("BOM_DELETE_ONLY_IN_CREATE_MODE");

        //  }
        //  else {
        //    this.updateVersionListGrid.ID = e.data.ID;
        //    this.ShowStructureVersionAtachment = true;
        //  }
        //}
        //if (e.name == 'ShowAttachments') {
        //  this.onStructureMapClick();
        //}
      }
  }
  onTypeGridItemClick(e) {

    if (e.data != undefined && e.data.Code != undefined && (e.name == "DXSelectedDelete" || e.name == 'DXEdit' || e.name == 'DXDelete')) {
      if (e.data.Code == '0') {
        e.handled = true;
        // e.editorOptions.readOnly = true;
        Notify.error("WAM_CANNOT_EDIT_DEFAULT_TYPE");
      }
    }

  }
  setVisibleCulumns(e) {

  }
  setContextParameters() {
    this.patternFilter.businessUnitID = this.branchId;
    this.patternFilter.CodeType = 1;
    this.serialPatternFilter.businessUnitID = this.branchId;
    this.serialPatternFilter.CodeType = 2;
    if (this.patternFilter.categoryID == null)
      this.patternType = true;
    else {

      this.service.get("/WAM/CodingPattern/List", (data) => {
        debugger
        if (data.ID != Guid.empty || data.ID != null) {
          if (data[0].Status != 20 && (this.headerItem.ID == Guid.empty || this.headerItem.ID == null)) {
            Notify.error('WAM_CONFIRM_PATTERN');
            this.patternFlag = false;
            this.catalogueLength = 4;
            this.patternType = true;
          }
          else if (data[0].Status == 20) {
            this.patternFlag = true;
            if (data[0].Method == 1) {//manual
              this.patternFlag = false;
              this.catalogueLength = 4;
              if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null)
                this.patternType = false;
              else
                this.patternType = true;

            }
            else if (data[0].Method == 2) {//pattern
              // this.patternFlag = true;
              // this.catalogueLength = 2;
              // this.patternType = true;
              this.allMain = true;
              data[0].Details.forEach(element => {
                if (!element.MainFlag) {
                  this.allMain = false;
                }
              });
              if (this.allMain) {
                this.patternFlag = false;
                this.catalogueLength = 4;
                this.patternType = true;
              }
              else {
                this.patternFlag = true;
                this.catalogueLength = 2;
                this.patternType = true;
              }
            }
            else if (data[0].Method == 4) {
              this.allMain = false;
              this.patternFlag = false;
              this.catalogueLength = 4;
              this.patternType = true;
              debugger
              this.service.post("/WAM/Item/CreateCodeSerial", (data) => {
                
                this.code = data;
              }, data[0]);

            }
            this.patternId = data[0].ID;
          }
        }
        else {
          //this.patternFlag = true;
          this.patternType = true;
        }
      }, this.patternFilter);

      this.service.get("/WAM/CodingPattern/List", (data) => {
        if (data.ID != Guid.empty || data.ID != null) {
          if (data[0].Status == 20) {
            if (data[0].Method == 2) {//pattern            

            }
            this.serialPatternId = data[0].ID;
          }
        }
        else {
          //this.patternFlag = true;
          this.patternType = true;
        }
      }, this.serialPatternFilter);
    }

  }

  setMenuItems() {
    if (this.headerItem.ID == null || this.headerItem.ID == Guid.empty || this.headerItem.ID == undefined) {
      this.menuItems[3].disabled = true;
      //this.menuItems[5].disabled = true;
      //this.menuItems[6].disabled = true;
      //this.menuItems[7].disabled = true;
    }
    else {
      this.menuItems[3].disabled = false;
      //this.menuItems[5].disabled = false;
      //this.menuItems[6].disabled = false;
      //this.menuItems[7].disabled = false;
    }
  }

  categoryChanged(data) {
    //this.code = this.headerItem.Code;
    //this.patternFilter.businessUnitID = this.branchId;
    //this.patternFilter.CodeType = 1;
    //console.log('this.code');
    //console.log(this.code);
    debugger
    if (data.Code == 51 || data.Code == 52) {
      this.headerItem.bomAbleFlag = true;
      this.formConfig.bomAbleReadOnly = true;
    }
    else
      this.formConfig.bomAbleReadOnly = false;
    this.headerItem.CategoryName = data.Title;
    this.patternFilter.categoryID = data.ID;
    this.serialPatternFilter.categoryID = data.ID;
    if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null) {
      this.code = null;
      this.headerItem.UnitScale = 1;
    }
    this.setContextParameters();
    //  console.log('this.code');
    // console.log(this.code);
  }

  groupChanged(data) {
    //this.code = this.headerItem.Code;
    //this.patternFilter.businessUnitID = this.branchId;
    //this.patternFilter.CodeType = 1;
    //console.log('this.code');
    //console.log(this.code);
    this.headerItem.GroupCode = data.Code;
    //if (this.headerItem.ID != null && this.headerItem.ID != undefined) {
    //  this.headerItem.CatalogueId = data.CatalogueId;
    //  this.headerItem.MeasurementUnitCommercialId = data.MeasurmentId;
    //  this.headerItem.MeasurementUnitlId = data.MeasurmentId;
    //}
    //this.patternFilter.categoryID = data.ID;
    //this.setContextParameters();
    //this.code = null;
    //console.log('this.code');
    //console.log(this.code);
  }

  onBusinessUnitCodeChanged(data, cell) {
    this.saveLoadParams.BusinessUnitName = data.Title;
    this.saveLoadParams.BusinessUnitId = data.ID;
    cell.setValue(data.Title);
  }

  onLocationChanged(data, cell) {
    this.locationSaveLoadParams.LocationDescription = data.Title;
    this.locationSaveLoadParams.LocationID = data.ID;
    cell.setValue(data.Title);
  }

  clearForm() {
    this.headerItem = { CategoryId: null, GroupId: null, CatalogueId: null };
    this.headerItem.IsActive = true;
    this.code = null;
    this.unitLocalData = [];
    this.catalogueLocalData = [];
    this.patternValues = [];
    this.refreshUnitGrid();
    //this.readonly = false;
    this.patternFlag = false;
    this.selecPatterntButton = this.translate.instant("WAM_PATTERN_SELECT");
    this.patternType = true;//
    this.filter.ItemId = null;
    this.setMenuItems();
  }
  onMenuItemClick(name) {
    switch (name) {
      case "New": {

        this.clearForm();
        break;
      }
      case "Edit": {
        break;
      }
      case "AdvanceSearch": {
        this.router.navigate(["wam/coding/itemsearch"]);
        break;
      }

      case "FastSearch": {
        //this.formConfig.itemSearchVisible = true;

        this.fastSearchLov.show();
        break;
      }

      case "Copy": {
        //this.router.navigate(["htl/pricelist/contractreports"], { queryParams: { copy: 1 } });
        break;
      }
      case "AssignUnit": {
        this.saveLoadParams.ItemId = this.headerItem.ID;
        this.businessUnitPopup = true;
        break;
      }
      case "Location": {

        this.locationSaveLoadParams.ItemID = this.headerItem.ID;
        this.locationPopup = true;
        break;
      }
      case "Type": {
        this.typeSaveLoadParams.ItemId = this.headerItem.ID;
        this.typePopup = true;
        break;
      }
      case "Save": {
        if (this.allMain && this.patternType && (this.headerItem.ID == null || this.headerItem.ID == Guid.empty || this.headerItem.ID == undefined))
          this.bindData();
        else
          this.savell();
        break;
      }
      case "VersionList": {
        this.loadVersionListGrid.ItemId = this.headerItem.ID;
        this.refreshVersionListGrid();
        this.showVersionPopup = true;
        break;
      }
      case "ItemInProd": {
        this.ItemInProdParam.ItemId = this.headerItem.ID;
        debugger;
        this.refreshItemInProdGrid();
        this.ItemInProdPopup = true;
        break;
      }
      case "ItemInventoryWarehouse": {
        this.InventoryWarehouseParam.ItemID = this.headerItem.ID;
        this.refreshInventoryWarehouseGrid();
        this.ItemInvWarehousePopup = true;
        break;
      }

      case 'UserInfo':
        this.infoPopupVisibile = true;
        break;
      case 'SerialPrameters':
        this.setSerialPatternPopup = true;
        break;
      case "AssignToWarehouse":
        this.popup.open(AssignItemWarehousePage, {
          width: '900',
          height: '600',
          title: 'تخصیص به انبار',
          data: { entityId: this.headerItem.ID },
        }).then(res => {


        })
        break;
    }

  }

  savell() {
    var result = this.form.instance.validate();
    if (result.isValid) {
      this.headerItem.Code = this.code;
      var param = this.headerItem;
      var unitDetailInsert: any = [];
      var unitDetailUpdate: any = [];
      var unitDetailDelete: any = [];

      var catalogueDetailInsert: any = [];
      var catalogueDetailUpdate: any = [];
      var catalogueDetailDelete: any = [];
      /////////////////////UNIT///////////////////////////////////////////////////////////////////////////////////              
      //Insert
      this.unitLocalData.filter(i => i.Flag == 1).forEach(t =>
        unitDetailInsert.push({
          CommercialScale: t.CommercialScale,
          Scale: t.Scale,
          Automatic: t.Automatic,
          MeasurementUnitId: t.MeasurementUnitId
        }));
      //Update
      this.unitLocalData.filter(i => i.Flag == 2).forEach(t =>
        unitDetailUpdate.push({
          ID: t.ID,
          CommercialScale: t.CommercialScale,
          Scale: t.Scale,
          Automatic: t.Automatic,
          MeasurementUnitId: t.MeasurementUnitId
        }));
      //Delete
      this.unitLocalData.filter(i => i.Flag == 3).forEach(t => unitDetailDelete.push(t.ID));
      var ItemUnits: any = {};
      ItemUnits.InsertedItems = unitDetailInsert;
      ItemUnits.UpdatedItems = unitDetailUpdate;
      ItemUnits.DeletedItems = unitDetailDelete;
      param.Units = ItemUnits;
      /////////////////////Catalogue///////////////////////////////////////////////////////////////////////////////////
      //Insert
      this.catalogueLocalData.filter(i => i.Flag == 1).forEach(t =>
        catalogueDetailInsert.push({
          MeasurementUnitId: t.MeasurementUnitId,
          CatalogueElementId: t.CatalogueElementId,
          DisplaySequence: t.DisplaySequence,
          PrintSequence: t.PrintSequence,
          BaseValue: t.BaseValue,
          FormalValue: t.FormalValue,
          MaximumValue: t.MaximumValue,
          MinimumValue: t.MinimumValue,
          DisableDate: t.DisableDate,
          EffevtivityDate: t.EffevtivityDate,
          Description: t.Description,
          PrintFlag: t.PrintFlag,
          FlagDesLatin: t.FlagDesLatin
        }));

      //Update
      this.catalogueLocalData.filter(i => i.Flag == 2).forEach(t =>
        catalogueDetailUpdate.push({
          ID: t.ID,
          MeasurementUnitId: t.MeasurementUnitId,
          CatalogueElementId: t.CatalogueElementId,
          DisplaySequence: t.DisplaySequence,
          PrintSequence: t.PrintSequence,
          BaseValue: t.BaseValue,
          FormalValue: t.FormalValue,
          MaximumValue: t.MaximumValue,
          MinimumValue: t.MinimumValue,
          DisableDate: t.DisableDate,
          EffevtivityDate: t.EffevtivityDate,
          Description: t.Description,
          PrintFlag: t.PrintFlag,
          FlagDesLatin: t.FlagDesLatin
        }));
      //Delete
      this.catalogueLocalData.filter(i => i.Flag == 3).forEach(t => catalogueDetailDelete.push(t.ID));
      var ItemCatalogues: any = {};
      ItemCatalogues.InsertedItems = catalogueDetailInsert;
      ItemCatalogues.UpdatedItems = catalogueDetailUpdate;
      ItemCatalogues.DeletedItems = catalogueDetailDelete;
      param.Elements = ItemCatalogues;
      /////////////////////Pattern///////////////////////////////////////////////////////////////////////////////////
      //Insert
      //this.catalogueLocalData.filter(i => i.Flag == 1).forEach(t =>
      //    catalogueDetailInsert.push({
      //        MeasurementUnitId: t.MeasurementUnitId,
      //        CatalogueElementId: t.CatalogueElementId,
      //        DisplaySequence: t.DisplaySequence,
      //        PrintSequence: t.PrintSequence,
      //        BaseValue: t.BaseValue,
      //        FormalValue: t.FormalValue,
      //        MaximumValue: t.MaximumValue,
      //        MinimumValue: t.MinimumValue,
      //        DisableDate: t.DisableDate,
      //        EffevtivityDate: t.EffevtivityDate,
      //        Description: t.Description,
      //        PrintFlag: t.PrintFlag,
      //    }));

      ////Update
      //this.catalogueLocalData.filter(i => i.Flag == 2).forEach(t =>
      //    catalogueDetailUpdate.push({
      //        ID: t.ID,
      //        MeasurementUnitId: t.MeasurementUnitId,
      //        CatalogueElementId: t.CatalogueElementId,
      //        DisplaySequence: t.DisplaySequence,
      //        PrintSequence: t.PrintSequence,
      //        BaseValue: t.BaseValue,
      //        FormalValue: t.FormalValue,
      //        MaximumValue: t.MaximumValue,
      //        MinimumValue: t.MinimumValue,
      //        DisableDate: t.DisableDate,
      //        EffevtivityDate: t.EffevtivityDate,
      //        Description: t.Description,
      //        PrintFlag: t.PrintFlag,
      //    }));
      ////Delete
      //this.catalogueLocalData.filter(i => i.Flag == 3).forEach(t => catalogueDetailDelete.push(t.ID));
      var ItemPatternValues: any = {};
      ItemPatternValues.InsertedItems = this.patternValues;
      var SerialPatternValues: any = {};
      SerialPatternValues.InsertedItems = this.serialPatternValues;
      param.PatternValues = ItemPatternValues;
      param.SerialPatternValues = SerialPatternValues;
      //////////////////////////////////////////////////////////////////////////
      this.service.post("/WAM/Item/Save", (data) => {
        
        if (data != null) {
          this.headerItem = data;
          this.unitLocalData = data.Units;
          this.catalogueLocalData = data.Elements;
          this.refreshUnitGrid();
          this.refreshcatalougeGrid();
          //this.readonly = true;
          this.patternType = true;
          this.selecPatterntButton = this.translate.instant("WAM_PATTERN_VIEW");
          this.setMenuItems();
          //this.localData = data[0].Items;
        }
        else {
          //this.readonly = false;
          this.selecPatterntButton = this.translate.instant("WAM_PATTERN_SELECT");
        }
        //notify({
        //  message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
        //  type: "success",
        //  width: 400
        //});
        this.clearForm();
        Notify.success('PUB_ACTION_SUCCESS_MSG');
      }, param);

    }
  }
  onCancelLocationPopup() {
    this.locationPopup = false;
  }

  onCancelTypePopup() {
    this.typePopup = false;
  }

  onCancelUnitPopup() {
    this.businessUnitPopup = false;
  }

  onGridItemClick(e) {
    if (this.unitSelectedRow.Automatic && (e.name == "DXEdit" || e.name == "DXDelete")) {
      //alert("امکان یه روز رسانی ماغیرهای سیستمی وجود ندارد");
      //notify({
      //  message: this.translate.instant("WAM_SYSTEM_PARAMETER_MSG"),
      //  type: "error",
      //  width: 400
      //});
      Notify.error('WAM_SYSTEM_PARAMETER_MSG');
      e.handled = true;
    }

    else if (e.name == 'DXDelete' || e.name == 'DXSelectedDelete') {
      Notify.error('PUB_CLICK_ON_SAVE_TO_PERMANENT_DELETE');
    }


  }
  onGridCatalougeClick(e) {
    if (e.name == 'DXDelete' || e.name == 'DXSelectedDelete') {
      Notify.error('PUB_CLICK_ON_SAVE_TO_PERMANENT_DELETE');
    }

  }

  itemInserted() {

    this.onMenuItemClick("Save");
  }
  unitSelectionChangedHandler() {
    if (this.unitSelectedKeys.length == 1) {
      this.unitSelectedRow = this.unitsGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.unitSelectedRow = {};
    }
  }

  onRowDbClick(e) {

    this.searchSelectedRow = e;
    this.filter.ItemId = e.ID;
    this.loadData();
    this.formConfig.itemSearchVisible = false;
  }

  loadData() {
    this.service.getPromise("/WAM/Item/List", this.filter).then((data) => {
      if (data[0] != null) {
        this.headerItem = data[0];
        this.code = this.headerItem.Code;
        this.catalogueFilter = { CatalogueId: this.headerItem.CatalogueId };
        if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null) {
          //this.readonly = false;
          this.selecPatterntButton = this.translate.instant("WAM_PATTERN_SELECT");
        }
        else {
          //this.readonly = true;
          //this.patternType = true;
          this.selecPatterntButton = this.translate.instant("WAM_PATTERN_VIEW");
        }
        this.unitLocalData = data[0].Units;
        this.catalogueLocalData = data[0].Elements;
        this.refreshUnitGrid();
        this.refreshcatalougeGrid();
        this.patternValues = data[0].PatternValues;
        this.serialPatternValues = data[0].SerialPatternValues;
        this.setMenuItems();
        this.setBomAble();
        //
      }
      else this.clearForm();
    }, this.filter);
  }
  refreshcatalougeGrid() {
    if (this.catalogueGrid != undefined && this.catalogueGrid.instance != undefined)
      this.catalogueGrid.instance.refresh();
  }
  refreshUnitGrid() {
    if (this.unitsGrid != undefined && this.unitsGrid.instance != undefined)
      this.unitsGrid.instance.refresh();
  }
  setBomAble() {
  }

  searchClick() {
    this.loadData();
  }

  selectTab(e) {
    this.selectedTab = e.itemData.id;
  }


  onEditorPreparingItemsGrid(e) {
    if (e.parentType === "dataRow" && e.dataField == "Automatic")
      e.editorOptions.readOnly = true;

  }

  onCellUnitChanged(data, cell) {
    this.editRow.MeasurementUnitId = data.ID;
    this.editRow.MeasurementUnitDescription = data.Title;
    cell.setValue(data.Title);
    //onCellUnitChanged
  }
  onCellElementChanged(data, cell) {
    this.editRow.CatalogueElementId = data.ID;
    this.editRow.CatalogueElementDescription = data.Title;
    //this.editRow.MeasurementUnitId = data.MeasurementUnitId;
    //this.editRow.MeasurementUnitDescription = data.MeasurementUnitDescription;
    //this.editRow.DisplaySequence = data.DisplaySequence;
    //console.log('editRow.DisplaySequence');
    //console.log(this.editRow.DisplaySequence);
    //this.editRow.MeasurementUnitDescription = data.MeasurementUnitDescription;
    //
    cell.setValue(data.Title);
  }

  measurementUnitChanged(data) {
    if (this.headerItem.ID == null || this.headerItem.ID == undefined || this.headerItem.ID == Guid.empty) {
      this.headerItem.MeasurementUnitCommercialId = data.ID;
    }
    //   this.CmmUnitFilter = { MUCS_ID: data.ClassId };
    // }
  }


  cmmMeasurementUnitChanged(data) {
    if (!this.flagSimpleMode && (this.headerItem.ID == null || this.headerItem.ID == undefined || this.headerItem.ID == Guid.empty)) {
      this.headerItem.UnitScale = data.Scale;
    }
  }


  msunGridOnInitNewRow(e) { e.data.Automatic = false; }
  OnPatternClick() {
    //this.bindData();
    this.setItemPatternPopup = true;
    console.log('this.patternId');
    console.log(this.patternId);
    //this.router.navigate(["wam/coding/setitempattern"], { queryParams: { patternId: this.patternId, itemID: this.headerItem.ID } });
  }

  onEditorPreparingLocationGrid(e) {
    if (e.parentType === "dataRow" && e.dataField == "Date")
      e.editorOptions.readOnly = true;

  }
  //bindData() {
  //    this.popupFilter.CodingPatternId = this.patternId;
  //    //if (this.filter.CodingPatternId != null) {
  //    this.service.get("/WAM/CodingPattern/List", (data) => {
  //        this.model = data;
  //        let item: any = [];

  //        var t: any = {};
  //        t = data[0].Details;
  //        for (item in t) {
  //            this.patternValues.push(t[item]);
  //        }

  //    }, this.popupFilter);
  //}
  //onShow(e) {  this.bindData(); }

  bindData() {
    if (this.patternId == undefined || this.patternId == null) {
      Notify.error(this.translate.instant('WAM_CREATING_ITEM_COD_ERROR'));
    }
    else {
      this.filter.CodingPatternId = this.patternId;


      //this.saveFlag = true;
      this.service.getPromise("/WAM/CodingPattern/List", this.filter).then((data) => {
        this.model = data[0];
        this.patternValues = [];
        let item: any = [];

        var t: any = {};
        t = data[0].Details;
        for (item in t) {
          //t[item].RRRR = "10";

          if (t[item].CollumnName == 'GroupId') {
            //t[item].CollumnValue = this.headerItem.GroupId;
            t[item].CollumnText = this.headerItem.GroupCode;
            t[item].Value = this.headerItem.GroupCode;
          }
          if (t[item].ParameterCode == 'SERIAL') {
            //t[item].CollumnValue = this.headerItem.GroupId;
            t[item].CollumnText = t[item].Serial;
            t[item].Value = t[item].Serial;
          }
          else
            t[item].CollumnValue = null;
          this.patternValues.push(t[item]);
        }
        this.service.postPromise("/WAM/Item/CreateCode", this.patternValues).then(data => {
          this.code = data;
          this.savell();
        }).catch((err) => {
          Notify.error(this.translate.instant('WAM_CREATING_ITEM_COD_ERROR'));
        });
      });
    }
  }

  onbusinesUnitShow(e) {
    if (this.businesUnitGrid != undefined && this.businesUnitGrid.instance != undefined)
      this.businesUnitGrid.instance.refresh();
  }

  onlocationShow(e) {
    if (this.locationGrid != undefined && this.locationGrid.instance != undefined)
      this.locationGrid.instance.refresh();
  }

  ontypeShow(e) {
    if (this.typeGrid != undefined && this.typeGrid.instance != undefined)
      this.typeGrid.instance.refresh();
  }


  onGroupLovClick() {

    this.popup.open(WAMItemGroupLovPage, {
      width: '900',
      height: '500',
      title: this.translate.instant("ITEM_ITGR"),
    }).then(res => {
      this.headerItem.GroupDescription = res.Description;
      this.headerItem.GroupCode = res.Code;
      this.headerItem.GroupId = res.ID;
      if (this.headerItem.ID != null && this.headerItem.ID != undefined) {
        // if (this.headerItem.CatalogueId == null)
        this.headerItem.CatalogueId = res.CatalogueId;
        // if (this.headerItem.MeasurementUnitCommercialId == null)
        this.headerItem.MeasurementUnitCommercialId = res.MeasurementUnitCommercialId;
        // if (this.headerItem.MeasurementUnitlId == null)
        this.headerItem.MeasurementUnitlId = res.MeasurementUnitlId;
      }
    });
  }
  onLocationLovClick() {

    this.popup.open(WAMWarehouseLocationPage, {
      width: '900',
      height: '500',
      title: this.translate.instant("WAM_LOCATION"),
    }).then(res => {
      this.headerItem.LocationID = res;
    });


  }
  onItctLovClick() {
    this.popup.open(DefinitionCategories, {
      width: '900',
      height: '500',
      title: this.translate.instant("WAM_ITEM_CATEGORY"),
    }).then(res => {
      var data = res;
      if (data.Code == 51 || data.Code == 52) {
        this.headerItem.bomAbleFlag = true;
        this.formConfig.bomAbleReadOnly = true;
      }
      else
        this.formConfig.bomAbleReadOnly = false;
      this.headerItem.CategoryName = data.Description;
      this.patternFilter.categoryID = data.ID;
      this.serialPatternFilter.categoryID = data.ID;
      this.setContextParameters();
      if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null) {
        this.code = null;
        this.headerItem.UnitScale = 1;
      }


    });


  }

  catalogueItemOnInitNewRow(e) {
    e.data.FlagDesLatin = false;
  }

  onCatalogueChanged(e) {
    this.catalogueFilter = { CatalogueId: e.ID };
  }
}
