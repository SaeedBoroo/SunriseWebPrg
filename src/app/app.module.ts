import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule } from "@angular/router";
import { AppComponent } from "./shared/app.component";
import { SlickModule } from 'ngx-slick';
// Modules
import { SharedModule } from "./shared/shared.module";
import { WAMModule } from "./wam/wam.module";
import { DemisInjector } from "./shared/util/Injector";
import { CoreModule } from "./shared/util/Core.module";

// Routes
export const ROUTES: any = [
  // Base
  { path: "", loadChildren: "./shared/shared.module#SharedModule" },
  { path: "", loadChildren: "./prg/prg.module#prgModule" },
  { path: "", loadChildren: "./wam/wam.module#WAMModule" }

];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    WAMModule,
    CoreModule.forRoot({ storage: {} }),
    
    //TODO sm-edit: Module factory sharing
    RouterModule.forRoot(ROUTES, { useHash: false }),
    // RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    BrowserAnimationsModule,
    SlickModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  static injector: Injector;

  constructor(injector: Injector) {
    DemisInjector.injector = injector;
  }

}
