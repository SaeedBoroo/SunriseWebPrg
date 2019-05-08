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


@Component({
  selector: 'wam-page-countingssearch',
  templateUrl: './countingssearch.page.html',
  providers: [ServiceCaller]
})

export class WAMCountingsSearchPage extends BasePage implements OnInit {

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

  //menuItems: any[] = [{
  //name: "New",
  //icon: "fa fa-plus green",
  //text: this.translate.instant("NEW"),
  //visible: true,
  //disabled: false
  //  }];
  menuItems = [];
  gridItems = [
    {
      name: "dx-view",
      icon: "fa fa-eye green",
      text: 'مشاهده',
    }
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
      //case "dx-delete":
      //    {

      //        if (this.localData.ID != null) {
      //            var result = confirm(this.translate.instant("PUB_WARNING_CONFIRM_DLT"), this.translate.instant("PUB_CONFIRM"));
      //            result.then((dialogResult) => {
      //                if (dialogResult) {
      //                    var param: any = [];
      //                    param.push(this.localData.ID);
      //                    this.service.post("/WAM/Countings/Delete", (data) => {
      //                        this.localData = null;
      //                        this.insertItem = {};
      //                        this.dataGrid.instance.refresh();

      //                        notify({
      //                            message: this.translate.instant("PUB_SUCCESS_CONFIRM_DLT"),
      //                            type: "success",
      //                            width: 400
      //                        });
      //                    }, param);
      //                }
      //            });
      //        }
      //        break;
      //    }
    }
  }


  onMenuItemClick(name) {
    // 
    //switch (name) {
    //    case "New": {
    //        this.navToNew();
    //        break;
    //    }
    //    default:
    //}
    ////
  }
}
