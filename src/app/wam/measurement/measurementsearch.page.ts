import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Notify } from '../../shared/util/Dialog';

@Component({
    selector: 'wam-page-measurementsearch',
    templateUrl: './measurementsearch.page.html',
    providers: [ServiceCaller]
})

export class WAMMeasurementSearchPage extends BasePage {
    @ViewChild('dataGrid') grid: DxDataGridComponent;

    headerItem: any = {};
    dataSource: any = {};
    localData: any[] = [];
    selectedRow: any = {};
    formStatus: number = 0;
    enableScale: boolean = true;
    filter: any = {};
    classSelectedKeys: any = {};
    menuItems = [
        {
            name: "Search",
            icon: "fa fa-search blue",
            text: "جستجو",
            visible: true
        },
        {
            name: "Edit",
            text: "انتخاب",
            icon: "fa fa-edit yellow",
            visible: true
        },
        {
            name: "Back",
            icon: "fa fa-arrow-left",
            text: this.translate.instant("بازگشت"),
            visible: true
        },
    ];
    constructor(public service: ServiceCaller, private router: Router, public translate: TranslateService, private route: ActivatedRoute) {
        super(translate);
    }

    onGridItemClick(event) {

    }
    selectionChangedHandler() {
        if (this.classSelectedKeys.length == 0) {
            this.classSelectedKeys = {};
        }
        else if (this.classSelectedKeys.length == 1) {
            this.classSelectedKeys = this.grid.instance.getSelectedRowsData()[0];
        }
        else {
            this.classSelectedKeys = {};
        }
    }
    onMenuItemClick(name) {
        {
            switch (name) {

                case "Back": {
                    this.router.navigate(["wam/measurement/measurement"]);
                    break;
                }

                case 'Edit': {
                    var selectedID: any = this.grid.instance.getSelectedRowsData()[0].MeasurementClassId;
                    console.log('selectedID');
                    console.log(selectedID);
                    if (selectedID == null) {
                      //notify("لطفا الگوی موردنظرانتخاب شود.", "error", 1000);
                      Notify.error('لطفا الگوی موردنظرانتخاب شود');
                    }
                    else {
                        this.router.navigate(['wam/measurement/measurement'], { queryParams: { classId: selectedID, formStatus: 1 } });
                    }

                }
            }
        }
    }
}
