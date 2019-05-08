import { NgModule, APP_INITIALIZER, ErrorHandler, ModuleWithProviders } from "@angular/core";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";



//
// import {
//     DxTextBoxModule ,
//     DxNumberBoxModule ,
//     DxMenuModule,
//     DxDataGridModule, 
//     DxPopupModule,
//     DxTabsModule,
//     DxTagBoxModule
// } from "devextreme-angular";

import { DevExtremeModule } from "devextreme-angular";
//
import { BasePage, PopupBasePage } from "./BasePage";
import { Deferred } from "./Deferred";
import { LabelComponent } from "./components/label.component";
import { PageContentComponent } from "./components/ui/content.component";
import { NavSideMenuComponent } from "./components/ui/sidemenu.component";
import { BreadcrumbsComponent } from "./components/ui/breadcrumb.component";
import { LoginLayoutComponent } from "./layouts/login.layout";
import { MasterLayoutComponent } from "./layouts/master.layout";
import { LoginPage } from "./pages/login.page";
import { ResetPasswordPage } from "./pages/setpass.page";
import { HomePage } from "./pages/home.page";
import { DXLovComponent } from "./components/dx-lov.component";
import { DXToolbarComponent } from "./components/dx-toolbar.component";
import { DXLabelBoxComponent } from "./components/ui/dx-label-box";
import { DXGridToolbarComponent } from "./components/gridtoolbar/dx-gridtoolbar.component";
import { DXGridToolbarDataSourceComponent } from "./components/gridtoolbar/dataSource.component";
import { DXTreeToolbarComponent } from "./components/gridtoolbar/dx-treetoolbar.component";
import { PopupComponent } from "./components/popup/popup.component";
import { SearchComponent } from "./components/search/search.component";
import { InputGroupComponent } from "./components/inputGroup/inputgroup.component";
import { BorderedInputComponent } from "./components/chequeComponents/borderedInput/borderedInput.component";
import { TextViewComponent } from "./components/textview/textview.component";

import { DynamicFormPage } from "./pages/dform.page";
import { TestPage } from "./pages/test.page";
import { UiTestPage } from "./pages/uiTest.page";
import { HasanzadePage } from "./pages/hasanzade.page";

import { FileExplorerPopupPage } from "./components/fileExplorer/fileexplorer.popup";

import { NotFoundPage } from "./pages/404.page";
import { AccessDeniedPage } from "./pages/403.page";
import { PageComponent } from "./components/ui/page.component";
import { DXDateBoxComponent } from "./components/datepicker/dx-date-picker";
import { DXTimeBoxComponent } from "./components/ui/dx-time-picker";
import { TranslateService } from "./services/TranslateService";
import { TranslatePipe } from "./pipes/translate.pipe";
import { ServiceCaller } from "./services/ServiceCaller";
import { PrintComponent } from "./components/print.component";

import { MenuService } from "./services/MenuService";
import { AuthGuard } from "./services/AuthGuard";
import { AuthService } from "./services/AuthService";
import { RouteData } from "./util/RouteData";
import { EventsServiceModule } from "angular-event-service/dist";
import { ModuleHomePage } from "./pages/module-home.page";
import { ReportPage } from "./report/report.page";
import { ReportButtonComponent } from "./report/dx-report.component";
import { UploadComponent } from "./components/uploader/upload.component";
import { UploadService } from "./components/uploader/upload.service";
import { FileUploadComponent } from "./components/FileUploader/fileupload.component";
import { ImageUploadComponent } from "./components/FileUploader/imageupload.component";
import { GalleryComponent } from "./components/FileUploader/gallery.component";

import { SlideShowComponent } from "./components/FileUploader/slideshow.component";

import { DatePipe } from "@angular/common";
import { DateTimeJalaliPipe } from "./components/datepicker/datetime-jalali.pipe";
import { DatetimepickerComponent } from "./components/datepicker/datetimepicker.component";
import { InputMaskDirective } from "./components/datepicker/input-mask.directive";
import { DraggableDirective } from "./directives/Draggable.directive";
// import { FormsModule } from '@angular/forms';

import { PermissionService } from "./permission/services/permission.service";
import { PermissionHelper } from "./permission/services/permission-helper.service";

import { FileService } from "./services/FileService";
import { ImageUploadModule } from "angular2-image-upload";
import { DemisErrorHandler } from "./errorHandler/DemisErrorHandler";
import { HttpErrorInterceptor } from "./errorHandler/http-error.interceptor";
import { HttpClientHandler } from "./errorHandler/http-error.tldr";
import { PanelBoxComponent } from "./components/panelbox/panelbox.component";
import { TransInputComponent } from "./components/transInput/transinput.component";
import { DemisPopup } from "./components/popup/demis-popup";
import { DemisPopupService } from "./components/popup/demis-popup-service";
import { ImageViewer } from "./components/FileUploader/image.viewer";
import { ConfigService } from "./services/ConfigService";
import { ThemeService } from "./services/ThemeService";
import { PopupTest } from "./pages/popup.test";
import { CoreService } from "./services/CoreService";
import { UploadPopupComponent } from "./components/fileExplorer/upload.popup";
import { FolderPopupComponent } from "./components/fileExplorer/folder.popup";
import { FileExplorerService } from "./components/fileExplorer/fileexplorer.service.proxy";
import { FolderExplorerService } from "./components/fileExplorer/folderexplorer.service.proxy";
import { FileExplorerManager } from "./components/fileExplorer/fileexplorer.service";
import { LoginPopup } from "./pages/login.popup";
import { DialogService, NotifyService } from "./util/Dialog";
import { FileExplorerConfigComponent } from "./components/fileExplorer/fileexplorer.config.component";
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';


const packageVersion = require("../../../package.json");

declare function page_actions(): any;

export function onStartup(service: ServiceCaller): () => Promise<any> {
  return () => {
    let currentVersion = packageVersion.version;
    let currentTheme = localStorage.getItem("dx-theme")
    // if (needUpdate(currentVersion)) {
    // if (!environment.production && !environment.hmr) {
    let deferred: Deferred<any> = new Deferred<any>();
    service.get("/SYS/Lang/String/List", data => {
      //use entries to create array of translates
      localStorage.setItem("translate", JSON.stringify(Object.entries(data)));
      localStorage.setItem("version", currentVersion);
      localStorage.setItem("dx-theme", currentTheme);

      deferred.resolve(true);
    });
    return deferred.promise;
    //}
    // }
  };
}
function needUpdate(currentVersion) {
  let lastVersion = localStorage.getItem("version");

  if (lastVersion && lastVersion >= currentVersion) return false;
  return true;
}
export function CanAlwaysActivateGuard(): boolean {
  return true;
}

export const ROUTES: any = [
  {
    path: "",
    component: MasterLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomePage },
      { path: "edm/home", component: FileExplorerPopupPage },
      { path: "PUB/FORM/:code", component: DynamicFormPage },
      { path: "pub/test", component: TestPage },
      { path: "pub/testui", component: UiTestPage },
      { path: "pub/hasanzade", component: HasanzadePage },
      { path: "pub/report", component: ReportPage }

    ]
  },
  {
    path: "",
    component: LoginLayoutComponent,
    canActivate: ["CanAlwaysActivateGuard"],
    canActivateChild: ["CanAlwaysActivateGuard"],
    children: [
      { path: "login", component: LoginPage },
      { path: "setpass", component: ResetPasswordPage },
      { path: "404", component: NotFoundPage },
      { path: "403", component: AccessDeniedPage },
    ]
  }
];

@NgModule({
  declarations: [
    MasterLayoutComponent,
    LoginLayoutComponent,
    LabelComponent,
    PageContentComponent,
    BreadcrumbsComponent,
    NavSideMenuComponent,
    PanelBoxComponent,
    DXLovComponent,
    DXToolbarComponent,
    DXLabelBoxComponent,
    DXGridToolbarComponent,
    DXDateBoxComponent,
    DXTimeBoxComponent,
    DXGridToolbarDataSourceComponent,
    DXTreeToolbarComponent,
    PopupComponent,
    SearchComponent,
    InputGroupComponent,
    TextViewComponent,
    BasePage,
    LoginPage,
    ResetPasswordPage,
    NotFoundPage,
    AccessDeniedPage,
    HomePage,
    ModuleHomePage,
    DynamicFormPage,
    TestPage,
    UiTestPage,
    HasanzadePage,
    FileExplorerPopupPage,
    UploadPopupComponent,
    FolderPopupComponent,
    FileExplorerConfigComponent,
    PageComponent,
    TranslatePipe,
    ReportPage,
    UploadComponent,
    DatetimepickerComponent,
    DateTimeJalaliPipe,
    InputMaskDirective,
    ReportButtonComponent,
    DraggableDirective,
    FileUploadComponent,
    ImageUploadComponent,
    GalleryComponent,
    ImageViewer,
    PopupTest,
    SlideShowComponent,
    BorderedInputComponent,
    TransInputComponent,
    DemisPopup,
    LoginPopup,
    ThemeSwitcherComponent
  ],
  imports: [
    CommonModule,
    DevExtremeModule,
    NgbModule.forRoot(),
    RouterModule.forChild(ROUTES),
    HttpModule,
    EventsServiceModule.forRoot(),
    ImageUploadModule.forRoot(),
  ],
  providers: [
    DatePipe,
    CoreService,
    ServiceCaller,
    FileService,
    ConfigService,
    ThemeService,
    FileExplorerService,
    FileExplorerManager,
    FolderExplorerService,
    PrintComponent,
    MenuService,
    AuthGuard,
    AuthService,
    DemisPopupService,
    DialogService,
    NotifyService,
    TranslateService,
    {
      provide: "CanAlwaysActivateGuard",
      useValue: CanAlwaysActivateGuard
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onStartup,
      deps: [ServiceCaller],
      multi: true
    },
    UploadService,
    PermissionService,
    PermissionHelper,
    HttpClientHandler,
    { provide: ErrorHandler, useClass: DemisErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  exports: [
    //
    
    DevExtremeModule,
    DatetimepickerComponent,
    DateTimeJalaliPipe,
    // DxTextBoxModule ,
    // DxNumberBoxModule ,
    // DxMenuModule,
    // DxDataGridModule,
    // DxPopupModule,
    // DxTabsModule,
    // DxTagBoxModule,
    //
    RouterModule,
    //
    LabelComponent,
    PageComponent,
    PageContentComponent,
    PanelBoxComponent,
    DXLovComponent,
    DXToolbarComponent,
    DXTreeToolbarComponent,
    DXLabelBoxComponent,
    DXGridToolbarComponent,
    DXDateBoxComponent,
    DXTimeBoxComponent,
    DXGridToolbarDataSourceComponent,
    TranslatePipe,
    ReportPage,
    ReportButtonComponent,
    UploadComponent,
    PopupComponent,
    TextViewComponent,
    SearchComponent,
    InputGroupComponent,
    DraggableDirective,
    FileUploadComponent,
    ImageUploadComponent,
    GalleryComponent,
    ImageViewer,
    PopupTest,
    //HasPermissionDirective,
    //ExceptPermissionDirective,
    //
    FileExplorerPopupPage,
    UploadPopupComponent,
    FolderPopupComponent,

    FileExplorerConfigComponent
  ],
  entryComponents: [DemisPopup, LoginPopup, FileExplorerPopupPage, UploadPopupComponent, FolderPopupComponent]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [MenuService, AuthService, ConfigService, CoreService]
    }
  }
}
