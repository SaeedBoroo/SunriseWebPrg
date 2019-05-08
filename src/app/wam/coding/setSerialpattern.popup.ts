import { Component, Input, OnInit, Output, ViewChild, AfterViewInit, EventEmitter, ContentChild, ComponentFactoryResolver, ComponentFactory, Injector, EmbeddedViewRef, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Deferred } from '../../shared/Deferred';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import 'rxjs/add/operator/toPromise';
import { LabelComponent } from "../../shared/components/label.component";
import { Guid } from '../../shared/types/GUID';
import { Notify } from '../../shared/util/Dialog';


//
@Component({
    selector: 'wam-setserialpattern-popup',
    templateUrl: './setserialpattern.popup.html'
})
export class WAMSetSerialPatternPopupPage extends BasePage {
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
        //console.log("visible changes");
        this.visibleChange.emit(this._visible);
    }

    // headerItem
    @Output()
    headerItemChange: EventEmitter<any > = new EventEmitter < any>();

    _headerItem: any;
    @Input()
    get headerItem(): any {
    return this._headerItem;
    }

    set headerItem(val: any) {
    this._headerItem = val;
    this.headerItemChange.emit(this._headerItem);
    }
    // SerialPatternValues
    @Output()
    SerialPatternValuesChange: EventEmitter<any> = new EventEmitter<any>();

    _SerialPatternValues: any;
    @Input()
    get SerialPatternValues(): any {
        return this._SerialPatternValues;
    }

    set SerialPatternValues(val: any) {
        this._SerialPatternValues = val;
        this.SerialPatternValuesChange.emit(this._SerialPatternValues);
    }

    // code
    @Output()
    codeChange: EventEmitter<string> = new EventEmitter<string>();

    _code: string;
    @Input()
    get code(): string {
        return this._code;
    }

    set code(val: string) {
        this._code = val;
        //console.log("visible changes");
        this.codeChange.emit(this._code);
    }

    //patternId
    @Output()
    patternIdChange: EventEmitter<string> = new EventEmitter<string>();

    _patternId: string;
    @Input()
    get patternId(): string {
        return this._patternId;
    }

    set patternId(val: string) {
        this._patternId = val;
        //console.log("visible changes");
        this.patternIdChange.emit(this._patternId);
    }

    filter: any = {};


    model: any = {};
    patternValueModel: any = {};
    patternValues: any = [];
    buttonText: string = this.translate.instant("PUB_SAVE");
    saveFlag: boolean = true;

    constructor(public service: ServiceCaller, public translate: TranslateService) {
        //
        super(translate);        
        this.filter.CodingPatternId = Guid.empty;
        this.bindData();
        console.log("this.headerItem");
        console.log(this.headerItem);
        //this.code = null;
    }

    bindData() {
        this.filter.CodingPatternId = this.patternId;
        debugger;
        if (this.SerialPatternValues == null || this.SerialPatternValues.length == 0) {
            this.buttonText = this.translate.instant("PUB_SAVE");
            this.saveFlag = true;
            this.service.get("/WAM/CodingPattern/List", (data) => {                
                this.model = data[0];                
                this.patternValues = [];
                let item: any = [];

                var t: any = {};
                t = data[0].Details;
                for (item in t) {
                    //t[item].RRRR = "10";
                    
                    if (t[item].CollumnName == 'GroupId') {
                        //t[item].CollumnValue = this.headerItem.GroupId;
                        t[item].CollumnText = this.headerItem.GroupCode;
                        t[item].Value = this.headerItem.GroupCode;
                    }
                    if (t[item].ParameterCode == 'SERIAL') {
                        //t[item].CollumnValue = this.headerItem.GroupId;
                        t[item].CollumnText = t[item].Serial;
                        t[item].Value = t[item].Serial;
                    }
                    else
                        t[item].CollumnValue = null;
                    t[item].CodingPatternParameterId = t[item].CodingPatternParameterId;
                    t[item].CodingPatternDetailId = t[item].CodingPatternDetailId;
                    t[item].ItemId = this.headerItem.ID;
                    this.patternValues.push(t[item]);
                }

            }, this.filter);
        }
        else {
            this.buttonText = this.translate.instant("PUB_RETURN");
            
            this.saveFlag = false;
            this.service.get("/WAM/CodingPattern/List", (data) => {
                this.model = data[0];
                this.patternValues = [];
                let item: any = [];

                var t: any = {};
                t = data[0].Details;
                for (item in t) {
                    //t[item].RRRR = "10";
                    t[item].CollumnValue = null;
                    t[item].MainFlag = true;
                    t[item].CollumnText = this.SerialPatternValues[item].Value;
                }

            }, this.filter);           
        }
    }

    patternChanged(data, ID) {
        var i = this.patternValues.findIndex(patternValue => patternValue.ID === ID);
        console.log('i');
        console.log(i);
        this.patternValues[i].Value = data.Code;
        //this.patternValues[data]
    }
    onSaveClick() {
        debugger;
        let nullValues: boolean = false;
        for (var t in this.patternValues) {
            if (this.patternValues[t].Value == null) {
                nullValues = true;
                //notify({
                //    message: this.translate.instant("PUB_REQUIRED"),
                //    type: "error",
                //    width: 400
                //});
                Notify.error('PUB_REQUIRED');
            }
        }
        if (!nullValues) {
            if (this.saveFlag) {
                // this.service.post("/WAM/MovementTrace/CreateCode", (data) => {
                //     this.code = data;
                //     this.SerialPatternValues = this.patternValues;
                //     //this.
                //     this.visible = false;
                // }, this.patternValues);
                this.SerialPatternValues = this.patternValues;
                this.visible = false;
            }
            else
                this.visible = false;
        }
    }
    onShow(e) { this.bindData(); }
}
