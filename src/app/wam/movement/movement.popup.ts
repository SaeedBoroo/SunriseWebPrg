import { Component, Inject, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';

@Component({
  selector: 'wam-movement-popup',
  templateUrl: './movement.popup.html'
})

export class WAMMovementPopup implements OnInit {

  ngOnInit() {

  }

  @ViewChild('itemGrid') itemGrid: DxDataGridComponent;
  // Visible
  @Output()
  visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _visible: boolean;
  @Input()
  get visible(): boolean {
    return this._visible;
  }

  set visible(val: boolean) {
    this._visible = val;
    console.log("visible changes");
    this.visibleChange.emit(this._visible);


  }

  //selectedRow
  @Output()
  selectedRowChange: EventEmitter<any> = new EventEmitter<any>();

  _selectedRow: any;
  @Input()
  get selectedRow(): any {
    return this._selectedRow;
  }

  set selectedRow(val: any) {
    this._selectedRow = val;
  }
  selectedKeys: any = {};

  loadParams: any = {};

  lovIttp: any = {};

  flagSimpleMode: boolean = true;

  constructor(public service: ServiceCaller, public translate: TranslateService) {
    let Config: any = {};
    Config.ConfigMode = 1;
    Config.key = 'WAM_FLG_SIMPLE_MODE';
    this.service.get("/ADM/Config/List", (data) => {
      if (data == 0)
        this.flagSimpleMode = false;
      else if (data == 1)
        this.flagSimpleMode = true;
    }, Config);
    this.loadParams = this.selectedRow;
    this.service.loadLovData("LOV-WAM-024", (data) => { this.lovIttp = data; })
  }

  onFormSubmit(e) {
  }

  onCancelClick() {
  }
  onShow(e) {
    debugger;
    this.loadParams = {RequestItemId:this.selectedRow.RequestItemId};
    this.refreshGrid();
  }

  refreshGrid() {
    debugger;
    if (this.itemGrid != undefined && this.itemGrid.instance != undefined)
      this.itemGrid.instance.refresh();
  }
}
