import { Component, OnInit, ChangeDetectorRef ,ViewChild} from '@angular/core';
import { List } from 'immutable';
import { PopupBasePage } from '../../shared/BasePage';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { RouteData } from '../../shared/util/RouteData';
import { ActivatedRoute, Router } from '@angular/router';
import CustomStore from "devextreme/data/custom_store";
import { TranslateService } from '../../shared/services/TranslateService';
import { Deferred } from '../../shared/Deferred';
import { Notify } from '../../shared/util/Dialog';
import { DxDataGridComponent } from 'devextreme-angular';



@Component({
    templateUrl: 'assignitemwarehouse.page.html'
})

export class AssignItemWarehousePage extends PopupBasePage implements OnInit {
    itemSelectedRow: any = {};
    loadParams: any = {};
    saveParams: any = {};
    dataSource:any={};
    headerItem:any={};
    ItemId:string;
    warehouseFilter:any={};
    itemSelectedKeys: any = [];
    @ViewChild('datagrid') dataGrid: DxDataGridComponent;
    menuItems: any[] = [
      
        {
          name: "Assignwarehouse",
          text: "تخصیص به انبار",
          visible: true
        }
       
      ];
      onMenuItemClick(name) {

        switch (name) {
          case "Assignwarehouse":
            {
              if (this.headerItem.WarehouseID == null) {
                Notify.error(this.translate.instant("WAREHOUSE_IS_NOT_SELECTED"));
              }
              else {
             
                let params:any={};
                params.warehouseID=this.headerItem.WarehouseID ;
                params.ItemId=this.ItemId;
                this.service.postPromise("/WAM/WarehouseItemFile/AssignWarehouseToItems", params)
                .then((data) => {
                    Notify.success('PUB_ACTION_SUCCESS_MSG');
                    this.dataGrid.instance.refresh();
                });
              }
              break;
            }
        }
    }
    ngOnInit()
    {
        debugger;
        this.ItemId = this.popupInstance.data ? this.popupInstance.data.entityId : null;
        this.warehouseFilter={
            ItemId:this.ItemId
        }
        // this.dataSource.store = new CustomStore({
        //     key: "ID",
        //     load: (loadOptions) => {
        //         let deferred: Deferred<any> = new Deferred<any>();
        //         this.service.getPromise("/WAM/WarehouseItemFile/Get", {ItemId:this.ItemId })
        //             .then((data) => {
        //                 deferred.resolve(data);
        //             });
        //         return deferred.promise;
        //     }
        // });
        this.loadParams.ItemId = this.ItemId; 
        this.saveParams.ItemId = this.ItemId; 
        this.dataGrid.instance.refresh();
        //this.saveParams.Id = this.ItemId;


    }
    selectionChangedHandler() {
        if (this.itemSelectedKeys.length == 0) {
          this.itemSelectedRow = {};
        }
        else if (this.itemSelectedKeys.length == 1) {
          this.itemSelectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
        }
        else {
          this.itemSelectedKeys = {};
        }
      }
    onDataChange(data) {
        this.headerItem.WarehouseCode = data.Code;

      }
    constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router,
        private route: ActivatedRoute, private routeDate: RouteData, private _cdr: ChangeDetectorRef)
        {
            super(translate);


            // if(this)
            // this.dataGrid.instance.refresh();
        }

        onGridItemClick(e){
            debugger;
            switch (e.name) {
                case "DXSave": {
                  //this.saveParams = e.data;
                  break;
                }
        }
    }
}