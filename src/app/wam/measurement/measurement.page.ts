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

@Component({
    selector: 'wam-page-measurement',
    templateUrl: './measurement.page.html',
    providers: [ServiceCaller]
})

export class WAMMeasurementPage extends BasePage {
    //@ViewChild('datagrid') grid: DxDataGridComponent;
    //@ViewChild('form') form: DxValidationGroupComponent;
    @ViewChild('gridMaster') dataGrid: DxDataGridComponent;
    @ViewChild('gridDetail') dataGridDetail: DxDataGridComponent;

    headerItem: any = {};
    dataSource: any = {};
    localData: any[] = [];
    selectedRow: any = {};
    formStatus: number = 0;
    disableScale: boolean = true;
    filter: any = {};

    selectedKeys: any = [];

    loadParams: any = {};

    itemsLength: Number = 0;

    menuItems: any[] = [
        //{
        //    name: "New",
        //    icon: "fa fa-plus green",
        //    text: this.translate.instant("NEW"),
        //    visible: true
        //},
        //{
        //    name: "Save",
        //    icon: "fa fa-floppy-o green",
        //    text: this.translate.instant("SAVE"),
        //    visible: true
        //},
        //{
        //    name: "Search",
        //    icon: "fa fa-search",
        //    text: this.translate.instant("PUB_SEARCH"),
        //    visible: true
       // },
        //{
        //    name: "UnitScales",
        //    icon: "fa fa-balance-scale green",
        //    text: this.translate.instant("UNIT_SCALE"),
        //    visible: true,
        //    //disabled: this.disableScale

        //}
    ];
    constructor(public service: ServiceCaller, private router: Router, public translate: TranslateService, private route: ActivatedRoute) {
        super(translate);
        //this.route.queryParams.subscribe(params => { this.filter.ClassId = params['classId'], this.formStatus = params['formStatus'] });
        //if (this.formStatus == 1) {
        //    this.service.get("/WAM/MeasurementClass/List", (data) => {
        //        this.headerItem = data[0];
        //        //this.disableScale = false;
        //        this.localData = this.headerItem.Units;
        //        this.itemsLength = this.localData.length;
        //        this.grid.instance.refresh();
        //    }, this.filter);
        //}

        //this.dataSource.store = new CustomStore({
        //    key: "ID",
        //    load: (loadOptions) => {
        //        let deferred: Deferred<any> = new Deferred<any>();
        //        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        //        return deferred.promise;
        //    },
        //    update: (key, values) => {
        //        let deferred: Deferred<any> = new Deferred<any>();
        //        var updatedItem = this.localData.filter(c => c.ID == key)[0];
        //        updatedItem.Flag = 2;
        //        Object.assign(updatedItem, values);

        //        //if (this.dataSource.filter(c =>
        //        //    c.ID != updatedItem.ID &&
        //        //    c.Flag != 3 &&
        //        //    c.SubjectId == updatedItem.SubjectId &&
        //        //    c.RoomTypeId == updatedItem.RoomTypeId).length > 0
        //        //) {
        //        //    deferred.reject("تکراری");
        //        //    return deferred.promise;
        //        //}
        //        //else {
        //        deferred.resolve(true);
        //        return deferred.promise;
        //        // }
        //    },
        //    insert: (values) => {
        //        var detailInsert: any = [];
        //        let deferred: Deferred<any> = new Deferred<any>();

        //        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;

        //        Object.assign(values, { Flag: 1 }) as any;
        //        this.localData.push(values);
        //        deferred.resolve(true);
        //        return deferred.promise;
        //    }

        //    , remove: (key) => {
        //        let deferred: Deferred<any> = new Deferred<any>();
        //        this.localData.filter(c => c.ID == key)[0].Flag = 3;
        //        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        //        return deferred.promise;
        //    }
        //});
    }

    onButtonClick(name) {
        //if (name == "New") {
        //    this.grid.instance.addRow();
        //    //this.dataSource. = 1;
        //}

    }

    //onMenuItemClick(name) {
    //    if (name == "New") {
    //        this.clearForm();
    //    }
    //    if (name == "Save") {
    //        console.log(this.headerItem);
    //        //var result = this.form.instance.validate();
    //        //if (result.isValid) {
    //        var param = this.headerItem;
    //        var detailInsert: any = [];
    //        var detailUpdate: any = [];
    //        var detailDelete: any = [];
    //        //Insert
    //        this.localData.filter(i => i.Flag == 1).forEach(t =>
    //            detailInsert.push({
    //                BaseFlag: t.BaseFlag,
    //                Description: t.Description,
    //                DescriptionLatin: t.DescriptionLatin,
    //                DecimalFlag: t.DecimalFlag,
    //                DecimalQuantity: t.DecimalQuantity,
    //                IsActive: t.IsActive,
    //                Code: t.Code,
    //                MeasurementClassId: t.MeasurementClassId
    //            }));
    //        //Update
    //        this.localData.filter(i => i.Flag == 2).forEach(t =>
    //            detailUpdate.push({
    //                ID: t.ID,
    //                BaseFlag: t.BaseFlag,
    //                Description: t.Description,
    //                DescriptionLatin: t.DescriptionLatin,
    //                DecimalFlag: t.DecimalFlag,
    //                DecimalQuantity: t.DecimalQuantity,
    //                IsActive: t.IsActive,
    //                Code: t.Code,
    //                MeasurementClassId: t.MeasurementClassId
    //            }));

    //        //Delete
    //        this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
    //        var Items: any = {};
    //        Items.InsertedItems = detailInsert;
    //        Items.UpdatedItems = detailUpdate;
    //        Items.DeletedItems = detailDelete;
    //        param.Units = Items;
    //        this.service.post("/WAM/MeasurementClass/Save", (data) => {
    //            notify({
    //                message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
    //                type: "success",
    //                width: 400
    //            });
    //        }, param);
    //    }

    //    if (name == "UnitScales") {
    //        this.router.navigate(["wam/measurement/measurementscale"], { queryParams: { classID: this.headerItem.ID } });
    //    }

    //    if (name == "Search") {
    //        this.router.navigate(["wam/measurement/measurementsearch"]);
    //    }
    //}

    msunGridOnInitNewRow(e) { e.data.BaseFlag = false; e.data.IsActive = false;}
    //clearForm() {
    //    this.headerItem = {};
    //    this.localData = [];
    //    this.grid.instance.refresh();
    //}
    onDetailGridItemClick(e) {
        console.log('e');
        console.log(e);
        if (this.selectedKeys.length == 0) {
          Notify.error('WAM_MEASUREMENT_NULL_CLASS');
            e.handled = true;
        }
    }
    selectionChangedHandler() {
        if (this.selectedKeys.length == 1) {
            this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
            this.loadParams = { ClassId: this.selectedRow.ID }
            this.dataGridDetail.instance.refresh();
        }
        else {
            this.selectedRow = {};
        }        
    }
    detailSelectionChangedHandler() { };

  onGridItemClick(e) {
     
    if (e.name == "DXInsert") {
      this.selectedKeys = [];
      this.loadParams = {}
      this.dataGridDetail.instance.refresh();
    };
  }
}
