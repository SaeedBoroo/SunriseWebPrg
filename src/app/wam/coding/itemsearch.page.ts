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
    selector: 'wam-page-itemsearch',
    templateUrl: './itemsearch.page.html',
    providers: [ServiceCaller]
})
export class WAMItemSearchPage extends BasePage implements OnInit {

    ngOnInit() {
        //this.menuItems[3].visible = false;
    }
    @ViewChild('dataGrid') dataGrid: DxDataGridComponent;
    @ViewChild('form') form: DxValidationGroupComponent;

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
    gridItems = [];
    selectedKeys: any = [];
    //LOV
    codeType: any = {};
    method: any = {};

    parameters: any = {};
    //LovFilter
    categoryFilter: any = {};
    //Variables
    itemSelectedKeys: any = [];
    selectedRow: any = {};
    infoPopupVisibile: boolean = false;
    //DataCotainers
    headerItem: any = {};
    dataSource: any = {};
    localData = [];
    filter: any = {};
    //
    constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
        super(translate);
        //this.loadData();
        // this.dataSource.store = new CustomStore({
        //     key: "ID",
        //     load: (loadOptions) => {
        //         let deferred: Deferred<any> = new Deferred<any>();
        //         deferred.resolve(this.localData.filter(s => s.Flag != 3));
        //         return deferred.promise;
        //     }
        // });

        //this.loadData();


        this.route.queryParams.subscribe(params => {
        });
        //LOV
        this.categoryFilter = { ITCT_FILTER: null };
        this.service.loadLovData("LOV-WAM-011", (data) => { this.parameters = data; });
        this.service.loadLovData("LOV-WAM-010", (data) => { this.method = data; });
        this.service.loadLovData("LOV-WAM-009", (data) => { this.codeType = data; });
        //this.service.loadLovData("LOV-WAM-006", (data) => { this.category = data; }, { ITCT_FILTER : "41"});
    }

    clearForm() {
        this.headerItem = {};
        this.headerItem.Status = 10;
        this.localData = [];
        this.refreshGrid();
    }

    refreshGrid() {
        debugger;
        if (this.dataGrid != undefined)        
            this.dataGrid.instance.refresh();
    }

    onMenuItemClick(name) {
        {
            switch (name) {
                case 'Search': {
                    this.loadData();
                    break;
                }

                case "Back": {
                    this.router.navigate(["wam/coding/item"]);
                    break;
                }

                case 'Edit': {
                    var selectedID: any = this.dataGrid.instance.getSelectedRowsData()[0].ID;
                    console.log('selectedID');
                    console.log(selectedID);
                    if (selectedID == null) {
                        //notify("لطفا الگوی موردنظرانتخاب شود.", "error", 1000);
                        Notify.error('لطفا الگوی موردنظرانتخاب شود');
                    }
                    else {
                        this.router.navigate(['wam/coding/item'], { queryParams: { itemID: selectedID } });
                    }

                }
            }
        }
    }

    onGridItemClick(event) {

    }
    selectionChangedHandler() {
        if (this.itemSelectedKeys.length == 0) {
            this.itemSelectedKeys = {};
        }
        else if (this.itemSelectedKeys.length == 1) {
            this.itemSelectedKeys = this.dataGrid.instance.getSelectedRowsData()[0];
        }
        else {
            this.itemSelectedKeys = {};
        }
    }
    loadData() {
        // debugger;
        // this.service.get("/WAM/Item/ListHeader", (data) => {

        //     console.log("last data is :");
        //     console.log(data);
        //     this.localData = data ? data : [];
            this.refreshGrid();
        // }, this.filter);
    }
    codeChanged(data) {
        this.filter.Description = data.Title;
    }


    onRowDbClickRouting(e) {
        var selectedID: any = this.dataGrid.instance.getSelectedRowsData()[0].ID;
        this.router.navigate(['wam/coding/item'], { queryParams: { itemID: selectedID } });

    }
    //onQueryClick() {
    //    this.loadData();
    //}
}
