import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModule, Pipe, PipeTransform, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
    DxDataGridModule,
    DxSparklineModule,
    DxTemplateModule
} from 'devextreme-angular';
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
import { Guid } from '../../shared/types/GUID';
import { DateTime, DateTimeFormat } from '../../shared/util/DateTime';

@Component({
    selector: 'wam-page-cardex',
    templateUrl: './cardex.page.html',
    providers: [ServiceCaller]
})
export class WAMCardexPage extends BasePage implements OnInit {

    ngOnInit() {
        //this.menuItems[3].visible = false;
    }
    @ViewChild('form') form: DxValidationGroupComponent;//cardexGrid
    @ViewChild('gridContainer') cardexGrid: DxDataGridComponent;

    searchItem: any = {};
    dataSource: any = {};
    localData = [];
    menuItems = [];
    itemSelectedKeys: any = [];
    selectedRow: any = {};
    flgMesurementType: boolean = false;
    typeFilter: any = {};

    gridItems = [
        {
            name: "dx-view",
            icon: "fa fa-eye green",
            text: 'مشاهده',
        }
    ];
    //
    constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
        super(translate);

        this.searchItem = { BaseMeasurementUnit: 1, ReportTypeWarehouse: 1 ,FlagTemporary:false};
        let today = DateTime.convertForRemote(DateTime.now);
        this.service.get("/WAM/Period/GetPeriodStart", (data) => {
            this.searchItem.DateFrom = data;
            },{filter:today}); 



        
        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred: Deferred<any> = new Deferred<any>();
                deferred.resolve(this.localData.filter(s => s.Flag != 3));
                return deferred.promise;
            }
        });
        this.route.queryParams.subscribe(params => {
            this.searchItem.WarehouseID = params['WarehouseID'];
            this.searchItem.ItemId = params['ItemID'];
            this.searchItem.inputParam = params['inputParam'];
            this.searchItem.DateFrom = params['DateFrom'];
            this.searchItem.DateTo = params['DateTo'];
        });
        //this.loadData();
    }
    onMenuItemClick(e) {}
    loadData() {
        if (this.form != undefined) {
            //this.searchItem.WarehouseIDList = [];//
            //this.searchItem.WarehouseIDList.push(this.searchItem.WarehouseID);
            //var result = this.form.instance.validate();
            //if (result.isValid) {
                debugger;
                this.service.post("/WAM/Cardex/List", (data) => {
                    this.localData = data;
                    if (this.searchItem.BaseMeasurementUnit == 2)
                        this.flgMesurementType = true;
                    else
                        this.flgMesurementType = false;
                    if (this.cardexGrid != undefined)
                        this.cardexGrid.instance.refresh();
                }, this.searchItem);
            // }
            // else {
            //     this.localData = [];
            //     if (this.cardexGrid != undefined)
            //         this.cardexGrid.instance.refresh();
            // }
        }

    }
    selectionChangedHandler() {
        this.selectedRow = this.cardexGrid.instance.getSelectedRowsData()[0];
    }
    onCardexMenuItemClick(e) {
        if (e.name == "dx-view") {
            debugger;
            this.router.navigate(["wam/movement/movement"], { queryParams: { ID: this.selectedRow.MovementID, type: this.selectedRow.MvtpTypeCode, sourceForem: 'CARDEX', WarehouseID: this.searchItem.WarehouseID, ItemID: this.searchItem.ItemId, DateFrom: this.searchItem.DateFrom, DateTo: this.searchItem.DateTo } });
        }
    }

    onCardexClick(cell) {
        this.router.navigate(["wam/movement/movement"], { queryParams: { ID: this.selectedRow.MovementID, type: this.selectedRow.MvtpTypeCode, sourceForem: 'CARDEX', WarehouseID: this.searchItem.WarehouseID, ItemID: this.searchItem.ItemId, DateFrom: this.searchItem.DateFrom, DateTo: this.searchItem.DateTo } });
    }

    warehouseChanged(e) {
         
        this.searchItem.WarehouseIDList = [];
        this.searchItem.WarehouseDescription = "";
        if (e.constructor == Array) {
            e.forEach(d => {
                this.searchItem.WarehouseIDList.push(d.ID);
                this.searchItem.WarehouseDescription += d.Title + ',';
            });
        }
        else
        {
            this.searchItem.WarehouseIDList.push(e.ID);
            this.searchItem.WarehouseDescription = e.Title;  
        }
    }

    itemChanged(e){
        this.typeFilter = {TYPE_ITEM_ID:e.ID}
    }
}

//@Pipe({ name: 'gridCellData' })
//export class GridCellDataPipe implements PipeTransform {
//    transform(gridData: any) {
//        return gridData.data[gridData.column.caption.toLowerCase()];
//    }
//}

