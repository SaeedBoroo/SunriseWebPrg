import { Component } from '@angular/core';
import { Router } from "@angular/router";


@Component({
    selector: 'not-found-page',
    templateUrl: './404.page.html',
})

export class NotFoundPage  {

  
    constructor(public router: Router) { }
}
