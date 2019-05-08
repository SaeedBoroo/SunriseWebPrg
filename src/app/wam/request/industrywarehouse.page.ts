import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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
    templateUrl: 'industrywarehouse.page.html'
})


export class IndustryWarehousePage extends PopupBasePage implements OnInit {
    headerItem:any={};
    requestId:string="";
    menuItems: any[] = [
        {
            name: "Save",
            icon: "fa fa-floppy-o green",
            text: this.translate.instant("SAVE"),
            visible: true,
            disabled: false
        }
    ]

    onMenuItemClick(name) {
        switch (name) {
            case "Save":
            this.Save();
            break;
        }
    }
    Save() {
        debugger
        let param:any={};
        param.RequestId=this.requestId;
       param.IndustryWarehouseId=this.headerItem.WarehouseID;

          this.service.postPromise("/WAM/RequestItem/Update",param).then(data => {
            this.popupInstance.result(data);
            Notify.success('PUB_ACTION_SUCCESS_MSG');

          }).catch((err) => {
            Notify.error(this.translate.instant(err));
          });
      
      }
    ngOnInit()
    {
        this.requestId = this.popupInstance.data ? this.popupInstance.data.requestId : null;

    }

    constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router,
        private route: ActivatedRoute, private routeDate: RouteData, private _cdr: ChangeDetectorRef) {
        super(translate);
    }
}