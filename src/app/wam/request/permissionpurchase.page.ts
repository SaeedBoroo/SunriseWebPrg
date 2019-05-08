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
    templateUrl: 'permissionpurchase.page.html'
})

export class PermissionPurchasePage extends PopupBasePage implements OnInit {
    dataSource: any = {};
    headerItem: any = {};
    selectedKeys: any = [];
    selectedRow: any = {};
    requestId: string;

    @ViewChild('datagrid') dataGrid: DxDataGridComponent;
    menuItems: any[] = [

        {
            name: "Save",
            icon: "fa fa-floppy-o green",
            text: this.translate.instant("SAVE"),
            visible: true,
            disabled: false
        },
    ]
    onMenuItemClick(name) {
        switch (name) {
            case "Save": {
                this.save();
                break;
            }
        }
    }
    ngOnInit() {
        debugger
        this.requestId = this.popupInstance.data ? this.popupInstance.data.requestId : null;
        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.getPromise("/WAM/RequestItem/List", { requsetId: this.headerItem.RequestId })
                    .then((data) => {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }
        });
    }
    constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router,
        private route: ActivatedRoute, private routeDate: RouteData, private _cdr: ChangeDetectorRef) {
        super(translate);
    }
    onDataChange(e) {
        this.dataGrid.instance.refresh();
    }
    save() {
        debugger;
        let params: any = {};
        params.RequestId = this.requestId;
        params.RequestItemIds = this.selectedKeys;
        this.service.postPromise("/WAM/RequestItem/Save", params)
            .then((data) => {

                this.popupInstance.result(data);
                Notify.success('PUB_ACTION_SUCCESS_MSG');
                this.dataGrid.instance.refresh();
            });
    }
    selectionChangedHandler() {
        debugger;
        if (this.selectedKeys.length == 0) {
            this.selectedKeys = {};
        }
        else if (this.selectedKeys.length == 1) {
            this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];

        }
        else {
            this.selectedRow = {};
        }
    }
}