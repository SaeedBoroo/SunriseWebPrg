import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { DxDataGridComponent, DxTreeListComponent } from 'devextreme-angular';
import { BasePage } from "../../shared/BasePage";
import { Notify, Dialog } from '../../shared/util/Dialog';


@Component({
  selector: 'wam-page-itemgroup',
  templateUrl: './itemgroup.page.html',
  providers: [ServiceCaller],
  host: { '(window:keypress)': 'hotkeys($event)' }
})



export class WAMItemGroupPage extends BasePage {

  @ViewChild(DxTreeListComponent) treeList: DxTreeListComponent;
  @ViewChild('Treegrid') dataGrid: DxDataGridComponent;

  @ViewChild('unitsGrid') unitsGrid: DxDataGridComponent;
  @ViewChild('catalogueGrid') catalogueGrid: DxDataGridComponent;
  itemSelected = false;
  menuItems = [
    //{
    //    name: "Branch",
    //    icon: "fa fa-plus green",
    //    text: this.translate.instant("درج شاخه"),
    //    visible: true
    //},
    {
      name: "Refresh",
      icon: "fa fa-refresh green",
      text: this.translate.instant("PUB_REFRESH"),
      visible: true,
      disabled: false
    },
    {
      name: "SubBranch",
      icon: "fa fa-plus green",
      text: this.translate.instant("درج زیرشاخه"),
      visible: true,
      disabled: false
    },
    {
      name: "EditSubBranch",
      icon: "fa fa-edit yellow",
      text: this.translate.instant("PUB_EDIT"),
      visible: true,
      disabled: false
    },
    {
      name: "AddUnits",
      text: this.translate.instant("WAM_ITEM_UNITS"),
      icon: "fa fa-balance-scale yellow",
      visible: true,
      disabled: false
    },
    {
      name: "AddCataloguess",
      text: this.translate.instant("WAM_ITEM_CATALOGUES"),
      icon: "fa fa-id-card yellow",
      visible: true,
      disabled: false
    }
    //,
    //{
    //    name: "Delete",
    //    text: "حذف",
    //    icon: "fa fa-trash red",
    //    visible: true
    //}
  ];

  dataSource: any = {};
  localData: any = {};
  unitDataSource: any = {};
  unitLocalData: any[] = [];
  catalogueDataSource: any = {};
  catalogueLocalData: any[] = [];
  data: any = {};
  selectedKeys: any = {};
  selectedRow: any = {};
  addItemGroupPopup = false;
  itemGroupUnitPopup = false;
  itemGroupCataloguePopup = false;
  branchFlag = false;

  level: number = 0;

  //itemSelected = false;

  saveLoadParams: any = {};

  currentCode: string;
  currentItcdId: string;
  currentItgrId: string;

  //LOV
  units: any = {};

  catalogueFilter: any = {};

  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    //
    //LOV
    //this.categoryFilter = { ITCT_FILTER: null };
    this.service.loadLovData("LOV-WAM-027", (data) => { this.units = data; });
    this.dataSource.store = new CustomStore({
      key: "ID",

      load: (loadOptions) => {
        var param: any = {};
        let deferred: Deferred<any> = new Deferred<any>();
        this.service.get("/WAM/ItemGroup/List/HierarchyNew", (data) => {
          this.localData = data;

          deferred.resolve(data);
        }, param)
        return deferred.promise;
      },
      update: (key, values) => {
        return new Promise((resolve, reject) => {
          let item = {};
          resolve(true);
        })
      }
    });
    this.menuItems[1].disabled = true;
    this.menuItems[2].disabled = true;
    this.menuItems[3].disabled = true;
    this.menuItems[4].disabled = true;
    this.catalogueFilter = { CatalogueId: this.localData.CatalogueId };
  }

  selectionChangedHandler() {
    //this.selectedRow = this.localData.filter(i => i.ID == this.selectedKeys[0])[0];

    //this.selectedKey = this.selectedKeys
    this.selectedRow = Object.assign({}, this.treeList.instance.getSelectedRowsData()[0]);
    if (this.selectedKeys.length == 1) {
      this.menuItems[1].disabled = false;
      this.menuItems[2].disabled = false;
      this.menuItems[3].disabled = false;
      this.menuItems[4].disabled = false;
    }
  }
  onMenuItemClick(name) {
    if (name == "Refresh") {
      this.dataSource.store.load();
      this.treeList.instance.refresh();
    }
    if (name == "SubBranch") {
      debugger;
      this.branchFlag = true;
      this.currentCode = this.selectedRow.Code;
      this.currentItgrId = this.selectedRow.ItemGroupId;
      this.currentItcdId = this.selectedRow.ItemCodingId;
      this.selectedRow.mode = 0;
      this.level = this.treeList.instance.getNodeByKey(this.selectedKeys[0]).level + 1;
   
         this.addItemGroupPopup = true;

    
    }
    if (name == "EditSubBranch") {
      if (this.selectedRow != undefined && this.selectedRow != null) {
      
        this.branchFlag = true;
        this.currentCode =this.selectedRow.Code;
        this.currentItgrId =  this.selectedRow.ItemGroupId;
        this.currentItcdId = this.selectedRow.ItemCodingId;
        this.selectedRow.mode = 1;
        this.addItemGroupPopup = true;
      }
      else
        Notify.error('PUB_NOT_DATA');

    }
    if (name == 'AddUnits') {
      if (this.selectedKeys.length == 1) {
        this.saveLoadParams.ItemId = this.selectedRow.ItemGroupId;
        this.itemGroupUnitPopup = true;
        this.currentItgrId = this.selectedRow.ItemGroupId;
      }
    }//AddCataloguess
    if (name == 'AddCataloguess') {
      if (this.selectedKeys.length == 1) {
        this.saveLoadParams.ItemId = this.selectedRow.ItemGroupId;
        this.catalogueFilter = { CatalogueId: this.selectedRow.CatalogueId };
        this.itemGroupCataloguePopup = true;
        this.currentItgrId = this.selectedRow.ItemGroupId;
      }
    }
    if (name == 'Delete') {
      // var result = confirm(this.translate.instant("PUB_CONFIRM_DELETE"), this.translate.instant("PUB_CONFIRM"));
      // result.then((dialogResult) => {
      //     if (dialogResult) {
      //         this.service.post("/WAM/ItemGroup/Delete", (data) => {
      //             this.treeList.instance.refresh();
      //             Notify.success('PUB_ACTION_SUCCESS_MSG');
      //         }, this.selectedKeys);
      //     }
      // });
      Dialog.delete().done(() => {
        this.service.post("/WAM/ItemGroup/Delete", (data) => {
          this.treeList.instance.refresh();
          Notify.success('PUB_ACTION_SUCCESS_MSG');
        }, this.selectedKeys);
      });

    }
  }

  onCellElementChanged(data, cell) {
    this.saveLoadParams.CatalogueElementId = data.ID;
    this.saveLoadParams.CatalogueElementDescription = data.Title;
    cell.setValue(data.Title);
  }

  onCellUnitChanged(data, cell) {
    this.saveLoadParams.MeasurementUnitId = data.ID;
    this.saveLoadParams.MeasurementUnitDescription = data.Title;
    cell.setValue(data.Title);
  }

  onCancelUnitPopup() {
    this.itemGroupUnitPopup = false;
  }

  onCancelCataloguePopup() {
    this.itemGroupCataloguePopup = false;
  }

  onUnitShow(e) {
    this.unitsGrid.instance.refresh();
  }

  onCatalogueShow(e) {
    this.catalogueGrid.instance.refresh();
  }

}
