import { Component, AfterViewInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '../services/TranslateService';
import { ServiceCaller } from '../services/ServiceCaller';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
import { AuthService } from "../services/AuthService";
import * as screenfull from 'screenfull';
import { EventsService } from 'angular-event-service/dist';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { DemisPopupService } from '../components/popup/demis-popup-service';
declare function page_init(): any;
declare function sidemenu_hide(): any;



@Component({
    selector: 'master-layout',
    templateUrl: './master.layout.html',
    animations: [
        trigger('navigation', [
            state('true', style({ left: '-20%' })),
            state('false', style({ left: '0%' })),
            transition('0 => 1', animate('.2s')),
            transition('1 => 0', animate('.2s'))

        ]),
        trigger('showOverlay', [
            state('true', style({ opacity: 1, display: "block" })),
            state('false', style({ opacity: 0, display: "none" })),
            transition('0 => 1', animate('.2s')),
            transition('1 => 0', animate('.5s'))

        ])
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterLayoutComponent implements AfterViewInit {
    isLoading: boolean;
    navigation: boolean = true;
    showOverlay: boolean = false;
    version: string = "1.0";
    config: any = { items: [], subject: null };

    navigationDrawer() {
        this.navigation = !this.navigation;
        this.showOverlay = !this.showOverlay;
    }
    constructor(
        private router: Router,
        public authService: AuthService,
        private route: ActivatedRoute,
        private service: ServiceCaller,
        private eventsService: EventsService,
        private cdr: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef,
        private demisPopupService: DemisPopupService,


    ) {


        //

        route.data.subscribe((data) => {
            if (data.config) {
                var keys = data.config.keys;
                this.config.subject = data.config.subject;
                if (keys && keys.length) {
                    service.getPromise('/ADM/Config/User/Display', { keys: keys }).then((b) => {
                        this.config.items = b;
                    });;
                }
                else {
                    this.config.items = [];
                }
            }
            else {
                this.config.items = [];
            }
        });
        this.version = localStorage.getItem("version");

    }

    ngAfterViewInit() {
        page_init();
        this.eventsService.on("loading", (value) => {
            if (value)
                this.isLoading = true;
            else
                this.isLoading = false;
            // this.cdr.markForCheck();
        })
    }

    toggleScreen() {
        screenfull.toggle();
        sidemenu_hide();
    }

    gotoUserConfig(key) {
        if (key) {
            this.router.navigate(['/adm/user/configs'], { queryParams: { key: key } });
        }
        else {
            if (this.config.subject) {
                this.router.navigate(['/adm/user/configs'], { queryParams: { subject: this.config.subject } });
            }
            else {
                this.router.navigate(['/adm/user/configs']);
            }
        }
    }


    ngOnDestroy(): void {
        this.viewContainerRef.clear();
     }
     ngOnInit(): void {
         this.demisPopupService.setRootViewContainerRef(this.viewContainerRef);
     }


}
