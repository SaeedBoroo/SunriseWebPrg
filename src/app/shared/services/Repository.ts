import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import notify from 'devextreme/ui/notify';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { EventsService } from 'angular-event-service/dist';
import { AppComponent } from '../app.component';
import { AppModule } from '../../app.module';
import { Inject, ReflectiveInjector, Injector } from '@angular/core';
import { FileService } from "./FileService";
import { HttpClientHandler } from '../errorHandler/http-error.tldr';

declare function $params(obj: any): string;

export class Repository {
    busyStack: Array<boolean> = new Array<boolean>();

    // private fileInfo = {
    //     FileNames: [],
    //     TableName: '',
    //     entityId: ''
    // }

    getSubject: Function;

    public BaseURL: string = environment.api_url;
    public BaseFileURL: string = environment.file_url;

    protected defaultConfig: any = { loading: true };



    protected fileService: FileService;

    constructor(protected http: Http, protected eventsService: EventsService,
        public httpHandler: HttpClientHandler) {
        let injector = ReflectiveInjector.resolveAndCreate([
            FileService
        ]);

        this.fileService = injector.get(FileService);
    }

    protected showNotify(message: string) {
        notify({
            message: message,
            type: "error",
            width: 400,
            displayTime: 10000,
            closeOnClick: true,
            closeOnOutsideClick: true
        });
    }

    protected showLoading() {
        this.busyStack.push(true);
        this.eventsService.broadcast("loading", this.isBusy());
    }

    protected hideLoading() {
        this.busyStack.pop();
        this.eventsService.broadcast("loading", this.isBusy());
    }

    private isBusy() {
        return this.busyStack.length > 0;
    }

    /**
     * return Promise<any>
     * @param path
     * @param params
     */
    public getPromise(path, params: any = null, config: any = this.defaultConfig): Promise<any> {
        let headers = this.createHeader();

        return new Promise((resolve, reject) => {

            let url = this.BaseURL + path;

            let q = $params(params);

            if (q != "") {
                if (url.indexOf("?") > 0)
                    url = url + "&" + q;
                else
                    url = url + "?" + q;
            }

            console.log("get=> " + url);
            // 
            //
            if (config.loading)
                this.showLoading();
            this.http.get(url, { headers: headers })
                .toPromise()
                .then(response => {
                    let json = response.json();
                    console.log(json);
                    if (json.Succeed == true)
                        resolve(json.Result);
                    else {
                        let message = json.Message.Handled == true ? json.Message.Text : 'Network Error';
                        //Notify.error(message);
                        this.httpHandler.handleError(message, this.showNotify);
                        console.log(message);
                        reject(message);

                    }
                }).catch(err => {
                    reject(err.message);
                    this.httpHandler.handleError(err.message, this.showNotify);
                }).then(() => {
                    if (config.loading)
                        this.hideLoading();
                });
        });

    }
    /**
    * return new Promise<any>
    */
    public postPromise(path, body: any = null, config: any = this.defaultConfig): Promise<any> {
     
        Object.assign(config, {
            saveFile: config.saveFile || false,
            tableName: config.tableName || '',
            useId: config.useId || true,
            preFileName: config.preFileName || ''
        });
        let headers = this.createHeader();
        //
        return new Promise((resolve, reject) => {
            if (config.loading)
                this.showLoading();
            return this.http.post(this.BaseURL + path, body, { headers: headers })
                .toPromise()
                .then(response => {
                    let json = response.json();
                    if (json.Succeed == true) {
                        console.log(json);
                        if (config.useId && json.Result && json.Result.ID)
                            //this.save files  after check file names is null
                            this.fileService.setFileInfo(null, config.tableName, json.Result.ID)

                        if (json.Result && config.saveFile == true) {
                            this.saveConfirmFile(json.Result, config.preFileName)
                        }
                        resolve(json.Result);
                    }
                    else {
                        let message = json.Message.Handled == true ? json.Message.Text : 'Network Error';
                        this.showNotify(message);
                        console.log(message);
                        reject(message)
                    }
                }).catch(err => {
                    reject(err.message);
                    this.httpHandler.handleError(err.message, this.showNotify);

                }).then(() => {
                    if (config.loading)
                        this.hideLoading();
                });;
        });
    }
    /**
    * return Observable<Response>
    */
    public postObservable(path, body: any = null): Observable<Response> {
        let headers = this.createHeader();
        //
        return this.http.post(this.BaseURL + path, body, { headers: headers })
            .retry(3)
            .map(response => response.json().Result);
    }
    public createHeader(sun_Header_token: any = "sunrise_token"): Headers {
       
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        if (sun_Header_token != "sunrise_token") {
            headers.append("Authorization", "Basic " + sun_Header_token);
        }
        else {
            let token = localStorage.getItem("token");
            if (token)
                headers.append("Authorization", "Basic " + localStorage.getItem("token"));
        }
        if (this.getSubject) {
            headers.append("SubjectCode", this.getSubject());
        }

        return headers;
    }

    private saveConfirmFile(entity, preFileName) {
        this.fileService.setPending(true);
        let fileInfo = this.fileService.getFileInfo();
        // entity: entity.ID, tableName: '' 
        fileInfo.files.forEach(element => {
            if (element.entityId == null)
                element.entityId = entity.ID;
            element.preFileName = preFileName;
            //  let opt = { saveFile: true, tableName: element.TableName, useId: true,preFileName: preFileName}
            this.postPromise("/EDM/File/SaveConfirm", element).then(res => {
                this.fileService.setPending();
                this.fileService.clearFileInfo();
                return res;
            });
        });
        //  fileInfo.entityId = entity.ID;

    }
}