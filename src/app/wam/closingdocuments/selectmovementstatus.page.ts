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
import { Guid } from '../../shared/types/GUID';

@Component({
  selector: 'wam-page-selectmovementstatus',
  templateUrl: './selectmovementstatus.page.html',
  providers: [ServiceCaller]
})

export class WAMSelectMovementStatusPage extends BasePage implements OnInit {
  ngOnInit() {
  }
  //@ViewChild('datagrid') dataGrid: DxDataGridComponent;
  //@ViewChild('movementGrid') movementGrid: DxDataGridComponent;
  //@ViewChild('form') form: DxValidationGroupComponent;


  menuItems = [

  ];
  //LOV
  officesLov: any = {};
  officesSeletedValue: any = {};
  constructor(public service: ServiceCaller, public translate: TranslateService, private router: Router, private route: ActivatedRoute) {
    super(translate);
    
  }
  onMenuItemClick(e) { }
  financialPeriodChanged(e) { }
  onValueChangedOffices(e) { }


}
