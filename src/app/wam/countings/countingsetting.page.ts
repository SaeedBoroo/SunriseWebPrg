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

@Component({
    selector: 'wam-page-countingsetting',
    templateUrl: './countingsetting.page.html',
    providers: [ServiceCaller]
})


export class WAMCountingSettingPage extends BasePage implements AfterViewInit {

    ngAfterViewInit() {
    }



    @ViewChild('grid') grid: DxDataGridComponent;

    menuItems: any[] = [
        {
            name: "Refresh",
            icon: "fa fa-refresh blue",
            text: this.translate.instant("REFRESH"),
            visible: true
        },

    ];



    //LOV

    lovMethod: any = {};
    dataSource: any = {};
    //parameters
    saveParams: any = {};

    onGridItemClick(e) {
        //console.log('e');
        //console.log(e);
        //if (this.selectedRow.SystemTableFlag) {
        //    //alert("امکان یه روز رسانی ماغیرهای سیستمی وجود ندارد");
        //    notify({
        //        message: this.translate.instant("WAM_SYSTEM_PARAMETER_MSG"),
        //        type: "error",
        //        width: 400
        //    });
        //    e.handled = true;
        //}
    }

    onMenuItemClick(name) {
        if (name == "Refresh") {
            this.grid.instance.refresh();
        }
    }

    constructor(public service: ServiceCaller,
        public translate: TranslateService) {
        super(translate);

        //LOV
        this.service.loadLovData("LOV-WAM-253", (data) => { this.lovMethod = data; })
    }

    onCellReffrenceMovementTypeChanged(data,cell) {
        this.saveParams.ReffrenceMovementTypeID = data.ID;
        cell.setValue(data.ID);
    }

    onCellGroupChanged(data,cell) {
        this.saveParams.GroupId = data.ID;
        cell.setValue(data.ID);
    }    

    selectionChangedHandler() {
        //if (this.selectedKeys.length == 1) {
        //    this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
        //    this.loadParams = { ParameterID: this.selectedRow.ID }
        //    this.dataGridDetail.instance.refresh();
        //}
        //else {
        //    this.selectedRow = {};
        //}
    }

    detailSelectionChangedHandler() {
        //if (this.detailSelectedKeys.length == 1) {
        //    this.detailSelectedRow = this.dataGridDetail.instance.getSelectedRowsData()[0];
        //    //this.loadParams = { ParameterID: this.selectedRow.ID }
        //    //this.dataGridDetail.instance.refresh();
        //}
        //else {
        //    this.detailSelectedRow = {};
        //}
    }
}
