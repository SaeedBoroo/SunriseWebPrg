import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '../../../shared/BasePage';
import { TranslateService } from '../../../shared/services/TranslateService';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { Deferred } from '../../../shared/Deferred';
import CustomStore from 'devextreme/data/custom_store';
import { Guid } from '../../../shared/types/GUID';
import { DateTime } from '../../../shared/util/DateTime';
import { Notify } from '../../../shared/util/Dialog';
@Component({
  selector: 'app-root-pricelist',
  templateUrl: './pricelistitem.component.html',
  styleUrls: ['./pricelistitem.component.scss']
})


export class PricelistitemComponent extends BasePage implements OnInit {

  editItem: any = {};
  editRow: any = {};
  gridItems = [];
  menuItems = [
    // {
    //   name: "copy",
    //   icon: "fa fa-copy green",
    //   text: 'کپی از فهرست بهای دیگر',
    //   visible: true
    // },
    {
      name: "save",
      text: 'ثبت',
      icon: "fa fa-floppy-o green",
      visible: true
    },
    {
      name: "delete",
      text: 'حذف',
      icon: "fa fa-ban red",
      visible: true
    },
  ];

  filter: any = {};
  warehouseItemFilter: any = {};
  typeIdWarehouse: any = {};
  headerItem: any = {

  };
  dataSource: any = {};
  localData: any[] = [];

  @ViewChild('grid') dataGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;

  constructor(public translate: TranslateService,
    public router: Router, private route: ActivatedRoute, public service: ServiceCaller) {
    super(translate);
    // let typeFilterSec: any = {};
    // this.service.get("/WAM/MovementType/List", (data) => {
    //   console.log("lov",JSON.stringify(data));
    //   this.typeIdWarehouse = data[0].ID;
    // }, typeFilterSec)


    this.route.queryParams.subscribe(params => {
      //اگر آی دی وجود داشت یعنی روی ادیت کلیک کرده و طبق اون آی دی به تابع لودگرید میره
      //اما اگه آی دی نداشت یعنی روی جدید کلیک کرده و از مسیر زیر ماکزیمم شماره که توی دیتابیس هست را بیرون میکشه

      debugger
      if (params['ID'] != "") {
        var param: any = {};
        param.PRLID = params['ID'];
        //کلا داخل تابع لودگرید متغیر فلگ برابر 2 میشه
        this.loadGrid(param);
      } else {
        debugger
        this.headerItem = {};
        this.localData = [];
        service.get("/PRG/PriceList/GenerateNumPriceList", (data) => {

          if (data != null) {
            this.headerItem.PRLNUM = data.PRLNUM;
          }
        }, []);

      }
    })

    debugger
    this.dataSource.store = new CustomStore({

      //آیدی محصول در تک تک ریدف هاست .که از تابع زیر میآید.
      //setCellValueOfItemCode()
      //یعنی اگه بجای آیدی، آیدی محصول را بنویسیم هم مشکلی نداره.
      key: 'ID',
      
      load: (loadOptions) => {
        //هنگام لود صفحه آنهایی را لود کن که فلگش برابر 3 نیست یعنی آنهایی که مساوی دیلیت نیست.
        //هنگام لوود کانستراکتور این لوود صدا زده میشه
        debugger
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      //ولییوز: آرایه ایست شامل مقادیر جدیدیست که در حال تغییر هستیم
      update: (key, values) => {
        
        let deferred: Deferred<any> = new Deferred<any>();
        //ID = Product_ID
        //updatedItem = old_Item آتمی که سلکت شده
        debugger
        var curentItem = this.localData.filter(c => c.ID == key)[0];
        
        if  (values.Item_Code != null) {
          debugger
            let flagUpdate: any = {};
            flagUpdate = this.localData.filter(i => i.Flag != 3 && i.ID_Product == values.ID_Product ).length;
            if (flagUpdate == 0) {
              deferred.resolve(true);
              Object.assign(curentItem, values);
              this.onMenuItemClick("save")//ثبت کلی 
              return deferred.promise;
            }
            else {
              deferred.reject("تکراری");              
              return deferred.promise;
            }
          }
          else  {
            deferred.resolve(true);
            Object.assign(curentItem, values);
            this.onMenuItemClick("save")//ثبت کلی 
            return deferred.promise;
          }
          
      },
      insert: (values) => {
        
        let detailInsert: any = [];
        var deferred: Deferred<any> = new Deferred<any>();

        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;

        let flagInsert: any = {};
        flagInsert = this.localData.filter(i => i.Flag != 3 && i.ID_Product == insertedItem.ID_Product).length;
        if (flagInsert > 0) {
          deferred.reject("تکراری");
          return deferred.promise;
        }
        else {
          Object.assign(values, { Flag: 1 }) as any;
          this.localData.push(values);
          this.onMenuItemClick("save")//ثبت کلی 
          deferred.resolve(true);
          return deferred.promise;
        }

        
      }

      , remove: (key) => {
        //هنگام حذف فلگ باید برابر 3 شود
        let deferred: Deferred<any> = new Deferred<any>();
        this.localData.filter(c => c.ID == key)[0].Flag = 3;
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        this.onMenuItemClick("save")//ثبت کلی
        return deferred.promise;

         
      }
    });

    

  }

  onItemCodeChange(data, cell) {
    cell.setValue(data);
  }

  setCellValueOfItemprc(){

  }
    //وقتی روی اووی کلیک شد مقدار جدید را با مقدار قبلی در جدول کلی جاگذاری میکند.
  setCellValueOfItemCode(newData, value, currentRow) {
    debugger
    if (value != null) {
      //مقادیر ولیو مقادیریست که در الووی میاره و آنها رو جایگذاری میکنه با مقادیری که در حال حاظر هست
      newData.ID_Product = value.ID;
      newData.Item_Code = value.Code;
      newData.Item_Des = value.Description;
      newData.Msun_Des = value.MwasurementUnitDescription;
    }
  }
  ngOnInit() {
    //پر کردن فیلدهای هدر آیتم در هنگام لود اولیه
    this.headerItem = {
      PRLNUM: 0,
      PRLCREATEDATE: DateTime.now,
      PRLDESC: ""
    }

  }

  onButtonClick(name) {
    if (name == "New") {
      this.dataGrid.instance.addRow();
    }
  }
  onGridItemPrepering(e) {
    if (e.name == "DXEdit")
      e.visible = false;
  }
  onGridItemClick(e) {

  }

  //دکمه های بالایی و دکمه هایی که در هر سطر میاره باهم هیچ تفاوتی ندارند.
  onMenuItemClick(name) {
    
    if (name == "save") {
      debugger
      var result = this.form.instance.validate();

      if (result.isValid) {

        var param: any = {};
        //مقادیر هدرآیتم را میریزه داخل پارامز
        Object.assign(param, this.headerItem);
        var detailInsert: any = [];
        var detailUpdate: any = [];
        var detailDelete: any = [];
        //Insert
        this.localData.filter(i => i.Flag == 1).forEach(t =>
          detailInsert.push({
            
            ID_Product: t.ID_Product,
            ID_PriceList: this.headerItem.PRLID,
            PrldPrice: t.PrldPrice,
            PrldDesc: t.PrldDesc
          }));
        //Update
        this.localData.filter(i => i.Flag == 2).forEach(t =>
          detailUpdate.push({
            ID: t.PRLDID,
            PRLDID: t.PRLDID,
            ID_PriceList: this.headerItem.PRLID,
            ID_Product: t.ID_Product,
            PrldPrice: t.PrldPrice,
            PrldDesc: t.PrldDesc
          }));
        //Delete
        this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.PRLDID));
        var Items: any = {};
        //سه مقدار بالا که پوش شد را باید داخل آبجکت آیتم بریزیم
        Items.InsertedItems = detailInsert;
        Items.UpdatedItems = detailUpdate;
        Items.DeletedItems = detailDelete;
        //سپس آبجکت آیتم را دوباره 
        param.PriceListDetailItems = Items;      
        this.service.post("/PRG/PriceList/SavePriceList", (data) => {
          // this.clearForm();
          this.headerItem = data;
          this.loadGrid({PRLID:this.headerItem.PRLID});
          Notify.success("PUB_ACTION_SUCCESS_MSG");

        }, param);
      }

      //else if (this.headerItem.TypeId == 2 && this.headerItem.AccountId == null) {
      //    console.log("ERROR_COMPLETE_FORM");
      //    notify({
      //        message: this.translate.instant("ERROR_COMPLETE_FORM"),
      //        type: "error",
      //        width: 400
      //    });
      //}

      else {
        console.log("ERROR_COMPLETE_FORM");
        Notify.error("ERROR_COMPLETE_FORM");

      }
    }
    else if (name=="delete")
    {
      this.service.post("/PRG/PriceList/DeletePriceList", (data) => {        
        Notify.success("PUB_ACTION_SUCCESS_MSG");
        this.router.navigate(["prg/pricelist"]);
      }, this.headerItem);
    }

  }

  loadGrid(param){
    debugger
     //اگر روی دکمه ادیت کلیک شد باید طبق آن آیدی اطلاعاتش را پر کند که به صورت زیر پر میشه.
    this.service.get("/PRG/PriceList/GetPriceListByID", (data) => {
      if (data != null) {
        this.localData = [];
        this.headerItem = data;        
        // this.warehouseItemFilter = { WarehouseID: this.insertItem.WarehouseID, typeControl: 1 ,MVTP_ID:this.typeId}
        this.localData = data.PRICELISTDETAILITEMS;
        //مقدار فلگ را برابر 2 کن. یعنی مود ویرایش.
        this.localData.forEach(s => s.Flag = 2);
        this.dataGrid.instance.refresh();
      }
    }, param);
  }


}
