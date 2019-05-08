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
//import { DateTime, DateTimeFormat } from '../../shared/util/DateTime';
import { Notify } from '../../shared/util/Dialog';
//import { DateTime, DateTimeFormat } from '../../shared/util/DateTime';import { DateTime, DateTimeFormat } from '../../shared/util/DateTime';
const TEST = new WeakMap();
@Component({
    selector: 'wam-page-firstmovement',
    templateUrl: './firstmovement.page.html',
    providers: [ServiceCaller]
})

export class WAMFirstMovement extends BasePage implements OnInit {

    ngOnInit() {
    }
    @ViewChild('itemGrid') itemGrid: DxDataGridComponent;
    @ViewChild('form') form: DxValidationGroupComponent;



    //LOV

    ////
    items: any = {};
    units: any = {};
    itemUnitFilter: any = {};
    lovItemSettingFilter: any = {};
    reffrenceMovementFilter: any = { WRHS_ID: null, MVTP_ID: null };
    requestFilter: any = { WRHS_ID: null };
    movementItemFilter: any = {};
    requestItemFilter: any = {};
    warehouseItemFilter: any = {};



    itemSelectedKeys: any = [];
    selectedRow: any = {};
    editRow: any = {};
    infoPopupVisibile: boolean = false;
    refMvmnData: any = {};

    headerItem: any = {};
    dataSource: any = {};
    localData: any[] = [];
    headerItemsConfig: any = {};
    itemsLength: Number = 0;
    saveParams: any = {};
    loadParams: any = {};

    Name: string = null;
    type: string;
    typeId: string = Guid.empty;
    reffrenceMovementTypeID: string;
    RelationType: Number;
    ReffrenceType: Number;
    refName: string = null;
    refMovementType: string;
    filter: any = {};
    typeFilter: any = {};

    buttonDisabled: boolean = false;

    flgUpdateCode: boolean = false;

    lovIttp: any = {};

    flagSimpleMode: boolean = true;

    checkQuantityCommercial: Boolean = false;
    scale: any = 0;
    commercialScale: any = 0;
    menuItems: any[] = [
        {
            name: "New",
            icon: "fa fa-plus green",
            text: this.translate.instant("NEW"),
            visible: true,
            disabled: false
        },
        {
            name: "Save",
            icon: "fa fa-floppy-o green",
            text: this.translate.instant("SAVE"),
            visible: true,
            disabled: false
        },
        {
            name: "Search",
            icon: "fa fa-search",
            text: this.translate.instant("PUB_SEARCH"),
            visible: true,
            disabled: false
        }
    ];
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
                
        TEST.set(WAMFirstMovement, this);
        this.type = '191';
        this.setContext();
        this.clearForm();
        this.route.queryParams.subscribe(params => {
            this.filter.ID = params['ID'];
            //this.inputParam = params;
        });
        if (this.filter.ID != Guid.empty && this.filter.ID != null && this.filter.ID != undefined)
            this.loadData();

        //LOV

        this.service.loadLovData("LOV-WAM-004", (data) => { this.items = data; }, { ITEM_ITCT_FILTER: null, ITEM_ITCT_FILTER_ALLOW: null });
        service.get("/SYS/FORMS/List", (data) => {
            this.units = data.Data;
        }, { Code: "LOV-WAM-005" });

        this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })

    }

    onCellWarehouseItemCodeChanged(data, cell) {
        debugger; 
        this.editRow.ItemDescription = data.Description;
        this.editRow.ItemId = data.ID;
        this.saveParams.ItemId = data.ID;
        this.saveParams.MovementTypeId = this.typeId;
        this.editRow.ItemTypeId = data.ItemTypeId;
        this.saveParams.ItemTypeId = data.ItemTypeId;
        //this.editRow.RequestItemId = data.RequestItemId;
        //this.saveParams.RequestItemId = data.RequestItemId;
        //this.editRow.UnitDescription = data.UnitDescription;
        this.itemUnitFilter = { ITEM_ID: data.ID };
        //console.log('this.itemUnitFilter');
        //console.log(this.itemUnitFilter);
        cell.setValue(data.Code);
        //this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; }, { TYPE_ITEM_ID: this.editRow.ItemId })
        //
    }
    clearForm() {
        this.headerItem = {};
        //if (this.headerItem.Status != 10)
        this.headerItem = { Status: 10, MovementTypeID: this.typeId };
        this.localData = [];
        this.movementItemFilter = {};
        this.requestItemFilter = {};
        this.warehouseItemFilter = {};
        this.loadParams = {};
        if (this.itemGrid != undefined)
            this.itemGrid.instance.refresh();
    }
    onQtyValueChange() {
        this.checkQuantityCommercial = false;
    }
    onMenuItemClick(name) {
        switch (name) {
            case "New": {
                this.clearForm();
                this.itemsLength = 0;
                this.headerItem.MovementTypeID = this.typeId;
                break;
            }
            case "Search": {
                this.router.navigate(["wam/inventory/firstmovementsearch"], { queryParams: { type: this.type } }, );
                break;
            }
            case "Save": {
                 
                this.headerItem.MovementTypeID = this.typeId;
                 
                this.save();
                break;
            }
            case "Confirm": {
                this.headerItem.Status = 20;
                this.save();
                break;
            }
            case "Delete": {
                //this.deleteAll();
                //this.setContext();
                break;
            }
            case 'UserInfo':
                this.infoPopupVisibile = true;
                break;
            default:
        }
        //
    }

    warehouseChanged(data) {

        this.headerItem.WarehouseDescription = data.Title;
        this.requestFilter = { WRHS_ID: this.headerItem.WarehouseID, type: this.type }
    }

    yaerChanged(data) {

    }

    onCellUnitChanged(data, cell) {
        this.editRow.UnitId = data.ID;
        this.saveParams.UnitId = data.ID;
        this.editRow.UnitDescriptionCommercial = data.Title;
        this.scale = data.Scale;
        this.commercialScale = data.CommercialScale;
        cell.setValue(data.Title);
        //
    }
    setCellValueOfUnitCommercial(newData, value, currentRowData) {
        let that = TEST.get(WAMFirstMovement);
        newData.UnitDescriptionCommercial = that.editRow.UnitDescriptionCommercial;
        newData.SecondQuantityCommercial = null;
        newData.Quantity = null;
    }

    onCanceledItemRowGrid(e) {
        this.editRow = {};
    }
    onGridItemClick(e) { }


    selectionChangedHandler() {
        if (this.itemSelectedKeys.length == 0) {
            this.itemSelectedKeys = {};
        }
        else if (this.itemSelectedKeys.length == 1) {
            this.itemSelectedKeys = this.itemGrid.instance.getSelectedRowsData()[0];
        }
        else {
            this.itemSelectedKeys = {};
        }
    }

    onEditorPreparingItemsGrid(e) {
        if (e.parentType === "dataRow" && (e.dataField == "ItemDescription" || e.dataField == "UnitDescription" || e.dataField == "Quantity" || e.dataField == "ItemCode" || e.dataField == "Sequence"))
            e.editorOptions.readOnly = true;
    }
    onGridWarehouseItemMenuClick(e) {
        if (e.name == "DXInsert") {
            this.flgUpdateCode = false;
            if (this.headerItem.Status > 10) {
                //notify({
                //    message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
                //    type: "error",
                //    width: 400
                //});
                Notify.error('WAM_INVALID_UPDATE_MSG');
                e.handled = true;
            }
            else
                this.onCanceledItemRowGrid(e);
        }
        if (e.name == 'DXEdit') {
            this.flgUpdateCode = true;
            this.itemUnitFilter = { ITEM_ID: e.data.ItemId };
            console.log('this.editRow');
            console.log(this.editRow);
            if (this.headerItem.Status > 10) {
                //notify({
                //    message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
                //    type: "error",
                //    width: 400
                //});
                Notify.error('WAM_INVALID_UPDATE_MSG')
                e.handled = true;
            }
            else
                this.onCanceledItemRowGrid(e);
        }
        if (e.name == "DXDelete") {
            if (this.headerItem.Status > 10) {
                //notify({
                //    message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
                //    type: "error",
                //    width: 400
                //});
                Notify.error('WAM_INVALID_UPDATE_MSG');
                e.handled = true;
            }
            else
                this.onCanceledItemRowGrid(e);
        }
        if (e.name == "DXSelectedDelete") {
            if (this.headerItem.Status > 10) {
                //notify({
                //    message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
                //    type: "error",
                //    width: 400
                //});
                Notify.error('WAM_INVALID_UPDATE_MSG');
                e.handled = true;
            }
            else
                this.onCanceledItemRowGrid(e);
        }
    }

    setCellValueOfSecondQuantityCommercial(newData, value, currentRowData) {
         
        let that = TEST.get(WAMFirstMovement);
        newData.SecondQuantityCommercial = value;
        let vScale = that.scale;///
        if (that.scale == 0)
            newData.Quantity = value * currentRowData.UnitScale;
        else
            newData.Quantity = value * that.scale;
        if (that.commercialScale == 0)
            newData.QuantityCommercial = value * currentRowData.CommercialUnitScale;
        else
            newData.QuantityCommercial = value * that.commercialScale;
    }

    setCellValueOfItemCode(newData, value, currentRowData) {
         
        let that = TEST.get(WAMFirstMovement);
        console.log(that.editRow);
        console.log(that.editRow);
        newData.ItemCode = value;
        newData.ItemDescription = that.editRow.ItemDescription;
        newData.UnitDescription = that.editRow.UnitDescription;
        //newData.ItemDescription = 
    }
    itemGridOnInitNewRow(e) {
        this.itemsLength = Number.parseInt(this.itemsLength.toString()) + 1;
        e.data.Sequence = Number.parseInt(this.itemsLength.toString());
    }
    setContext() {
        debugger;
        if (this.typeId == Guid.empty) {
            this.typeFilter.Code = this.type;
            this.service.get("/WAM/MovementType/List", (data) => {
                this.headerItem.MovementTypeId = data[0].MovementTypeId;
                this.typeId = data[0].ID;
            }, this.typeFilter)
        }
        if (this.headerItem.ID == Guid.empty)
            this.buttonDisabled = true;
        else
            this.buttonDisabled = false;

    }
    InsertRows() {
         
        var result = this.form.instance.validate();
        if (result.isValid) {
            let year = this.headerItem.Year;
            //let date = this.headerItem.year + '/01/01';
            var param = this.headerItem;
            debugger;
            this.service.postPromise("/WAM/Movement/FirstMovement", param).then((data) => {
                this.headerItem = data;
                this.itemGrid.instance.refresh();
              //  this.headerItem.Year = (<string>DateTime.convertToLocal(data[0].Date).toString()).substr(0,4) ;
                this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
                this.saveParams = { MovementId: this.headerItem.ID }
                this.loadParams = { MovementId: this.headerItem.ID }
                //notify({
                //    message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
                //    type: "success",
                //    width: 400
                //});
                Notify.success('PUB_ACTION_SUCCESS_MSG');
            })
        }
    }
    loadData() {
        //let date = this.headerItem.year + '/01/01';
         
        //this.headerItem.Date = DateTime.convertForRemote(date);
        this.filter.TypeCode = this.type;
        this.service.get("/WAM/Movement/List", (data) => {
            if (data[0].ID != Guid.empty) {
                this.headerItem = data[0];
                //this.headerItem.Year = (<string>DateTime.convertToLocal(data[0].Date).toString()).substr(0,4) ;
                this.localData = data[0].Items;
                this.itemsLength = this.localData.length;
                console.log('this.localData = data[0].Items');
                console.log(this.localData = data[0].Items);
                this.itemGrid.instance.refresh();
                this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
                this.saveParams = { MovementId: this.headerItem.ID }
                this.loadParams = { MovementId: this.headerItem.ID }
                this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })
            }
            else {
                this.clearForm;
            }
        }, this.filter);
    }
    save() {
        var result = this.form.instance.validate();
        if (result.isValid) {
            let year = this.headerItem.Year;
            let date = this.headerItem.Year + '/01/01';
            debugger;
            //DateTime.convertForRemote(date);
            //this.headerItem.Date = DateTime.convertForRemote(date);
            var param = this.headerItem;
            this.service.postPromise("/WAM/Movement/Save", param).then((data) => {
                this.headerItem = data;
                this.itemGrid.instance.refresh();
                //this.headerItem.Year = data.Date;
               // this.headerItem.Year =  (<string>DateTime.convertToLocal(data.Date).toString()).substr(0,4);
                this.warehouseItemFilter = { WarehouseID: this.headerItem.WarehouseID, MVMN_ID: this.headerItem.ID }
                this.saveParams = { MovementId: this.headerItem.ID }
                this.loadParams = { MovementId: this.headerItem.ID }
                //notify({
                //    message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
                //    type: "success",
                //    width: 400
                //});
                Notify.success('PUB_ACTION_SUCCESS_MSG');
            })
        }
    }
}
