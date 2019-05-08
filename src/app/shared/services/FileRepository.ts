import { Inject, Injectable } from '@angular/core';
import { Http, HttpModule, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import notify from 'devextreme/ui/notify';
import { Response } from '@angular/http';
import { Repository } from './Repository';
import { EventsService } from 'angular-event-service/dist';
import { FileService } from './FileService';
import { HttpClientHandler } from '../errorHandler/http-error.tldr';

declare function $params(obj: any): string;


@Injectable()
export class FileRepository extends Repository {
    constructor(protected http: Http, protected eventsService: EventsService,public httpHandler: HttpClientHandler) {
        super(http, eventsService,httpHandler);
    }
    /**
      * return Observable<Response>
      */
    public postFile(path, body: any = null): Promise<any> {
        var headers = this.createHeaderFile();
        //
        return new Promise((resolve, reject) => {

            return this.http.post(this.BaseURL + path, body, { headers: headers })
                .toPromise().then(response => {
                    var json = response.json();
                    resolve(json.Result);
                }).catch(err => {
                    reject(err)
                })
        })
        //.then(response => response.json().Result);
    }

    /**
    * Get File, Return Primose<any>
    */
    public getfileList(path = '/EDM/File/List', params: any = null): Promise<any> {
        var headers = this.createHeader();
        let url = this.BaseURL + path;
        return new Promise((resolve, reject) => {
            var q = $params(params);
            if (q != "") {
                if (url.indexOf("?") > 0)
                    url = url + "&" + q;
                else
                    url = url + "?" + q;
            }
            this.http.get(url, { headers: headers }).toPromise().then(response => {
                var json = response.json();
                resolve(json.Result)
            }).catch(err => {
                reject(err)
            })
        })

    }

    /**
    * return Observable<Response>
    */
    public getfileObservable(path, params: any = null): Observable<Response> {
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
        return this.http.get(url, { headers: headers });
    }

    public createHeaderFile(): Headers {
        var headers = new Headers();
        // headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // headers.append('Accept', 'application/json');
        var token = localStorage.getItem("token");
        if (token)
            headers.append("Authorization", "Basic " + localStorage.getItem("token"));
        return headers;
    }
}
