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
import { Guid } from '../../shared/types/GUID';

@Component({
  selector: 'wam-page-codingpattern',
  templateUrl: './codingpattern.page.html',
  providers: [ServiceCaller]
})
export class WAMCodingPatternPage extends BasePage implements OnInit {
  ngOnInit() {

  }
  @ViewChild('datagrid') dataGrid: DxDataGridComponent;
  @ViewChild('form') form: DxValidationGroupComponent;

  menuItems: any[] = [
    {
      name: "New",
      icon: "fa fa-plus green",
      text: this.translate.instant("NEW"),
      visible: true,
      disabled: false
    },
    {
      name: "Save",
      icon: "fa fa-floppy-o green",
      text: this.translate.instant("SAVE"),
      visible: true,
      disabled: false
    },
    {
      name: "Confirm",
      icon: "fa fa-check green",
      text: this.translate.instant("PUB_CONFIRM"),
      visible: true,
      disabled: false
    },
    {
      name: "AdvancedSearch",
      icon: "fa fa-search",
      text: this.translate.instant("ADVANCED_SEARCH"),
      visible: true,
      disabled: false
    }
  ];


  //LOV
  businessUnites: any = {};
  codeType: any = {};
  category: any = {};
  method: any = {};

  parameters: any = {};
  //LovFilter
  categoryFilter: any = {};
  //Variables
  itemSelectedKeys: any = [];
  selectedRow: any = {};
  flgSearch: boolean = false;
  formStatus: number = 0;
  updateDisabled: boolean = false;

  infoPopupVisibile: boolean = false;
  //DataCotainers
  headerItem: any = {};
  dataSource: any = {};
  localData: any[] = [];
  filter: any = {};
  editRow: any = {};
  //

  flagSimpleMode: boolean = true;

  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);

    let Config: any = {};
    Config.ConfigMode = 1;
    Config.key = 'WAM_FLG_SIMPLE_MODE';
    this.service.get("/ADM/Config/List", (data) => {
      if (data == 0)
        this.flagSimpleMode = false;
      else if (data == 1)
        this.flagSimpleMode = true;
    }, Config);

    this.route.queryParams.subscribe(params => { this.filter.CodingPatternId = params['codingPatternID'], this.formStatus = params['formStatus'] });
    this.loadData();
    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var updatedItem = this.localData.filter(c => c.ID == key)[0];
        updatedItem.Flag = 2;
        //if (updatedItem.ParameterID == null)
        //  updatedItem.ParameterID = this.editRow.ParameterID;

        if ((this.editRow.ParameterID != null) && (updatedItem.ParameterID == null || (updatedItem.ParameterID != null && updatedItem.ParameterID != this.editRow.ParameterID)))
          updatedItem.ParameterID = this.editRow.ParameterID;

        Object.assign(updatedItem, values);
        deferred.resolve(true);
        return deferred.promise;
      },
      insert: (values) => {
        var detailInsert: any = [];
        let deferred: Deferred<any> = new Deferred<any>();
        var insertedItem = Object.assign(values, { ID: Math.random() }) as any;
        Object.assign(values, { Flag: 1 }) as any;
        values.ParameterID = this.editRow.ParameterID;
        this.localData.push(values);
        deferred.resolve(true);
        return deferred.promise;
      }
      , remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.localData.filter(c => c.ID == key)[0].Flag = 3;
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      }
    });

    //LOV
    this.categoryFilter = { ITCT_FILTER: null };
    this.service.loadLovData("LOV-WAM-011", (data) => { this.parameters = data; });

    //this.service.loadLovData("LOV-WAM-006", (data) => { this.category = data; }, { ITCT_FILTER : "41"});
  }


  clearForm() {
    this.headerItem = {};
    this.headerItem.Status = 10;
    this.localData = [];
    this.filter = {};
    this.dataGrid.instance.refresh();
    this.updateDisabled = false;
    this.enableConfirm();
    //
  }
  onMenuItemClick(name) {
    switch (name) {
      case "New": {
        this.clearForm();
        break;
      }
      case "Edit": {
        break;
      }
      case "Search": {
        //this.lessMode = !this.lessMode;
        this.flgSearch = !this.flgSearch;
        break;
      }
      case "AdvancedSearch": {
        this.router.navigate(["wam/coding/codingpatternsearch"]);
        //
        break;
        //
      }
      case "Confirm": {
        if (this.headerItem != undefined && this.headerItem.ID != null) {
          this.headerItem.Status = 20;
          var param = this.headerItem;
          this.service.post("/WAM/CodingPattern/Save", (data) => {
            //this.clearForm();
            if (data[0] != null) {
           
              //console.log('this.headerItem.ID');
              //console.log(this.headerItem.ID);



              //Commented By hooman Aghaei
            // this.headerItem = data;
            // this.localData = data.Details;
            //////////////////////////
              if (this.headerItem.Status > 10)
                this.updateDisabled = true;
              else
                this.updateDisabled = false;
            }
            //notify({
            //    message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
            //    type: "success",
            //    width: 400
            //});
         
            Notify.success('PUB_ACTION_SUCCESS_MSG');
            this.enableConfirm();
          }, param);
        }
        else
          Notify.error('PUB_NOT_DATA');

      }
      case "Save": {
        var result = this.form.instance.validate();
        if (result.isValid) {
          var param = this.headerItem;
          var detailInsert: any = [];
          var detailUpdate: any = [];
          var detailDelete: any = [];
          //Insert
          this.localData.filter(i => i.Flag == 1).forEach(t =>
            detailInsert.push({
              Sequence: t.Sequence,
              Seperator: t.Seperator,
              ParameterID: t.ParameterID,
              Lenght: t.Lenght,
            }));
          //Update
          this.localData.filter(i => i.Flag == 2).forEach(t =>
            detailUpdate.push({
              ID: t.ID,
              Sequence: t.Sequence,
              Seperator: t.Seperator,
              ParameterID: t.ParameterID,
              Lenght: t.Lenght,
            }));

          //Delete
          this.localData.filter(i => i.Flag == 3).forEach(t => detailDelete.push(t.ID));
          var Details: any = {};
          Details.InsertedItems = detailInsert;
          Details.UpdatedItems = detailUpdate;
          Details.DeletedItems = detailDelete;
          param.Details = Details;
          this.service.post("/WAM/CodingPattern/Save", (data) => {
            //this.clearForm();

            //  console.log('this.headerItem.ID');
            //  console.log(this.headerItem.ID);


            //Commented By hooman Aghaei
            this.headerItem = data;
            this.localData = data.Details;
            //////////////////////////

           debugger;
            if (this.headerItem.Status > 10)
              this.updateDisabled = true;
            else
              this.updateDisabled = false;
            //notify({
            //    message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
            //    type: "success",
            //    width: 400
            //});
            if (this.dataGrid.instance != undefined && this.dataGrid != undefined)
              this.dataGrid.instance.refresh();
            Notify.success('PUB_ACTION_SUCCESS_MSG');
            this.enableConfirm();
          }, param);
          break;
        }
      }
      case 'UserInfo':
        this.infoPopupVisibile = true;
        break;
      default:
    }

  }

  onButtonClick(name) {
    switch (name) {
      case "New":
        this.dataGrid.instance.addRow();
        break;
      case "Delete": {
        this.itemSelectedKeys.forEach(s => {
          this.localData.filter(c => c.ID == s)[0].Flag = 3;
        })
        this.dataGrid.instance.refresh();
        break;
      }
      default:
    }
  }
  itemInserted() {
  
    var result = this.form.instance.validate();
    debugger;
    if (result.isValid) {
      this.onMenuItemClick('Save');
    }
  }
  onGridItemClick(e) {
    //  console.log('e');
    //  console.log(e);


    if (e.name == 'DXInsert' || e.name == 'DXEdit') {
      var result = this.form.instance.validate();
      if (!result.isValid)
        e.handled = true;

    }
    if (e.name == 'DXDelete' || e.name == 'DXSelectedDelete') {
      Notify.error('PUB_CLICK_ON_SAVE_TO_PERMANENT_DELETE');
    }
    if (this.headerItem.Status > 10) {
      //alert("امکان یه روز رسانی ماغیرهای سیستمی وجود ندارد");
      //notify({
      //    message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
      //    type: "error",
      //    width: 400
      //});
      Notify.error('WAM_INVALID_UPDATE_MSG');
      e.handled = true;
    }

    if (this.headerItem.Method != 2) {
      //alert("امکان یه روز رسانی ماغیرهای سیستمی وجود ندارد");
      //notify({
      //    message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
      //    type: "error",
      //    width: 400
      //});
      Notify.error('WAM_PATTERN_TYPE');
      e.handled = true;
    }
    if (this.headerItem.Method != 2) {
      //alert("امکان یه روز رسانی ماغیرهای سیستمی وجود ندارد");
      //notify({
      //    message: this.translate.instant("WAM_INVALID_UPDATE_MSG"),
      //    type: "error",
      //    width: 400
      //});
      Notify.error('WAM_PATTERN_TYPE');
      e.handled = true;
    }

  }
  selectionChangedHandler() {
    if (this.itemSelectedKeys.length == 0) {
      this.itemSelectedKeys = {};
    }
    else if (this.itemSelectedKeys.length == 1) {
      this.itemSelectedKeys = this.dataGrid.instance.getSelectedRowsData()[0];
    }
    else {
      this.itemSelectedKeys = {};
    }
  }
  loadData() {
    if (this.formStatus == 1) {
      this.service.get("/WAM/CodingPattern/List", (data) => {
        if (data[0] != null) {
          this.headerItem = data[0];
          this.localData = data[0].Details;
          this.dataGrid.instance.refresh();
          if (this.headerItem.Status > 10)
            this.updateDisabled = true;
          else
            this.updateDisabled = false;
        }
        else this.clearForm();

        this.enableConfirm();
      }, this.filter);
    }
    else
      this.headerItem.Status = 10;
  }
  searchClick() {
    this.loadData();
  }
  onParameterChanged(data, cell) {
    this.editRow.ParameterID = data.ID;
    cell.setValue(data.Title);
  }

  enableConfirm() {
    //if (this.headerItem.Status >= 20)
    //  this.menuItems[2].text = this.translate.instant("WAM_MODIFY");
    //else
    //  this.menuItems[4].text = this.translate.instant("PUB_CONFIRM");
    if (this.headerItem.ID == Guid.empty || this.headerItem.ID == null || this.headerItem.Status >= 20)
      this.menuItems[2].disabled = true;
    else
      this.menuItems[2].disabled = false;
  }
}
