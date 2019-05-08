import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { RouteData } from '../../shared/util/RouteData';
import { Notify, Dialog } from '../../shared/util/Dialog';

@Component({
  selector: 'wam-page-definitiontypespecification',
  templateUrl: './definitiontypespecification.page.html',
  providers: [ServiceCaller]
})

export class WAMDefinitionTypeSpecificationPage extends BasePage implements AfterViewInit {

  ngAfterViewInit() {
    //this.menuItems[2].visible = false;
    //this.menuItems[1].visible = false;
    this.lessMode = true;
    if (this.selectedKeys.length > 0) {
      this.selectionChangedHandler();
    }
  }


  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;


  selectedKeys: any = [];
  selectedRow: any = {};
  lessMode: boolean = true;
  searchitem: any = {};
  loadParams: any = {};

  menuItems: any[] = [
    {
      name: "New",
      icon: "fa fa-plus",
      text: this.translate.instant("PUB_NEW"),
      visible: true
    },
    // {
    //     name: "Edit",
    //     icon: "fa fa-edit yellow",
    //     text: this.translate.instant("EDIT"),
    //     visible: true
    // },
    // {
    //     name: "Delete",
    //     icon: "fa fa-trash red",
    //     text: this.translate.instant("DELETE"),
    //     visible: true
    // },
    {
      name: "Search",
      icon: "fa fa-search",
      text: this.translate.instant("PUB_SEARCH"),
      visible: true
    },
    {
      name: "Refresh",
      icon: "fa fa-refresh blue",
      text: this.translate.instant("REFRESH"),
      visible: true
    },

  ];

  navToNew() {
    this.routeDate.storage.data = null;
    this.router.navigate(["wam/catalog/definitiontypespecificationedit"]);
  }

  navToEdit() {
    this.routeDate.storage.data = this.selectedRow;
    this.router.navigate(["wam/catalog/definitiontypespecificationedit"]);
  }

  dbClickEdit() {
    this.navToEdit();
  }

  onMenuItemClick(name) {
    if (name == "New") {
      this.navToNew();
    }
    if (name == "Edit") {
      this.navToEdit();
    }

    if (name == "Delete") {
      // var result = confirm(this.translate.instant("PUB_CONFIRM_DELETE"), this.translate.instant("PUB_CONFIRM"));
      // result.then((dialogResult) => {
      //     if (dialogResult) {
      //         this.service.post("/WAM/ItemCatalogue/Delete", (data) => {
      //             this.selectedKeys = [];
      //             this.dataGrid.instance.refresh();
      //             Notify.success('دیتای مورد نظر حذف شد');
      //         }, this.selectedKeys);
      //     }
      // });

      //Commented By Hooman Aghaei
      //Dialog.delete().done(() => {
      //  this.service.post("/WAM/ItemCatalogue/Delete", (data) => {
      //    this.selectedKeys = [];
      //    this.dataGrid.instance.refresh();
      //    Notify.success('دیتای مورد نظر حذف شد');
      //  }, this.selectedKeys);
      //});

    }
    if (name == "Search") {
      if (this.lessMode == true) {
        this.lessMode = false;
      }
      else {
        this.lessMode = true
      }
    }
    if (name == "Refresh") {
      this.loadParams.Code = null;
      this.loadParams.Description = null;
      this.refreshGrid();

    }

  }

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private routeDate: RouteData) {

    super(translate);

  }

  selectionChangedHandler() {
    if (this.selectedKeys.length == 0) {
      //this.menuItems[1].visible = false;
      //this.menuItems[2].visible = false;
    }
    else if (this.selectedKeys.length == 1) {
      //this.menuItems[1].visible = true;
      //this.menuItems[2].visible = true;
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.selectedRow = {};
      //this.menuItems[1].visible = false;
      //this.menuItems[2].visible = true;
    }
  }

  onSearchClick() {
    this.loadParams.Code = this.searchitem.Code;
    this.loadParams.Description = this.searchitem.Description;
    this.refreshGrid();
  }
  refreshGrid() {
    if (this.dataGrid != undefined && this.dataGrid.instance != undefined)
      this.dataGrid.instance.refresh();

  }
}
