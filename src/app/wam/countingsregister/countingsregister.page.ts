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
import { Guid } from '../../shared/types/GUID';
import { Notify } from '../../shared/util/Dialog';
const TEST = new WeakMap();


@Component({
    selector: 'wam-page-countingsregister',
    templateUrl: './countingsregister.page.html',
    providers: [ServiceCaller]
})

//

export class WAMCountingsRegisterPage extends BasePage implements OnInit {


    ngOnInit() {
    }
    @ViewChild('CountingsRegisterItems') itemGrid: DxDataGridComponent;

    saveParams: any = {};
    loadParams: any = {};
    CountingItemsSelectedKeys: any = [];
    selectedRow: any = {};
    lessMode: boolean = false;
    readOnlyLov: boolean = false;
    dataSource: any = {};
    localData: any = [];
    editItem: any = {};
    editRow: any = {};
    ReadOnlyAllField: boolean = false;
    lovOnFilterItem: any = {};
    itemsLength: Number = 0;
    filter: any = {};
    headerItem: any = {};
    SearchItem: any = {};
    readonly: boolean = false;
    insertItem: any = {};
    countings: string;
    countingsId: string = Guid.empty;




    menuItems: any[] = [
        //{
        //    name: "New",
        //    icon: "fa fa-plus green",
        //    text: this.translate.instant("NEW"),
        //    visible: true,
        //    disabled: false
        //},
        {
            name: "Save",
            icon: "fa fa-floppy-o green",
            text: this.translate.instant("SAVE"),
            visible: true,
            disabled: false
        },
        {
            name: "Back",
            text: "بازگشت",
            icon: "fa fa-arrow-left blue",
            visible: true
        },
        {
            name: "Zero",
            text: "ثبت صفر برای کالاهای ثبت نشده",
            visible: true
        },

    ];



    constructor(public service: ServiceCaller,
        public translate: TranslateService,
        private router: Router, private route: ActivatedRoute) {
        super(translate);
        TEST.set(WAMCountingsRegisterPage, this);
        this.route.queryParams.subscribe(params => {
            this.filter.ItemId = params['itemID'];
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
                if (updatedItem.ItemId == null)
                    updatedItem.ItemId = this.editItem.ItemId;
                Object.assign(updatedItem, values);
                deferred.resolve(true);
                return deferred.promise;
            },
            insert: (values) => {
                var detailInsert: any = [];
                let deferred: Deferred<any> = new Deferred<any>();
                var insertedItem = Object.assign(values, { ID: Math.random() }) as any;
                Object.assign(values, { Flag: 1, ItemId: this.editItem.ItemId }) as any;
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

        this.route.queryParams.subscribe(params => {
            if (params['ID'] != null) {
                var param: any = {};
                param.CountingId = params['ID'];
                this.service.get("/WAM/CountingsRegisterItems/List", (data) => {
                    this.headerItem.ID = data.ID;
                    Object.assign(this.headerItem, data);
                     
                    this.localData = data.CountingsDetailItems;
                    this.localData.forEach(s => s.Flag = 2);
                    this.itemGrid.instance.refresh();
                }, param);
            }
            else {
                this.clearForm();
                this.itemGrid.instance.refresh();
            }
        });

    }

    clearForm() {
        this.headerItem = {};
        this.headerItem = { State: 10 };
        this.localData = [];
        this.headerItem.ID = null;
        this.itemGrid.instance.refresh();

    }


    saveAll() {
         
        var param = this.headerItem;
        var detailInsert: any = [];
        var detailUpdate: any = [];
        var detailDelete: any = [];
        //Insert
        this.localData.filter(i => i.Flag == 1).forEach(t =>
            detailInsert.push({
                SequenceNumber: t.SequenceNumber,
                ItemCode: t.ItemCode,
                ItemId: t.ItemId,
                ItemDescription: t.ItemDescription,
                UnitItem: t.UnitItem,
                CNIT_QTY_INV: t.CNIT_QTY_INV,
                Quentity1: t.Quentity1,
                Quentity2: t.Quentity2,
                Quentity3: t.Quentity3,
            }));
        //Update
        this.localData.filter(i => i.Flag == 2).forEach(t =>
            detailUpdate.push({
                ID: t.ID,
                SequenceNumber: t.SequenceNumber,
                ItemCode: t.ItemCode,
                ItemId: t.ItemId,
                ItemDescription: t.ItemDescription,
                UnitItem: t.UnitItem,
                CNIT_QTY_INV: t.CNIT_QTY_INV,
                Quentity1: t.Quentity1,
                Quentity2: t.Quentity2,
                Quentity3: t.Quentity3,
            }));
        //Delete
        this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
        var Items: any = {};
        Items.InsertedItems = detailInsert;
        Items.UpdatedItems = detailUpdate;
        Items.DeletedItems = detailDelete;
        param.CountingsDetailItems = Items;


        this.service.post("/WAM/CountingsRegister/Save", (data) => {
            this.localData = data.Items;
            this.router.navigate(["wam/countingsregister/countingsregistersearch"]);
            //notify({
            //    message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
            //    type: "success",
            //    width: 400
            //});
            Notify.success('PUB_ACTION_SUCCESS_MSG');
        }, param);
    }



    onMenuItemClick(name) {
        switch (name) {
            case "New": {
                this.clearForm();
                break;
            }
            case "Save": {

                this.saveAll();
                break;
            }
            case "Back": {
                 
                this.router.navigate(["wam/countingsregister/countingsregistersearch"]);
                break;
            }
            case "Zero": {
                 
                console.log(this.localData);
                this.saveBeforeZero();
                this.service.post("/WAM/CountingsRegisterItems/ZeroRegister", (data) => {
                     
                    this.localData = data;
                    this.itemGrid.instance.refresh();
                }, this.localData);

                break;
            }

        }
    }




    onGridItemClick(e) {

    }



    CountingItemsselectionChangedHandler() {

        if (this.CountingItemsSelectedKeys.length == 1) {
            this.selectedRow = this.itemGrid.instance.getSelectedRowsData()[0];
        }
        else {
            this.selectedRow = {};
        }
    }



    onEditorPreparingCountingsGrid(e) {

        //if (e.parentType === "dataRow" && e.dataField == "Automatic")
        //    e.editorOptions.readOnly = true;
    }


    onCellItemChanged(data, cell) {
        this.editItem.ItemDescription = data.Description;
        this.editItem.ItemId = data.ID;
        cell.setValue(data.Code);
    }


    setCellValueWorkStation(newData, value, currentRowData) {

        let that = TEST.get(WAMCountingsRegisterPage);
        newData.ItemCode = value;
        newData.ItemDescription = that.editItem.ItemDescription;

    }

    onSearchClick() {
         
        var searchedItem = this.localData.filter(c => c.SequenceNumber == this.SearchItem.SequenceNumber)[0];
        this.SearchItem.ItemCode = searchedItem.ItemCode;
        this.SearchItem.ItemDescription = searchedItem.ItemDescription;
        switch (this.headerItem.State) {
            case 1: {
                this.SearchItem.Quentity = searchedItem.Quentity1 ;
                break;
            }
            case 2: {
                this.SearchItem.Quentity = searchedItem.Quentity2 ;
                break;
            }
            case 3: {
                this.SearchItem.Quentity = searchedItem.Quentity3 ;
                break;
            }
        }
        //this.SearchItem.Quentity1 = searchedItem.Quentity1;
        //this.SearchItem.Quentity2 = searchedItem.Quentity2;
        //this.SearchItem.Quentity3 = searchedItem.Quentity3;
    }

    onRegisterClick() {
         
        var searchedItem = this.localData.filter(c => c.SequenceNumber == this.SearchItem.SequenceNumber)[0];
        console.log(this.SearchItem);
        switch (this.headerItem.State)
        {
            case 1: {
                searchedItem.Quentity1 = this.SearchItem.Quentity;
               // this.SearchItem.Quentity = searchedItem.Quentity1;
                break;
            }
            case 2: {
                searchedItem.Quentity2 = this.SearchItem.Quentity;
               // this.SearchItem.Quentity = searchedItem.Quentity2;
                break;
            }
            case 3: {
                searchedItem.Quentity3 = this.SearchItem.Quentity;
               // this.SearchItem.Quentity = searchedItem.Quentity3;
                break;
            }
        }
        //searchedItem.Quentity1 = this.SearchItem.Quentity1;
        //searchedItem.Quentity2 = this.SearchItem.Quentity2;
        //searchedItem.Quentity3 = this.SearchItem.Quentity3;
        console.log(searchedItem);
        this.service.post("/WAM/CountingsRegisterItems/SaveNewQuentity", (data) => {
            this.itemGrid.instance.refresh();
            this.SearchItem = {};
        }, searchedItem);


    }

    onDataChange(e) {
         
        this.headerItem.State = e.ID;
        this.itemGrid.instance.refresh();
    }


    saveBeforeZero() {
         
        var param = this.headerItem;
        var detailInsert: any = [];
        var detailUpdate: any = [];
        var detailDelete: any = [];
        //Insert
        this.localData.filter(i => i.Flag == 1).forEach(t =>
            detailInsert.push({
                SequenceNumber: t.SequenceNumber,
                ItemCode: t.ItemCode,
                ItemId: t.ItemId,
                ItemDescription: t.ItemDescription,
                UnitItem: t.UnitItem,
                CNIT_QTY_INV: t.CNIT_QTY_INV,
                Quentity1: t.Quentity1,
                Quentity2: t.Quentity2,
                Quentity3: t.Quentity3,
            }));
        //Update
        this.localData.filter(i => i.Flag == 2).forEach(t =>
            detailUpdate.push({
                ID: t.ID,
                SequenceNumber: t.SequenceNumber,
                ItemCode: t.ItemCode,
                ItemId: t.ItemId,
                ItemDescription: t.ItemDescription,
                UnitItem: t.UnitItem,
                CNIT_QTY_INV: t.CNIT_QTY_INV,
                Quentity1: t.Quentity1,
                Quentity2: t.Quentity2,
                Quentity3: t.Quentity3,
            }));
        //Delete
        this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
        var Items: any = {};
        Items.InsertedItems = detailInsert;
        Items.UpdatedItems = detailUpdate;
        Items.DeletedItems = detailDelete;
        param.CountingsDetailItems = Items;


        this.service.post("/WAM/CountingsRegister/Save", (data) => {
            this.localData = data.Items;
            //notify({
            //    message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
            //    type: "success",
            //    width: 400
            //});
            Notify.success('PUB_ACTION_SUCCESS_MSG');
        }, param);
    }

}
