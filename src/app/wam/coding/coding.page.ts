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
    selector: 'wam-page-coding',
    templateUrl: './coding.page.html',
    providers: [ServiceCaller]
})

export class WAMCodingPage extends BasePage implements OnInit {


    ngOnInit() {

    }

    @ViewChild('gridMaster') dataGrid: DxDataGridComponent;
    @ViewChild('gridDetail') dataGridDetail: DxDataGridComponent;

    dataSource: any = {};
    dataSourceDetail: any = {};
    selectedKeys: any = [];
    selectedRow: any = {};
    detailSelectedKeys: any = [];
    detailSelectedRow: any = {};
    lessMode: boolean = true;
    searchitem: any = {};
    paramID: string = "";
    localData: any = [];
    saveParams: any = {};
    editRow: any = {};

    editable: boolean = true;

    flagSimpleMode: boolean = true;

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




    onGridItemClick(e) {
        console.log('e');
        console.log(e);
        if (this.selectedRow.SystemTableFlag) {
            //alert("امکان یه روز رسانی ماغیرهای سیستمی وجود ندارد");
            //notify({
            //    message: this.translate.instant("WAM_SYSTEM_PARAMETER_MSG"),
            //    type: "error",
            //    width: 400
            //});
            Notify.error('WAM_SYSTEM_PARAMETER_MSG');
            e.handled = true;
        }
    }

    onDetailGridItemClick(e) {
        console.log('e');
        console.log(e);
        if (this.selectedRow.SystemTableFlag) {
            //alert("امکان یه روز رسانی ماغیرهای سیستمی وجود ندارد");
            //notify({
            //    message: this.translate.instant("WAM_SYSTEM_PARAMETER_MSG"),
            //    type: "error",
            //    width: 400
            //});
            Notify.error('WAM_SYSTEM_PARAMETER_MSG');
            e.handled = true;
        }
    }

    onMenuItemClick(name) {
        if (name == "Search") {
            this.lessMode = !this.lessMode;
        }
        if (name == "Refresh") {
            this.dataGrid.instance.refresh();
        }
    }

    constructor(public service: ServiceCaller,
        public translate: TranslateService) {
        super(translate);
        let Config: any = {};
        Config.ConfigMode = 1;
        Config.key = 'WAM_FLG_SIMPLE_MODE';
        this.service.get("/ADM/Config/List", (data) => {
            if (data == 0)
            this.flagSimpleMode = false;
          else if (data == 1)
            this.flagSimpleMode = true;
        }, Config);        

        //http://localhost:5575/API/ADM/Config/List?ConfigMode=0&key=BFC-FINANCIAL-DEPARTMENT

    }

    onCellBusinessUnitChanged(data, cell) {
        this.saveParams.BusinessUnitId = data.ID;
        cell.setValue(data.Title);
        //
    }


}
