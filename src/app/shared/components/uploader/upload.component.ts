import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { UploadMetadata } from './upload.interface';

import { UploadService } from './upload.service';
import { Style } from './style';
/**
 * Model for any files
 */
export class FileHolder {
    public pending: boolean = false;
    public serverResponse: { status: number, response: any };

    constructor(public src: string, public file: File) {
    }
}

@Component({
    selector: 'file-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnChanges {

    files: FileHolder[] = [];
    fileCounter: number = 0;
    fileOver: boolean = false;
    showFileTooLargeMessage: boolean = false;

    @Input() beforeUpload: (param: UploadMetadata) => UploadMetadata | Promise<UploadMetadata> = data => data;
    @Input() buttonCaption = 'انتخاب...';
    @Input() disabled = false;
    @Input('class') cssClass = 'file-ul';
    @Input() clearButtonCaption = 'خالی کردن';
    @Input() uploadButtonCaption = 'بارگذاری';
    @Input() dropBoxMessage = '';
    @Input() fileTooLargeMessage;
    @Input() headers: Headers | { [name: string]: any };
    @Input() max = 100;
    @Input() maxFileSize: number;
    @Input() preview = true;
    @Input() partName: string;
    @Input() multiple = false;
    @Input() style: Style;
    @Input('extensions') supportedExtensions: string[];
    @Input() url: string;
    @Input() withCredentials = false;
    @Input() uploadedFiles: string[] | Array<{ url: string, fileName: string, blob?: Blob }> = [];
    @Output() removed = new EventEmitter<FileHolder>();
    @Output() uploadStateChanged = new EventEmitter<boolean>();
    @Output() uploadFinished = new EventEmitter<any>();

    @ViewChild('input')
    private inputElement: ElementRef;
    private pendingFilesCounter: number = 0;

    constructor(private fileService: UploadService) {
    }

    ngOnInit() {
        if (!this.fileTooLargeMessage) {
            this.fileTooLargeMessage = 'An file was too large and was not uploaded.' + (this.maxFileSize ? (' The maximum file size is ' + this.maxFileSize / 1024) + 'KiB.' : '');
        }
        this.supportedExtensions = this.supportedExtensions ? this.supportedExtensions.map((ext) => 'file/' + ext) : ['image/*'];
    }
    /**
     * delete all Prepared files
     */
    deleteAll() {
        this.files.forEach(f => this.removed.emit(f));
        this.files = [];
        this.fileCounter = 0;
        this.inputElement.nativeElement.value = '';
    }
    /**
     * delete single file
     * @param file File
     */
    deleteFile(file: FileHolder): void {
        let index = this.files.indexOf(file);
        this.files.splice(index, 1);
        this.fileCounter--;
        this.inputElement.nativeElement.value = '';
        this.removed.emit(file);
    }
    ngOnChanges(changes) {
        if (changes.uploadedFiles && changes.uploadedFiles.currentValue.length > 0) {
            this.processUploadedFiles();
        }
    }
    /**
     * change tracker for new file
     * @param files file list
     */
    onFileChange(files: FileList) {
        if (this.disabled) return;

        let remainingSlots = this.countRemainingSlots();
        let filesToUploadNum = files.length > remainingSlots ? remainingSlots : files.length;

        if (this.url && filesToUploadNum != 0) {
            this.uploadStateChanged.emit(true);
        }

        this.fileCounter += filesToUploadNum;
        this.showFileTooLargeMessage = false;
        this.uploadFiles(files, filesToUploadNum);
    }

    onFileOver = (isOver) => this.fileOver = isOver;

    private countRemainingSlots = () => this.max - this.fileCounter;
    /**
     * after uploaded use this method for manage response
     * @param response FileNames
     * @param fileHolder uploaded files
     */
    private onResponse(response: Response, fileHolder: FileHolder[]) {
        //TODO: check file uploaded
        fileHolder.forEach(element => {
            // element.serverResponse = { status: response.status, response };
            element.pending = false;
        });
        this.uploadFinished.emit(response);
        if (--this.pendingFilesCounter == 0) {
            this.uploadStateChanged.emit(false);
        }
    }
    /**
     * prepare file for upload
     */
    private processUploadedFiles() {
        for (let i = 0; i < this.uploadedFiles.length; i++) {
            let data: any = this.uploadedFiles[i];

            let fileBlob: Blob,
                file: File,
                fileUrl: string;

            if (data instanceof Object) {
                fileUrl = data.url;
                fileBlob = (data.blob) ? data.blob : new Blob([data]);
                file = new File([fileBlob], data.fileName);
            } else {
                fileUrl = data;
                fileBlob = new Blob([fileUrl]);
                file = new File([fileBlob], fileUrl);
            }

            this.files.push(new FileHolder(fileUrl, file));
        }
    }
    /**
     * add base64 to thubmnail in view and add to file holder list
     * @param files file list
     * @param filesToUploadNum file count to upload  
     */
    private async uploadFiles(files: FileList, filesToUploadNum: number) {
        for (let i = 0; i < filesToUploadNum; i++) {
            const file = files[i];

            if (this.maxFileSize && file.size > this.maxFileSize) {
                this.fileCounter--;
                this.inputElement.nativeElement.value = '';
                this.showFileTooLargeMessage = true;
                continue;
            }

            const beforeUploadResult: UploadMetadata = await this.beforeUpload({ file, url: this.url, abort: false });

            if (beforeUploadResult.abort) {
                this.fileCounter--;
                this.inputElement.nativeElement.value = '';
                continue;
            }

            //TODO: show image
            //   const img = document.createElement('img');
            //   img.src = window.URL.createObjectURL(beforeUploadResult.file);

            const reader = new FileReader();
            reader.addEventListener('load', (event: any) => {
                const fileHolder: FileHolder = new FileHolder(event.target.result, beforeUploadResult.file);
                // this.uploadSingleFile(fileHolder, beforeUploadResult.url, beforeUploadResult.formData);
                this.files.push(fileHolder);
            }, false);
            reader.readAsDataURL(beforeUploadResult.file);
        }
    }
    /**
     * Start
     */
    async startUpload() {
        //TODO: use FileHolder separately for queue uploading
        // for (let i = 0; i < this.files.length; i++) {
        //     let element = this.files[i];
        //     const beforeUploadResult: UploadMetadata = await this.beforeUpload({ file: element.file, url: this.url, abort: false });

        //     if (beforeUploadResult.abort) {
        //         this.fileCounter--;
        //         this.inputElement.nativeElement.value = '';
        //         continue;
        //     }
        //     this.uploadSingleFile(element, beforeUploadResult.url, beforeUploadResult.formData);
        // }
        this.uploadSingleFile(this.files);
    }
    
    private uploadSingleFile(fileHolder: FileHolder[]) {
        //TODO: use sep url
        // if (url) {
        this.pendingFilesCounter++;
        fileHolder.forEach(element => {
            element.pending = true;
        });;
        this.fileService
            .postFile(this.url, fileHolder, this.headers, this.partName, this.withCredentials)
            .then(
            response => this.onResponse(response, fileHolder),
            error => {
                this.onResponse(error, fileHolder);
                // this.deleteFile(fileHolder);
            });
        // } else {
        //     this.uploadFinished.emit(fileHolder);
        // }
    }
}