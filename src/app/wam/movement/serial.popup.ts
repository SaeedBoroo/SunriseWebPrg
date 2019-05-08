import { Component, Input, OnInit, Output, ViewChild, AfterViewInit, EventEmitter, ContentChild, ComponentFactoryResolver, ComponentFactory, Injector, EmbeddedViewRef, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import 'rxjs/add/operator/toPromise';
import { LabelComponent } from "../../shared/components/label.component";
import { Guid } from '../../shared/types/GUID';
import { Notify, Dialog } from '../../shared/util/Dialog';
import { debounce } from 'rxjs/operators/debounce';
import { debug } from 'util';
const TEST = new WeakMap();


//
@Component({
  selector: 'wam-serial-popup',
  templateUrl: './serial.popup.html'
})
export class WAMSerialPopupPage extends BasePage {
  @ViewChild('traceGrid') traceGrid: DxDataGridComponent;
  @ViewChild('lotGrid') lotGrid: DxDataGridComponent;

  // Visible
  @Output()
  visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _visible: boolean;
  @Input()
  get visible(): boolean {
    return this._visible;
  }

  set visible(val: boolean) {
    this._visible = val;
    this.visibleChange.emit(this._visible);
  }

  // flgCreateTagVisible
  @Output()
  flgCreateTagVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _flgCreateTagVisible: boolean;
  @Input()
  get flgCreateTagVisible(): boolean {
    return this._flgCreateTagVisible;
  }

  set flgCreateTagVisible(val: boolean) {
    this._flgCreateTagVisible = val;
    this.flgCreateTagVisibleChange.emit(this._flgCreateTagVisible);
  }

  //tagRelatedData
  @Output()
  tagRelatedDataChange: EventEmitter<any> = new EventEmitter<any>();

  _tagRelatedData: any;
  @Input()
  get tagRelatedData(): any {
    return this._tagRelatedData;
  }

  set tagRelatedData(val: any) {
    this._tagRelatedData = val;
  }


  CentricAccountFilter: any = {};
  traceLoadParam: any = {};
  lotLoadParam: any = {};
  lotSaveParam: any = {};

  traceSelectedKeys: any = [];
  lotSelectedKeys: any = [];

  traceSelectedRow: any = {};
  lotSelectedRow: any = {};

  editRow: any = {};

  lotFilter: any = {};

  groupLotSaveParam: any = [];

  createTagData: any = {};
  constructor(public service: ServiceCaller, public translate: TranslateService) {
    //
    super(translate);
    TEST.set(WAMSerialPopupPage, this);

  }
  onCancelSerialPopup() {
    this.visible = false;
  }

  onFormSubmit() {
    let MvitId = this.tagRelatedData.ID;
    this.service.get("/WAM/MovementTrace/Confirm", (data) => {
      if (data)
        this.visible = false;
      else
        Notify.error('PUB_LOT_QTY_ERROR');
    }, { MvitID: MvitId });
  }



  onCreateClick() {

    this.createTagData.MovementItemId = this.tagRelatedData.ID;
    this.service.post("/WAM/MovementTrace/AutomaticInsert", (data) => {
      this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
      // this.lotLoadParam.MovementItemId = this.selectedRow.ID;
      // this.lotLoadParam.MovementTraceId = this.selectedRow.ID;
      this.traceGrid.instance.refresh();
      this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
      this.lotGrid.instance.refresh();
      Notify.success('PUB_ACTION_SUCCESS_MSG');
    }, this.createTagData);
  }
  onShow(e) {
debugger;
    this.createTagData.CentricAccountId = this.tagRelatedData.CentricAccountId;
    this.createTagData.LocationID = this.tagRelatedData.LocationId;
    this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
    this.createTagData.Quantity = this.tagRelatedData.SecondQuantityCommercial;
    this.traceGrid.instance.refresh();
    this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
    this.lotGrid.instance.refresh();
    this.lotFilter = { ITEM_ID: this.tagRelatedData.ItemId, WRHS_ID: this.tagRelatedData.WarehouseID, Date: this.tagRelatedData.Date, reffrenceMovementTypeID: this.tagRelatedData.reffrenceMovementTypeID, MVIT_MVIT_ID: this.tagRelatedData.ReffrenceMovementItemId, CNAC_ID: this.tagRelatedData.CentricAccountId };
  }

  traceSelectionChangedHandler() {

    if (this.traceSelectedKeys.length == 1) {
      this.traceSelectedRow = this.traceGrid.instance.getSelectedRowsData()[0];
      this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
      this.lotGrid.instance.refresh();
    }
    else {
      this.traceSelectedRow = {};
    }
  }

  lotSelectionChangedHandler() {

    if (this.lotSelectedKeys.length == 1) {
      //this.lotSelectedRow = this.lotGrid.instance.getSelectedRowsData()[0];
      //this.lotLoadParam = {MovementItemId : this.selectedRow.ID, MovementTraceId: this.lotSelectedRow.ID }
      //this.traceGrid.instance.refresh();
    }
    else {
      this.lotSelectedRow = {};
    }
  }
  onGridLotClick(e) {
    debugger;//
    if (e.name == "DXInsert") {
      if (this.flgCreateTagVisible) {
        Notify.error('WAM_INVALID_INSERT_TAG');
        e.handled = true;
      }
      else
        this.onCanceledItemRowGrid(e);
    }
    else if (e.name == "DXSave") {
      if (!this.tagRelatedData.tagRequired) {
        this.service.post("/WAM/MovementLot/GroupSave", (data) => {
          this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
          this.traceGrid.instance.refresh();
          this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
          this.lotGrid.instance.refresh();
          Notify.success('PUB_ACTION_SUCCESS_MSG');
        }, this.groupLotSaveParam);
        this.groupLotSaveParam = [];
      }
      else if (this.tagRelatedData.tagRequired) {
        this.service.post("/WAM/MovementLot/SaveWithMVIT", (data) => {
          this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
          this.traceGrid.instance.refresh();
          this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
          this.lotGrid.instance.refresh();
          Notify.success('PUB_ACTION_SUCCESS_MSG');
        }, this.groupLotSaveParam);
        this.groupLotSaveParam = [];
      }
    }
    if (e.name == 'DXEdit') {
      //if (this.flgCreateTagVisible) {
      //   Notify.error('WAM_INVALID_INSERT_TAG');
      //   e.handled = true;
      // }
      // else
      this.onCanceledItemRowGrid(e);
    }
    // if (e.name == "DXDelete") {
    //   if (this.flgCreateTagVisible) {
    //     Notify.error('WAM_INVALID_UPDATE_MSG');
    //     e.handled = true;
    //   }
    //   else
    //     this.onCanceledItemRowGrid(e);
    // }

    if (e.name == "DXSelectedDelete") {
      if (this.lotSelectedKeys.length > 0) {
        let delData: any = [];
        delData = this.lotSelectedKeys;
        // let result = confirm(this.translate.instant("PUB_CONFIRM_DELETE"), this.translate.instant("PUB_CONFIRM"));
        // result.then((dialogResult) => {
        //   if (dialogResult)
        //     this.service.post("/WAM/MovementLot/Delete", (data) => {
        //       this.lotSelectedKeys = [];
        //       this.lotGrid.instance.refresh();
        //     }, delData);
        // });
        Dialog.delete().done(() => {
          this.service.post("/WAM/MovementLot/Delete", (data) => {
            this.lotSelectedKeys = [];
            this.lotGrid.instance.refresh();
          }, delData);
        });
      }
    }
    // if (e.name == "DXSelectedDelete") {
    //   e.handled = true;

    // }
    // if (e.name == "DXSelectedDelete") {
    //   if (this.flgCreateTagVisible) {
    //     Notify.error('WAM_INVALID_UPDATE_MSG');
    //     e.handled = true;
    //   }
    //   else
    //     this.onCanceledItemRowGrid(e);
    // }
  }
  onCanceledItemRowGrid(e) {
    this.editRow = {};
  }

  onEditorPreparingItemsGrid(e) {
    //if (e.parentType === "dataRow" )
    //e.editorOptions.readOnly = true;
  }

  onCellTraceChanged(data, cell) {
    this.traceLoadParam.TraceCode = data.Code;
    this.traceLoadParam.TraceId = data.ID;
    //this.editItem.MovementItemId = 
  }

  onCellLotChanged(e, cell) {

    this.lotSaveParam.LotIDList = [];
    //this.lotSaveParam.WarehouseDescription = "";
    if (e.constructor == Array) {
      e.forEach(d => {
        this.groupLotSaveParam.push({ LotNumberId: d.ID, MovementItemId: this.tagRelatedData.ID, CentricAccountId: d.CentricAccountId, LocationID: d.LocationID });
        //this.lotSaveParam.WarehouseDescription += d.Title + ',';
      });
    }

    //this.createTagData.MovementItemId = this.tagRelatedData.ID;
    // this.service.post("/WAM/MovementLot/GroupSave", (data) => {
    //   this.traceLoadParam.MovementItemId = this.tagRelatedData.ID;
    //   this.traceGrid.instance.refresh();
    //   this.lotLoadParam = { MovementItemId: this.tagRelatedData.ID, MovementTraceId: this.traceSelectedRow.ID }
    //   this.lotGrid.instance.refresh();
    //   Notify.success('PUB_ACTION_SUCCESS_MSG');
    // }, this.groupLotSaveParam);
    // this.groupLotSaveParam = [];
    //  
    // this.lotSaveParam.LotNumberId = data.ID;
    // this.lotSaveParam.CentricAccountId = data.CentricAccountId;
    // this.lotSaveParam.LocationID = data.LocationID;
    // this.lotSaveParam.CentricAccountName = data.CentricAccountName;
    // this.lotSaveParam.LocationDescription = data.LocationDescription;
    // this.lotSaveParam.CentricAccountTypeDescription = data.CentricAccountTypeDescription;
    // this.lotSaveParam.MovementItemId = this.tagRelatedData.ID;
  }
  setCellValueOfLot(newData, value, currentRowData) {
    let that = TEST.get(WAMSerialPopupPage);

    newData.CentricAccountName = that.lotSaveParam.CentricAccountName;
    newData.CentricAccountTypeDescription = that.lotSaveParam.CentricAccountTypeDescription;
    newData.LocationDescription = that.lotSaveParam.LocationDescription;
  }
  lotInserted() {
    this.traceGrid.instance.refresh();
  }

  onCellAccountTypeChanged(data, cell) {
    this.CentricAccountFilter = { TypeId: data.ID };
    cell.setValue(data.Title);
  }


  onCellCentricAccountChanged(data, cell) {
    this.lotSaveParam.CentricAccountId = data.ID;
    cell.setValue(data.Title);
  }


  onCellLocationChanged(data, cell) {
    this.lotSaveParam.LocationID = data.ID;
    cell.setValue(data.Title);
  }

  setCellValueOfAccountType(newData, value, currentRowData) {
    // let that = TEST.get(WAMSerialPopupPage);
    // newData.CentricAccountName = that.editRow.CentricAccountName;
  }
  setCellValueOfCentricAccount(newData, value, currentRowData) {
    let that = TEST.get(WAMSerialPopupPage);
    newData.CentricAccountName = that.editRow.CentricAccountName;
    newData.CentricAccountId = that.lotSaveParam.CentricAccountId;
  }
  setCellValueOfLocation(newData, value, currentRowData) {
    let that = TEST.get(WAMSerialPopupPage);
    newData.LocationDescription = that.editRow.LocationDescription;
    newData.LocationID = that.lotSaveParam.LocationID;
  }

}
