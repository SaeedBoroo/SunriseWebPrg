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
import { RouteData } from '../../shared/util/RouteData';


@Component({
    selector: 'wam-page-countingsregistersearch',
    templateUrl: './countingsregistersearch.page.html',
    providers: [ServiceCaller]
})

export class WAMCountingsRegisterSearchPage extends BasePage implements OnInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    ngOnInit() {

    }


    selectedKeys: any = [];
    selectedRow: any = {};
    deleteparam: any = {};
    countingsId: string;
    localData: any = {};
    insertItem: any = {};
    editItem: any = {};
    dataSource: any = {};


    gridItems = [
        {
            name: "dx-view",
            icon: "fa fa-eye green",
            text: 'مشاهده',
        }
    ];
    menuItems = [];
    navToView() {
        this.router.navigate(["wam/countingsregister/countingsregister"], { queryParams: { ID: this.selectedRow } });
    }

    //navToNew() {
    //    this.router.navigate(["wam/countingsregister/countingsregister"], { queryParams: { ID: "" } });
    //}

    constructor(public service: ServiceCaller,
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute) {
        super(translate);
        // this.dataGrid.instance.refresh();

       
     }

    selectionChangedHandler() {
        if (this.selectedKeys.length == 1) {
            this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0].ID;
        }
        else {
            this.selectedRow = {};

        }
    }

    onGridItemClick(e) {

        switch (e.name) {

            case "dx-view":
                {
                    this.navToView();
                    break;
                }
            //case "DXInsert":
            //    {
            //        this.navToNew();
            //        e.handled = true;
            //        break;
            //    }
        }
    }


    onMenuItemClick(name) {
       
    }
}
