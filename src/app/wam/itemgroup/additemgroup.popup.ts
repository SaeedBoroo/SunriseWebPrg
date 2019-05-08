import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import CustomStore from "devextreme/data/custom_store";
import ArrayStore from "devextreme/data/array_store";
import "rxjs/add/operator/toPromise";
import { ServiceCaller } from "../../shared/services/ServiceCaller";
import { Deferred } from "../../shared/Deferred";
import notify from "devextreme/ui/notify";
import { confirm } from "devextreme/ui/dialog";
import { TranslateService } from "../../shared/services/TranslateService";

@Component({
  selector: "wam-additemgroup-popup",
  templateUrl: "./additemgroup.popup.html"
})
export class WAMAddItemGroupPopupPage {
  // Visible
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _visible: boolean;
  @Input()
  get visible(): boolean {
    return this._visible;
  }

  set visible(val: boolean) {
    this._visible = val;

    this.visibleChange.emit(this._visible);
  }

  @Output() flagChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _flag: boolean;
  @Input()
  get flag(): boolean {
    return this._flag;
  }

  set flag(val: boolean) {
    this._flag = val;
    this.rootDisabled = val;
    this.flagChange.emit(this._flag);
  }

  //ParentCode
  @Output()
  parentCodeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _parentCode: string;
  @Input()
  get parentCode(): string {
    return this._parentCode;
  }

  set parentCode(val: string) {
    this._parentCode = val;

  }

  //selectedRow
  @Output() selectedRowChange: EventEmitter<any> = new EventEmitter<any>();

  _selectedRow: any;
  @Input()
  get selectedRow(): any {
    return this._selectedRow;
  }

  set selectedRow(val: any) {
    this._selectedRow = val;
  }

  //level
  @Output() levelChange: EventEmitter<number> = new EventEmitter<number>();

  _level: number;
  @Input()
  get level(): number {
    return this._level;
  }

  set level(val: number) {
    this._level = val;
  }
  //ParentId
  @Output() parentIdChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _parentId: string;
  @Input()
  get parentId(): string {
    return this._parentId;
  }

  set parentId(val: string) {
    this._parentId = val;
    //console.log("parentCode changes");
    //console.log(this._parentId);
  }
  //itcdtId
  @Output() itcdIdChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _itcdId: string;
  @Input()
  get itcdId(): string {
    return this._itcdId;
  }

  set itcdId(val: string) {
    this._itcdId = val;
    //console.log("parentCode changes");
    //console.log(this._itcdId);
  }

  rootDisabled: boolean = false;
  addBranchPopup = false;
  branchItems: any = {};
  selectedKeys: any = {};
  //itemGroupCode: string = this._parentCode + this.branchItems.LevelCode;

  constructor(
    public service: ServiceCaller,
    public translate: TranslateService
  ) {
    //
    //this.dataSource.store = new CustomStore({
    //    key: "ID",

    //    update: (key, values) => {
    //        return new Promise((resolve, reject) => {
    //            let item = {};
    //            resolve(true);
    //        })
    //    }
    //});
    if (this.selectedRow != undefined && this.selectedRow.mode == 1)
      this.branchItems = Object.assign({}, this.selectedRow);
    else
      this.branchItems.Code;
  }

  onFormSubmit(e) {
    this.branchItems.ParentID = this.parentId;
    this.branchItems.ItemCodingId = this.itcdId;
    if (this.branchItems.MeasurementUnitlId == null && this.branchItems.MeasurementUnitCommercialId != null)
      this.branchItems.MeasurementUnitlId = this.branchItems.MeasurementUnitCommercialId;
    else if (this.branchItems.MeasurementUnitCommercialId == null && this.branchItems.MeasurementUnitlId != null)
      this.branchItems.MeasurementUnitCommercialId = this.branchItems.MeasurementUnitlId;

    this.service.post(
      "/WAM/ItemGroup/Save",
      data => {
        this.selectedKeys = [];
        this.addBranchPopup = false;
        notify({
          message: this.translate.instant("PUB_ACTION_SUCCESS_MSG"),
          type: "success",
          width: 400
        });
        this.visible = false;

      },
      this.branchItems
    );
  }

  onCancelClick() {
    this.addBranchPopup = false;
  }
  setCode() {

    if (this.branchItems.LevelCode != null)
      this.branchItems.Code = this._parentCode + this.branchItems.LevelCode;
  }
  //
  onEditorPreparingCatalogue(e) { }
  onEditorPreparingUnit(e) { }
  onShow(e) {

    this.clearForm();
  }
  clearForm() {
    this.branchItems = {};
  
    if (this.selectedRow != undefined && this.selectedRow.mode == 1) {
      this.branchItems = Object.assign({}, this.selectedRow);
      this.branchItems.ID = this.selectedRow.ID;
      this.branchItems.parentId = this.selectedRow.ParentID;
    }
    else {

      this.selectedRow.Level = this.level;

      this.service.post(
        "/WAM/ItemGroup/GetLevelCode",
        data => {

          //this.branchItems.Code = data;
          //this.branchItems.LevelCode = data.replace(this._parentCode, '');
        //
       
          this.branchItems.LevelCode = data;
          this.branchItems.Code = this._parentCode + data;
          this.branchItems.IsActive = true;
          this.branchItems.MeasurementUnitlId = this.selectedRow.MeasurementUnitlId;
          this.branchItems.UnitDes = this.selectedRow.MeasurementUnitDescription;
          this.branchItems.CatalogueId = this.selectedRow.CatalogueId;
          this.branchItems.MeasurementUnitCommercialId = this.selectedRow.MeasurementUnitCommercialId;
          this.branchItems.UnitDesCMM = this.selectedRow.MeasurementUnitCommercialDescription;
          this.branchItems.Description = null;
          
        
        },
        this.selectedRow
      );
    }
  }

}
