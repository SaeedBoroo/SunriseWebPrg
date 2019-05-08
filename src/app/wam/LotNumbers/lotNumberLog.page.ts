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
import { Guid } from '../../shared/types/GUID';



@Component({
  selector: 'wam-page-lotNumber-log',
  templateUrl: './lotNumberLog.page.html',
})
export class WAMLotNumberLog extends BasePage {

  @ViewChild('form') form: DxValidationGroupComponent;
  @ViewChild('lotNumbersGrid') lotNumbersGrid: DxDataGridComponent;
  @ViewChild('lotNumbersToGrid') lotNumbersToGrid: DxDataGridComponent;

  /**
   * **********************
   */
  headerItems: any = {};
  formConfig: any = {};
  lotNumbersGridSelectedKeys: any = [];
  lotNumbersToGridSelectedKeys: any = [];
  lotGridParams: any = {};
  lotToGridParams: any = {};
  /**
   * *********************
   */


  menuItems: any[] = [
  ];
  onMenuItemClick(name) {

  }

  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    this.refreshLotGrid();
    this.refreshLotToGrid();
    this.setButtonDisable();
  }
  centricFromChanged(e) {
    this.headerItems.CentricAccountNamFrom = e.Title;
    this.refreshLotGrid();
    this.setButtonDisable();
  }
  centricToChanged(e) {
    this.headerItems.CentricAccountNamTo = e.Title;
    this.refreshLotToGrid();
    this.setButtonDisable();

  }
  lotNumbersGridselectionChangedHandler() {
    this.setButtonDisable();

  }
  setButtonDisable() {
    
    if (this.lotNumbersGridSelectedKeys.length > 0 && this.headerItems.CentricIdTo != null && this.headerItems.CentricIdTo != this.headerItems.CentricIdFrom )
      this.formConfig.disableMoveButton = false;
    else
      this.formConfig.disableMoveButton = true;


  }
  refreshLotGrid() {
    if (this.headerItems.CentricIdFrom == null) {
      this.lotGridParams.ShowNullCentrics = true;
      this.lotGridParams.CentricAcountId = Guid.empty;

    }
    else {
      this.lotGridParams.ShowNullCentrics = false;
      this.lotGridParams.CentricAcountId = this.headerItems.CentricIdFrom;
    }
    if (this.lotNumbersGrid != undefined && this.lotNumbersGrid.instance != undefined)
      this.lotNumbersGrid.instance.refresh();
  }
  refreshLotToGrid() {
    if (this.headerItems.CentricIdTo == null)
      this.lotToGridParams.CentricAcountId = Guid.empty;
    else
      this.lotToGridParams.CentricAcountId = this.headerItems.CentricIdTo;
    if (this.lotNumbersToGrid != undefined && this.lotNumbersToGrid.instance != undefined)
      this.lotNumbersToGrid.instance.refresh();
  }
  onMoveClick() {
    let result = this.form.instance.validate();
    let msg;

    if (result.isValid) {
      var param: any = {};
      param.Keys = this.lotNumbersGridSelectedKeys;
      param.CentricIdFrom = this.headerItems.CentricIdFrom;
      param.CentricIdTo = this.headerItems.CentricIdTo;



      this.service.postPromise("/WAM/LotNumberLog/ChangeLotNumberData", param).then(data => {
        Notify.success('PUB_ACTION_SUCCESS_MSG');
        this.lotNumbersGridSelectedKeys = [];
        this.lotNumbersToGridSelectedKeys = [];
        this.refreshLotGrid();
        this.refreshLotToGrid();

      }).catch((err) => {
        Notify.error(this.translate.instant(err));
      });
    }
    else {
      Notify.error('PUB_ERROR_COMPLETE_FORM_MSG');
    }
  }

}
