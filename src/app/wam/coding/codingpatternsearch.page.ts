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
    selector: 'wam-page-codingpatternsearch',
    templateUrl: './codingpatternsearch.page.html',
    providers: [ServiceCaller]
})
export class WAMCodingPatternSearchPage extends BasePage implements OnInit {

    ngOnInit() {

    }

    @ViewChild('datagrid') dataGrid: DxDataGridComponent;
    @ViewChild('form') form: DxValidationGroupComponent;

    menuItems = [
        {
            name: "Search",
            icon: "fa fa-search blue",
            text: "جستجو",
            visible: true
        },
        // {
        //     name: "Edit",
        //     text: "انتخاب",
        //     icon: "fa fa-edit yellow",
        //     visible: true
        // },
        {
            name: "Back",
            icon: "fa fa-arrow-left",
            text: this.translate.instant("بازگشت"),
            visible: true
        },
    ];

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
    localData: any[] = [];
    filter: any = {};
    //

    flagSimpleMode: boolean = true;

    constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
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

        this.loadData();

        this.route.queryParams.subscribe(params => {
        });



        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred: Deferred<any> = new Deferred<any>();
                deferred.resolve(this.localData.filter(s => s.Flag != 3));
                return deferred.promise;
            },
            update: (key, values) => {
                let deferred: Deferred<any> = new Deferred<any>();
                var updatedItem = this.localData.filter(c => c.ID == key)[0];
                updatedItem.Flag = 2;
                Object.assign(updatedItem, values);
                deferred.resolve(true);
                return deferred.promise;
            },
            insert: (values) => {
                var detailInsert: any = [];
                let deferred: Deferred<any> = new Deferred<any>();
                var insertedItem = Object.assign(values, { ID: Math.random() }) as any;
                Object.assign(values, { Flag: 1 }) as any;
                this.localData.push(values);
                deferred.resolve(true);
                return deferred.promise;
            }
            , remove: (key) => {
                let deferred: Deferred<any> = new Deferred<any>();
                this.localData.filter(c => c.ID == key)[0].Flag = 3;
                deferred.resolve(this.localData.filter(s => s.Flag != 3));
                return deferred.promise;
            }
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
                    this.router.navigate(["wam/coding/codingpattern"]);
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
                        this.router.navigate(['wam/coding/codingpattern'], { queryParams: { codingPatternID: selectedID, formStatus: 1 } });
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
         
        this.service.get("/WAM/CodingPattern/List", (data) => {
            console.log("last data is :");
            console.log(data);

            if (data[0] != null) {
                this.headerItem = data[0];
                console.log('Items: ');
                console.log(data[0].Details);
                this.localData = data[0].Details;
                this.dataGrid.instance.refresh();
            }
            else this.clearForm();
        }, this.filter);
    }
    searchClick() {
        this.loadData();
    }
    onRowDbClickRouting(e) {
        this.navToView();
    }
    navToView() {
         
        //this.router.navigate(["wam/request/mrprequest"], { queryParams: { ID: this.selectedKeys[0] } });
        var selectedID: any = this.dataGrid.instance.getSelectedRowsData()[0].ID;

        this.router.navigate(['wam/coding/codingpattern'], { queryParams: { codingPatternID: selectedID, formStatus: 1 } });
    }
}
