import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { BasePage } from '../../shared/BasePage';
import { TranslateService } from '../../shared/services/TranslateService';
import { Router } from '@angular/router';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { Notify } from '../../shared/util/Dialog';
import { Deferred } from '../../shared/Deferred';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { PermissionService } from '../../shared/permission';

@Component({
  selector: 'app-root-userfurther',
  templateUrl: './userfurther.component.html',
  styleUrls: ['./userfurther.component.scss']
})
export class UserfurtherComponent extends BasePage implements OnInit {

  menuItems = [
    {
      name: "save",
      icon: "fa fa-floppy-o green",
      text: 'ذخیره',
      visible: true
    },
    {
      name: "cancel",
      text: 'انصراف',
      icon: "fa fa-ban red",
      visible: true
    },
  ];
  ALLOW_PRG_UFIF_001
  @ViewChild('form') form: DxValidationGroupComponent;

  constructor(public translate: TranslateService, public router: Router, public service: ServiceCaller,public permissionService: PermissionService) {
    super(translate);
  }

  ngOnInit() {
    let deferred: Deferred<any> = new Deferred<any>();
    this.ALLOW_PRG_UFIF_001 = this.permissionService.hasDefined('PRG_UFIF_001');//چک دسترسی به ویرایش قسمت کاست و تلرانس
    this.service.get("/PRG/USER_FURTHER_INFORMATION/List", (data) => {
      if (data != null)
        this.editItem = data;
      console.log("editItem---->" + JSON.stringify(this.editItem));
      deferred.resolve(data);
    }, this.filter);
  }

  filter: any = {};
  editItem: any = {};
  onMenuItemClick(name) {


    if (name == "cancel") {

      this.router.navigate(["prg/home"]);
    }
    if (name == "save") {
      var result = this.form.instance.validate();
      if (result.isValid) {
        console.log("this.editItem", this.editItem);
        debugger
        this.service.postPromise("/PRG/USER_FURTHER_INFORMATION/SAVE", this.editItem).
          then((data) => {            
            this.service.get("/PRG/USER_FURTHER_INFORMATION/List", (data) => {
              if (data != null) {
                this.editItem = {};
                this.editItem = data;
              }
              console.log("editItem--HAJAR-->" + JSON.stringify(this.editItem));
            }, this.filter);
            Notify.success();

          });
      }

    }
  }


}
