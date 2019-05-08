import { Component, OnInit } from '@angular/core';
import DxThemes from 'devextreme/ui/themes';

@Component({
  selector: 'theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  themes = [
    {
      name: "theme_light",
      icon: "fa fa-circle veryLightGray ",
      text: 'معمولی',
      visible: true
    },
    {
      name: "theme_dark",
      icon: "fa fa-circle",
      text: 'تاریک',
      visible: true
    }
    // ,
    // {
    //   name: "theme_blue",
    //   icon: "fa fa-circle blue",
    //   text: 'آبی',
    //   visible: true
    // }
  ]

  constructor() { }

  ngOnInit() {
  }

  onThemeClick(name){
    debugger
      if ( name == 'theme_light' ) {
        window.localStorage.setItem("dx-theme", "generic.light");
        DxThemes.current(localStorage.getItem("dx-theme"));
       // window.location.reload();
      }
      else if ( name == 'theme_dark' ) {
        window.localStorage.setItem("dx-theme", "generic.dark");
        DxThemes.current(localStorage.getItem("dx-theme"));
       // window.location.reload();
      }
      else if ( name == 'theme_blue' ) {
        window.localStorage.setItem("dx-theme", "material.blue");
        DxThemes.current(localStorage.getItem("dx-theme"));
       // window.location.reload();
      }
  }

}
