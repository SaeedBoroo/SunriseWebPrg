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
  selector: 'wam-page-requestsearch',
  templateUrl: './requestsearch.page.html',
  providers: [ServiceCaller]
})

export class WAMRequestSearchPage extends BasePage implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  ngOnInit() {

  }


  selectedKeys: any = [];
  selectedRow: any = {};

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
     
    this.router.navigate(["wam/request/request"], { queryParams: { ID: this.selectedKeys[0] } });
  }

  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private routeDate: RouteData) {
    super(translate);
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
         
        this.router.navigate(["wam/request/request"], { queryParams: { ID: null } });
        break;
      }
      default:
    }
    //
  }

  onRequestClick(cell) {
    this.navToView();
  }
}
