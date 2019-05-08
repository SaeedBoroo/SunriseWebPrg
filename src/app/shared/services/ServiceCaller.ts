import { Inject, Injectable } from '@angular/core';
import { Http, HttpModule, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import notify from 'devextreme/ui/notify';
import { Response } from '@angular/http';
import { FileRepository } from './FileRepository';
import { EventsService } from 'angular-event-service/dist';
import { FileService } from './FileService';
import { HttpClientHandler } from '../errorHandler/http-error.tldr';
import { environment } from '../../../environments/environment';


declare function $params(obj: any): string;


@Injectable()
export class ServiceCaller extends FileRepository {

    http: Http;



    constructor(@Inject(Http) http: Http, @Inject(EventsService) eventsService: EventsService, public httpHandler: HttpClientHandler) {
        super(http, eventsService, httpHandler);
        this.http = http;
    }
    public get(path, callback, params: any = null, onError = null,sun_Header_token:any="sunrise_token") {
        var headers = this.createHeader(sun_Header_token);

        var url = this.BaseURL + path;

        var q = $params(params);

        if (q != "") {
            if (url.indexOf("?") > 0)
                url = url + "&" + q;
            else
                url = url + "?" + q;
        }

        console.log("get=> " + url);
        // 
        //
        super.showLoading();

        this.http.get(url, { headers: headers })

            .toPromise()
            .then(response => {

                super.hideLoading();
                var json = response.json();
                console.log(json);
                if (json.Succeed == true)
                    callback(json.Result);
                else {
                    let message = json.Message.Handled == true ? json.Message.Text : 'Network Error';
                    this.showNotify(message);
                    console.log(message);
                    if (onError != null) {
                        onError();
                    }
                }
            }).catch(err => {
                this.httpHandler.handleError(err.message, this.showNotify)
                super.hideLoading();
            });
    }
    /**
    * @deprecated Use other method
    */
    public post(path, onCallback, body: any = null, onError = null,sun_Header_token:any="sunrise_token") {
        debugger
        let headers = this.createHeader(sun_Header_token);
        //
        super.showLoading();
        return this.http.post(this.BaseURL + path, body, { headers: headers })
            .toPromise()
            .then(response => {
                debugger
                super.hideLoading();
                var json = response.json();
                let result;
                console.log(json);
                if (json.Succeed == true)
                    result = onCallback(json.Result);
                else {
                    let message = json.Message.Handled == true ? json.Message.Text : 'Network Error';
                    this.showNotify(message);
                    console.log(message);
                    if (onError != null) {
                        onError(message);
                    }
                }
                return result || json.Result;
                //this.handlerData(response, callback);
            }).catch(err => {
                this.httpHandler.handleError(err.message, this.showNotify)
                super.hideLoading();
            });
    }
    /**
    * @deprecated Use other method
    */
    public getfile(path, callback, params: any = null, onError = null) {
        var headers = this.createHeader();
        var url = this.BaseURL + path;
        var q = $params(params);
        if (q != "") {
            if (url.indexOf("?") > 0)
                url = url + "&" + q;
            else
                url = url + "?" + q;
        }
        console.log("get=> " + url);
        // 
        //
        super.showLoading();
        this.http.get(url, { headers: headers })
            //   .retry(3)
            .subscribe((data: any) => {
                super.hideLoading();
                if (data._body.startsWith('<!DOCTYPE html>')) {

                    window.open(environment.url + JSON.parse(JSON.stringify(data._body)), '_blank');
                } else {

                    window.open(environment.url + JSON.parse((data._body)), '_blank');
                }
                callback(data);
            });
    }

    base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }


    // private handleError(error: any) {
    //     let errMsg = (error.message) ? error.message :
    //         error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    //     this.showNotify(errMsg);
    //     return Observable.throw(errMsg);
    // }


    public loadLovData(code: string, callback: (items: any[]) => void, params: any = null): void {
        let paramList = [];

        for (var i in params) {
            paramList.push({ Name: i, Value: params[i] });
        }
        this.get("/SYS/FORMS/List", (data) => {
            callback(data.Data);
        },
            {
                Code: code,
                Params: paramList
            })
    }


}

