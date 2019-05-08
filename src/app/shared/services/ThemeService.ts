import { Injectable } from "@angular/core";
import { ConfigService } from "./ConfigService";

@Injectable()
export class ThemeService {

    constructor(private config: ConfigService) {

    }

    public set() {
        this.config.load().then(() => {
            let theme = this.config.get('ADM-THEME');
            if (theme == '0') {
                this.defaultTheme();
            } else if (theme == '1') {
                this.compactTheme();
            } else {
                this.defaultTheme();
            }
        }).catch(err => {
            this.defaultTheme();
        });
    }

    defaultTheme() {
        require("style-loader!../../../../node_modules/devextreme/dist/css/dx.light.css");
        require("style-loader!../../../../src/assets/vendor/bootstrap/css/bootstrap-rtl.css");
        require("style-loader!../../../../src/assets/css/Fixer.scss");
    }

    compactTheme() {
        require("style-loader!../../../../node_modules/devextreme/dist/css/dx.light.compact.css");
        require("style-loader!../../../../src/assets/vendor/bootstrap/css/bootstrap.css");
        require("style-loader!../../../../src/assets/css/Fixer.compact.scss");
    }
}