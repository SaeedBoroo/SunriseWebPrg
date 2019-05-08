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
const TEST = new WeakMap();

@Component({
  selector: 'wam-page-warehouseitemfile',
  templateUrl: './warehouseitemfile.page.html',
  providers: [ServiceCaller]
})


export class WAMWarehouseItemFilePage extends BasePage implements OnInit {

  ngOnInit() {
  }
  @ViewChild('WarehouseItemFile') itemGrid: DxDataGridComponent;


  priorities: any[] = [];
  itemReadOnly: boolean = true;
  groupReadOnly: boolean = true;
  assign: any = {};
  saveParams: any = {};
  loadParams: any = {};
  WarehouseItemsSelectedKeys: any = [];
  selectedRow: any = {};
  lessMode: boolean = false;
  readOnlyLov: boolean = false;
  dataSource: any = {};
  localData: any = [];
  editItem: any = {};
  editRow: any = {};
  ReadOnlyAllField: boolean = false;
  AssignItemPopup: boolean = false;
  lovOnFilterItem: any = {};
  itemsLength: Number = 0;
  filter: any = {};
  headerItem: any = {};
  readonly: boolean = false;
  insertItem: any = {};
  itemUnitFilter: any = {};
  scale: any = 0;
  commercialScale: any = 0;
  editCell: any = {};
  WarehouseId: any = {};
  searchItem: any = [];
  selectedPriorities: any = {}
  d: any;

  ItemIds: any = [];

  menuItems: any[] = [
    //{
    //    name: "Save",
    //    icon: "fa fa-floppy-o green",
    //    text: this.translate.instant("SAVE"),
    //    visible: true,
    //    disabled: false
    //},
    //{
    //    name: "Back",
    //    text: "بازگشت",
    //    icon: "fa fa-arrow-left blue",
    //    visible: true
    //},
    {
      name: "AssignItem",
      icon: "fa fa-arrow-circle-down",
      text: "تخصیص کالا به انبار",
      visible: true
    }
    //{
    //    name: "ComputeInventory",
    //    text: "محاسبه موجودی",
    //    visible: true
    //}
  ];

  gridItems = [
    //{
    //    name: "DX_Add",
    //    icon: "fa fa-floppy-o green",
    //    text: 'ذخیره',
    //    visible: true
    //}
    //,
    //{
    //    name: "DX_Edit",
    //    text: "ویرایش",
    //    icon: "fa fa-edit yellow",
    //    visible: true
    //}
    //,
    //{
    //    name: "DX_Delete",
    //    text: "حذف",
    //    tooltip: this.translate.instant("PUB_DELETE"),
    //    icon: "fa fa-trash red",
    //    visible: true
    //}
  ];

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router, private route: ActivatedRoute) {
    super(translate);
    TEST.set(WAMWarehouseItemFilePage, this);
    this.priorities = [
      {
        id: "1",
        text: "بر اساس کالا",
      }
      ,
      {
        id: "2",
        text: "بر اساس گروه ها",
      },
      {
        id: "3",
        text: "بر اساس کدینگ",
      }

    ];
    //
    //    this.dataSource.store = new CustomStore({
    //        key: "ID",
    //        load: (loadOptions) => {
    //            let deferred: Deferred<any> = new Deferred<any>();
    //            this.service.get("/WAM/WarehouseItemFile/List", (data) => {

    //                deferred.resolve(data);
    //            })
    //            return deferred.promise;
    //        }


    //        //TEST.set(WAMWarehouseItemFilePage, this);
    //        //    this.route.queryParams.subscribe(params => {
    //        //        this.filter.ItemId = params['itemID'];
    //        //    });
    //    });
    //
  }

  onChanged(e) {
    debugger;
    if (!e.value)
      return;
    if (e.value.id == "1") {
      this.groupReadOnly = true;
      this.itemReadOnly = false;
      this.assign.ItemArrangement = true;
      this.assign.GroupArrangement = false;
      this.assign.CodingArrangement = false;
    }
    else if (e.value.id == "2") {
      this.itemReadOnly = true;
      this.groupReadOnly = false;
      this.assign.GroupArrangement = true;
      this.assign.ItemArrangement = false;
      this.assign.CodingArrangement = false;
    }
    else {
      this.itemReadOnly = false;
      this.groupReadOnly = false;
      this.assign.CodingArrangement = true;
      this.assign.GroupArrangement = false;
      this.assign.ItemArrangement = false;
    }
    if ((e.value && e.previousValue) && e.value.id != e.previousValue.id) {
      this.selectedPriorities = e.value;
    }
    console.log(e.value.id);
  }

  clearForm() {
    this.headerItem = {};
    this.headerItem = { State: 0 };
    this.localData = [];
    this.headerItem.ID = null;
    this.itemGrid.instance.refresh();

  }

  onitemAssignment(e) {
    debugger;
    var ItemIds_: any = [];
    ItemIds_.push(this.ItemIds);
    var param: any = {};
    param.WarehouseId = this.WarehouseId;
    param.StartItem = this.assign.StartItem;
    param.FinishItem = this.assign.FinishItem;
    param.ItemIds = [];
    this.ItemIds.forEach(f => {
      param.ItemIds.push(f.ID);
    });
    param.Group = this.assign.Group;
    param.ItemArrangement = this.assign.ItemArrangement;
    param.GroupArrangement = this.assign.GroupArrangement;
    param.CodingArrangement = this.assign.CodingArrangement;
    param;
    let that = this;
    this.service.postPromise("/WAM/WarehouseItemFile/AssignItemsToWarehouse", param).then(data => {
      that.AssignItemPopup = false;
      Notify.success('PUB_ACTION_SUCCESS_MSG');
      that.itemGrid.instance.refresh();
      that.selectedPriorities = null;
      //param = {};
      //param.ItemIds = [];
    })
    //if (param.ItemArrangement == null && param.GroupArrangement == null && param.CodingArrangement == null) {
    //  Notify.error(this.translate.instant("NON_IS_SELECTED"));
    //}
    //else
    //{
    //  if (param.ItemArrangement == true && (param.StartItem == null || param.FinishItem == null))
    //  {
    //    Notify.error(this.translate.instant("ITEMS_ARE_NOT_SELECTED"));
    //  }
    //  else
    //  {
    //    if (param.GroupArrangement == true && param.Group == null)
    //    {
    //      Notify.error(this.translate.instant("GROUPS_ARE_NOT_SELECTED"));
    //    }

    //    else
    //    {
    //      if (param.StartItem < 0 || param.FinishItem < 0)
    //      {
    //        Notify.error(this.translate.instant("ENTERED_VALUE_IS_INCORRECT"));
    //      }
    //      else
    //      {
    //        this.service.post("/WAM/WarehouseItemFile/AssignItemsToWarehouse", (data) => {
    //          this.AssignItemPopup = false;
    //          Notify.success('PUB_ACTION_SUCCESS_MSG');
    //          this.itemGrid.instance.refresh();

    //        }, param);
    //      }
    // }
    //  }
    // }
  }

  onHiding(e) {
    debugger;
    this.selectedPriorities = null;
    this.assign = {};
   // this.assign.Groupdes ="";
   // this.assign.Group = null;
  }

  groupChanged(e) {
    // 
   // this.assign = {};
    //this.assign.Groupdes = e.Code + e.Title;
    this.assign.Group = e.ID;
  }


  startItemChanged(data) {
    debugger;
    console.log(data);
    // this.assign.StartItem = data.Code;
    this.ItemIds = data;
    //this.searchItem.ItemIds = [];
    //this.searchItem.ItemDescription = "";
    //if (data.constructor == Array) {
    //  data.forEach(d => {
    //    this.searchItem.ItemIds.push(d.ID);
    //    this.searchItem.ItemDescription += d.Title + ',';
    //  });
    //}
    //else {
    //  this.searchItem.ItemIds.push(data.ID);
    //  this.searchItem.ItemDescription = data.Title;
    //}
  }



  finishItemChanged(data) {
    this.assign.FinishItem = data.Code;
  }
  onreturn() {
    this.AssignItemPopup = false;
  }

  //saveAll() {
  //     
  //    var param = this.headerItem;
  //    var detailInsert: any = [];
  //    var detailUpdate: any = [];
  //    var detailDelete: any = [];

  //    //Insert
  //    this.localData.filter(i => i.Flag == 1).forEach(t =>
  //        detailInsert.push({
  //            ItemCode: t.ItemCode,
  //            ItemDescription: t.ItemDescription,
  //            UnitDescription: t.UnitDescription,
  //            OrdPointQuentity: t.OrdPointQuentity,
  //            OrdQuentity: t.OrdQuentity,
  //            InventoryQuentity: t.InventoryQuentity,
  //            InventoryDate: t.InventoryDate,
  //            InventoryTime: t.InventoryTime,
  //            MaxQuentity: t.MaxQuentity,
  //            State: t.State,
  //            LocationControlFlag: t.LocationControlFlag,
  //        }));

  //    //Update
  //    this.localData.filter(i => i.Flag == 2).forEach(t =>
  //        detailUpdate.push({
  //            ID: t.ID,
  //            ItemCode: t.ItemCode,
  //            ItemDescription: t.ItemDescription,
  //            UnitDescription: t.UnitDescription,
  //            OrdPointQuentity: t.OrdPointQuentity,
  //            OrdQuentity: t.OrdQuentity,
  //            InventoryQuentity: t.InventoryQuentity,
  //            InventoryDate: t.InventoryDate,
  //            InventoryTime: t.InventoryTime,
  //            MaxQuentity: t.MaxQuentity,
  //            State: t.State,
  //            LocationControlFlag: t.LocationControlFlag,
  //        }));

  //    //Delete
  //    this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
  //    var Items: any = {};
  //    Items.InsertedItems = detailInsert;
  //    Items.UpdatedItems = detailUpdate;
  //    Items.DeletedItems = detailDelete;
  //    param.DetailItems = Items;

  //    console.log(param);


  //    this.service.post("/WAM/Setup/WarehouseItemFile/Save", (data) => {
  //        this.localData = data.Items;
  //        notify({
  //            message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
  //            type: "success",
  //            width: 400
  //        });
  //    }, param);
  //}



  onMenuItemClick(name) {

    switch (name) {
      case "AssignItem":
        {
          if (this.headerItem.WarehouseID == null) {
            Notify.error(this.translate.instant("WAREHOUSE_IS_NOT_SELECTED"));
          }
          else {
            this.assign = {};
            this.AssignItemPopup = true;
          }
          break;
        }

      //case "Save": {

      //    this.saveAll();
      //    break;
      //}
      //case "Back": {
      //    this.router.navigate(["wam/countings/countingssearch"]);
      //    break;
      //}

    }
  }



  onGridItemClick(e) {
    this.onCanceledItemRowGrid(e);
    //     
    //    if (e.name == "DX_Add") {


    //    }
    //if (e.name == "DXEdit") {

    //    if (this.WarehouseItemsSelectedKeys.length == 1) {

    //    }
    //}
    //    if (e.name == "DX_Delete") {
    //        var result = confirm(this.translate.instant("PUB_CONFIRM_DELETE"), this.translate.instant("PUB_CONFIRM"));
    //        result.then((dialogResult) => {
    //            if (dialogResult) {
    //                this.service.post("/WAM/WarehouseItemFile/Delete", (data) => {
    //                    notify({
    //                        message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
    //                        type: "success",
    //                        width: 400
    //                    });
    //                    this.localData = this.localData.filter(s => s.id == this.selectedRow.ID);
    //                    this.itemGrid.instance.refresh();

    //                }, this.WarehouseItemsSelectedKeys);
    //            }

    //        });
    //    }
  }



  WarehouseItemsselectionChangedHandler() {

    if (this.WarehouseItemsSelectedKeys.length == 1) {
      this.selectedRow = this.itemGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.selectedRow = {};
    }
  }



  onEditorPreparingItemsGrid(e) {
    if (e.parentType === "dataRow" && (e.dataField == "ItemDescription" || e.dataField == "UnitDescription"))
      e.editorOptions.readOnly = true;

    if (e.parentType === "dataRow" && (e.dataField == "InventoryQuentity" || e.dataField == "InventoryDate" || e.dataField == "InventoryTime"))
      e.editorOptions.readOnly = true;
  }



  onCellItemChanged(data, cell) {
    this.editCell.ItemDescription = data.ItemDescription;
    this.editCell.UnitDescription = data.UnitDescription;
    this.editCell.ItemId = data.ID;
    this.saveParams.ItemId = data.ID;
    cell.setValue(data.ItemCode);//
  }

  onStateCellItemChanged(data, cell) {

    //this.editCell.data.State = data.ID;
    this.editCell.data.StateTitle = data.Title;
    cell.setValue(data.State);
  }


  //setCellValueWorkStation(newData, value, currentRowData) {

  //    let that = TEST.get(WAMWarehouseItemFilePage);
  //    newData.ItemCode = value;
  //    newData.ItemDescription = that.editItem.ItemDescription;

  //}

  onDataChange(data) {

    this.loadParams.WarehouseId = data.ID;
    //this.loadParams.WarehouseCode = data.Code;
    this.saveParams.WarehouseId = data.ID;
    this.headerItem.WarehouseCode = data.Code;
    this.WarehouseId = data.ID;
    this.itemGrid.instance.refresh();
    this.assign = {};
    this.assign.StartItemId = undefined;
    this.assign.FinishItemId = undefined;
    this.assign.Group = Guid.empty;

  }
  onCanceledItemRowGrid(e) {
    this.editRow = {};
  }

  setCellValueOfItemCode(newData, value, currentRowData) {

    let that = TEST.get(WAMWarehouseItemFilePage);
    newData.ItemCode = value;
    newData.ItemDescription = that.editCell.ItemDescription;
    newData.UnitDescription = that.editCell.UnitDescription;
  }

  setCellValueOfState(newData, value, currentRowData) {

    let that = TEST.get(WAMWarehouseItemFilePage);
    newData.State = value;
    newData.StateTitle = that.editCell.StateTitle;
  }


  //setCellValueOfUnitCommercial(newData, value, currentRowData)
  //{
  //    let that = TEST.get(WAMWarehouseItemFilePage);
  //    newData.UnitDescription = that.editRow.UnitDescription;
  //    newData.SecondQuantityCommercial = null;
  //    newData.Quantity = null;
  //}


  //onCellReQuestItemCodeChanged(data, cell) {
  //    this.editItem.ItemDescription = data.ItemDescription;
  //    this.editItem.UnitDescription = data.UnitDescription;
  //    this.itemUnitFilter = { ITEM_ID: data.ID };
  //    cell.setValue(data.Code);
  //}


  //onStandardOperationGridClick(name) {
  //    if (name == "New") {
  //        this.saveParams.BussinessId = this.saveParams.WarehouseId;
  //        this.itemGrid.instance.addRow();
  //    }
  //}

}

