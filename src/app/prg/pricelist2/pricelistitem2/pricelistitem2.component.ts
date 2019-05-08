import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { TranslateService } from '../../../shared/services/TranslateService';
import { BasePage } from '../../../shared/BasePage';
import { Deferred } from '../../../shared/Deferred';
import CustomStore from 'devextreme/data/custom_store';
import { Notify } from '../../../shared/util/Dialog';
import { DateTime } from '../../../shared/util/DateTime';
import { localeData } from 'jalali-moment';

@Component({
  selector: 'app-root-pricelistitem2',
  templateUrl: './pricelistitem2.component.html',
  styleUrls: ['./pricelistitem2.component.scss']
})
export class Pricelistitem2Component extends BasePage implements OnInit {
  menuItems = [{
    name: 'save',
    icon: 'fa fa-floppy green',
    text: 'ذخیره',
    visible : true
  },{
    name: 'cancel',
    icon: 'fa fa-ban red',
    text: 'انصراف',
    visible : true
  }]

  
  headerItem: any ={}
  localData: any ={}
@ViewChild('form')  form: DxValidationGroupComponent
@ViewChild('grid')  dataGrid: DxDataGridComponent

  constructor(public translate: TranslateService, 
     public router: Router, 
     private route: ActivatedRoute,
     public service: ServiceCaller) 
  {
    super(translate);
 
    this.route.queryParams.subscribe( params => { 
      //اگر آی دی وجود داشت یعنی روی ادیت کلیک کرده و طبق اون آی دی به تابع ... میره
      //اما اگه آی دی نداشت یعنی روی جدید کلیک کرده و از مسیر زیر ماکزیمم شماره که توی دیتابیس هست را بیرون میکشه

      if (params['ID'] != '') {
      debugger
        let param: any={}
        param.PRLID = params['ID']
        this.loadGrid(param)

      } else {
        
        this.service.get('/PRG/PriceList/GenerateNumPriceList',(data)=>{
          debugger
          if (data != null) {
            this.headerItem.PRLNUM = data.PRLNUM
            
          }
        })
      }
    })
  
  


  }

  onItemCodeChange(data, cell) {
    cell.setValue(data);
  }
  
  //وقتی روی اووی کلیک شد مقدار جدید را با مقدار قبلی در جدول کلی جاگذاری میکند.
  setCellValueOfItemCode(newData, value, currentRow) {
    debugger
    if (value != null) {
      newData.ID_Product = value.ID;
      newData.Item_Code = value.Code;
      newData.Item_Des = value.Description;
      newData.Msun_Des = value.MwasurementUnitDescription;
    }
  }

  ngOnInit() {
    //پر کردن فیلدهای هدر آیتم در هنگام لود اولیه
this.headerItem = {
  PRLNUM : 0,
  PRLCREATEDATE: DateTime.now,
  PRLDESC: ''
}

  }

  onMenuItemClick(btn_id){
    debugger
    if(btn_id == 'save'){
console.log('saveeeeee')
    }
    else if(btn_id == 'cancel'){
      this.router.navigate(['prg/pricelist2'])
    }
  }
 
  loadGrid(param){
    //اگر روی دکمه ادیت کلیک شد باید طبق آن آیدی اطلاعاتش را پر کند که به صورت زیر پر میشه.
    debugger
  this.service.get('/PRG/PriceList/GetPriceListByID',(data)=>{
  if (data != '') {
    this.headerItem = data;
    this.localData = data.PRICELISTDETAILITEMS;
    this.localData.ForEach(s => s.Flag = 2);
    this.dataGrid.instance.refresh();
    
  }
})
  }

}
