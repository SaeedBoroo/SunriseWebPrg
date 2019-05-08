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
import { RouteData } from '../../shared/util/RouteData';
import { Notify } from '../../shared/util/Dialog';


@Component({
  selector: 'wam-page-verifycountingslist',
  templateUrl: './verifycountingslist.page.html',
  providers: [ServiceCaller]
})

export class WAMVerifyCountingsListPage extends BasePage implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  ngOnInit() {

  }


  selectedKeys: any = [];
  selectedRow: any = {};
  deleteparam: any = {};
  countingsId: string;
  localData: any = {};
  insertItem: any = {};
  editItem: any = {};
  dataSource: any = {};

  menuItems: any[] = [{
    icon: "fa fa-edit yellow",
    text: '    عملیات    ',
    items: [
      {
        name: "FisrtCounter",
        // icon: 'fa fa-bar-chart green',
        text: "انجام شمارش اول"
      },
      {
        name: "ConfirmFisrtCounter",
        // icon: 'fa fa-pencil-square-o green',
        text: "تایید شمارش اول"

      },
      {
        name: "ConfirmSecondCounter",
        // icon: 'fa fa-pencil-square-o green',
        text: "تایید شمارش دوم"

      },
      {
        name: "ConfirmThirdCounter",
        // icon: 'fa fa-pencil-square-o green',
        text: "تایید شمارش سوم"

      },

    ]
  },];

  gridItems = [
    //{
    //    name: "dx-view",
    //    icon: "fa fa-eye green",
    //    text: 'مشاهده',
    //}
    //,
    //{ 
    //    name: "DXInsert",
    //    // icon: "fa fa-trash-o",
    //     text: 'جدید',
    // }
  ];

  navToView() {
    this.router.navigate(["wam/countings/countings"], { queryParams: { ID: this.selectedRow } });
  }

  navToNew() {
    this.router.navigate(["wam/countings/countings"], { queryParams: { ID: "" } });
  }

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute) {
    super(translate);
    // this.dataGrid.instance.refresh();


  }

  selectionChangedHandler() {
    if (this.selectedKeys.length == 1) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0].ID;
    }
    else {
      this.selectedRow = {};

    }
  }

  onGridItemClick(e) {

    switch (e.name) {

      case "dx-view":
        {
          this.navToView();
          break;
        }
      case "DXInsert":
        {
          this.navToNew();
          e.handled = true;
          break;
        }
    }
  }

  onMenuItemClick(name) {
     
    switch (name) {

      case "FisrtCounter": {
        var param: any = {};
        param.CountingId = this.selectedKeys[0];
        param.ID = this.selectedKeys[0];
        param.State = 1;

        this.service.post("/WAM/CountingsLis/SaveState", (data) => {
          this.dataGrid.instance.refresh();
          Notify.success('عملیات با موفقیت انجام شد');
        }, param);
        break;
      }

      case "ConfirmFisrtCounter": {
        var param: any = {};
        param.CountingId = this.selectedKeys[0];
        param.ID = this.selectedKeys[0];
        param.State = 2;

        this.service.post("/WAM/CountingsLis/SaveState", (data) => {
          this.dataGrid.instance.refresh();
          Notify.success('عملیات با موفقیت انجام شد');
        }, param);
        break;
      }

      case "ConfirmSecondCounter": {
        var param: any = {};
        param.CountingId = this.selectedKeys[0];
        param.ID = this.selectedKeys[0];
        param.State = 3;

        this.service.post("/WAM/CountingsLis/SaveState", (data) => {
          this.dataGrid.instance.refresh();
          Notify.success('عملیات با موفقیت انجام شد');
        }, param);
        break;
      }

      case "ConfirmThirdCounter": {
        var param: any = {};
        param.CountingId = this.selectedKeys[0];
        param.ID = this.selectedKeys[0];
        param.State = 4;

        this.service.post("/WAM/CountingsLis/SaveState", (data) => {
          this.dataGrid.instance.refresh();
          Notify.success('عملیات با موفقیت انجام شد');
        }, param);
        break;
      }
    }
  }


 
}