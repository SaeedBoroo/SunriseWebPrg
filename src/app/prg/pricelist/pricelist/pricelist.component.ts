import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../shared/services/TranslateService';
import { Router } from '@angular/router';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { BasePage } from '../../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../../shared/util/Dialog';


@Component({
  selector: 'app-root-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.scss']
})
export class PricelistComponent extends BasePage implements AfterViewInit {
  ngAfterViewInit(): void {
    this.menuItems[1].visible = false;
    this.menuItems[2].visible = false;
    if (this.jasem.length > 0) {
      this.selectionChangedHandler();
    }
  }
  @ViewChild('grid') dataGrid: DxDataGridComponent;
  selectedRow: any = {};
  jasem: any = [];
  menuItems = [
    {
      name: "New",
      icon: "fa fa-plus green",
      text: 'جدید',
      visible: true
    },
    {
      name: "Edit",
      icon: "fa fa-edit green",
      text: 'ویرایش',
      visible: true
    },
    {
      name: "Delete",
      icon: "fa fa-trash red",
      text: 'حذف',
      visible: true
    }
  ]


  constructor(public translate: TranslateService, public router: Router, public service: ServiceCaller) {
    super(translate);
    
  }



  onMenuItemClick(name) {
    if (name == "New") {
      this.router.navigate(["prg/pricelistitem"], { queryParams: { ID: "" } });
    } else if (name == "Edit") {
      this.router.navigate(["prg/pricelistitem"], { queryParams: { ID: this.selectedRow } });
    }
    else if (name=="Delete")
    {
      this.service.post("/PRG/PriceList/DeletePriceList", (data) => {        
        Notify.success("PUB_ACTION_SUCCESS_MSG");
      }, this.dataGrid.instance.getSelectedRowsData()[0]);
    }
    
  }


  selectionChangedHandler() {

    if (this.jasem.length == 0) {
      this.menuItems[1].visible = false;
      this.menuItems[2].visible = false;
    } else if (this.jasem.length == 1) {
      this.menuItems[1].visible = true;
      this.menuItems[2].visible = true;
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0].ID;
    } else {
      this.selectedRow = {};
      this.menuItems[1].visible = false;
      this.menuItems[2].visible = true;
    }
  }


}
