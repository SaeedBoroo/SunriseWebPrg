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

@Component({
    selector: 'wam-page-measurementscale',
    templateUrl: './measurementscale.page.html',
    providers: [ServiceCaller]
})

export class WAMMeasurementScalePage extends BasePage implements OnInit {

    ngOnInit() {
        //this.menuItems[3].visible = false;
    }
    @ViewChild('scaleGrid') grid: DxDataGridComponent;

    dataSource: any = {};
    localData: any[] = [];
    selectedRow: any = {};
    menuItems: any[] = [
        {
            name: "Back",
            icon: "fa fa-arrow-left",
            text: this.translate.instant("PUB_RETURN"),
            visible: true
        }
    ];

    filter: any = {};
    editRow: any = {};
    headerItem: any = {};
    formula: string = '';

    constructor(public service: ServiceCaller, private router: Router, public translate: TranslateService, private route: ActivatedRoute) {
        super(translate);

        this.route.queryParams.subscribe(params => { this.filter.ClassId = params['classID'] });        
        this.service.get("/WAM/MeasurementClass/List", (data) => {
            this.headerItem = data[0];
            this.filter.MeasurementUnitId = this.headerItem.MainMeasurementUnitId;
            this.formula = this.headerItem.MainMeasurementUnitCode + ' * ';
            this.grid.instance.refresh();
        },  this.filter);
        console.log('this.headerItem');
        console.log(this.headerItem.Code);
        
    }

    onButtonClick(name) {
        if (name == "New") {
            this.grid.instance.addRow();
        }
    }
    onCellUnitChanged(data, cell) {
        this.filter.MeasurementUnitCommercialId = data.ID;
        this.filter.MeasurementUnitCommercialCode = data.Code;
        this.filter.MeasurementUnitCommercialDescription = data.Title;
        this.formula = this.headerItem.MainMeasurementUnitCode + ' * ';
        cell.setValue(data.Title);
    }
    onMenuItemClick(name) {
        switch (name) {
            case "Back": {
                this.router.navigate(["wam/measurement/measurement"], { queryParams: { classID: this.headerItem.ID, formStatus: 1 } });
                //
                break;
            }
        }
    }
}
