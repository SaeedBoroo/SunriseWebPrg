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
    selector: 'wam-page-patternparameter',
    templateUrl: './patternparameter.page.html',
    providers: [ServiceCaller]
})

export class WAMPatternParameterPage extends BasePage implements AfterViewInit {

    ngAfterViewInit() {
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
    loadParams: any = {};

    editable: boolean = true;

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
        if (this.selectedRow.SystemTableFlag &&(e.name == 'DXEdit' ||e.name == "DXDelete")) {
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
          this.loadParams = {};
          this.dataGridDetail.instance.refresh();
          this.selectedKeys = [];
        }
    }

    constructor(public service: ServiceCaller,
        public translate: TranslateService) {
        super(translate);
    }

    selectionChangedHandler() {
        if (this.selectedKeys.length == 1) {
            this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
            this.loadParams = { ParameterID: this.selectedRow.ID }
            this.dataGridDetail.instance.refresh();
        }
        else {
            this.selectedRow = {};
        }
    }

    detailSelectionChangedHandler() {
        if (this.detailSelectedKeys.length == 1) {
            this.detailSelectedRow = this.dataGridDetail.instance.getSelectedRowsData()[0];
            //this.loadParams = { ParameterID: this.selectedRow.ID }
            //this.dataGridDetail.instance.refresh();
        }
        else {
            this.detailSelectedRow = {};
        }
    }

    onEditorPreparingOtherResourcesGrid(e) {

        if (e.parentType === "dataRow"
            && e.row.data.SystemTableFlag
            && e.row.data.ID != null) {
            e.editorOptions.readOnly = true;
        }
    }

    onSearchClick() {
        this.loadParams.Code = this.searchitem.Code;
        this.loadParams.Description = this.searchitem.Description;
        this.dataGrid.instance.refresh();
    }
}
