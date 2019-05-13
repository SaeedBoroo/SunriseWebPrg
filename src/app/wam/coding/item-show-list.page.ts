import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { DXLovComponent } from '../../shared/components/dx-lov.component';
import { DemisPopupService } from '../../shared/components/popup/demis-popup-service';
import { and } from '@angular/router/src/utils/collection';



//نمایش دادن موجودیت هر انبار بر اساس فیلترهای درخواستی
@Component({
    selector: 'item-show-list',
    templateUrl: './item-show-list.page.html',
    providers: [ServiceCaller]
})
export class WamShowItemsPageComponent extends BasePage implements OnInit, OnChanges {

  @Input() cat_id
  @Input() cat_name
  @Input() grp_id
  @Input() grp_name
  @Input() onvan = null
  @Input() VahedAnbar

  @ViewChild('showListGrid') showListGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;
  @ViewChild('fastSearchLov') fastSearchLov: DXLovComponent;

 
  showListGridCount: any
  dataSource: any = {};
  LocalData: any[] = [];

  //..
  constructor(public service: ServiceCaller, private popup: DemisPopupService,
     public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    //
  
  }
  
  ngOnInit() {

    
   
    this.getItemListAPI();

  this.dataSource.store = new CustomStore({
    key: "ID",
    load: (loadOptions) => {
      let deferred: Deferred<any> = new Deferred<any>();
      deferred.resolve(this.LocalData);
      if(this.LocalData.length == 0){
          this.showListGrid.instance.refresh();
      }
      return deferred.promise;
    },
    update: (key, values) => {
      return null
    },
    insert: (values) => {
      return null
    }
    , remove: (key) => {
      return null
    }
  });

  }

  ngOnChanges( changes: SimpleChanges ){

      this.showListGrid.instance.filter([
        [
          [ "Description", "contains", this.onvan] ,"or",
          [ "CategoryId", "=", this.cat_id] ,"or",
          [ "GroupId", "=", this.grp_id]
        ],"or",
        [
          [ "Description", "contains", this.onvan] ,"and",
          [ "CategoryId", "=", this.cat_id] ,"and",
          [ "GroupId", "=", this.grp_id]
        ]


        // [
        //   [
        //     [ "Description", "contains", this.onvan] ,"or",
        //     [ "CategoryId", "=", this.cat_id] ,"or",
        //     [ "GroupId", "=", this.grp_id]
        //   ], "or",
        //   [
        //     [ "Description", "contains", this.onvan] ,"and",
        //     [ "CategoryId", "=", this.cat_id] ,"and",
        //     [ "GroupId", "=", this.grp_id]
        //   ]
        // ],
        //  "and",
        // [
        //   [
        //     [ this.onvan , "=", undefined ] ,"or",
        //     [ this.cat_id, "=", undefined ] ,"or",
        //     [ this.grp_id, "=", undefined ]
        //   ],"or",
        //   [
        //     [ "Description", "contains", this.onvan] ,"and",
        //     [ "GroupId", "=", this.grp_id]
        //   ],"or",
        //   [
        //     [ "Description", "contains", this.onvan] ,"and",
        //     [ "CategoryId", "=", this.cat_id]
        //   ],"or",
        //   [
        //     [ "CategoryId", "=", this.cat_id] ,"and",
        //     [ "GroupId", "=", this.grp_id]
        //   ]
        // ] 
      ]);

        
     
      
    
      
    }


       

    
    

getItemListAPI(){

    this.service.get("/WAM/Item/List", (data) => {
      this.LocalData = data
      
      
      console.log('LocalData >> ', data)
    });



     
}

}
 
//   if(!changes.onvan.isFirstChange()) {   
    
//     this.CrntValue = changes.onvan.currentValue;         
//     this.showListGrid.instance.filter([
//       [ "Description", "contains", this.CrntValue ]
//   ]);
// }