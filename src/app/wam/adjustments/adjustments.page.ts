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
    selector: 'wam-page-adjustments',
    templateUrl: './adjustments.page.html',
    providers: [ServiceCaller]
})



export class WAMAdjustmentsPage extends BasePage implements OnInit {


    ngOnInit() {

    }
    @ViewChild('CountingItems') itemGrid: DxDataGridComponent;

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
    readonly: boolean = false;
    insertItem: any = {};
    countings: string;
    countingsId: string = Guid.empty;


    menuItems: any[] = [
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
            name: "DeleteAdjustments",
            text: "حذف تعدیلات انبارگردانی",
            visible: true
        },
        {
            name: "VerifyAdjustments",
            text: "تائید تعدیلات انبارگردانی",
            visible: true
        },
        {
            name: "DoAdjustments",
            text: "اعمال تعدیلات انبارگردانی",
            visible: true
        },
        {
            icon: "fa fa-plus",
            text: 'انبارگردانی',
            items: [
                {
                    name: "ViewRecept",
                   // icon: 'fa fa-bar-chart green',
                    text: "مشاهده رسید تعدیلات انبارگردانی"
                },
                {
                    name: "NewOreder",
                   // icon: 'fa fa-pencil-square-o green',
                    text: "مشاهده حواله تعدیلات انبارگردانی"

                },

            ]
        },
    ];


    constructor(public service: ServiceCaller,
        public translate: TranslateService,
        private router: Router, private route: ActivatedRoute) {
        super(translate);
        //
        TEST.set(WAMAdjustmentsPage, this);
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
                this.headerItem.ID = params['ID'];
                this.service.get("/WAM/AdjustmentsItems/List", (data) => {
                     
                   // data.State
                    if (data.State == 1 || data.State == 2 || data.State == 3) {
                        this.menuItems[2].visible = false;
                        this.menuItems[3].visible = false;
                        this.menuItems[4].visible = false;
                        this.menuItems[5].visible =  true;
                    }
                    else {

                        if (data.State == 4) {
                            this.menuItems[2].visible = false;
                            this.menuItems[3].visible = false;
                            this.menuItems[5].visible = true;
                        }
                        else {
                            if (data.State == 5) {
                                this.menuItems[4].visible = false;
                                this.menuItems[5].visible = true;
                            }
                        }
                    }
                    this.headerItem.ID = data.ID;
                    Object.assign(this.headerItem, data);
                     
                    this.localData = data.AdjustmentsDetailItems;
                    this.localData.forEach(s => s.Flag = 2);
                    this.itemGrid.instance.refresh();
                }, param);
            }
            else {
                this.clearForm();
                if (this.itemGrid != undefined)
                    this.itemGrid.instance.refresh();
            }
        });
    }



    clearForm() {
        this.headerItem = {};
        this.headerItem = { State: 10 };
        this.localData = [];
        this.headerItem.ID = null;
        if (this.itemGrid != undefined)
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
                ItemCode: t.ItemCode,
                ItemId: t.ItemId,
                ItemDescription: t.ItemDescription,
                UnitItem: t.UnitItem,
                CNIT_QTY_INV: t.CNIT_QTY_INV,
                QuentityFinal: t.QuentityFinal,
                road: t.road,
                deficit: t.deficit
            }));
        //Update
        this.localData.filter(i => i.Flag == 2).forEach(t =>
            detailUpdate.push({
                ID: t.ID,
                ItemCode: t.ItemCode,
                ItemId: t.ItemId,
                ItemDescription: t.ItemDescription,
                UnitItem: t.UnitItem,
                CNIT_QTY_INV: t.CNIT_QTY_INV,
                QuentityFinal: t.QuentityFinal,
                road: t.road,
                deficit: t.deficit
            }));
        //Delete
        this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
        var Items: any = {};
        Items.InsertedItems = detailInsert;
        Items.UpdatedItems = detailUpdate;
        Items.DeletedItems = detailDelete;
        param.AdjustmentsDetailItems = Items;


        this.service.post("/WAM/Adjustments/Save", (data) => {
            this.localData = data.Items;
            this.router.navigate(["wam/adjustments/adjustmentssearch"]);
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
            case "Save": {

                this.saveAll();
                break;
            }
            case "DeleteAdjustments": {
                 
                var param: any = {};
                param.CountingId = this.headerItem.ID;
                this.service.post("/WAM/Adjustments/DeleteAdjustmentsDB", (data) => {
                    this.headerItem.State = 4;
                    //notify({
                    //    message: this.translate.instant("عملیات با موفقیت انجام شد"),
                    //    type: "success",
                    //    width: 300
                    //});
                    Notify.success('عملیات با موفقیت انجام شد');
                }, param);
                break;
            }
            case "VerifyAdjustments": {
                 
               

                break;
            }
            case "Back": {
                this.router.navigate(["wam/adjustments/adjustmentssearch"]);
                break;
            }
            case "DoAdjustments": {
                 
                var param: any = {};
                param.CountingId = this.headerItem.ID;
                this.service.post("/WAM/Adjustments/AddAdjustments", (data) => {
                    this.headerItem.State = 5;
                    this.menuItems[4].visible = false;
                    this.menuItems[2].visible = true;
                    this.menuItems[3].visible = true;
                    this.menuItems[5].visible = true;
                    //notify({
                    //    message: this.translate.instant("عملیات با موفقیت انجام شد"),
                    //    type: "success",
                    //    width: 300
                    //});
                    Notify.success('عملیات با موفقیت انجام شد');
                }, param);
                break;
            }
        }
    }

    onDataChange(e) {

        
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
        let that = TEST.get(WAMAdjustmentsPage);
        newData.ItemCode = value;
        newData.ItemDescription = that.editItem.ItemDescription;
    }

    OnPatternClick() {



    }





}

//

