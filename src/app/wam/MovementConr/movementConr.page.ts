import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Router, ActivatedRoute } from '@angular/router'
import { Deferred } from '../../shared/Deferred';

import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { RouteData } from '../../shared/util/RouteData';
import { Notify, Dialog } from '../../shared/util/Dialog';
import { DateTime, DateTimeFormat } from '../../shared/util/DateTime';
import { DXLovComponent } from '../../shared/components/dx-lov.component';


@Component({
  selector: 'wam-page-movementConr',
  templateUrl: './movementConr.page.html',
})
export class WAMMovementConrPage extends BasePage implements OnInit {
  ngOnInit(): void {
  }
  @ViewChild('form') form: DxValidationGroupComponent;
  @ViewChild('movementPopupForm') movementPopupForm: DxValidationGroupComponent;
  @ViewChild('DlvGrid') DlvGrid: DxDataGridComponent;
  @ViewChild('RcptGrid') RcptGrid: DxDataGridComponent;
  @ViewChild('fastSearchLov') fastSearchLov: DXLovComponent;



  /**
   * **********************
   */
  headerItems: any = {};
  tagRelatedData: any = {};
  dlvParams: any = {};
  rcptParams: any = {};
  movmentPopupItems: any = {};
  movementPopupItemsTo: any = {};
  SearchItems: any = {};
  formConfig: any = {};
  accordionSelectedItems: any = [];
  dlvGridSelectedKeys: any = [];
  rcptGridSelectedKeys: any = [];
  /**
   * *********************
   */


  menuItems: any[] = [
    {
      name: "New",
      icon: "fa fa-plus green",
      // text: this.translate.instant("PUB_NEW"),
      visible: true,
      disabled: false,
    },
    {
      name: "Save",
      tooltip: this.translate.instant("PUB_SAVE"),
      enabled: false,
      icon: "fa fa-floppy-o green",
      // text: this.translate.instant("SAVE"),
      visible: true,
      disabled: false,
    },
    {
      name: "Refresh",
      //text: this.translate.instant("PUB_REFRESH"),
      icon: "fa fa-refresh yellow",
      visible: true,
      disabled: false,
    },

    {
      name: "Delete",
      icon: "fa fa-trash",
      // text: this.translate.instant("PUB_DELETE"),
      visible: true,
    },
    {
      name: "Search",
      icon: "fa fa-search",
      // text: this.translate.instant("PUB_SEARCH"),
      visible: true,
      disabled: false,
    },
    {
      name: "Confirm",
      tooltip: this.translate.instant("PUB_CONFIRM"),
      enabled: false,
      icon: "fa fa-check green",
      text: this.translate.instant("PUB_CONFIRM"),
      visible: true,
      disabled: false,
    }
  ];
  gridsItems: any[] = [
    {
      name: "DXTag",
      icon: "fa fa-tags",
      text: this.translate.instant("SELECT_TAG"),
      visible: true
    }
  ];
  onMenuItemClick(name) {
    if (name == "New") {
      this.clearForm();
      this.controlItemsAccess();
    }
    if (name == "Save") {
      if (this.headerItems.Type != 10)
        Notify.error('PUB_NO_CHANGE_IN_CONFIRM_MODE');
      else if (this.headerItems.ID == null)
        Notify.error('PUB_HEADER_WILL_SAVE_WITH_DETAIL');
      else
        this.onSaveClick();
    }
    if (name == "Refresh") {
      if (this.headerItems != undefined && this.headerItems.ID != null)
        this.initForm();
    }
    if (name == "Delete") {
      if (this.headerItems.Type != 10)
        Notify.error('PUB_NO_CHANGE_IN_CONFIRM_MODE');
      else {
        if (this.headerItems != undefined && this.headerItems.ID != null)
          Dialog.delete().done(() => {
            let delData: any = [];
            delData.push(this.headerItems.ID)
            this.service.post("/WAM/MovementConr/Delete", (data) => {
              Notify.success('PUB_ACTION_SUCCESS_MSG');
              this.clearForm();
              this.controlItemsAccess();
            }, delData);
          });
      }
    }

    if (name == "Search") {
      this.SearchItems = {};
      this.fastSearchLov.show();
    }
    if (name == "Confirm") {

      if (this.headerItems != undefined && this.headerItems.ID != null) {
        if (this.DlvGrid.instance.totalCount() > 0) {
          if (this.headerItems.Type != 10)
            Notify.error('PUB_NO_CHANGE_IN_CONFIRM_MODE');
          else {

            Dialog.confirm("PUB_CONFIRM", "BOM_CONFIRM_RECORD_QUESTION").okay(() => {
              this.headerItems.Type = 20;
              let result = this.form.instance.validate();
              let msg;
              if (result.isValid) {
                this.service.postPromise("/WAM/MovementConr/Save", this.headerItems).then((data) => {
                  this.showSuccessMsg();
                }).catch((err) => {
                  Notify.error(this.translate.instant(err));
                  this.headerItems.Type = 10;
                });
              }
              else {
                Notify.error('PUB_ERROR_COMPLETE_FORM_MSG');
              }



            });
          }
        }
        else
          Notify.error('WAM_ONE_REC_FOR_CONFIRM');
      }

      else
        Notify.error('WAM_PLEASE_SAVE_HEADER_FIRST');
    }
  }
  movementConrAcardionItems: any[] = [
    {
      index: 0,
      title: this.translate.instant("WAM_DELIVER_ITEMS"),
      icon: "fa fa-inbox-in"
    },
    {
      index: 1,
      title: this.translate.instant("WAM_RECIPT_ITEMS"),
      icon: "fa fa-inbox-out"
    }
  ]
  selectedIndex: 0;
  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    this.formConfig.serialPopupVisible = false;
    this.formConfig.lockHeaderItems = false;
    this.checkAndSetSaveButtonDisable();
    this.initForm();
    this.setTagInformation();
    this.accordionSelectedItems =
      [this.movementConrAcardionItems[0],
      this.movementConrAcardionItems[1]];
  }
  onSearchClick(data) {
    if (data.ID != null) {
      this.headerItems.ID = data.ID;
      this.initForm();
    }
  }
  onChangeWrhsFrom() {
    this.headerItems.TargetWarehouseId = this.headerItems.WarehouseId;
    this.headerItems.TargetWarehouseDescription = this.headerItems.WarehouseDescription;
  }
  setItemTypelovParams(data) {

    this.movmentPopupItems.UnitId = data.UnitId;
    this.formConfig.lovItemTypeFilter = {
      TYPE_ITEM_ID: this.movmentPopupItems.ItemId
    };
  }
  setItemTypelovParamsTo(data) {
    this.movementPopupItemsTo.UnitId = data.UnitId;

    this.formConfig.lovItemTypeFilterTo = {
      TYPE_ITEM_ID: this.movementPopupItemsTo.ItemId
    };
  }
  initForm() {
    this.formConfig.showSearchPanel = false;
    let startParam = null;
    if (this.headerItems.ID != null && this.headerItems.ID != undefined) {
      startParam = this.headerItems.ID;
    }
    //else {
    //  this.route.queryParams.subscribe(params => {
    //    if (params['code'] != undefined) {
    //      startParam = params['code']
    //    }
    //  });
    //}
    if (startParam != null) {
      this.service.get("/WAM/MovementConr/Get", (data) => {
        this.headerItems = data;
        if (this.headerItems.ID != null && this.headerItems.ID != undefined) {
          this.refreshGrids();
        }
      }, { conrId: startParam }
        , this.controlItemsAccess());
    }
    else
      this.headerItems.Type = 10;


  }
  refreshGrids(gridName = null) {
    if (gridName == null || gridName == "dlvGrid")
      if (this.DlvGrid != undefined && this.DlvGrid.instance != undefined) {
        this.setGridsParam("dlvGrid");
        this.DlvGrid.instance.refresh();
      }
    if (gridName == null || gridName == "rcptGrid")
      if (this.RcptGrid != undefined && this.RcptGrid.instance != undefined) {
        this.setGridsParam("rcptGrid");
        this.RcptGrid.instance.refresh();
      }

  }
  setGridsParam(gridName = null) {
    if (gridName == null || gridName == "dlvGrid") {
      this.dlvParams.MovementId = this.headerItems.DeliverMovementId;
    }
    if (gridName == null || gridName == "rcptGrid") {
      this.rcptParams.MovementId = this.headerItems.ReciptMovementId;


    }
  }
  clearForm() {
    this.headerItems = {
      Date: DateTime.convertForRemote(DateTime.now),
      ConfirmDate: null,
      Type: 10
    };

  }
  StatusTypeChange($event) {
    this.controlItemsAccess();
  }
  controlItemsAccess() {
    if (this.headerItems.ID != undefined && this.headerItems.ID != null) {
      this.formConfig.lockHeaderItems = true;
      if (this.headerItems.Type == 20) {
        this.setButtonsDisabled(true);
        this.formConfig.lockComment = true;
      }
      else {
        this.setButtonsDisabled(false);
        this.formConfig.lockComment = false;
      }
    }
    else {
      this.formConfig.lockComment = false;
      this.formConfig.lockHeaderItems = false;
      this.setButtonsDisabled(false);
    }
    this.checkAndSetSaveButtonDisable();
  }
  setButtonsDisabled(status) {
    this.menuItems[1].disabled = status;
    this.menuItems[3].disabled = status;
    this.menuItems[5].disabled = status;
  }
  checkAndSetSaveButtonDisable() {
    if (this.headerItems == undefined || this.headerItems.ID == null)
      this.menuItems[1].disabled = true;
    else
      this.menuItems[1].disabled = false;

  }
  showSuccessMsg() {

    Notify.success('PUB_ACTION_SUCCESS_MSG');
  }
  onSaveClick() {
    let result = this.form.instance.validate();
    let msg;

    if (result.isValid) {

      this.service.post("/WAM/MovementConr/Save", (data) => {
        this.headerItems.ID = data.ID;
        this.showSuccessMsg();
        this.initForm();
      }, this.headerItems);
    }
    else {
      Notify.error('PUB_ERROR_COMPLETE_FORM_MSG');
    }

  }
  setTagInformation() {

    let paramDlv: any = {};
    let paramRcpt: any = {};
    paramDlv.Code = "201";
    paramRcpt.Code = "101";
    this.service.postPromise("/WAM/MovementType/GetByCode", paramDlv)
      .then((data) => {
        if (data.AutomaticTagFlag == null)
          this.formConfig.flgCreateTagDlv = true;
        else
          this.formConfig.flgCreateTagDlv = data.AutomaticTagFlag;
        this.formConfig.DlvTypeId = data.ID;
      })
      .catch(error => { Notify.error('WAM_ERROR_FETCH_TYPE_DATA') });

    this.service.postPromise("/WAM/MovementType/GetByCode", paramRcpt)
      .then((data) => {
        if (data.AutomaticTagFlag == null)
          this.formConfig.flgCreateTagRcpt = true;
        else
          this.formConfig.flgCreateTagRcpt = data.AutomaticTagFlag;
        this.formConfig.RcptTypeId = data.ID;
      })
      .catch(error => { Notify.error('WAM_ERROR_FETCH_TYPE_DATA') });

  }


  /***********Grids Menu Click*************/
  getReadytoOpenPopup(gridName,mode) {

    if (this.movmentPopupItems != undefined && this.movmentPopupItems.Sequence == null && mode != 'DXEdit')
      this.movmentPopupItems.Sequence = this.DlvGrid.instance.totalCount() + 1;
    this.formConfig.popupTitle = this.translate.instant('WAM_DELIVER_ITEMS') + " / " + this.translate.instant('WAM_RECIPT_ITEMS');
    this.formConfig.popupName = "deliverItemsPopup";

    this.movementPopupItemsTo.Sequence = this.movmentPopupItems.Sequence;
    this.formConfig.movementItemFilter = { WarehouseID: this.headerItems.WarehouseId }
    this.formConfig.movementItemFilterTo = { WarehouseID: this.headerItems.TargetWarehouseId }
    this.formConfig.movementPopupVisible = true;
  }

  openTagPopup(data, wareHouse, gridName) {

    if (gridName == "dlvGrid") {
      this.tagRelatedData.flgCreateTag = this.formConfig.flgCreateTagDlv;


    }
    else {
      this.tagRelatedData.flgCreateTag = this.formConfig.flgCreateTagRcpt;

    }

    this.tagRelatedData = data;
    this.tagRelatedData.WarehouseID = wareHouse;
    this.tagRelatedData.Date = this.headerItems.Date;
    if (this.formConfig.DlvTypeId == undefined || this.formConfig.DlvTypeId == null
      || this.formConfig.RcptTypeId == undefined || this.formConfig.RcptTypeId == null)
      Notify.error('WAM_ERROR_FETCH_TYPE_DATA');
    else {
      if (gridName == "dlvGrid")
        this.tagRelatedData.reffrenceMovementTypeID = this.formConfig.DlvTypeId;
      else
        this.tagRelatedData.reffrenceMovementTypeID = this.formConfig.RcptTypeId;
      this.formConfig.serialPopupVisible = true;
    }
  }
  onDlvGridMenuClick(e) {
    if (e.name == "DXTag") {
      this.openTagPopup(e.data, this.headerItems.WarehouseId, "dlvGrid");
    }
    else
      if (this.headerItems.Type != 10) {
        e.handled = true;
        Notify.error('PUB_NO_CHANGE_IN_CONFIRM_MODE');
      }
      else {
        if (e.name == "DXInsert") //{
          e.handled = true;
        //if (this.headerItems != undefined && this.headerItems.ReciptMovementId != null) {
        this.movmentPopupItems = {};
        this.movementPopupItemsTo = {};
        this.getReadytoOpenPopup("dlvGrid", e.name );
        // }
        // else
        //   Notify.error('WAM_PLEASE_SAVE_HEADER_FIRST');
        //}
        if (e.name == 'DXEdit') {
          e.handled = true;

          let getParam: any = {};
          let returnedData: any = [];
          getParam.MovementItemParentId = e.data.ID;
          getParam.MovementId = this.headerItems.ReciptMovementId;
          this.service.getPromise("/WAM/MovementItem/List", getParam)
            .then((data) => {
              if (data.length > 0) {
                this.movmentPopupItems = e.data;
                returnedData = data[0];
                this.movementPopupItemsTo = returnedData;
              }
            })
            .catch(error => { Notify.error('WAM_ERROR_FETCH_TYPE_DATA') });
          this.getReadytoOpenPopup("dlvGrid", e.name );
        }
      }
  }
  onRcptGridMenuClick(e) {

    if (e.name == "DXTag") {
      this.openTagPopup(e.data, this.headerItems.TargetWarehouseId, "rcptGrid");
    }
    else
      if (this.headerItems.Type != 10) {
        e.handled = true;
        Notify.error('PUB_NO_CHANGE_IN_CONFIRM_MODE');
      }
      else {
        if (e.name == "DXInsert") {
          e.handled = true;
          if (this.headerItems != undefined && this.headerItems.ReciptMovementId != null) {
            this.movmentPopupItems = {};
            this.movementPopupItemsTo = {};
            this.getReadytoOpenPopup("rcptGrid", e.name );
          }
          else
            Notify.error('WAM_PLEASE_SAVE_HEADER_FIRST');

        }

        if (e.name == 'DXEdit') {
          e.handled = true;
       
          let getParam: any = {};
          let returnedData: any = [];
          getParam.ID = e.data.ReffrenceMovementItemId;
          getParam.MovementId = this.headerItems.DeliverMovementId ;
          this.service.getPromise("/WAM/MovementItem/List", getParam)
            .then((data) => {

              if (data.length > 0) {
                this.movementPopupItemsTo = e.data;
                returnedData = data[0];
                this.movmentPopupItems = returnedData;
              }
            })
            .catch(error => { Notify.error('WAM_ERROR_FETCH_TYPE_DATA') });
          this.getReadytoOpenPopup("rcptGrid", e.name );
        }
      }
  }
  /***********popUp*****/
  onCancelPopup() {
    this.formConfig.movementPopupVisible = false;
  }
  setSuitMovementId() {
    this.movmentPopupItems.MovementId = this.headerItems.DeliverMovementId;
    this.movementPopupItemsTo.MovementId = this.headerItems.ReciptMovementId;
  }
  onSaveAndNextPopup() {
    let result = this.movementPopupForm.instance.validate();

    if (result.isValid
      && this.movmentPopupItems.Sequence != null
      && this.movmentPopupItems.Sequence > 0
      && this.movmentPopupItems.SecondQuantityCommercial > 0
      && this.movmentPopupItems.SecondQuantityCommercial != null) {
      if (this.movmentPopupItems.ItemId != this.movementPopupItemsTo.ItemId) {
        this.movmentPopupItems.Quantity = this.movmentPopupItems.SecondQuantityCommercial;
        this.movmentPopupItems.QuantityCommercial = this.movmentPopupItems.SecondQuantityCommercial;
        this.movementPopupItemsTo.Quantity = this.movmentPopupItems.Quantity;
        this.movementPopupItemsTo.QuantityCommercial = this.movmentPopupItems.QuantityCommercial;
        this.movementPopupItemsTo.Sequence = this.movmentPopupItems.Sequence;
        this.setSuitMovementId();
        let movementItemData: any = {};
        movementItemData = this.headerItems;
        movementItemData.from = this.movmentPopupItems;
        movementItemData.to = this.movementPopupItemsTo;

        this.service.postPromise("/WAM/MovementConr/SaveItems", movementItemData).then((data) => {
          this.showSuccessMsg();
          if (this.headerItems.ID == null) {
            this.headerItems.ID = data.ID;
            this.headerItems.ConrNumber = data.ConrNumber;
            this.headerItems.Date = data.Date;
            this.headerItems.ReciptMovementId = data.ReciptMovementId;
            this.headerItems.DeliverMovementId = data.DeliverMovementId;
            this.onMenuItemClick("Refresh");
          }
          this.refreshGrids("dlvGrid");
          this.refreshGrids("rcptGrid");
          this.movmentPopupItems = {};
          this.movementPopupItemsTo = {};
          this.setSuitMovementId();
          this.movmentPopupItems.Sequence = this.DlvGrid.instance.totalCount() + 1;
          this.checkAndSetSaveButtonDisable();

        }).catch((err) => {
          Notify.error(this.translate.instant(err));
        });
      }
      else
        Notify.error('PUB_ERROR_COMPLETE_FORM_MSG');
    }
    else
      Notify.error('WAM_IN_OUT_CANNT_BE_EQUALS');


  }
}
