import { Component, OnInit, ViewChild } from '@angular/core';
import {  Router } from '@angular/router';
import { TranslateService } from '../../shared/services/TranslateService';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { ServiceCaller } from '../../shared/services/ServiceCaller';
import { Notify } from '../../shared/util/Dialog';
import { Deferred } from '../../shared/Deferred';
import { PermissionService } from '../../shared/permission';

@Component({
  selector: 'app-root-userfurther2',
  templateUrl: './userfurther2.component.html',
  styleUrls: ['./userfurther2.component.scss']
})
export class Userfurther2Component implements OnInit {

  menuItems = [
    {
      name:'save',
      icon:'fa fa-floppy-o green',
      text:'ذخیره',
      visible: true
    },{
      name:'cancel',
      icon:'fa fa-ban red',
      text:'انصراف',
      visible: true
    },{
      name:'aaa',
      icon:'fa fa-users blue',
      text:'aaa',
      visible: true
    }
  ]


  constructor(private router: Router,
     private translate: TranslateService,
      private service: ServiceCaller, public permissionService: PermissionService) { }

  ngOnInit() {
    
    this.ALLOW_PRG_UFIF_001 = this.permissionService.hasDefined('PRG_UFIF_001');//چک دسترسی به ویرایش قسمت کاست و تلرانس
    this.service.get("/PRG/USER_FURTHER_INFORMATION/List", (data) => {
      if (data != null)
        this.editItem = data;
      console.log("editItem---->" + JSON.stringify(this.editItem));
      
    }, this.filter);
  }

  ALLOW_PRG_UFIF_001
  filter: any = {};
  editItem: any = {}
  @ViewChild('form') form: DxValidationGroupComponent;

  onClickBtn(name){
    if (name == 'save') {
      var result = this.form.instance.validate();
      if(result.isValid){
        console.log("editItem:::", this.editItem);
        this.service.postPromise('/PRG/USER_FURTHER_INFORMATION/SAVE', this.editItem);
        Notify.success();

      }
    } 
   else if(name == 'cancel') {
      this.router.navigate(['prg/home'])
    }
  }
}
