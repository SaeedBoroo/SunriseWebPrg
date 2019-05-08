import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Guid } from '../../shared/types/GUID';
import { Notify } from '../../shared/util/Dialog';
import { DXLovComponent } from '../../shared/components/dx-lov.component';
import { DemisPopupService } from '../../shared/components/popup/demis-popup-service';
import { AssignItemWarehousePage } from './assignitemwarehouse.page';

@Component({
  selector: 'wam-page-iteminfo',
  templateUrl: './iteminfo.page.html',
  providers: [ServiceCaller]
})
export class WAMItemInfoPage extends PopupBasePage implements OnInit {
  flagSimpleMode: boolean;
  filter: any = {};
  headerItem: any = {};
  inventoryFilter: any = {};
  allInventoryFilter: any = {};
  //instanceId:any={};
  ngOnInit() {

    this.filter.ItemId = this.popupInstance.data.ItemId;
    if (this.filter.ItemId != null)
      this.loadData();
  }





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
    });


    // this.route.queryParams.subscribe(params => {
    //   this.filter.ItemId = params['itemID'];
    //   //this.headerItem.code = params['code'];
    // });
    //this.filter.ItemId = this.popupInstance.data;
    debugger;


    this.route.queryParams.subscribe(params => {
    });

  }

  loadData() {
    this.service.getPromise("/WAM/Item/List", this.filter).then((data) => {
      if (data[0] != null) {
        this.headerItem = data[0];
        this.inventoryFilter = {
          WarehouseID: this.popupInstance.data.WarehouseID,
          ItemId: this.filter.ItemId,
          typeId: this.popupInstance.data.ItemTypeId,
          //Date: DateTime.now,//this.insertItem.Date
          Date: this.popupInstance.data.Date,
        };
        this.service.get("/WAM/Inventory/GetItemTypeInventory",
          (data) => {
            //this.editRow.Inventory = data;
            this.headerItem.Inventory = data;
          },
          this.inventoryFilter)
        this.allInventoryFilter = {
          ItemId: this.filter.ItemId,
          typeId: this.popupInstance.data.ItemTypeId,
          //Date: DateTime.now,//this.insertItem.Date
          Date: this.popupInstance.data.Date,
        };
        this.service.get("/WAM/Inventory/GetItemTypeInventory",
          (data) => {
            //this.editRow.Inventory = data;
            this.headerItem.AllInventory = data;
          },
          this.allInventoryFilter)
      }
      //
    }
      , this.filter);
  }
  onSelectClick() {
    this.popupInstance.close();
    // this.popupInstance.result(this.selectedRow);
  }
  onCancelClick() {
    this.popupInstance.close();
  }
}
