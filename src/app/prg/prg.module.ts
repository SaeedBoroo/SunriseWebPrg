import { Injector, NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
// import {CKEditorModule} from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { DynamicFormPage } from "../shared/pages/dform.page";
import { ModuleHomePage } from "../shared/pages/module-home.page";
import { AuthGuard } from "../shared/services/AuthGuard";
import { MasterLayoutComponent } from "../shared/layouts/master.layout";

import { ReportPage } from "../shared/report/report.page";
import { UserfurtherComponent } from './userfurther/userfurther.component';
import { PricelistitemComponent } from './pricelist/pricelistitem/pricelistitem.component';
import { PricelistComponent } from './pricelist/pricelist/pricelist.component';
import { SaveRequestComponent } from './request/save-request/save-request.component';
import { ListRequestComponent } from './request/list-request/list-request.component';
import { RequestProductionDetailComponent } from './request/request-production-detail/request-production-detail.component';
import { ShowSuggestsComponent } from './request/show-suggests/show-suggests.component';
import { Userfurther2Component } from './userfurther2/userfurther2.component';
import { Pricelist2Component } from './pricelist2/pricelist2/pricelist2.component';
import { Pricelistitem2Component } from './pricelist2/pricelistitem2/pricelistitem2.component'; 

export const ROUTES: any = [
    {
        path: '', component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
             
            { path: 'prg/home', component: ModuleHomePage , data: { code: "PRG" }},
            { path: 'prg/userfurther', component: UserfurtherComponent },    
            { path: 'prg/userfurther2', component: Userfurther2Component },   
            { path: 'prg/pricelistitem2', component: Pricelistitem2Component },
            { path: 'prg/pricelist2', component: Pricelist2Component },                                 
            { path: 'prg/pricelistitem', component: PricelistitemComponent },                                       
            { path: 'prg/pricelist', component: PricelistComponent },                                       
            { path: 'prg/request', component: SaveRequestComponent },                                       
            { path: 'prg/requestlist', component: ListRequestComponent },                                       
            { path: 'prg/config/unt/types', component: DynamicFormPage,data:{code:"FRM-PRG-001"} },                                       
            { path: 'prg/config/grade/types', component: DynamicFormPage,data:{code:"FRM-PRG-002"} }, 
            { path: 'prg/config/subj/types', component: DynamicFormPage,data:{code:"FRM-PRG-003"} },
            { path: 'prg/frm/ufif', component: DynamicFormPage,data:{code:"FRM-PRG-004"} },
            
        ]
    },
];

@NgModule({
    declarations: [
        UserfurtherComponent,
        PricelistitemComponent,
        PricelistComponent,
        SaveRequestComponent,
        ListRequestComponent,
        RequestProductionDetailComponent,
        ShowSuggestsComponent,
        Userfurther2Component,
        Pricelist2Component,
        Pricelistitem2Component,
        
    ],
    imports: [
        CommonModule,
        SharedModule.forRoot(),
        FormsModule,
        // CKEditorModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [
        RouterModule
    ] 
})

export class prgModule {
    
}
