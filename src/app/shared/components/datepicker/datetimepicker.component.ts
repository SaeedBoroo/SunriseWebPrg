import {
    forwardRef,
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    ElementRef,
    OnChanges,
    SimpleChanges, HostListener,
    ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgbDatepickerI18n, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerI18nPersian } from 'ng2-datepicker-jalali/persian/ngb-datepicker-i18n-persian';
import { NgbCalendarPersian } from 'ng2-datepicker-jalali/persian/ngb-calendar-persian';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { DxTextBoxComponent } from 'devextreme-angular';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatetimepickerComponent),
    multi: true
};

// export const CUSTOM_INPUT_CONTROL_VALIDATOR: any = {
//     provide: NG_VALIDATORS,
//     useExisting: forwardRef(() => DatetimepickerComponent),
//     multi: true
// };


@Component({
    selector: 'datetimepicker',
    templateUrl: './datetimepicker.component.html',
    styleUrls: ['./datetimepicker.component.css'],
    providers: [
        { provide: NgbCalendar, useClass: NgbCalendarPersian },
        { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },
        CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
        // CUSTOM_INPUT_CONTROL_VALIDATOR
    ]
    , encapsulation: ViewEncapsulation.None
})
export class DatetimepickerComponent implements OnInit, OnChanges, ControlValueAccessor {
    @ViewChild('datepicker') datepicker: ElementRef;
    @ViewChild('textbox') textBox: DxTextBoxComponent;
    @Output() OnPersianFormat = new EventEmitter();
    @Input('disableTime') disableTime = true;
    @Input() maxDateTime;
    @Input() minDateTime;
    @Input() required: boolean = false;;
    @Input() displayMonths = 1;
    @Output() onChangeValue: EventEmitter<any> = new EventEmitter();

    @Input() readOnly: boolean;

    @Input() overlayVisible: boolean;
    @Input() dir: 'ltr' | 'rtl';

    maskRules: any = {
        "H": /[0-5]/,
        "h": /[0-9]/
    };

    _dateTimeFormat = '';
    _date;
    _time;
    _value: Date;
    _lastValue;

    _panelClick: boolean;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        this._panelClick = false;
        console.log(this.elementRef.nativeElement.parentElement.dir, this.elementRef.nativeElement.parentElement);

        if (!(this.dir === 'rtl' || this.dir === 'ltr')) {
            let parent = this.elementRef.nativeElement.parentElement;
            while (parent && !(this.dir === 'rtl' || this.dir === 'ltr')) {
                this.dir = parent.dir;
                parent = parent.parentElement;
            }
            if (!(this.dir === 'rtl' || this.dir === 'ltr')) {
                this.dir = 'rtl';
            }
        }
    }
    ngAfterViewInit() {
        if (this.textBox) {
            var validator = this.textBox.validator;
            var rules: any[] = [];
            if (this.required) {
                rules.push({ type: "required", message: "این فیلد اجباری است" })
                validator.instance.option("validationRules", rules);
            }
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.canChange();
    }

    changedTime() {
        if (this._time) {
            this.canChange();
        }
    }

    changedDate() {
        if (this._date) {
            this.canChange();
        }
    }

    getValue(): Date {
        this.applyTextInput();
        if (this._date) {
            let date: Date = new NgbCalendarPersian().toGregorian(this._date);

            if (this.disableTime) {
                this._time = new NgbTime(0, 0, 0);
            }

            if (this._time) {
                if (this._time.hour.toString().length == 1)
                    this._time.hour = '0' + this._time.hour;
                date.setHours(this._time.hour);
                date.setMinutes(this._time.minute);
                date.setSeconds(this._time.second);
                date.setMilliseconds(0);

                this.OnPersianFormat.emit(this._date.year + '/' + this._date.month + '/' + this._date.day +
                    ((this.disableTime) ? '' : ' ' + this._time.hour + ':' + this._time.minute + ':' + this._time.second));
                return date;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    applyTextInput() {
        if (this._date) {
            if (this.disableTime) {
                this._dateTimeFormat = `${this.pad(this._date.year, 4)}/${this.pad(this._date.month, 2)}/${this.pad(this._date.day, 2)}`;
            } else if (this._time) {
                this._dateTimeFormat = `${this.pad(this._date.year, 4)}/${this.pad(this._date.month, 2)}/${this.pad(this._date.day, 2)}`
                    + `${this.pad(this._time.hour, 2)}:${this.pad(this._time.minute, 2)}`;
            }
        }
    }

    pad(str: number | any, max) {
        str = str.toString();
        let i: number;
        let strR = '';
        for (i = 0; i < max - str.length; i++) {
            strR += '0';
        }

        return strR + str;
    }

    inputBlur(ev) {
        if (!ev || !ev.element.children[0] || ev.element.children[0].value.trim().length < 8)
            this._dateTimeFormat = "";
        if (this._dateTimeFormat) {
            if (this._dateTimeFormat.indexOf('/') === -1)
                this._dateTimeFormat = this._dateTimeFormat.substr(0, 4) + '/' +
                    this._dateTimeFormat.substr(4, 2) + '/' + this._dateTimeFormat.substr(6, 2)
                    + (!this.disableTime ? ' ' + this._dateTimeFormat.substr(8, 2) + ':' + this._dateTimeFormat.substr(10, 2) : '');
            let datetime: string[] = this._dateTimeFormat.replace(/\s/gi, ' ').split(' ');
            if ((this.disableTime && datetime.length === 1) || datetime.length === 2) {
                let date: string[] = datetime[0].split('/');
                if (date.length === 3 &&
                    +date[0] && +date[0] > 0 && +date[0] < 9999 &&
                    +date[1] && +date[1] > 0 && +date[1] <= 12 &&
                    +date[2] && +date[2] > 0 && +date[2] <= 31
                ) {
                    if (this.disableTime) {
                        this._time = new NgbTime(0, 0, 0);
                        this._date = new NgbDate(+date[0], +date[1], +date[2]);
                    } else if (datetime.length > 1) {
                        let time: string[] = datetime[1].split(':');
                        if (time.length === 2 &&
                            +time[0] != null && +time[0] > -1 && +time[0] < 24 &&
                            +time[1] != null && +time[1] > -1 && +time[1] < 60
                        ) {
                            this._time = new NgbTime(+time[0], +time[1], 0);
                            this._date = new NgbDate(+date[0], +date[1], +date[2]);
                        } else {
                            this._time = null;
                        }
                    }
                } else {
                    this._date = null;
                    this._time = null;
                }
            } else {
                this._date = null;
                this._time = null;
            }
        } else {
            this._date = null;
            this._time = null;
        }
        let temp = this.getValue();
        if (this._date === null)
            temp = null
        this.onChangeValue.emit(temp)
        this.onChange(temp);
        this.canChange();
    }

    maxDate() {
        if (this.maxDateTime) {
            return new NgbCalendarPersian().fromGregorian(this.maxDateTime);
        }
    }

    minDate() {
        if (this.minDateTime) {
            return new NgbCalendarPersian().fromGregorian(this.minDateTime);
        }
    }

    maxTime() {
        if (this.maxDateTime) {
            return new NgbTime(this.maxDateTime.getHours(), this.maxDateTime.getMinutes(), this.maxDateTime.getSeconds());
        }
    }

    minTime() {
        if (this.minDateTime) {
            return new NgbTime(this.minDateTime.getHours(), this.minDateTime.getMinutes(), this.minDateTime.getSeconds());
        }
    }

    getValidDate() {
        if (this._date && (this.minDateTime || this.maxDateTime)) {
            if (this.minDate() &&
                (this.minDate().year > this._date.year ||
                    (this.minDate().year === this._date.year && this.minDate().month > this._date.month) ||
                    (this.minDate().year === this._date.year && this.minDate().month === this._date.month &&
                        this.minDate().day > this._date.day))) {
                return false;
            } else if (this.maxDate() &&
                (this.maxDate().year < this._date.year ||
                    (this.maxDate().year === this._date.year && this.maxDate().month < this._date.month) ||
                    (this.maxDate().year === this._date.year && this.maxDate().month === this._date.month &&
                        this.maxDate().day < this._date.day))) {
                return false;
            }
        }
        return true;
    }

    getValidTime() {
        if (this.disableTime === true) {
            return true;
        }

        if (this.getValidDate() && this._time && this._date && (this.minDateTime || this.maxDateTime)) {

            if (this.minDateTime &&
                this.minDate() &&
                this.minTime()) {

                if (this.minDate().year === this._date.year &&
                    this.minDate().month === this._date.month &&
                    this.minDate().day === this._date.day) {

                    if (this.minTime().hour > this._time.hour || (
                        this.minTime().hour === this._time.hour &&
                        this.minTime().minute >= this._time.minute
                    )) {
                        return false;
                    }
                }
            }

            if (this.maxDateTime && this.maxDate() && this.maxTime()) {
                if (this.maxDate().year === this._date.year &&
                    this.maxDate().month === this._date.month &&
                    this.maxDate().day === this._date.day) {

                    if (this.maxTime().hour < this._time.hour || (
                        this.maxTime().hour === this._time.hour &&
                        this.maxTime().minute <= this._time.minute)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    canChange() {
        let value = this.getValue();
        if (this._lastValue !== value) {
            this._lastValue = value;
            this.onChange(value);
            if (value)
                this.onChangeValue.emit(value);
        }
    }

    onChange: any = () => {

    }
    onTouched: any = () => {
    }

    writeValue(val: any) {
        if (!val) {
            this._value = null;
            this._date = null;
            this._dateTimeFormat = null;
            this._lastValue = null;
        }
        if (val !== this.getValue()) {
            if (val && val.indexOf('T') !== -1)
                val = val.replace('T', ' ');
            this._value = new Date(val);
            if (this._value && val) {
                this._date = new NgbCalendarPersian().fromGregorian(this._value);
                this._time = new NgbTime(this._value.getHours(), this._value.getMinutes(), this._value.getSeconds());
            }
            this.applyTextInput();
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    // validate(c) {
    //     let err = {
    //         rangeError: {
    //             dateTime: this.getValue(),
    //             max: this.maxDateTime,
    //             min: this.maxDateTime
    //         }
    //     };
    //     return this._dateTimeFormat || !this.getValidTime() || !this.getValidDate() ? err : null;
    // }
    getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    setPosition() {
        var offsetElement = this.getCoords(this.datepicker.nativeElement.parentElement);
        this.datepicker.nativeElement.style.position = 'fixed';
        this.datepicker.nativeElement.style.top = offsetElement.top + this.datepicker.nativeElement.parentElement.offsetHeight + 'px';
        this.datepicker.nativeElement.style.left = offsetElement.left + 'px';
    }
    onMouseClick(datePicker) {
        if (this.readOnly) {
            return;
        }

        if (!this._panelClick) {
            if (this.overlayVisible) {
                this.hide();
            } else {
                setInterval(() => {
                    this.setPosition();
                })
                this.show();

                if (this._date) {
                    datePicker.navigateTo({ year: this._date.year, month: this._date.month });
                }
            }
        }
    }

    show() {
        this.overlayVisible = true;
    }

    hide() {
        this.overlayVisible = false;
    }
    close() {
        this.hide();
        this._panelClick = false;
    }
    @HostListener('document:click', ['$event'])
    handleClick(event) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            if (this.disableTime || (!this.disableTime && !this._panelClick)) {
                this.hide();
            }
        }
        this._panelClick = false;
    }
}
