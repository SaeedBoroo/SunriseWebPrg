import { Component, Input, AfterViewInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Inject, Injectable } from '@angular/core';

import { Http, HttpModule, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../services/ServiceCaller';
import { Deferred } from '../Deferred';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../services/TranslateService';
import { RouteData } from '../util/RouteData';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent, DxTextBoxComponent, DxSelectBoxComponent, DxLookupComponent, DxDropDownBoxModule, DxListModule, DxSelectBoxModule } from 'devextreme-angular';

declare function print_pdf(url: string);
@Injectable()
export class PrintComponent {
    http: Http;
    service: ServiceCaller;
    reportData: any = {};
    filename: any = '';
    datasourcecond: any = [];
    // form code
    @Input()
    formCode: string = '';

    // 
    @Output() paramsChange: EventEmitter<any>;

    private _params: any = {};

    @Input()
    get params(): any {


        return this._params;
    }
    set params(val: any) {

        this._params = val;
        if (val)

            this.paramsChange.emit(this._params);

    }
    constructor(@Inject(ServiceCaller) service: ServiceCaller, private route: ActivatedRoute, private routeData: RouteData) {
        this.service = service;
        this.paramsChange = new EventEmitter<any>();

    }
    init(params, formCode) {
        this.params = params;
        this.formCode = formCode;
    }

    getFilter() {
        let filter: any = {
            Params: []
        };
        this.reportData.Code = this.formCode;
        filter.Code = this.formCode;
        Object.keys(this.params).forEach(element => {
            filter.Params.push({
                Name: element,
                Value: this.params[element],
                Operators: '1'
            });
        });
        return filter;
    }

    printwithoutshow(getFilter = null) {
        let that = this;
        this.service.postPromise("/ADM/Report/List", getFilter ? getFilter() : this.getFilter()).then(data => {
            that.filename = data.FileName;
            that.service.getfile("/ADM/Report/GetFile?FileName=" + that.filename, (data) => {
                let url = that.service.BaseURL + "/ADM/Report/print?FileName=" + that.filename + "&Code=" + that.formCode;
                //
                print_pdf(url);
            });

        });
    }

}