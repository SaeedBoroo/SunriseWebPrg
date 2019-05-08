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
  selector: 'wam-page-warehouse',
  templateUrl: './warehouse.page.html',
  providers: [ServiceCaller]
})
export class WAMWarehousePage extends BasePage {
  @ViewChild('grid') dataGrid: DxDataGridComponent;
  @ViewChild('gridcoding') gridcoding: DxDataGridComponent;
  @ViewChild('gridType') gridType: DxDataGridComponent;
  @ViewChild('warehousePopup') warehousePopup: DxValidationGroupComponent;



  ngOnInit() {
    this.service.loadLovData("LOV-WAM-050", (data) => {
      this.WRHSTYPEDataSource = data;
    });
  }

  menuItems: any[] = [];
  //
  gridItems: any[] = [
    {
      name: "DX-CODING",
      icon: "fa fa-file-code-o green",
      text: 'کدینگ انبار ',
      visible: true
    },
    {
      name: "DX-DOCUMENT",
      icon: "fa fa-file-text blue",
      text: 'اسناد انبار',
      visible: true
    }
  ];

  selectRow: any = {};
  loadParams: any = {};
  editItem: any = {};
  selectedKeys: any = [];
  selectedRow: any = {};
  DocumentWereHousePopup: boolean = false;
  CodingWereHousePopup: boolean = false;
  WRHSTYPEDataSource: any = [];
  lovBusinessFilter: any = {};
  warehousePopupItems: any = {};
  warehousePopupVisible = false;
  popupSaveButton: any = {};
  warehouseMovementType: any = [];

  lovMovementTypeFilter: any = [];







  constructor(public service: ServiceCaller, public translate: TranslateService) {
    //
    super(translate);
    //this.lovBusinessFilter = {
    //  BranchId: this.branchId
    //}
  }

  selectionChangedHandler() {
    if (this.selectedKeys.length == 1) {
      this.selectRow = this.dataGrid.instance.getSelectedRowsData()[0].ID;
    }
  }

  onMenuItemClick(name) {

  }


  onCancelClick() {
    this.refreshWarehouseGrid();
    this.warehousePopupVisible = false;
  }


  onSaveClick() {


    let result = this.warehousePopup.instance.validate();
    if (result.isValid) {
      this.service.post("/WAM/Warehouse/Save", (data) => {
       
        if (this.popupSaveButton.mode == 0) {
          this.warehousePopupItems = {};
          this.warehousePopupItems.Active = 1;
        }
        else
          this.onCancelClick();

      }, this.warehousePopupItems);
    }
  }
  refreshWarehouseGrid() {
    if (this.dataGrid != undefined && this.dataGrid.instance != undefined)
      this.dataGrid.instance.refresh();
  }
  onGridItemClick(e) {
    if (e.name == "DXInsert") {
      e.handled = true;
      this.popupSaveButton.text = this.translate.instant("PUB_SAVE_AND_NEXT");
      this.popupSaveButton.status = e.name;
      this.warehousePopupItems = {};
      this.popupSaveButton.mode = 0; 

      this.warehousePopupItems.Active = 1;

      this.warehousePopupVisible = true;
    }
    if (e.name == "DXEdit") {
      e.handled = true;
      this.popupSaveButton.text = this.translate.instant("PUB_SAVE");
      this.popupSaveButton.mode = 1; 
      this.popupSaveButton.status = e.name;

      this.warehousePopupItems = e.data;
      this.warehousePopupVisible = true;
    }
    if (e.name == "DX-CODING") {
      this.editItem.WarehouseId = this.selectRow;
      this.CodingWereHousePopup = true;
      this.gridcoding.instance.refresh();
    }
    if (e.name == "DX-DOCUMENT") {
      this.editItem.WarehouseId = this.selectRow;
      this.setLovMovementType();
      this.DocumentWereHousePopup = true;
      this.gridType.instance.refresh();
    }
  }

  onCellChanged(data, cell) {
    this.editItem.BusinessUnitName = data.Title;
    this.editItem.BusinessUnitId = data.ID;
    cell.setValue(data.Title);
  }

  onCellCodingCodeChanged(data, cell) {
    this.editItem.CodingName = data.Title;
    this.editItem.CodingCode = data.Code;
    this.editItem.WarehouseId = this.selectRow;
    this.editItem.CodingId = data.ID;
    //cell.setValue(data.Code);
  }

  onCellTypeCodeChanged(data, cell) {
    //this.editItem.TypeDescription = data.Title;
    //this.editItem.WarehouseId = this.selectRow;
    //this.editItem.MovementTypeId = data.ID;
    //cell.setValue(data.Code);
    if (data != [] && data.length > 0) {
      this.warehouseMovementType = [];
      data.forEach(l => {
        this.warehouseMovementType.push({
          MovementTypeId: l.ID,
          WarehouseId: this.selectRow,
        });
      });
      
    }
  }

  onCanceledItemRowGrid(e) {
    // this.editItem = {};
  }

  onGridItemClickdocument(e) {
    if (e.name == "DXInsert") {
      this.onCanceledItemRowGrid(e);
    }
    else if (e.name == "DXSave") {
      this.service.postPromise("/WAM/WarehouseMovementType/SaveGroup", this.warehouseMovementType).then((data) => {
        if (data != undefined) {
          this.editItem.WarehouseId = this.selectRow
          this.gridType.instance.refresh();
          Notify.success(this.translate.instant("PUB_ACTION_SUCCESS_MSG"));
        }
      }).catch((err) => {
        Notify.error(this.translate.instant(err));
      });
    }
  }

  setLovMovementType() {
    this.lovMovementTypeFilter = {
      warehouseId: this.selectRow
    };
  }
}
