import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { Router } from '@angular/router';
import { Notify } from '../../../shared/util/Dialog';

@Component({
  selector: 'app-root-pricelist2',
  templateUrl: './pricelist2.component.html',
  styleUrls: ['./pricelist2.component.scss']
})
export class Pricelist2Component implements OnInit,AfterViewInit {


  @ViewChild('grid') dataGrid: DxDataGridComponent;
  selectedRow: any = {};
  sun_active_flag: any = {};
  dataa
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

  
  constructor(private service: ServiceCaller, private router:Router) { }

  ngOnInit() {
    this.service.get('/PRG/PriceList/List', (data)=>{
      this.dataa = data
    })
  }

  ngAfterViewInit(): void {
    this.menuItems[1].visible = false;
    this.menuItems[2].visible = false;
    if (this.sun_active_flag.length > 0) {
      this.selectionChangedHandler();
    }
  }
  onMenuItemClick(name) {
    if( name == 'New'){
      this.router.navigate(['prg/pricelistitem2'],  { queryParams: { ID: "" } })
    }
    else if( name == 'Edit'){
      this.router.navigate(['prg/pricelistitem2'],  { queryParams: { ID: this.selectedRow } })
    }
    else if( name == 'Delete'){
      this.service.post("/PRG/PriceList/DeletePriceList", (data) => {        
        Notify.success();
      }, this.dataGrid.instance.getSelectedRowsData()[0]);
    }
  }

  selectionChangedHandler(){
    if (this.sun_active_flag.length == 0) {
      this.menuItems[1].visible = false;
      this.menuItems[2].visible = false;
    } else if (this.sun_active_flag.length == 1) {
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
