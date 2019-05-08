import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../shared/services/TranslateService';
import { BasePage } from '../../shared/BasePage';

//نمایش دادن موجودیت هر انبار بر اساس فیلترهای درخواستی
@Component({
    selector: 'wam-show-items',
    templateUrl: './item-show.page.html'
})
export class WamShowItemsPageComponent extends BasePage implements OnInit {

    menuItems: any[] = [
        {
          name: "New",
          icon: "fa fa-plus green",
          // text: this.translate.instant("NEW"),
          visible: true,
          disabled: false
        },
        {
          name: "Save",
          icon: "fa fa-floppy-o green",
          //  text: this.translate.instant("SAVE"),
          visible: true,
          disabled: false
        },
        {
          name: "Search",
          icon: "fa fa-search",
          tooltip: this.translate.instant("PUB_SEARCH"),
          visible: true,
          disabled: false,
          items: [
            {
              name: "FastSearch",
              icon: "fa fa-bolt",
              text: this.translate.instant("PUB_FAST_SEARCH"),
              visible: true,
              disabled: false
            },
            {
              name: "AdvanceSearch",
              icon: "fa fa-tasks",
              text: this.translate.instant("ADVANCED_SEARCH"),
              visible: true,
              disabled: false
            }
          ]
        }
      ];

    constructor( public translate: TranslateService) { super(translate) }

    ngOnInit(): void { }
}
