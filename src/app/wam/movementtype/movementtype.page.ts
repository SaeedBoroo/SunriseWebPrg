import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { RouteData } from '../../shared/util/RouteData';

@Component({
  selector: 'wam-page-movementtype',
  templateUrl: './movementtype.page.html',
  providers: [ServiceCaller]
})


export class WAMMovementTypePage extends BasePage implements AfterViewInit {

  ngAfterViewInit() {
  }



  @ViewChild('movementTypeValidation') movementTypeValidation: DxValidationGroupComponent;

  @ViewChild('grid') grid: DxDataGridComponent;
  @ViewChild('gridCategory') gridCategory: DxDataGridComponent;

  menuItems: any[] = [
    {
      name: "Refresh",
      icon: "fa fa-refresh blue",
      text: this.translate.instant("REFRESH"),
      visible: true
    },

  ];

  gridItems: any[] = [
    {
      name: "DX-CATEGORY",
      icon: "fa fa-file-code-o green",
      text: 'خانواده کالا',
      visible: true
    }
  ];



  //LOV
  relationtype: any = {};
  reffrencetype: any = {};
  movementType: any = {};
  movementTypeItems: any = {};
  movementTypePopup: any = {};
  //parameters
  saveParams: any = {};

  editItem: any = {};
  selectRow: any = {};
  selectedKeys: any = [];
  detailSelectedKeys: any = [];
  CategoryPopup: boolean = false;

  onMenuItemClick(name) {
    if (name == "Refresh") {
      this.grid.instance.refresh();
    }
  }

  selectionChangedHandler() {
    if (this.selectedKeys.length == 1) {
      this.selectRow = this.grid.instance.getSelectedRowsData()[0].ID;
    }
  }

  onGridItemClick(e) {
    this.movementTypeItems = { TempRequired: false, IsActive: true };
    if (e.name == "DXInsert") {
      e.handled = true;
      this.movementTypePopup.text = this.translate.instant('PUB_SAVE_AND_NEXT');
      this.movementTypePopup.mode = 0;
      this.movementTypePopup.visible = true;

    }
    if (e.name == "DXEdit") {
      e.handled = true;
      this.movementTypePopup.text = this.translate.instant('PUB_SAVE');
      this.movementTypePopup.mode = 1;
      this.movementTypePopup.visible = true;
      this.movementTypeItems = Object.assign({}, e.data);
    }
    if (e.name == "DX-CATEGORY") {
      this.editItem.TypeId = this.selectRow;
      this.CategoryPopup = true;
      if (this.gridCategory != undefined && this.gridCategory.instance != undefined)
        this.gridCategory.instance.refresh();
    }
  }
  onSaveMovementType() {

    if (this.movementTypeValidation.instance.validate().isValid) {
      this.service.post("/WAM/MovementType/Save", (data) => {
        if (this.movementTypePopup.mode == 0)
          this.movementTypeItems = {};
        else
          this.onCancelMovementType();
      }, this.movementTypeItems);
    }
  }
  onCancelMovementType() {
    if (this.grid.instance != undefined)
      this.grid.instance.refresh();
    this.movementTypePopup.visible = false;
  }
  onCellCodingCodeChanged(data, cell) {
    this.editItem.CategoryName = data.Title;
    this.editItem.TypeId = this.selectRow;
    this.editItem.CategoryId = data.ID;
    //cell.setValue(data.Code);
  }

  constructor(public service: ServiceCaller,
    public translate: TranslateService) {
    super(translate);

    //LOV
    this.service.loadLovData("LOV-WAM-035", (data) => { this.relationtype = data; });
    this.service.loadLovData("LOV-WAM-036", (data) => { this.reffrencetype = data; });
    this.service.loadLovData("LOV-WAM-041", (data) => { this.movementType = data; });
  }




  detailSelectionChangedHandler() {
    //if (this.detailSelectedKeys.length == 1) {
    //    this.detailSelectedRow = this.dataGridDetail.instance.getSelectedRowsData()[0];
    //    //this.loadParams = { ParameterID: this.selectedRow.ID }
    //    //this.dataGridDetail.instance.refresh();
    //}
    //else {
    //    this.detailSelectedRow = {};
    //}
  }
}
