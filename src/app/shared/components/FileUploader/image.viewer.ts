import { BasePage } from "../../BasePage";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";


const BaseTempURL = environment.temp_url;
@Component({
    selector: 'dx-image-viewer',
    templateUrl: './image.viewer.html'
})
export class ImageViewer extends BasePage implements OnInit {

    ngOnInit(): void {

    }
    get files() {
        let result = [];
        this.FileNames.forEach(item => {
            item.FileNames.forEach(element => {
                result.push(BaseTempURL + '/' + element.Name);
            });
        });
        return result;
    }
}