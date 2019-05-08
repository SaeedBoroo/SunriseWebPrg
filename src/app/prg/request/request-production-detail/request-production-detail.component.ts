import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BasePage } from '../../../shared/BasePage';
import { TranslateService } from '../../../shared/services/TranslateService';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { Deferred } from '../../../shared/Deferred';
import CustomStore from 'devextreme/data/custom_store';
import { Notify } from '../../../shared/util/Dialog';
import { Guid } from '../../../shared/types/GUID';
import { PermissionService } from '../../../shared/permission';

@Component({
  selector: 'request-production-detail',
  templateUrl: './request-production-detail.component.html',
  styleUrls: ['./request-production-detail.component.scss']
})
export class RequestProductionDetailComponent extends BasePage implements OnChanges,OnInit {

  ngOnInit(): void {  
    this.getpermissions();
  }

  @Input() REQP_ID: Guid = Guid.empty;
  @Input() REQ_Header;
  
  @ViewChild('gridDetail') dataGridDetail: DxDataGridComponent;

  dataSourceDetail: any = {};
  itemfilter
  localDataDetail: any[] = [];


  allow_REPD_DRefrencePrice :boolean=false;
  

  constructor(public translate: TranslateService, public router: Router,
    private route: ActivatedRoute, public service: ServiceCaller,public permissionService: PermissionService) {
    super(translate);
    
    
    this.REQP_ID = Guid.empty;

    this.dataSourceDetail.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.localDataDetail.filter(s => s.Flag != 3));
        this.itemfilter = {
          ID_PriceList  : this.REQ_Header.REQ_PRLID
      }
        return deferred.promise;
      },
      update: (key, values) => {
        
        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.localDataDetail.filter(c => c.ID == key)[0];

        updatedItem.Flag = 2;
        if (values.ITEM_CODE != null) {
          let flagUpdate: any = {};
          flagUpdate = this.localDataDetail.filter(i => i.Flag != 3 && i.REPD_Item_Id == values.REPD_Item_Id && i.ID != updatedItem.ID).length;
          if (flagUpdate == 0) {
            deferred.resolve(true);
            Object.assign(updatedItem, values);
            this.save(updatedItem, (data) => { });
            return deferred.promise;
          }
          else {
            deferred.reject("تکراری");
            return deferred.promise;
          }
        }
        else {
          deferred.resolve(true);
          Object.assign(updatedItem, values);
          this.save(updatedItem, (data) => { });
          return deferred.promise;
        }
      },
      insert: (values) => {
        
        var detailInsert: any = [];
        let deferred: Deferred<any> = new Deferred<any>();

        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;

        let flagInsert: any = {};
        flagInsert = this.localDataDetail.filter(i => i.Flag != 3 && i.REPD_Item_Id == insertedItem.REPD_Item_Id).length;
        if (flagInsert > 0) {
          deferred.reject("تکراری");
          return deferred.promise;
        }
        else {
          Object.assign(values, { Flag: 1 }) as any;
          this.save(values, (data) => {
            values = data;
            this.localDataDetail.push(values);
            this.dataGridDetail.instance.refresh();
          });
          deferred.resolve(true);
          return deferred.promise;
        }
      }

      , remove: (key) => {
        debugger
        let deferred: Deferred<any> = new Deferred<any>();
        this.localDataDetail.filter(c => c.ID == key)[0].Flag = 3;
        this.Delete({ data: this.localDataDetail.filter(c => c.ID == key)[0] }, (data) => {
          console.log("sajjad_data_delete", data);
          if (data) {
            this.dataGridDetail.instance.refresh();
          }
        });
        deferred.resolve(this.localDataDetail.filter(s => s.Flag != 3));
        return deferred.promise;
      }
    });
   
  }

  ngOnChanges(changes: SimpleChanges)
   {     
    //console.log('header',   JSON.stringify(changes.headerItem.currentValue))
    this.REQP_ID = changes.REQP_ID.currentValue;
    if (this.REQP_ID != Guid.empty)
    {      
      this.localDataDetail = [];
      this.service.get("/PRG/Request/Get_PRG_Request_Production_Detail", (data) => {
        this.localDataDetail = data;
        this.dataGridDetail.instance.refresh();
      }, { REPD_REQP_ID: this.REQP_ID });
     }
  }

  onItemCodeChange(data, cell) {
    cell.setValue(data);
  }

  onGridDetailItemPrepering(e) {
    if (e.name == "DXEdit")
      e.visible = false;
  }


  onGridDetailItemClick(e) {
  }

  onDetailItemCodeChange(data, cell) {
    cell.setValue(data);
  }

  onButtonDetailClick(name) {
    if (name == "New") {
      this.dataGridDetail.instance.addRow();
    }
  }

  setCellValueOfDetailItemCode(newData, value, currentRow) {
    if (value != null) {
      newData.REPD_Item_Id = value.ID;
      newData.ITEM_CODE = value.Code;
      newData.ITEM_DESC = value.Description;
      newData.MSUN_DES = value.MwasurementUnitDescription;
      newData.REPD_DRefrencePrice = value.PrldPrice;
      newData.REPD_DSuggestPrice = value.PrldPrice;
      newData.SUM_DRefrencePrice = value.PrldPrice * currentRow.REPD_DPure
      newData.REPD_SUM_ITEM = value.PrldPrice * currentRow.REPD_DPure
    }
  }
  setCellMultiplicationOfDetailItemCode(newData, value, currentRow) {
    if (value != null) {
      debugger
      newData.REPD_SUM_ITEM = currentRow.REPD_DPure * value;
      newData.REPD_DSuggestPrice = value;
    }
  }


  setCellMultiplicationOfREPD_DPure(newData, value, currentRow) {
    if (value != null) {
      debugger
      newData.REPD_SUM_ITEM=currentRow.REPD_DSuggestPrice*value;
      newData.SUM_DRefrencePrice=currentRow.REPD_DRefrencePrice*value;
      newData.REPD_DPure = value;

    }
  }
  

  save(param: any, sacallback) {
    debugger
    if (this.REQP_ID != Guid.empty) {
      param.REPD_REQP_ID = this.REQP_ID;
      param.REQ_ID=this.REQ_Header.REQ_ID;
      this.service.post("/PRG/Request/Save_PRG_Request_Production_Detail", (data) => {
        sacallback(data);
        Notify.success("PUB_ACTION_SUCCESS_MSG");
      }, param);
    } else {

      Notify.info("PRG_ACTION_EMPTYVALUE_REQP_ID_MSG");
    }
  }

  Delete(param: any, callback) {
    this.service.post("/PRG/Request/Delete_PRG_Request_Production_Detail", (data) => {
      callback(data);
      Notify.success("PUB_ACTION_SUCCESS_MSG");
    }, param.data);
  }

  getpermissions() {
    debugger;
    this.allow_REPD_DRefrencePrice = this.permissionService.hasDefined('PRG-REQ-001')
}

}
