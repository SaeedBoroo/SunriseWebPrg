import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { Guid } from '../../shared/types/GUID';
import { Notify } from '../../shared/util/Dialog';
import { DXLovComponent } from '../../shared/components/dx-lov.component';
import { DemisPopupService } from '../../shared/components/popup/demis-popup-service';
import { AssignItemWarehousePage } from './assignitemwarehouse.page';
import { WAMItemGroupLovPage } from '../itemgroup/itemgroupTreeLov.page';
import { WAMWarehouseLocationPage } from '../warehouselocation/warehouselocation.page';
import { DefinitionCategories } from '../categories/DefinitionCategories.page';


//نمایش دادن موجودیت هر انبار بر اساس فیلترهای درخواستی
@Component({
    selector: 'item-show-list',
    templateUrl: './item-show-list.page.html',
    providers: [ServiceCaller]
})
export class WamShowItemsPageComponent extends BasePage implements OnInit {

  @Input('cat_id') cat_id
  @Input('grp_id') grp_id

  @ViewChild('showListGrid') showListGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;
  @ViewChild('fastSearchLov') fastSearchLov: DXLovComponent;

 
 
  //LOV
  codeType: any = {};
  method: any = {};
  units: any = {};
  parameters: any = {};
  patternParameterFilter: any = {};
  patternId: string;
  serialPatternId: string;
  patternFlag: boolean = false;
  code: string = "";
  code1: string = "";
  //LovFilter
  categoryFilter: any = {};
  catalogueFilter: any = {};
  CmmUnitFilter: any = {};
  //Variables
  selectedTab = 0;
  revisionStatusLov: any = {};
  showVersionPopup: boolean = false;
  versionGridMode: any = {};
  loadVersionListGrid: any = {};
  selectedKeys: any = [];
  typeSelectedKeys: any = [];
  unitSelectedKeys: any = [];
  versionSelectedKeys: any = [];
  unitSelectedRow: any = {};
  searchSelectedKeys: any = [];
  searchSelectedRow: any = {};
  itemRevisionsParams: any = {};
  setItemPatternPopup = false;
  setSerialPatternPopup = false;
  infoPopupVisibile: boolean = false;
  selecPatterntButton: string = this.translate.instant("WAM_PATTERN_SELECT");
  readonly: boolean = false;
  patternType: boolean = true;
  catalogueLength: Number = 4;
  revisionReadOnly: boolean;
  businessUnitPopup: boolean = false;
  locationPopup: boolean = false;
  typePopup: boolean = false;
  ItemInProdPopup: boolean = false;
  ItemInvWarehousePopup: boolean = false;
  //DataCotainers
  headerItem: any = {};
  itemShowListDataSource: any = {};
  catalogueDataSource: any = {};
  unitLocalData: any[] = [];
  catalogueLocalData: any[] = [];
  filter: any = {};
  popupFilter: any = {};
  patternFilter: any = {};
  serialPatternFilter: any = {};
  editRow: any = {};
  model: any = {};
  patternValues: any = [];
  serialPatternValues: any = [];
  saveLoadParams: any = {};
  locationSaveLoadParams: any = {};
  typeSaveLoadParams: any = {};
  ItemInProdParam: any = {};
  InventoryWarehouseParam: any = {};
  allMain: boolean = true;
  formConfig: any = {};
  flagSimpleMode: boolean = true;
  FieldsTbl : any
  column1: any
  column2: any
  column3: any

  //..
  constructor(public service: ServiceCaller, private popup: DemisPopupService,
     public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    //
   
  }
  
  ngOnInit() {

    this.service.get("/SYS/FORMS/List", (data) => {
        this.itemShowListDataSource = data.Data;
        console.log('data List>>> ', data.Data)
    }, { Code: "LOV-WAM-201" });





    this.itemShowListDataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.itemShowListDataSource);
        return deferred;
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
 
  loadData() {
    this.service.getPromise("/SYS/Forms/List?Code=LOV-WAM-201" ).then((data) => {
      if (data[0] != null) {
        console.log('data List> ', data)
        this.headerItem = data[0];
        this.code = this.headerItem.Code;
        this.catalogueFilter = { CatalogueId: this.headerItem.CatalogueId };
        if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null) {
          //this.readonly = false;
          this.selecPatterntButton = this.translate.instant("WAM_PATTERN_SELECT");
        }
        else {
          //this.readonly = true;
          //this.patternType = true;
          this.selecPatterntButton = this.translate.instant("WAM_PATTERN_VIEW");
        }
        this.unitLocalData = data[0].Units;
        this.catalogueLocalData = data[0].Elements;

        this.patternValues = data[0].PatternValues;
        this.serialPatternValues = data[0].SerialPatternValues;

        //
      }

    }, this.filter);
  }
 


}
