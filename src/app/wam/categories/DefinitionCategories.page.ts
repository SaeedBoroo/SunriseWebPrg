import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage, PopupBasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { RouteData } from '../../shared/util/RouteData';
import { Notify } from '../../shared/util/Dialog';
import { Guid } from '../../shared/types/GUID';
import { debounce } from 'rxjs/internal/operators/debounce';

@Component({
  selector: 'DefinitionCategories',
  templateUrl: './DefinitionCategories.page.html',
  providers: [ServiceCaller]
})

export class DefinitionCategories extends PopupBasePage implements OnInit {

  ngOnInit() {
    if (this.popupInstance != undefined) {
      this.instanceId = this.popupInstance.data;
      this.gridHeight = 350;
      this.isPopup = true;
    }
    else
      this.isPopup = false;
  }

  @ViewChild('Treegrid') dataGrid: DxDataGridComponent;


  dataSource: any = {};
  localData: any = [];
  isPopup = false;
  instanceId: any = {};
  service: ServiceCaller;
  selectedKeys: any = [];
  InsertParam: any = {};
  InputPopup = false;
  RootInfo: any = {};
  gridHeight = 650;
  menuItems = [];
  treeItems = [
    {
      name: "DXNew",
      icon: "fa fa-plus green",
      text: this.translate.instant("NEW"),
      visible: true,
    }
  ];
  constructor(public serviceCaller: ServiceCaller, public translate: TranslateService, private router: Router, private routeDate: RouteData) {
    super(translate);
    this.service = serviceCaller;

    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        var param: any = {};
        let deferred: Deferred<any> = new Deferred<any>();
        this.service.get("/WAM/ItemCategory/ListTree", (data) => {
          this.localData = data;

          deferred.resolve(data);
        }, param)
        return deferred.promise;
      }
      , remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var list: any = [];
        list.push(key);
        this.service.post("/WAM/ItemCategory/Delete", (data) => {
          deferred.resolve(data);
        }, list)
        return deferred.promise;
      }
    });
  }
  onMenuItemClick(e) { }
  selectionChangedHandler() {
    if (this.selectedKeys.length == 1) {
      this.RootInfo = this.dataGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.RootInfo = {};
    }
  }
  onGridRefresh() {
    if (this.dataGrid != undefined) {
      this.dataGrid.instance.refresh();
    }
  }
  onSaveClick() {
    this.service.postPromise("/WAM/ItemCategory/Save", this.InsertParam).then(data => {
      this.onGridRefresh();
      this.InputPopup = false;
    }).catch((err) => {
      Notify.error(this.translate.instant(err));
    });
  }

  onTreeItemClick(e) {
    if (e.name == "DXInsert") {
      e.handled = true;
      Notify.info('WAM_ITCT_INS_UPD_DEL_FALSE');
    }
    if (e.name == "DXNew") {
      e.handled = true;
      if (this.RootInfo.CategoryCategoryId == Guid.empty ||
        this.RootInfo.CategoryCategoryId == null ||
        this.RootInfo.CategoryCategoryId == undefined) {
        this.InsertParam = {};
        this.InsertParam.CategoryCategoryId = e.data.ID;
        this.InputPopup = true;
      }
      else {
        Notify.error('WAM_ITCT_LVL_INS');
      }
    }
    if (e.name == "DXEdit") {
      e.handled = true;
      if (this.RootInfo.CategoryCategoryId == Guid.empty ||
        this.RootInfo.CategoryCategoryId == null ||
        this.RootInfo.CategoryCategoryId == undefined) {
        Notify.info('WAM_ITCT_INS_UPD_DEL_FALSE');
      }
      else {
        this.InsertParam = {};
        this.InsertParam = Object.assign({}, e.data);
        this.InputPopup = true;
      }
    }
    if (e.name == "DXDelete") {

      if (this.RootInfo.CategoryCategoryId == Guid.empty ||
        this.RootInfo.CategoryCategoryId == null ||
        this.RootInfo.CategoryCategoryId == undefined) {
        e.handled = true;
        Notify.info('WAM_ITCT_INS_UPD_DEL_FALSE');
      }
    }
  }
  onCancelClick() {
    this.InputPopup = false;
  }

  onSelectClick() {
    if (this.selectedKeys.length == 1) {
      this.popupInstance.result(this.RootInfo);
      this.popupInstance.close();
    }
    else
      Notify.error('BOM_PLEASE_SELECT_ONE_RECORD');
  }
  onCancelSelectClick() {
    this.popupInstance.close();
  }
}
