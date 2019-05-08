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
  selector: 'wam-page-mrprequestsearch',
  templateUrl: './mrprequestsearch.page.html',
  providers: [ServiceCaller]
})

export class WAMMRPRequestSearchPage extends BasePage implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  ngOnInit() {

  }


  selectedKeys: any = [];
  selectedRow: any = {};
  loadParams: any = {};

  menuItems: any[] = [{
    name: "New",
    icon: "fa fa-plus green",
    text: this.translate.instant("NEW"),
    visible: true,
    disabled: false
  }];

  gridItems = [
    {
      name: "dx-view",
      icon: "fa fa-eye green",
      text: 'مشاهده',
    }
  ];

  navToView() {

    this.router.navigate(["wam/request/mrprequest"], { queryParams: { ID: this.selectedKeys[0] } });
  }

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private routeDate: RouteData,
    private route: ActivatedRoute) {
    super(translate);
    var param: any = {};
    param.Code = this.route.snapshot.data["type"];
    if (param.Code == null) {
      this.route.queryParams.subscribe(params => {
        if (params['type'] != null) {
          param.Code = params['type'];
          this.service.get("/WAM/MovementType/List", (data) => {
            if (data.length > 0) {
              this.loadParams.RequestTypeID = data[0].ID;
              this.refreshGrid();
            }
          }, param)
        }
        else if (params['ReffrenceType'] != null) {
          this.loadParams.ReffrenceType = params['ReffrenceType'];
          this.refreshGrid();
        }

        else if (params['ReffrenceType'] == null) {
          this.loadParams.ReffrenceType = 1;
          this.refreshGrid();
        }
      });
    }
    else {
      this.service.get("/WAM/MovementType/List", (data) => {
        if (data.length > 0) {          
          this.loadParams.RequestTypeID = data[0].ID;
          this.refreshGrid();
        }
      }, param)
    }
    //this.loadParams = 
  }

  refreshGrid() {
    if (this.dataGrid != undefined && this.dataGrid.instance != undefined)
      this.dataGrid.instance.refresh();
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

    if (e.name == "dx-view") {
      this.navToView();
    }
  }


  onMenuItemClick(name) {
    switch (name) {
      case "New":
        {

          this.router.navigate(["wam/request/mrprequest"], { queryParams: { ID: null } });
          break;
        }
      default:
    }
    //
  }

  onRowDbClickRouting(e) {
    this.navToView();
  }
}
