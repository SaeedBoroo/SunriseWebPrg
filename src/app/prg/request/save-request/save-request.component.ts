
import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BasePage } from '../../../shared/BasePage';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { TranslateService } from '../../../shared/services/TranslateService';
import { Router, ActivatedRoute } from '@angular/router';
import { Notify, Dialog } from '../../../shared/util/Dialog';
import { Conditional } from '@angular/compiler';
import { Deferred } from '../../../shared/Deferred';
import CustomStore from 'devextreme/data/custom_store';
import { Guid } from '../../../shared/types/GUID';
import { confirm } from 'devextreme/ui/dialog';
import { PermissionService } from '../../../shared/permission';
import { DxValidationGroupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-root-save-request',
  templateUrl: './save-request.component.html',
  styleUrls: ['./save-request.component.scss']
})
export class SaveRequestComponent extends BasePage implements OnInit {
  REQP_ID: Guid = Guid.empty;
  Production_Grid_Item_Des_Selected_Row;

  @ViewChild('form') form: DxValidationGroupComponent;
  PopupVisible: boolean = false;
  ShowSuggestPopupVisible: boolean = false;
  constructor(public translate: TranslateService, public router: Router,
    private route: ActivatedRoute, public service: ServiceCaller,public permissionService: PermissionService) {
    super(translate);
    this.route.queryParams.subscribe(params => {
      if (params['ID'] != "") {
        debugger
        var param: any = {};
        param.requestId = params['ID'];
        service.get("/PRG/Request/GetRequest", (data) => {
          if (data != null) {
            this.headerItem = data;
          }
        }, param);

        this.localData = [];
        service.get("/PRG/Request/Get_PRG_Request_Production", (data) => {
          this.localData = data;
          this.dataGrid.instance.refresh();
        }, { REQP_REQ_ID: params['ID'] });

      } else {
        this.headerItem = {};
        service.get("/PRG/Request/GenerateNumRequest", (data) => {
          if (data != null) {
            debugger
            this.headerItem.REQ_Num = data.REQ_Num;
            this.headerItem.REQ_Unt_Type_Id= data.REQ_Unt_Type_Id;
            this.headerItem.REQ_Unt_Grade_Id=data.REQ_Unt_Grade_Id;
            this.headerItem.REQ_SUBJ_ID=data.REQ_SUBJ_ID;
            this.headerItem.REQ_PRLID=data.REQ_PRLID;
            
          }
        }, []);

      }
    })

    this.dataSource.store = new CustomStore({

      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      update: (key, values) => {
        debugger
        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.localData.filter(c => c.ID == key)[0];

        updatedItem.Flag = 2;
        // Object.assign(updatedItem, values);
        if (values.ITEM_CODE != null) {
          let flagUpdate: any = {};
          // this.localData.filter(c => c.ID == key)[0] = values;
          flagUpdate = this.localData.filter(i => i.Flag != 3 && i.REQP_ITEM_ID == values.REQP_ITEM_ID && i.ID != updatedItem.ID).length;
          if (flagUpdate == 0) {
            deferred.resolve(true);
            Object.assign(updatedItem, values);
            this.save_request_header_and_Detail(updatedItem, (data) => { });
            return deferred.promise;
          }
          else {
            deferred.reject("تکراری");

            // this.localData.filter(c => c.ID == key)[0] = temp;
            return deferred.promise;
          }
        }
        else {
          deferred.resolve(true);
          Object.assign(updatedItem, values);
          this.save_request_header_and_Detail(updatedItem, (data) => { });
          return deferred.promise;
        }
      },
      insert: (values) => {
        debugger
        var detailInsert: any = [];
        let deferred: Deferred<any> = new Deferred<any>();

        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;

        let flagInsert: any = {};
        flagInsert = this.localData.filter(i => i.Flag != 3 && i.REQP_ITEM_ID == insertedItem.REQP_ITEM_ID).length;
        if (flagInsert > 0) {
          deferred.reject("تکراری");
          return deferred.promise;
        }
        else {
          Object.assign(values, { Flag: 1 }) as any;
          this.save_request_header_and_Detail(values, (data) => {
            values = data;
            this.localData.push(values);
            this.dataGrid.instance.refresh();
          });
          deferred.resolve(true);
          return deferred.promise;
        }
      }

      , remove: (key) => {
        debugger
        let deferred: Deferred<any> = new Deferred<any>();
        this.localData.filter(c => c.ID == key)[0].Flag = 3;
        this.Delete({ data: this.localData.filter(c => c.ID == key)[0] }, (data) => {
          console.log("sajjad_data_delete", data);
          if (data) {
            this.dataGrid.instance.refresh();
          }
        }); deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      }
    });



  }

  setCellValueOfItemCode(newData, value, currentRow) {
    if (value != null) {
      debugger
      newData.REQP_ITEM_ID = value.ID;
      newData.ITEM_CODE = value.Code;
      newData.ITEM_DESC = value.Description;
      newData.MSUN_DES = value.MwasurementUnitDescription;
    }
  }
  onItemCodeChange(data, cell) {
    cell.setValue(data);
  }



  ngOnInit() {   
    debugger
    this.allow_PRG_REQ_002 = this.permissionService.hasDefined('PRG-REQ-002');//چک دسترسی به ویرایش قسمت بالای هدر 
    this.allow_PRG_REQ_005=  this.permissionService.hasDefined('PRG-REQ-005');//چک دسترسی به ثبت پیشنهاد
    this.allow_PRG_REQ_006=  this.permissionService.hasDefined('PRG-REQ-006');//چک دسترسی به مشاهده پیشنهاد ها
  
  }


  @ViewChild('grid') dataGrid: DxDataGridComponent;

  
  allow_PRG_REQ_002:boolean=false;
  allow_PRG_REQ_004:boolean=  this.permissionService.hasDefined('PRG-REQ-004');//دسترسی تایید نزخ گذاری
  allow_PRG_REQ_005:boolean=  this.permissionService.hasDefined('PRG-REQ-005');//چک دسترسی به ثبت پیشنهاد
  allow_PRG_REQ_006:boolean=  this.permissionService.hasDefined('PRG-REQ-006');//چک دسترسی به مشاهده پیشنهاد ها
  dataSource: any = {};
  localData: any[] = [];

  gridItems = [{
    name: "save_suggest",
    icon: "fa fa-user green",
    text: 'ثبت پیشنهاد',
    visible: false
  }, {
    name: "show_suggest",
    icon: "fa fa-users black",
    text: 'نمایش همه پیشنهادها',
    visible: false
  }
  ];

  headerItem: any = {};
  editItem: any = {};
      ///چک دسترسی به قسمت تایید نرخ گذاری

  menuItems = [
    // {
    //   name: "copy_prev_info",
    //   icon: "fa fa-copy blue",
    //   text: 'کپی از اطلاعات قبل',
    //   visible: true
    // },
    {
      name: "pricing_confirm",
      icon: "fa fa-thumbs-up black",
      text: 'تایید نرخ گذاری',
      visible: this.allow_PRG_REQ_004
    },
    {
      name: "send_request",
      icon: "fa fa-save blue",
      text: 'ارسال درخواست',
      visible: true
    },
    {
      name: "Save",
      icon: "fa fa-save green",
      text: 'ثبت',
      visible: true
    },
    {
      name: "Delete",
      icon: "fa fa-trash red",
      text: 'حذف کلی درخواست',
      visible: true
    }
  ]

  onButtonClick(name) {
    if (name == "New") {
      this.dataGrid.instance.addRow();
    }
  }
  onGridItemPrepering(e) {
    if (e.name == "DXEdit")
      e.visible = false;
  }
  onMenuItemClick(name) {
    if (name == "Save") {
      this.save_request_header();
    } else if (name == "Delete") {
      Dialog.delete().done(() => {
        this.service.post("/PRG/Request/Delete", (data) => {
          this.REQP_ID = Guid.empty;
          this.localData = [];
          this.dataGrid.instance.refresh();
          this.router.navigate(["prg/requestlist"], {});
          Notify.success("PUB_ACTION_SUCCESS_MSG");
        }, this.headerItem);
      });
    } else if (name == "send_request") {
      Dialog.confirm('ارسال در خواست جهت بررسی','در صورت ارسال جهت برسی دیگر امکان ویرایش وجود ندارد آیا ادامه می دهید؟').okay(() => {
        this.headerItem.REQ_Status = 1;
        this.save_request_header();
      })
    } else if (name == "pricing_confirm") {
      Dialog.confirm('تایید در خواست','آیا درخواست را تایید می کنید؟').okay(() => {
        this.headerItem.REQ_Status = 3;
        this.save_request_header();
      })
    }
  }

  onGridItemClick(e) {
    if (e.name == "save_suggest") {
      if (this.allow_PRG_REQ_005){
        this.PopupVisible = true;
      }
      else
        {
          Notify.error("PRG_REQ_SAVE_SUGGESET_LIMIT");
        }
      
    } else if (e.name == "show_suggest")
     {
          if (this.allow_PRG_REQ_006)
            {
              this.ShowSuggestPopupVisible = true;
            }
          else
            {
              Notify.error("PRG_REQ_SHOW_SUGGESET_LIMIT");
            } 
      
    }
  }


  Delete(param: any, callback) {
    this.service.post("/PRG/Request/Delete_PRG_Request_Production", (data) => {
      callback(data);
      this.REQP_ID = Guid.empty;
      Notify.success("PUB_ACTION_SUCCESS_MSG");
    }, param.data);
  }

  rowClickEvent(e) {
    this.REQP_ID = e.data.REQP_ID;
    this.Production_Grid_Item_Des_Selected_Row = e.data.ITEM_DESC;

  }
  suggest_save() {
    this.editItem.REPS_REQP_ID = this.REQP_ID;
    this.service.post("/PRG/Request/Save_PRG_Request_Production_Suggest", (data) => {
      this.REQP_ID = Guid.empty;
      Notify.success("PUB_ACTION_SUCCESS_MSG");
      this.PopupVisible = false;
      this.editItem = {};
    }, this.editItem);
  }
  save_request_header() {
/*     if (this.headerItem.REQ_Unt_Type_Id==Guid.empty || this.headerItem.REQ_Unt_Grade_Id==Guid.empty )
    {
      Notify.error("درجه و نوع واحد نمی تواند خالی باشد");
    } */
    debugger
    var result = this.form.instance.validate();
    if (result.isValid) {    
      this.service.post("/PRG/Request/SaveRequest", (data) => {
        this.headerItem.REQ_ID = data.REQ_ID;
        Notify.success("PUB_ACTION_SUCCESS_MSG");
      }, this.headerItem);
     }
  }

  save_request_header_and_Detail(param: any, sacallback) {

    var result = this.form.instance.validate();
    if (result.isValid) {      
        let return_data: any = {};

        this.service.post("/PRG/Request/SaveRequest", (data) => {
          
          this.headerItem.REQ_ID = data.REQ_ID;
          param.REQP_REQ_ID = this.headerItem.REQ_ID;
          param.REPS_SuggeesterType = 2;
          this.service.post("/PRG/Request/Save_PRG_Request_Production", (data) => {
            return_data = data;
            sacallback(return_data);
            Notify.success("PUB_ACTION_SUCCESS_MSG");

          }, param);

          Notify.success("PUB_ACON_SUCCESS_MSG");
        }, this.headerItem);
      }
  }

  setVisibleDLG($event) {
    this.ShowSuggestPopupVisible = $event;
    console.log("visible_dlg", $event);
  }
}
