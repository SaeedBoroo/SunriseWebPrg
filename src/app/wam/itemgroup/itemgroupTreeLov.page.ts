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
import { BasePage, PopupBasePage } from "../../shared/BasePage";
import { Notify, Dialog } from '../../shared/util/Dialog';


@Component({
  selector: 'wam-page-itemgroupLov',
  templateUrl: './itemgroupTreeLov.page.html',
  providers: [ServiceCaller],
  host: { '(window:keypress)': 'hotkeys($event)' }
})



export class WAMItemGroupLovPage extends PopupBasePage implements OnInit {
  ngOnInit() {
    this.instanceId = this.popupInstance.data;
  }

  @ViewChild(DxTreeListComponent) treeList: DxTreeListComponent;
  @ViewChild('Treegrid') dataGrid: DxDataGridComponent;

  itemSelected = false;
  dataSource: any = {};
  localData: any = {};
  instanceId: any = {};
  data: any = {};
  selectedKeys: any = {};
  selectedRow: any = {};


  level: number = 0;

  //itemSelected = false;

  saveLoadParams: any = {};



  //LOV
  units: any = {};



  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
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

  }

  selectionChangedHandler() {
    this.selectedRow = Object.assign({}, this.treeList.instance.getSelectedRowsData()[0]);

  }

  onSearchClick() {
    if (this.selectedKeys.length == 1) {
      this.popupInstance.close();
      this.popupInstance.result(this.selectedRow);
    }
    else
      Notify.error('BOM_PLEASE_SELECT_ONE_RECORD');
  }
  onCancelClick() {
    this.popupInstance.close();
  }
}
