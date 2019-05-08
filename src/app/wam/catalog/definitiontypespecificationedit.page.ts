import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { RouteData } from '../../shared/util/RouteData';
import { Notify } from '../../shared/util/Dialog';

@Component({
  selector: 'wam-page-definitiontypespecificationedit',
  templateUrl: './definitiontypespecificationedit.page.html',
  providers: [ServiceCaller]
})

export class WAMDefinitionTypeSpecificationEditPage extends BasePage implements OnInit {


  @ViewChild('formValidation') formValidation: DxValidationGroupComponent;
  @ViewChild('grid') dataGrid: DxDataGridComponent;

  ngOnInit() {
    this.service.loadLovData("LOV-WAM-012", (data) => {
      this.QuantityTypeDataSource = data;
    });
    this.service.loadLovData("LOV-WAM-005", (data) => {
      this.UnitDataSource = data;
    });
    this.service.loadLovData("LOV-WAM-014", (data) => {
      this.CatalogTypeDataSource = data;
    });
    this.service.loadLovData("LOV-WAM-013", (data) => {
      this.CodeParamDataSource = data;
    });

    if (this.routeDate.storage.data != null) {
      var data: any = [];
      data = this.routeDate.storage.data;
      this.editItem.Code = data.Code;
      this.editItem.Description = data.Description;
      this.editItem.IsActive = data.IsActive;
      this.editItem.ID = data.ID;
      this.localData = data.Elements;
      this.localData.forEach(s => s.Flag = 2);
      this.refreshGrid();
    }
    if (this.routeDate.storage.data == null) {
      this.editItem = {};
      this.localData = [];
      this.refreshGrid();
    }
  }

  refreshGrid() {
    if (this.dataGrid != undefined && this.dataGrid.instance != undefined)
      this.dataGrid.instance.refresh();
  }

  editItem: any = {};
  dataSource: any = {};
  localData: any = [];
  selectedKeys: any = [];
  QuantityTypeDataSource: any = [];
  UnitDataSource: any = [];
  CatalogTypeDataSource: any = [];
  CodeParamDataSource: any = [];

  gridItems = [
    {}
  ];

  menuItems = [
    {
      name: "Add",
      icon: "fa fa-floppy-o green",
      text: this.translate.instant("PUB_SAVE"),
      visible: true
    },
    {
      name: "cancel",
      text: this.translate.instant("PUB_RETURN"),
      icon: "fa fa-ban red",
      visible: true
    },
  ];

  navToForm() {
    this.router.navigate(["wam/catalog/definitiontypespecification"]);
  }

  onMenuItemClick(name) {

    if (name == "Add") {

      var param: any = {};
      param.Code = this.editItem.Code;
      param.Description = this.editItem.Description;
      param.IsActive = this.editItem.IsActive;
      param.ID = this.editItem.ID;
      var detailInsert: any = [];
      var detailUpdate: any = [];
      var detailDelete: any = [];

      //Insert
      this.localData.filter(i => i.Flag == 1).forEach(t =>
        detailInsert.push({
          ID: t.ID,
          CatalogeParameterTypeID: t.CatalogeParameterTypeID,
          CatalogeParameterTypeName: t.CatalogeParameterTypeName,
          DisplaySequence: t.DisplaySequence,
          DefaultValue: t.DefaultValue,
          UnitId: t.UnitId,
          CatalogueTypeID: t.CatalogueTypeID,
          CatalogueTypeDescroptin: t.CatalogueTypeDescroptin,
          Requierd: t.Requierd,
          DataTypeId: t.DataTypeId,
        }));
      //Update
      this.localData.filter(i => i.Flag == 2).forEach(t =>
        detailUpdate.push({
          ID: t.ID,
          CatalogeParameterTypeID: t.CatalogeParameterTypeID,
          CatalogeParameterTypeName: t.CatalogeParameterTypeName,
          DisplaySequence: t.DisplaySequence,
          DefaultValue: t.DefaultValue,
          UnitId: t.UnitId,
          CatalogueTypeID: t.CatalogueTypeID,
          CatalogueTypeDescroptin: t.CatalogueTypeDescroptin,
          Requierd: t.Requierd,
          DataTypeId: t.DataTypeId,
        }));

      //Delete
      this.localData.filter(i => i.Flag == 3).forEach(t =>
        detailDelete.push(t.ID));

      var Items: any = {};
      Items.InsertedItems = detailInsert;
      Items.UpdatedItems = detailUpdate;
      Items.DeletedItems = detailDelete;
      param.Elements = Items;
      this.service.post("/WAM/ItemCatalogue/Save", (data) => {
        // 
        //this.editItem = data;
        //this.localData = data.Elements;
        //this.localData.forEach(s => s.Flag = 2);
        this.refreshGrid();
        //this.navToForm();
      }, param);

    }

    if (name == "SaveNext") {
      if (this.selectedKeys.length != 0 && this.editItem != null) {
        var param: any = {};
        param.Code = this.editItem.Code;
        param.Description = this.editItem.Description;
        param.IsActive = this.editItem.IsActive;
        param.ID = this.editItem.ID;
        var detailInsert: any = [];
        var detailUpdate: any = [];
        var detailDelete: any = [];

        //Insert
        this.localData.filter(i => i.Flag == 1).forEach(t =>
          detailInsert.push({
            ID: t.ID,
            CatalogeParameterTypeID: t.CatalogeParameterTypeID,
            CatalogeParameterTypeName: t.CatalogeParameterTypeName,
            DisplaySequence: t.DisplaySequence,
            DefaultValue: t.DefaultValue,
            UnitId: t.UnitId,
            CatalogueTypeID: t.CatalogueTypeID,
            CatalogueTypeDescroptin: t.CatalogueTypeDescroptin,
            Requierd: t.Requierd,
            DataTypeId: t.DataTypeId,
          }));
        //Update
        this.localData.filter(i => i.Flag == 2).forEach(t =>
          detailUpdate.push({
            ID: t.ID,
            CatalogeParameterTypeID: t.CatalogeParameterTypeID,
            CatalogeParameterTypeName: t.CatalogeParameterTypeName,
            DisplaySequence: t.DisplaySequence,
            DefaultValue: t.DefaultValue,
            UnitId: t.UnitId,
            CatalogueTypeID: t.CatalogueTypeID,
            CatalogueTypeDescroptin: t.CatalogueTypeDescroptin,
            Requierd: t.Requierd,
            DataTypeId: t.DataTypeId,
          }));

        //Delete
        this.localData.filter(i => i.Flag == 3).forEach(t =>
          detailDelete.push(t.ID));

        var Items: any = {};
        Items.InsertedItems = detailInsert;
        Items.UpdatedItems = detailUpdate;
        Items.DeletedItems = detailDelete;
        param.Elements = Items;
        this.service.post("/WAM/ItemCatalogue/Save", (data) => {
          this.editItem = {};
          this.localData = [];
          this.refreshGrid();
        }, param);
      }
      //notify({
      //    message: this.translate.instant("پر بودن گرید و iput ها اجباری است"),
      //    type: "warning",
      //    width: 330
      //});
      Notify.warning('ERROR_COMPLETE_FORM');
    }

    if (name == "cancel") {
      this.navToForm();
    }

  }

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private routeDate: RouteData) {
    super(translate);
    this.dataSource.store = new CustomStore({
      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;
      },
      insert: (values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        //Object.assign(values, { ID: Math.random() }) as any;
        Object.assign(values, { ID: Math.random(), Flag: 1 }) as any;
        this.localData.push(values);
        deferred.resolve(true);
        return deferred.promise;

      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        Object.assign(this.localData.filter(c => c.ID == key)[0], values);
        deferred.resolve(true);
        return deferred.promise;
      },
      remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.localData.filter(c => c.ID == key)[0].Flag = 3;
        deferred.resolve(this.localData.filter(s => s.Flag != 3));
        return deferred.promise;

      }
    });
  }
  itemInserted() {
      this.onMenuItemClick('Add');  
  }
  onGridItemClick(e) {
    if (e.name == 'DXDelete' || e.name == 'DXSelectedDelete') {
      Notify.error('PUB_CLICK_ON_SAVE_TO_PERMANENT_DELETE');
    }
  }


}
