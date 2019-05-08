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
import { reject } from 'q';
import { Notify } from '../../shared/util/Dialog';

@Component({

  selector: 'wam-page-warehouselocation',
  templateUrl: './warehouselocation.page.html',
  providers: [ServiceCaller]

})

export class WAMWarehouseLocationPage extends PopupBasePage implements OnInit {

  ngOnInit() {

    this.mode = this.route.snapshot.data["mode"];
    if (this.mode == "2") { this.visiblecolumn = true; }
    else
      this.visiblecolumn = false;
    if (this.popupInstance != undefined) {
      this.instanceId = this.popupInstance.data;
      this.gridHeight = 350;
      this.showButtons = true;
    }
    else
      this.showButtons = false;
  }

  @ViewChild('Treegrid') dataGrid: DxDataGridComponent;
  @ViewChild('lists') lists: DxDataGridComponent;
  gridHeight = 600;
  mode: string;
  instanceId: string;
  visiblecolumn: boolean;
  showButtons: boolean;
  selectedRowId: string = null;
  SubjectsTypDataSource: any = {};
  dataSource: any = {};
  TreeViewDataSource: any = {};
  localData: any = [];
  AddUserPopup: boolean = false;
  service: ServiceCaller;
  selectedKeys: any = [];
  SelectedParentID: any;
  lessMode: boolean = true;
  allowDeleting: boolean = false;
  searchitem: any = {};
  list: any = [];
  listID: any = [];
  ChkSelectedKeys: any = [];
  menuItems: any[] = [];
  treeItems = [{}];
  lovParamLocations: any = {};

  constructor
    (public serviceCaller: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private routeDate: RouteData,
    private route: ActivatedRoute) {
    super(translate);
    this.service = serviceCaller;

    //tree gide
    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.service.get("/WAM/WarehouseLocation/List", (data) => {
          this.localData = data;
          deferred.resolve(data);
        })
        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var editItem = this.localData.filter(c => c.ID == key)[0];
        if (this.lovParamLocations.LocationTypeId != null) {
          values.LocationTypeId = this.lovParamLocations.LocationTypeId;
        }
        Object.assign(editItem, values);
        this.service.post("/WAM/WarehouseLocation/Save", (data) => {
          deferred.resolve(data);
        }, editItem, (error) => {
          deferred.reject(error);
        })
        return deferred.promise;
      },
      insert: (values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        if (values.ParentID == 0) {
          values.ParentID = null;
        }
        if (this.lovParamLocations.LocationTypeId != null) {
          values.LocationTypeId = this.lovParamLocations.LocationTypeId;
          console.log(values);
          this.service.post("/WAM/WarehouseLocation/Save", (data) => {
            deferred.resolve(data);
          }, values, (error) => {
            deferred.reject(error);
          })
          return deferred.promise;
        }
        else {
          deferred.reject("انتخاب نوع محل اجباری است");
        }

        this.lovParamLocations.LocationTypeId = null;
      }
      , remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var list: any = [];
        list.push(key);
        this.service.post("/WAM/WarehouseLocation/Delete", (data) => {
          deferred.resolve(data);
        }, list)
        return deferred.promise;
      }
    });


  }

  onTreeItemPrepering(e) { }
  onMenuItemClick(name) {

  }

  selectionChangedHandler() {
    if (this.selectedKeys.length == 1) {
      this.selectedRowId = this.selectedKeys[0];

    }
    else {
      this.selectedRowId = null;
    }
  }



  onItemClick(e) {
    this.SelectedParentID = e.itemData.ID;
  }


  onTreeItemClick(e) {
    if (e.name == "DXADDUSER") {
      var param: any = {};
      param.ID = this.selectedRowId;
      this.service.get("/WAM/WarehouseLocation/List", (data) => {
        this.ChkSelectedKeys = [];
        this.listID = [];
        data.forEach(f => {
          if (f.Checked == true) {
            this.ChkSelectedKeys.push(f.ID);
            this.listID.push(f.ID);
          }
        });
        this.list = data;
        this.AddUserPopup = true;
        e.handled = true;
      }, param);
    }
  }


  onChanged(e) {
    if (e.addedItems.length == 1) {
      this.listID.push(e.addedItems[0].ID);
    }
    if (e.removedItems.length == 1) {
      this.listID.pop(e.removedItems[0].ID);
    }
    console.log(this.listID);
  }

  onLovLocationDescription(e) {
    this.lovParamLocations.LocationTypeId = e.ID;
  }
  onSelectClick() {
    if (this.selectedKeys.length == 1) {

      this.popupInstance.result(this.selectedRowId);
      this.popupInstance.close();
    }
    else
      Notify.error('BOM_PLEASE_SELECT_ONE_RECORD');
  }
  onCancelClick() {
    this.popupInstance.close();
  }
}
