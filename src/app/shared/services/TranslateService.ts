import { Inject, Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ServiceCaller } from './ServiceCaller';
import { Deferred } from '../Deferred';
import 'rxjs/Rx';
import notify from 'devextreme/ui/notify';




@Injectable()
export class TranslateService {

    data: any;

    constructor(private service: ServiceCaller) {
        if (localStorage.getItem("translate") == null) {
            service.get("/SYS/Lang/String/List", (data) => {
                localStorage.setItem("translate", JSON.stringify(Object.entries(data)));
            });
        }
        else {
            this.data = JSON.parse(localStorage.getItem("translate"));
        }
    }



    public instant(key: string): string {
        //console.log("instant");
        //use 0 for object entries
        if (!this.data) {
            notify({
                message: "لطفا آخرین نسخه را دریافت کنید",
                type: "error",
                width: 400,
                displayTime: 10000,
                closeOnClick: true,
                closeOnOutsideClick: true
            });
            return key;
        }
        let temp = [];
        // this.data.forEach(element => {
        //     if (element[0] === key)
        //         temp = element;
        // });
        // if (!temp)
        temp = this.data.find(function (element) {
            return element[0] == key;
        })
        if (!temp)
            temp = this.data.filter(function (element) {
                return element[0] == key;
            }).shift();

        if (temp)
            return temp[1];

        return key;
        // return this.data[key] || key;
    }
}
