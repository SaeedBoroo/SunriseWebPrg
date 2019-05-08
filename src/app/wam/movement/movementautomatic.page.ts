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
import { Notify, Dialog } from '../../shared/util/Dialog';


@Component({
  selector: 'wam-page-movementautomatic',
  templateUrl: './movementautomatic.page.html',
  providers: [ServiceCaller]
})

export class WAMMMovementAutomatic extends BasePage implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  ngOnInit() {

  }
  readonly:boolean=false;

  insertItem: any = {};
  selectedKeys: any = [];
  selectedRow: any = {};
  itemSelectedRow: any = [];
  loadParams: any = {};
  //menuItems = [];
  dataSource: any = {};
  typeTarget: any;
  menuItems: any[] = [
    {
      name: "AutomaticInsert",
      icon: "fa fa-magic",
      text: this.translate.instant("WAM_AUTO_INSERT_MOVEMENT"),
      visible: true
    }];

  gridItems: any[] = [
    //{
    //  name: "DXAutomaticInsert",
    //  icon: "fa fa-magic",
    //  text: this.translate.instant("WAM_AUTO_INSERT_MOVEMENT"),
    //  visible: true
    //}
  ];


  constructor(public service: ServiceCaller,
    public translate: TranslateService,
    private router: Router,
    private routeDate: RouteData,
    private route: ActivatedRoute) {
    super(translate);
    var param: any = {};
    debugger;
    param.Code = '262';//this.route.snapshot.data["type"];
    if (param.Code == null) {
      this.route.queryParams.subscribe(params => {
        if (params['type'] != null) {

          param.Code = params['type'];
          this.service.get("/WAM/MovementType/List", (data) => {

            this.loadParams.RequestTypeID = data[0].ID;
            this.dataGrid.instance.refresh();
          }, param)
        }
      });
    }
    else {
      this.service.get("/WAM/MovementType/List", (data) => {
        if (data != undefined && data.length != 0) {
          this.insertItem.RequestTypeID = data[0].ID;
          this.loadParams.RequestTypeID = data[0].ID;
          this.typeTarget = param.Code;
          this.dataGrid.instance.refresh();
        }
      }, param)
    }
    //this.loadParams = 
  }

  RequesttTypeChanged(d) {
    var param: any = {};
    if (d.ID != null) {
      param.Code = d.Code;//this.route.snapshot.data["type"];
      this.typeTarget = param.Code;
      this.service.get("/WAM/MovementType/List", (data) => {
        this.loadParams.RequestTypeID = data[0].ID;
        this.dataGrid.instance.refresh();
      }, param)
    }
  }

  selectionChangedHandler() {
    debugger;
    if (this.selectedKeys.length >= 1) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
      this.itemSelectedRow = this.dataGrid.instance.getSelectedRowsData();
    }
    else {
      this.selectedRow = {};

    }
  }
  onRowDbClick(e) { 
    this.router.navigate(["wam/request/mrprequest"], { queryParams: { ID: this.selectedRow.RequestId } });
  }

  onMenuItemClick(name) {
    switch (name) {
      case "New":
        {
          this.router.navigate(["wam/request/mrprequest"], { queryParams: { ID: null } });
          break;
        }
      case "AutomaticInsert":
        {
          debugger;
          let ArrayList: any = [];
          ArrayList = this.itemSelectedRow.filter(s => s.Status == 20);
          let ArrayListGuid: any = [];
          ArrayList.forEach(t => {
            ArrayListGuid.push(t.ID);
          });
          if (ArrayListGuid.length >= 1) {
            let message = '';
            if (this.itemSelectedRow.length != ArrayListGuid.length) {
              message = "WAM_AUTOMATIC_INSERT_STATUS_CREATE";
            }
            else {
              message = "WAM_AUTOMATIC_INSERT_STATUS_CONFIRM";
            }
            Dialog.confirm("",message).okay(() => {
              this.service.post("/WAM/Movement/AutomaticInsertMrpMovementGroup", (data) => {
                this.dataGrid.instance.refresh();
                Notify.success('PUB_ACTION_SUCCESS_MSG');
              }, ArrayListGuid);
            });
            
          }
          else {
            Notify.error('WAM_AUTOMATIC_INSERT_STATUS');
          }
          break;
        }
      default:
    }
    //
  }

  onGridItemClick(e) {
    debugger
    if (e.name == "DXAutomaticInsert") {
      //if (this.selectedRow.Status == 20) {
      //  this.service.post("/WAM/Movement/AutomaticInsertMrpMovement", (data) => {
      //    this.dataGrid.instance.refresh();
      //    Notify.success('PUB_ACTION_SUCCESS_MSG');
      //  }, this.selectedKeys);
      //}
      //else {
      //  Notify.error('WAM_MRP_INSERT_STATUS');
      //}
      

    }
  }

  
}
