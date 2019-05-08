import { Component, Input, Output, OnInit, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceCaller } from '../../services/ServiceCaller';
import { RouteData } from '../../util/RouteData';
import { TranslateService } from '../../services/TranslateService';
import { BasePage } from '../../BasePage';


@Component({
    selector: 'dx-customgallery',
    templateUrl: './gallery.component.html'
})
export class GalleryComponent extends BasePage implements OnInit {
    galleryData: any = {};
    BaseUrl: string = "";
    // form tablename
    @Input()
    tableName: string;
    ngOnInit() {

        let params = {};
        let Images = [];
        let image: any;
        params = { TableName: this.tableName };



        this.service.getPromise('/EDM/File/GetFilePath', params).then(res => {


            res.forEach(element => {
                image = this.service.BaseFileURL + '/' + element;
                Images.push(image);
            });
            this.galleryData = Images;
            return res;
        });
    }

    constructor(
        public service: ServiceCaller,
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private routeDate: RouteData,

    ) {

        super(translate);
    }
}
