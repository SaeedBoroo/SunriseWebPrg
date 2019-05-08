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
import { Notify } from '../../shared/util/Dialog';

@Component({
  selector: 'wam-page-definition',
  templateUrl: './definition.page.html',
  providers: [ServiceCaller]
})

export class WAMDefinitionPage extends BasePage implements AfterViewInit {

  ngAfterViewInit() {
  }



  @ViewChild('gridMaster') dataGrid: DxDataGridComponent;
  @ViewChild('gridDetail') dataGridDetail: DxDataGridComponent;

  dataSource: any = {};
  dataSourceDetail: any = {};
  selectedKeys: any = [];
  selectedRow: any = {};
  lessMode: boolean = true;
  searchitem: any = {};
  paramID: string = "";
  localData: any = [];
  loadParams: any = {};
  selectedKeysDetail: any = [];

  detailLoadParams: any = {};

  menuItems: any[] = [
    {
      name: "Refresh",
      icon: "fa fa-refresh blue",
      text: this.translate.instant("REFRESH"),
      visible: true
    },

  ];

  gridItems = [{}];
  gridItemsDetail = [{}];


  onMenuItemClick(name) {
    if (name == "Search") {
      this.lessMode = !this.lessMode;
    }
    if (name == "Refresh") {
      this.loadParams.Code = undefined;
      this.loadParams.Description = undefined;
      this.dataGrid.instance.refresh();
    }
  }

  constructor(public service: ServiceCaller,
    public translate: TranslateService) {
    super(translate);

    //this.dataSource.store = new CustomStore({
    //    key: "ID",
    //    load: (loadOptions) => {
    //        var param: any = {};
    //        param.Code = this.searchitem.Code;
    //        param.Description = this.searchitem.Description;
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        this.service.get("/WAM/CatalogueGroup/List", (data) => {
    //            this.localData = data;
    //            deferred.resolve(data);
    //        }, param)
    //        return deferred.promise;
    //    },
    //    update: (key, values) => {
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        //var editItem = this.dataGrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
    //        var editItem = this.localData.filter(c => c.ID == key)[0];
    //        Object.assign(editItem, values);
    //        this.service.post("/WAM/CatalogueGroup/Save", (data) => {
    //            deferred.resolve(data);
    //        }, editItem, (error) => {
    //            deferred.reject(error);
    //        })
    //        return deferred.promise;
    //    },
    //    insert: (values) => {
    //        values.ID = Math.random();
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        this.service.post("/WAM/CatalogueGroup/Save", (data) => {
    //            deferred.resolve(data);
    //        }, values, (error) => {
    //            deferred.reject(error);
    //        })
    //        return deferred.promise;
    //    }
    //    , remove: (key) => {
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        var list: any = [];
    //        list.push(key);
    //        this.service.post("/WAM/CatalogueGroup/Delete", (data) => {
    //            deferred.resolve(data);
    //        }, list, (msg) => {
    //            deferred.reject(msg);
    //        });
    //        return deferred.promise;
    //    }
    //});


    //this.dataSourceDetail.store = new CustomStore({
    //    key: "ID",
    //    load: (loadOptions) => {
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        if (this.selectedRow != undefined)
    //            deferred.resolve(this.selectedRow.CTypes);
    //        else
    //            deferred.resolve(null);
    //        return deferred.promise;
    //    },

    //    update: (key, values) => {
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        var edititem = this.dataGridDetail.instance.getDataSource().items().filter(c => c.ID == key)[0];
    //        Object.assign(edititem, values);
    //        this.service.post("/WAM/CatalogueType/Save", (data) => {
    //            deferred.resolve(data);
    //        }, edititem, (error) => {
    //            deferred.reject(error);
    //        })
    //        return deferred.promise;
    //    },

    //    insert: (values) => {
    //        values.ID = Math.random();
    //        values.CatalogueGroupId = this.paramID;
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        this.service.post("/WAM/CatalogueType/Save", (data) => {
    //            this.selectedRow.CTypes = data.CTypes;
    //            this.dataGridDetail.instance.refresh();
    //            deferred.resolve(true);
    //        }, values, (error) => {
    //            deferred.reject(error);
    //        })
    //        return deferred.promise;
    //    },

    //    remove: (key) => {
    //        let deferred: Deferred<any> = new Deferred<any>();
    //        var list: any = [];
    //        list.push(key);
    //        this.service.post("/WAM/CatalogueType/Delete", (data) => {
    //            this.selectedRow.CTypes = this.selectedRow.CTypes.filter(c => c.ID != key);
    //            this.dataGridDetail.instance.refresh();
    //            deferred.resolve(true);
    //        }, list, (msg) => {
    //            deferred.reject(msg);
    //        });
    //        return deferred.promise;
    //    }
    //});

  }

  selectionChangedHandler() {
     
    if (this.selectedKeys.length == 1) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
      this.paramID = this.dataGrid.instance.getSelectedRowsData()[0].ID;
      this.detailLoadParams.CatalogueGroupId = this.dataGrid.instance.getSelectedRowsData()[0].ID;
      this.dataGridDetail.instance.refresh();
    }
    else {
      this.selectedRow = {};
    }
  }

  onSearchClick() {
    this.loadParams.Code = this.searchitem.Code;
    this.loadParams.Description = this.searchitem.Description;
    this.dataGrid.instance.refresh();
  }

  onGridItemClick(e) {
     
    if (e.name == "DXInsert") {
            this.selectedKeys = [];
      this.detailLoadParams = {}
      this.dataGridDetail.instance.refresh();
    };
  }

  onDetailGridItemClick(e) {
     
    if (e.name == "DXInsert") {
      if (this.selectedKeys.length != 1) {
        e.handled = true;
        Notify.error('PUB_PLEASE_SELECT_ONLY_ONE');
      }

    };
  }
}
