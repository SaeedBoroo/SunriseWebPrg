import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ServiceCaller } from '../services/ServiceCaller';
import { Deferred } from '../Deferred';
import { TranslateService } from '../services/TranslateService';
import { BasePage } from '../BasePage';
import { Dialog, Notify } from '../util/Dialog';
import { DxDataGridComponent } from 'devextreme-angular';



@Component({
    selector: 'dform-page',
    templateUrl: './dform.page.html',
    host: { '(window:keydown)': 'hotkeys($event)' },
})

export class DynamicFormPage extends BasePage implements AfterViewInit {
    menuItems = [
        {
            name: "New",
            icon: "fa fa-plus green",
            text: this.translate.instant("NEW"),
            visible: true,
        },
        {
            name: "Delete",
            text: this.translate.instant("DELETE"),
            icon: "fa fa-trash red",
            visible: true,
        },
        {
            name: "Refresh",
            icon: "fa fa-refresh blue",
            text: this.translate.instant("REFRESH"),
            visible: true,
        }
    ];


    ngAfterViewInit() {
    }

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    fields: any = [];
    saveApi: string;

    dataSource: any = {};
    popupVisible = false;

    isInEdit = false;
    formCode: string;
    isColumnConfig: boolean = false;
    loadedLovData: any = {};

    private sub: any;

    constructor(
        public service: ServiceCaller,
        public translate: TranslateService,
        private route: ActivatedRoute
    ) {
        super(translate);
    }


    // hotkeys(e) {
    //     if (e.key == "Insert" && e.ctrlKey) {
    //         this.dataGrid.instance.addRow();
    //     }
    //     // if (e.key == "Delete" && e.ctrlKey) {
    //     //      
    //     //     this.deleteSelectedRows();
    //     // }
    //     if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
    //         alert("search");
    //     }
    //     e.preventDefault();
    // }

    ngOnInit() {
        this.formCode = this.route.snapshot.data["code"];
        if (this.formCode != null) {
            this.configDataSource();
        }
        else {
            this.sub = this.route.params.subscribe(params => {
                this.formCode = params["code"];
                this.configDataSource();
            });
        }
    }

    configDataSource() {
        console.log(this.formCode);
        this.dataSource.store = new CustomStore({
            key: "ID",
            load: (loadOptions) => {
                let deferred: Deferred<any> = new Deferred<any>();
                this.service.get("/SYS/Forms/List", (data) => {
                    this.saveApi = data.SaveApi;
                    this.fields = data.Fields;
                    this.addColumns();
                    deferred.resolve(data.Data);
                }, { code: this.formCode, PageIndex: loadOptions.skip });
                return deferred.promise;
            },
            update: (key, values) => {
                let deferred: Deferred<any> = new Deferred<any>();
                if (this.saveApi) {
                    let row = this.dataGrid.instance.getDataSource().items().filter(c => c.ID == key)[0];
                    let data: any = Object.assign(row, values);
                    this.service.post(this.saveApi, (result) => {
                        deferred.resolve(result);
                    }, data, (error) => {
                        deferred.reject(error);
                    });
                }
                else {
                    var fields = [];
                    for (var i in values) {
                        fields.push({ Name: i, Value: values[i] });
                    }
                    let data = {
                        ID: key,
                        FormCode: this.formCode,
                        Fields: fields
                    };
                    this.service.post("/SYS/Forms/Save", (result) => {
                        deferred.resolve(result);
                    }, data, (error) => {
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            },
            insert: (values) => {
                let deferred: Deferred<any> = new Deferred<any>();

                if (this.saveApi) {
                    this.service.post(this.saveApi, (result) => {
                        deferred.resolve(result);
                    }, values, (error) => {
                        deferred.reject(error);
                    });
                }
                else {
                    var fields = [];
                    for (var i in values) {
                        fields.push({ Name: i, Value: values[i] });
                    }
                    var data = {
                        FormCode: this.formCode,
                        Fields: fields
                    };
                    this.service.post("/SYS/Forms/Save", (result) => {
                        deferred.resolve(result);
                    }, data, (error) => {
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            }
        });
    }


    addColumns() {
        if (this.isColumnConfig)
            return;
        console.log("addColumns")
        console.log(this.fields)

        this.dataGrid.instance.deleteColumn("ID");


        //
        for (var i in this.fields) {
            var f = this.fields[i];
            var dataType: string = "string";
            if (f.Name == "ID")
                continue;
            let editorOptions: any = {};
            if (f.Format)
                editorOptions.format = f.Format;
            // boolean
            if (f.DataType == 1)
                dataType = "boolean";
            // Numeric
            else if (f.DataType == 2)
                dataType = "number";
            // DateTime
            else if (f.DataType == 21)
                dataType = "dateTime";
            else if (f.DataType == 22)
                dataType = "date";
            else if (f.DataType == 23)
                dataType = "time";
            // other
            else
                dataType = "string";

            var col = {
                dataField: f.Name,
                caption: this.translate.instant(f.Title),
                width: f.Width,
                dataType: dataType,
                validationRules: f.Required == true && f.ControlType != 4 ? [{ type: "required", message: "این فیلد اجباری است" }] : null,
                allowEditing: f.AllowEdit,
                lookup: f.ControlType != 5 ? null : this.createLookupDataSource(f),
                minWidth: "100px",
                editorOptions: editorOptions
            };
            if (f.Width) {
                col.width = f.Width;
            }

            this.dataGrid.instance.addColumn(col);
        }
        this.dataGrid.instance.endUpdate();
        this.isColumnConfig = true;
    }

    cellTemplate(cell, field) {
        console.log("calculateDisplayValue");
        this.service.post("/SYS/Forms/List/Post", (data) => {
            console.log(data.Data[0]);
        }, { code: field.Lookup, Params: [{ Name: "ID", Value: cell.value }] });
    }

    createLookupDataSource(field): any {
        let item = {
            allowClearing: field.Required != true,
            dataSource: new CustomStore({
                key: "ID",
                load: (loadOptions) => {
                    // 
                    let deferred: Deferred<any> = new Deferred<any>();

                    if (this.loadedLovData[field.Lookup]) {
                        deferred.resolve(this.loadedLovData[field.Lookup]);
                    }
                    else {
                        this.service.get("/SYS/Forms/List", (data) => {
                            this.loadedLovData[field.Lookup] = data.Data;
                            deferred.resolve(data.Data);
                        }, { code: field.Lookup });
                    }
                    return deferred.promise;
                },
                byKey: (key) => {
                    let deferred: Deferred<any> = new Deferred<any>();
                    // this.service.get("/SYS/Forms/List", (data) => {
                    //     deferred.resolve(data.Data);
                    // }, { code: field.Lookup, Params: [{ Name: "ID", Value: key }] });
                    let founded=this.loadedLovData[field.Lookup].find(c=>c.ID==key);
                    deferred.resolve(founded);

                    return deferred.promise;
                }
            }),
            displayExpr: "Title",
            valueExpr: "ID"
        };

        return item;
    }

    onContentReady(e) {
        this.dataGrid.instance.columnOption("command:edit", "visible", false);
    }

    onEditingStart(e) {
        //console.log(e);
    }

    selectionChangedHandler() {
        let selectedKeys = this.dataGrid.instance.getSelectedRowKeys();
        this.menuItems[1].visible = selectedKeys.length > 1;
    }

    onMenuItemClick(name) {
        if (name == "New") {
            this.dataGrid.instance.addRow();
        }
        //if (name == "Edit") {
        //    if (this.dataGrid.instance.getSelectedRowsData.length == 1) {
        //        var index = this.dataGrid.instance.getRowIndexByKey(this.dataGrid.instance.getSelectedRowsData[0].ID);
        //        this.dataGrid.instance.editRow(index);
        //    }
        //}
        if (name == "Refresh") {
            this.dataGrid.instance.refresh();
        }
        if (name == "Delete") {
            this.deleteSelectedRows();
        }

    }

    onGridMenuItemClick(e) {

        if (e.name == "DXDelete") {
            e.handled = true;
            this.deleteSelectedRows();
        }
        if (e.name == "DXSelectedDelete") {
            e.handled = true;
            this.deleteSelectedRows();
        }
    }


    deleteSelectedRows() {
        let selectedKeys = this.dataGrid.instance.getSelectedRowKeys();
        if (!selectedKeys.length) {
            Notify.error("PUB_NO_ITEM_SELECTED")
            return;
        }

        Dialog.delete().done(() => {
            this.service.postPromise("/SYS/Forms/Delete", {
                FormCode: this.formCode,
                List: selectedKeys
            }).then(() => {
                this.dataGrid.instance.refresh();
                Notify.success("PUB_ACTION_SUCCESS_MSG");
            });
        });
    }
}
