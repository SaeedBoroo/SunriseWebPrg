import { Component, Input, ViewChild, Output, EventEmitter, ContentChild, ComponentFactoryResolver, ComponentFactory, Injector, EmbeddedViewRef, ApplicationRef } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { DxMenuComponent, DxTreeListComponent } from 'devextreme-angular';
import { ServiceCaller } from "../../services/ServiceCaller";
import { DateTime, DateTimeFormat } from '../../util/DateTime';
import { Dialog } from '../../util/Dialog';
import { ConfigService } from '../../services/ConfigService';



export class TreeToolbarItemClickEventArgs {
    index: number;
    data: any;
    name: string;
    handled: boolean = false;
}
export class TreeToolbarItemPreperingEventArgs {
    name: string;
    data: any;
    visible: boolean = true;
    disabled: boolean = false;
}

export class TreeRowDbClickEventArgs {
    data: any;
    key: any;
    index: boolean = true;
    handled: boolean = false;
}


@Component({
    selector: 'tree-toolbar',
    templateUrl: './dx-treetoolbar.component.html',
    entryComponents: [DxMenuComponent]
})
export class DXTreeToolbarComponent {

    @ViewChild(DxMenuComponent) menu: DxMenuComponent;
    @ContentChild(DxTreeListComponent) tree: DxTreeListComponent;
    // @ContentChild(DXTreeToolbarDataSourceComponent) dataSource: DXTreeToolbarDataSourceComponent;

    @Output() onButtonClick = new EventEmitter<string>();
    @Output() onMenuItemClick = new EventEmitter<TreeToolbarItemClickEventArgs>();
    @Output() onMenuItemPrepering = new EventEmitter<TreeToolbarItemPreperingEventArgs>();
    @Output() onCancelEditRow = new EventEmitter<any>();
    @Output() onRowDbClick = new EventEmitter<TreeRowDbClickEventArgs>();

    allowEdit: boolean = false;
    allowDelete: boolean = false;
    allowInsert: boolean = false;

    // Items
    private _rowMenuItems: any[] = [];
    @Input()
    get rowMenuItems(): any[] {
        return this._rowMenuItems;
    }

    set rowMenuItems(val: any[]) {
        this._rowMenuItems = val;
    }

    // Header Items
    private _headerMenuItems: any[] = [];
    @Input()
    get headerMenuItems(): any[] {
        return this._headerMenuItems;
    }

    set headerMenuItems(val: any[]) {
        this._headerMenuItems = val;
    }


    constructor(
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef,
        private service: ServiceCaller,
        private config: ConfigService
    ) {

    }
    ngOnInit() {
        this.tree.onToolbarPreparing.subscribe((e) => {
            e.toolbarOptions.visible = false;
        });
        if (!this.tree.filterRow)
            this.tree.filterRow = {};
        this.tree.filterRow.visible = this.config.get('ADM-USER-SHOW-FILTER') == '1';
    }

    ngAfterViewInit() {
        //if (this.dataSource)
        //    this.tree.dataSource = this.createDataSource();

        this.allowInsert = this.tree.editing.allowAdding;
        this.allowEdit = this.tree.editing.allowUpdating;
        this.allowDelete = this.tree.editing.allowDeleting;


        this.tree.hoverStateEnabled = true;
        //this.tree.columnAutoWidth = true;
        this.tree.rowAlternationEnabled = true;
        this.tree.showRowLines = true;
        this.tree.showBorders = true;
        this.tree.allowColumnReordering = true;
        this.tree.allowColumnResizing = true;
        this.tree.editing.texts.confirmDeleteMessage = null;

        this.tree.onContentReady.subscribe((e) => {
            e.component.columnOption("command:edit", {
                visibleIndex: -1,
                width: 100
            });
        });

        this.tree.onCellPrepared.subscribe((e) => {
            if (e.rowType === 'header' && e.column.command === "edit") {
                var cellElement = (e.cellElement as HTMLDivElement);
                const childComponentFactory = this.resolver.resolveComponentFactory(DxMenuComponent);
                let componentRef = childComponentFactory.create(this.injector);
                this.appRef.attachView(componentRef.hostView);
                var root = {
                    icon: "fa fa-bars white",
                    name: "root",
                    items: []
                };
                if (this.allowInsert) {
                    root.items.push({
                        text: "ایجاد",
                        icon: "fa fa-plus green",
                        name: "DXInsert",
                        beginGroup: true
                    });
                }
                root.items.push({
                    text: "بروز رسانی",
                    icon: "fa fa-refresh blue",
                    name: "DXRefresh",
                });
                root.items.push({
                    text: "نمایش ردیف فیلتر",
                    icon: "fa fa-search blue",
                    name: "DXToggleFilterRow",
                });
                root.items.push({
                    text: "انتخاب ستونها",
                    icon: "fa fa-table blue",
                    name: "DXColumnChooser",
                });
                if (this.allowDelete && this.tree.selection.mode == "multiple") {
                    root.items.push({
                        text: "حذف موارد انتخاب شده",
                        icon: "fa fa-trash red",
                        name: "DXSelectedDelete",
                    });
                }

                for (const key in this.headerMenuItems) {
                    if (this.headerMenuItems.hasOwnProperty(key)) {
                        const item = this.headerMenuItems[key];
                        root.items.push(item);
                    }
                }

                if (root.items) {
                    componentRef.instance.items = [root];
                    cellElement.innerHTML = "";
                    cellElement.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
                    componentRef.instance.onItemClick.subscribe((d) => {
                        this.menuClick(d.itemData.name, e.rowIndex, e.data);
                    });
                }
            }
            if (e.rowType === "data" && e.column.command === "edit") {
                var isEditing = e.row.isEditing;
                var cellElement = (e.cellElement as HTMLDivElement);
                //
                const childComponentFactory = this.resolver.resolveComponentFactory(DxMenuComponent);
                let componentRef = childComponentFactory.create(this.injector);
                this.appRef.attachView(componentRef.hostView);
                //

                if (isEditing) {
                    var rootV = [
                        {
                            icon: "fa fa-undo",
                            name: "DXCancel",
                        },
                        {
                            icon: "fa fa-floppy-o blue",
                            name: "DXSave",
                        }
                    ];
                    componentRef.instance.items = rootV;
                }
                else if (!isEditing) {
                    var root = {
                        icon: "fa fa-cogs",
                        name: "root",
                        items: []
                    };
                    root.items.push({
                        text: "فرزند جدید",
                        icon: "fa fa-plus green",
                        name: "DXNew",
                    });
                    if (this.allowEdit) {
                        root.items.push({
                            text: "ویرایش",
                            icon: "fa fa-pencil yellow",
                            name: "DXEdit",
                        });
                    }
                    if (this.allowDelete) {
                        root.items.push({
                            text: "حذف",
                            icon: "fa fa-trash red",
                            name: "DXDelete"

                        });
                    }

                    if (this.rowMenuItems && this.rowMenuItems.length) {
                        let clone: any[] = this.rowMenuItems.map(x => Object.assign({}, x));
                        for (var j in clone) {
                            let i = clone[j];
                            root.items.push({
                                text: i.text,
                                name: i.name,
                                icon: i.icon,
                                visible: i.visible,
                                disabled: i.disabled
                            });
                        }
                    }
                    for (var i in root.items) {
                        let event = new TreeToolbarItemPreperingEventArgs();
                        event.data = e.data;
                        event.name = root.items[i].name;
                        this.onMenuItemPrepering.emit(event);
                        root.items[i].visible = event.visible;
                        root.items[i].disabled = event.disabled;
                    }

                    componentRef.instance.items = [root]
                }
                cellElement.innerHTML = "";
                cellElement.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
                componentRef.instance.onItemClick.subscribe((d) => {
                    this.menuClick(d.itemData.name, e.rowIndex, e.data);
                });
            }
            if (e.rowType === "data" && e.column.dataType === "date") {
                let cellElement = (e.cellElement as HTMLDivElement);
                let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
                if (!isEditing)
                    cellElement.innerHTML = DateTime.convertToLocal(e.value);
            }
            if (e.rowType === "data" && e.column.dataType === "dateTime") {
                let cellElement = (e.cellElement as HTMLDivElement);
                let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
                if (!isEditing)
                    cellElement.innerHTML = DateTime.convertToLocal(e.value, DateTimeFormat.DateTime);
            }
            if (e.rowType == "data" && e.column.dataType == "time") {
                let cellElement = (e.cellElement as HTMLDivElement);
                let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
                if (!isEditing)
                    cellElement.innerHTML = DateTime.convertToLocal(e.value, DateTimeFormat.Time);
            }
            if (e.rowType == "data" && e.column.dataType == "currency") {
                let cellElement = (e.cellElement as HTMLDivElement);
                let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
                if (!isEditing && e.value != null)
                    cellElement.innerHTML = e.value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            }
        });

        // Provide double click for grid  
        this.tree.onRowClick.subscribe(this.onRowClick);
        // provide shortcuts
        this.tree.onKeyDown.subscribe(this.onKeyDown);
    }

    private menuClick(name: string, rowIndex: number, data: any) {
        let item = new TreeToolbarItemClickEventArgs();
        item.data = data;
        item.index = rowIndex;
        item.name = name;
        let tree = this.tree.instance;
        let key = data ? data[this.tree.keyExpr.toString()] : null;
        switch (item.name) {
            case "root":
                return;
            case "DXDelete":
                {
                    if (this.allowDelete) {
                        this.onMenuItemClick.emit(item);
                        if (item.handled == false) {
                            Dialog.delete().done(() => {
                                //this.tree.instance.deleteRow(rowIndex); 

                                //let key = tree.getNodeByKey(rowIndex);
                                tree.getDataSource().store().remove(key).then(() => {

                                    tree.refresh();
                                });

                            }).final(() => {
                                tree.focus();
                            });
                        }
                    }
                    break;
                }
            case "DXInsert":
                {
                    if (this.allowInsert) {
                        this.onMenuItemClick.emit(item);
                        if (item.handled == false)
                            tree.addRow();
                    }
                    break;
                }
            case "DXSelectedDelete": {
                this.onMenuItemClick.emit(item);
                break;
            }
            case "DXNew":
                {
                    if (this.allowInsert) {
                        this.onMenuItemClick.emit(item);
                        if (item.handled == false)
                            tree.addRow(item.data.ID);
                    }
                    break;
                }
            case "DXEdit":
                {
                    if (this.allowEdit) {
                        this.onMenuItemClick.emit(item);
                        if (item.handled == false)
                            tree.editRow(rowIndex);
                    }
                    break;
                }
            case "DXSave":
                {
                    this.onMenuItemClick.emit(item);
                    if (item.handled == false)
                        tree.saveEditData();
                    break;
                }
            case "DXCancel":
                {
                    this.onMenuItemClick.emit(item);
                    if (item.handled == false) {
                        tree.cancelEditData();
                    }
                    break;
                }
            case "DXToggleFilterRow":
                {
                    tree.option({ filterRow: { visible: !this.tree.filterRow.visible } });
                    break;
                }
            case "DXColumnChooser":
                {
                    tree.showColumnChooser();
                    break;
                }
            case "DXRefresh":
                {
                    tree.refresh();
                    break;
                }
            default:
                this.onMenuItemClick.emit(item);
        }
    }



    private onRowClick = (e) => {

        let component = e.component;
        let prevClickTime: any = component.lastClickTime2;
        component.lastClickTime2 = new Date();
        if (e.rowType == "data") {
            let event = new TreeRowDbClickEventArgs();
            event.data = e.data;
            event.index = e.rowIndex;
            event.key = e.key;
            //
            if (prevClickTime && (component.lastClickTime2 - prevClickTime < 300)) {
                this.onRowDbClick.emit(event);
                if (!event.handled) {
                    let defaults = this.rowMenuItems ? this.rowMenuItems.filter(c => c.default) : [];
                    if (defaults.length) {
                        this.menuClick(defaults[0].name, e.rowIndex, e.data);
                    }
                    else {
                        this.menuClick("DXEdit", e.rowIndex, e.data);
                    }
                }
            }
            else {
            }
        }
    }


    private onKeyDown = (e) => {
        let grid = this.tree.instance;
        let keys = grid.getSelectedRowKeys();
        let rowIndex = -1;
        let rowData = null;
        if (keys.length == 1) {
            rowIndex = grid.getRowIndexByKey(keys[0]);
            rowData = grid.getSelectedRowsData()[0];
        }
        // 
        switch (e.event.code) {
            case 'Insert':
                if (e.event.ctrlKey)
                    this.menuClick("DXInsert", -1, null);
                break
            case 'Enter':
                if (rowIndex > -1) {
                    this.menuClick("DXEdit", rowIndex, rowData);
                }
                break
            case 'Delete':
                if (e.event.ctrlKey) {
                    this.menuClick("DXDelete", rowIndex, rowData);
                    e.event.preventDefault();
                }
                break
            case 'Period':
                if (e.event.ctrlKey) {
                    this.menuClick("DXRefresh", -1, null);
                    e.event.preventDefault();
                }
                break
        }

    }


    private _showRefresh: boolean = false;
    @Input()
    get showRefresh(): boolean {
        return this._showRefresh;
    }
    set showRefresh(val: boolean) {
        this._showRefresh = val;
    }


    private _showNew: boolean = false;
    @Input()
    get showNew(): boolean {
        return this._showNew;
    }
    set showNew(val: boolean) {
        this._showNew = val;
    }


    private _showEdit: boolean = false;
    @Input()
    get showEdit(): boolean {
        return this._showEdit;
    }
    set showEdit(val: boolean) {
        this._showEdit = val;
    }



    private _showDelete: boolean = false;
    @Input()
    get showDelete(): boolean {
        return this._showDelete;
    }
    set showDelete(val: boolean) {
        this._showDelete = val;
    }


}


