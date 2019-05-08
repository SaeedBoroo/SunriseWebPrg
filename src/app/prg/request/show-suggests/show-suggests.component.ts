import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { TranslateService } from '../../../shared/services/TranslateService';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
import { BasePage } from '../../../shared/BasePage';
import { Deferred } from '../../../shared/Deferred';
import { Guid } from '../../../shared/types/GUID';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../../shared/util/Dialog';
import { PermissionService } from '../../../shared/permission';

@Component({
  selector: 'show-suggests',
  templateUrl: './show-suggests.component.html',
  styleUrls: ['./show-suggests.component.scss']
})
export class ShowSuggestsComponent extends BasePage implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
      
  }

  @ViewChild('Suggest_Grid') Suggest_Grid: DxDataGridComponent;
  popup_showing (e) {
    console.log('e',e)
    this.service.get("/PRG/Request/Get_PRG_Request_Production_Suggest", (data) => {
      if (data != null) {
        this.Suggest_Grid_localData = data;
        this.Suggest_Grid.instance.refresh();         
      }
    }, { REPS_REQP_ID: this.REQP_ID });
}

popup_hiding (e) {
  this.close_popup();  
}

ConfirmTypes: any[] = [
  {
      Value: 0,
      Title: "تایید نشده"
  },
  {
      Value: 1,
      Title: "تایید شده"
  }
];

  allow_PRG_REQ_007:boolean=false;
  @Input() ITEM_DESC:string;
  @Input() REQP_ID: Guid = Guid.empty;
  @Input() ShowSuggestPopupVisible: boolean = true;
  @Output() hide=new EventEmitter();
  Suggest_Grid_localData: any[] = [];
  datasource_suggest: any = {};
  constructor(public translate: TranslateService, public router: Router,
    private route: ActivatedRoute, public service: ServiceCaller,public permissionService: PermissionService) {
    super(translate);

    this.datasource_suggest.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        console.log("Suggest_Grid_localData", this.Suggest_Grid_localData);
        deferred.resolve(this.Suggest_Grid_localData);
        return deferred.promise;
      },
      update: (key, values) => {
        debugger
        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.Suggest_Grid_localData.filter(c => c.ID == key)[0];
       
        updatedItem.Flag = 2;
        let flagUpdate: any = {};
        flagUpdate = this.Suggest_Grid_localData.filter(i => i.REPS_Confirm==1 && (i.ID!=key) && values.REPS_Confirm==1).length;
        if (flagUpdate == 0) {
          deferred.resolve(true);      
          Object.assign(updatedItem, values);    
          this.suggest_save(updatedItem);
          return deferred.promise;
        }
        else {
          deferred.reject("امکان تغییر وضعیت به تایید شده برای بیش از یک ردیف امکان پذیر نیست!");
          return deferred.promise;
        }

      }
    }
    );
  }

  suggest_save(updatedItem :any) {
      this.allow_PRG_REQ_007=this.permissionService.hasDefined('PRG-REQ-007');//مجوز دسترسی به ویرایش پیشنهاد
      if (this.allow_PRG_REQ_007)
      {
        updatedItem.REPS_REQP_ID = this.REQP_ID;
        this.service.post("/PRG/Request/Save_PRG_Request_Production_Suggest", (data) => {
          Notify.success("PUB_ACTION_SUCCESS_MSG");
          this.Suggest_Grid.instance.refresh();
        }, updatedItem);
      }
        else  { Notify.info("PRG_REQ_SUGGEST_EDIT_LIMIT") }
  }

  close_popup(): void {
    this.ShowSuggestPopupVisible = false;
    this.hide.emit(this.ShowSuggestPopupVisible);
    this.Suggest_Grid_localData = [];
    console.log('ShowSuggestPopupVisible_sa', this.ShowSuggestPopupVisible); 
  } 

  private findTitle(state, value) {
    return this.ConfirmTypes.find(c => c.Value == state).Title;
}

  private findColor(state, value) {
    if (state == 0) {
        return value ? 'green' : 'red';
    }
    return state == 1 ? 'green' : 'red';
}

private findIcon(state, value) {

    if (state == 0) {
        return value ? 'fa-check' : 'fa-ban';
    }
    return state == 1 ? 'fa-check' : 'fa-ban';
}

}
