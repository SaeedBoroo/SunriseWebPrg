import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
//
// import { DynamicFormPage } from "../shared/pages/dform.page";
// import { ModuleHomePage } from "../shared/pages/module-home.page";
import { AuthGuard } from "../shared/services/AuthGuard";
import { MasterLayoutComponent } from "../shared/layouts/master.layout";
//
//WAM
import { WAMMovementPage } from './movement/movement.page';
import { WAMMMovementAutomatic } from './movement/movementautomatic.page';
import { WAMMovementSearchPage } from './movement/movementsearch.page';
import { WAMTemporaryMovementPage } from './temporarymovement/temporarymovement.page';
import { WAMTemporaryMovementSearchPage } from './temporarymovement/temporarymovementsearch.page';
import { WAMSerialPopupPage } from './movement/serial.popup';
import { WAMMovementTypePage } from './movementtype/movementtype.page';
import { WAMWarehousePage } from './warehouse/warehouse.page';

import { WAMItemGroupPage } from './itemgroup/itemgroup.page';
import { WAMItemGroupLovPage } from './itemgroup/itemgroupTreeLov.page';

import { WAMMovementPopup } from './movement/movement.popup';
import { WAMMovementConrPage } from './MovementConr/movementConr.page';
//import { WAMItemGroupUnitPage } from './itemgroup/itemgroupunit.popup';
//import { WAMItemGroupCataloguePage } from './itemgroup/itemgroupcatalogue.popup';
import { WAMDefinitionPage } from './catalog/definition.page';
import { WAMDefinitionTypeSpecificationPage } from './catalog/definitiontypespecification.page';
import { WAMDefinitionTypeSpecificationEditPage } from './catalog/definitiontypespecificationedit.page';
import { WAMAddItemGroupPopupPage } from './itemgroup/additemgroup.popup';
import { WAMMeasurementPage } from './measurement/measurement.page';
import { WAMMeasurementScalePage } from './measurement/measurementscale.page';
import { WAMMeasurementSearchPage } from './measurement/measurementsearch.page';
//
import { WAMCodingPage } from './coding/coding.page';
import { WAMCodingPatternSearchPage } from './coding/codingpatternsearch.page';
import { WAMCodingPatternPage } from './coding/codingpattern.page';
import { WAMItemSearchPage } from './coding/itemsearch.page';
import { WAMItemPage } from './coding/item.page';
import { WAMItemInfoPage } from './coding/iteminfo.page';
import { WAMSetItemPatternPopupPage } from './coding/setitempattern.popup';
import { WAMSetSerialPatternPopupPage } from './coding/setSerialpattern.popup';
//import { WAMSetItemPatternPage } from './coding/setitempattern.page';
import { WAMPatternParameterPage } from './coding/patternparameter.page';
import { AssignItemWarehousePage } from './coding/assignitemwarehouse.page';
//Request
import { WAMRequestSearchPage } from './request/requestsearch.page';
import { WAMRequestPage } from './request/request.page';
import { WAMMRPRequestSearchPage } from './request/mrprequestsearch.page';
import { WAMMRPRequestPage } from './request/mrprequest.page';
import { PermissionPurchasePage } from './request/permissionpurchase.page';
import { IndustryWarehousePage } from './request/industrywarehouse.page';
//Counting
import { WAMCountingSettingPage } from './countings/countingsetting.page';
import { WAMCountingsPage } from './countings/countings.page';
import { WAMCountingsSearchPage } from './countings/countingssearch.page';
import { WAMCountingsRegisterPage } from './countingsregister/countingsregister.page';
import { WAMCountingsRegisterSearchPage } from './countingsregister/countingsregistersearch.page';
import { WAMAdjustmentsPage } from './adjustments/adjustments.page';
import { WAMAdjustmentsSearchPage } from './adjustments/adjustmentssearch.page';
//Cardex
import { WAMCardexPage } from './Inventory/cardex.page';
import { WAMInventoryPage } from './Inventory/inventory.page';
//Closingdocuments
import { WAMMovementStatusPage } from './closingdocuments/movementstatus.page';
import { WAMMovementStatusDetailPage } from './closingdocuments/movementstatusdetail.page';
import { WAMSelectMovementStatusPage } from './closingdocuments/selectmovementstatus.page';
//
//
import { WAMFirstMovement } from './Inventory/firstmovement.page';//
import { WAMFirstMovementSearchPage } from './Inventory/firstmovementsearch.page';
import { WAMWarehouseItemFilePage } from './warehouseitemfile/warehouseitemfile.page';
import { WAMWarehouseLocationPage } from "./warehouselocation/warehouselocation.page";
//import { WAMCountingSettingPage } from "./countings/countingsetting.page";
//import { WAMMMovementAutomatic } from "./movement/movementautomatic.page";
import { WAMVerifyCountingsListPage } from "./verifycountingslist/verifycountingslist.page";
import { DefinitionCategories } from "./categories/DefinitionCategories.page";

import { WAMLotNumberLog } from './LotNumbers/lotNumberLog.page';
import { WamShowItemsPageComponent } from "./coding/item-show-list.page";


export const ROUTES: any = [
  {
    path: '',
    component: MasterLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      //WAM
      //Request
      { path: 'wam/request/requestsearch', component: WAMRequestSearchPage },
      { path: 'wam/request/request', component: WAMRequestPage },
      { path: 'wam/request/mrprequestsearch', component: WAMMRPRequestSearchPage },
      { path: 'wam/request/mrprequest', component: WAMMRPRequestPage },
      { path: 'wam/request/permissionpurchase', component: PermissionPurchasePage },
      { path: 'wam/request/industrywarehouse', component: IndustryWarehousePage },
      //Measurement
      { path: 'wam/measurement/measurement', component: WAMMeasurementPage },
      { path: 'wam/measurement/measurementscale', component: WAMMeasurementScalePage },
      { path: 'wam/measurement/measurementsearch', component: WAMMeasurementSearchPage },
      //Coding
      { path: 'wam/coding/itemcoding', component: WAMCodingPage/*DynamicFormPage, data: { code: 'FRM-WAM-001' } */ },
      { path: 'wam/itemgroup/itemgroup', component: WAMItemGroupPage },
      { path: 'wam/itemgroup/itemgroupTreeLov', component: WAMItemGroupLovPage },

      { path: 'wam/coding/assignitemwarehouse', component: AssignItemWarehousePage },
      //{ path: 'wam/itemgroup/itemgroupunit', component: WAMItemGroupUnitPage },
      //{ path: 'wam/itemgroup/itemgroupcatalogue', component: WAMItemGroupCataloguePage },
      { path: 'wam/itemgroup/itemgroup/wam-additemgroup-popup', component: WAMAddItemGroupPopupPage },
      { path: 'wam/coding/codingpattern', component: WAMCodingPatternPage },
      { path: 'wam/coding/codingpatternsearch', component: WAMCodingPatternSearchPage },
      { path: 'wam/coding/item', component: WAMItemPage },
      { path: 'wam/coding/items-show', component: WamShowItemsPageComponent },
      { path: 'wam/coding/iteminfo', component: WAMItemInfoPage },
      { path: 'wam/coding/setitempattern', component: WAMSetItemPatternPopupPage },
      { path: 'wam/coding/setserialpattern', component: WAMSetSerialPatternPopupPage },
      //{ path: 'wam/coding/setitempattern', component: WAMSetItemPatternPage },
      { path: 'wam/coding/itemsearch', component: WAMItemSearchPage },
      { path: 'wam/coding/patternparameter', component: WAMPatternParameterPage },
      //Catalogue
      { path: 'wam/catalog/definition', component: WAMDefinitionPage },
      { path: 'wam/catalog/definitiontypespecification', component: WAMDefinitionTypeSpecificationPage },
      { path: 'wam/catalog/definitiontypespecificationedit', component: WAMDefinitionTypeSpecificationEditPage },

      //TemporaryMovement
      { path: 'wam/temporarymovement/temporarymovement', component: WAMTemporaryMovementPage },
      { path: 'wam/temporarymovement/temporarymovementsearch', component: WAMTemporaryMovementSearchPage },

      //Movement
      { path: 'wam/movement/movement', component: WAMMovementPage },
      { path: 'wam/movement/movementsearch', component: WAMMovementSearchPage },
      { path: 'wam/movement/serial', component: WAMSerialPopupPage},
      { path: 'wam/movement/movementcostcenterreturn', component: WAMMovementPage, data: { type: "111" } },
      { path: 'wam/movement/movementpur', component: WAMMovementPage, data: { type: "133" } },
      { path: 'wam/movementConr/movementConr', component: WAMMovementConrPage },

      { path: 'wam/movement/movementpurwageservice', component: WAMMovementPage, data: { type: "135" } },
      { path: 'wam/movement/movementpurwageserviceout', component: WAMMovementPage, data: { type: "235" } },
      { path: 'wam/movement/movementsalreturn', component: WAMMovementPage, data: { type: "141" } },
      { path: 'wam/movement/movementpurorderless', component: WAMMovementPage, data: { type: "134" } },
      { path: 'wam/movement/movementsalwageservicein', component: WAMMovementPage, data: { type: "143" } },
      { path: 'wam/movement/movementwarehousein', component: WAMMovementPage, data: { type: "153" } },
      { path: 'wam/movement/movementwipin', component: WAMMovementPage, data: { type: "161" } },
      { path: 'wam/movement/movementcostcenter', component: WAMMovementPage, data: { type: "211" } },
      { path: 'wam/movement/movementpurreturn', component: WAMMovementPage, data: { type: "233" } },
      { path: 'wam/movement/movementsal', component: WAMMovementPage, data: { type: "241" } },
      { path: 'wam/movement/movementsalwageserviceout', component: WAMMovementPage, data: { type: "243" } },
      { path: 'wam/movement/movementwarehouseout', component: WAMMovementPage, data: { type: "253" } },
      { path: 'wam/movement/movementwipout', component: WAMMovementPage, data: { type: "261" } },
      { path: 'wam/movement/movementwaste', component: WAMMovementPage, data: { type: "294" } },
      { path: 'wam/movement/movementwastein', component: WAMMovementPage, data: { type: "194" } },
      { path: 'wam/movement/movementadjustmentin', component: WAMMovementPage, data: { type: "193" } },
      { path: 'wam/movement/movementadjustmentout', component: WAMMovementPage, data: { type: "293" } },
      { path: 'wam/movement/movementasset', component: WAMMovementPage, data: { type: "281" } },
      { path: 'wam/movement/movementreturntowip', component: WAMMovementPage, data: { type: "263" } },
      { path: 'wam/movement/movementforeingpur', component: WAMMovementPage, data: { type: "136" } },
      { path: 'wam/movement/movementretforeingpur', component: WAMMovementPage, data: { type: "236" } },
      { path: 'wam/movement/movementlendin', component: WAMMovementPage, data: { type: "137" } },
      { path: 'wam/movement/movementlendinreturn', component: WAMMovementPage, data: { type: "237" } },
      { path: 'wam/movement/movementlendoutreturn', component: WAMMovementPage, data: { type: "138" } },
      { path: 'wam/movement/movementlendout', component: WAMMovementPage, data: { type: "238" } },
      { path: 'wam/movement/movementlendout', component: WAMMovementPage, data: { type: "297" } },
      { path: 'wam/movement/movementout', component: WAMMovementPage, data: { type: "148" } },
      { path: 'wam/movement/movementin', component: WAMMovementPage, data: { type: "248" } },
      { path: 'wam/movement/movementwipreturn', component: WAMMovementPage, data: { type: "162" } },
      { path: 'wam/movement/movementrelated', component: WAMMovementPopup},
      { path: 'wam/movement/movementautomatic', component: WAMMMovementAutomatic},



      //Warehouse
      { path: 'wam/warehouse/warehouse', component: WAMWarehousePage },

      //MovementType
      { path: 'wam/movementtype/movementtype', component: WAMMovementTypePage },
      //Inventory
      { path: 'wam/inventory/cardex', component: WAMCardexPage },
      { path: 'wam/inventory/inventory', component: WAMInventoryPage },
      //Inventory
      { path: 'wam/inventory/cardex', component: WAMCardexPage },
      //closingdocuments
      { path: 'wam/closingdocuments/movementstatus', component: WAMMovementStatusPage },
      { path: 'wam/closingdocuments/movementstatusdetail', component: WAMMovementStatusDetailPage },
      { path: 'wam/closingdocuments/selectmovementstatus', component: WAMSelectMovementStatusPage },
      //Countings
      { path: 'wam/countings/countingsetting', component: WAMCountingSettingPage },
      { path: 'wam/countings/countings', component: WAMCountingsPage },
      { path: 'wam/countings/countingssearch', component: WAMCountingsSearchPage },
      { path: 'wam/countingsregister/countingsregister', component: WAMCountingsRegisterPage },
      { path: 'wam/countingsregister/countingsregistersearch', component: WAMCountingsRegisterSearchPage },
      { path: 'wam/adjustments/adjustments', component: WAMAdjustmentsPage },
      { path: 'wam/adjustments/adjustmentssearch', component: WAMAdjustmentsSearchPage },
      //WarehouseItemFile
      { path: 'wam/warehouseitemfile/warehouseitemfile', component: WAMWarehouseItemFilePage },
      //inventory
      { path: 'wam/inventory/firstmovement', component: WAMFirstMovement },
      { path: 'wam/inventory/firstmovementsearch', component: WAMFirstMovementSearchPage },
      //location
      { path: 'wam/warehouselocation/warehouselocation', component: WAMWarehouseLocationPage },
      { path: 'wam/verifycountingslist/verifycountingslist', component: WAMVerifyCountingsListPage },
   // category 
      { path: 'wam/categories/DefinitionCategories', component: DefinitionCategories },

      { path: 'wam/lotNumbers/lotNumberLog', component: WAMLotNumberLog },

    ]
  },
];

@NgModule({
  declarations: [
    //WAM
    
    WAMMovementTypePage,
    WAMMovementPage,
    WAMMovementSearchPage,
    WAMMovementConrPage,
    WAMTemporaryMovementPage,
    WAMTemporaryMovementSearchPage,
    WAMMovementPopup,
    WAMSerialPopupPage,
    WAMMeasurementPage,
    WAMMeasurementScalePage,
    WAMMeasurementSearchPage,
    WAMWarehousePage,
    WAMItemGroupPage,
    WAMItemGroupLovPage,
    //WAMItemGroupUnitPage,
    //WAMItemGroupCataloguePage,
    WAMAddItemGroupPopupPage,
    WAMPatternParameterPage,
    WAMCodingPage,
    WAMCodingPatternSearchPage,
    WAMCodingPatternPage,
    WAMCodingPatternSearchPage,
    WAMItemPage,
    WAMItemInfoPage,
    WAMSetItemPatternPopupPage,
    WAMSetSerialPatternPopupPage,
    //WAMSetItemPatternPage,
    WAMItemSearchPage,
    WAMRequestPage,
    WAMRequestSearchPage,
    WAMMRPRequestPage,
    AssignItemWarehousePage,
    WAMMRPRequestSearchPage,
    WAMDefinitionPage,
    WAMDefinitionTypeSpecificationPage,
    WAMDefinitionTypeSpecificationEditPage,
    WAMCountingSettingPage,
    WAMCountingsPage,
    WAMCountingsSearchPage,
    WAMCardexPage,
    WAMInventoryPage,
    WAMFirstMovement,//
    WAMSelectMovementStatusPage,
    WAMMovementStatusPage,
    WAMFirstMovementSearchPage,
    WAMWarehouseItemFilePage,
    WAMCountingsRegisterPage,
    WAMCountingsRegisterSearchPage,
    WAMAdjustmentsPage,
    WAMAdjustmentsSearchPage,
    WAMWarehouseLocationPage,
    WAMMMovementAutomatic,
    WAMVerifyCountingsListPage,
    WAMMovementStatusDetailPage,
    DefinitionCategories,
    WAMLotNumberLog,
    PermissionPurchasePage,
    IndustryWarehousePage,
    WamShowItemsPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    RouterModule.forChild(ROUTES)
    ],
  exports: [
    RouterModule,
    WAMSerialPopupPage
  ]
})

export class WAMModule {

}
