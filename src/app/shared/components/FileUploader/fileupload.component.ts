import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { Uppy } from 'uppy/lib/core'
import { RouteData } from '../../util/RouteData'
import { IUppy, UppyFile } from 'uppy-store-ngrx'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from '../../../../environments/environment';
import { UploadService } from '../uploader/upload.service';
import { DxFileUploaderComponent, DxFileUploaderModule } from 'devextreme-angular';



import { Repository } from '../../services/Repository';
import { Http } from '@angular/http';
import { EventsService } from 'angular-event-service/dist';
import { Tus } from 'uppy/lib/plugins/Tus';
import { HttpClientHandler } from '../../errorHandler/http-error.tldr';

const Dashboard = require('uppy/lib/plugins/Dashboard');
const StatusBar = require('uppy/lib/plugins/StatusBar');
const DragDrop = require('uppy/lib/plugins/DragDrop');
const Tus = require('uppy/lib/plugins/Tus');
const ThumbnailGenerator = require('uppy/lib/plugins/ThumbnailGenerator');
const ProgressBar = require('uppy/lib/plugins/ProgressBar');
const uppyOne = new Uppy({ debug: true });

@Component({
  selector: 'dx-file-upload',
  templateUrl: './fileupload.component.html'
})
export class FileUploadComponent implements OnInit {
  @ViewChild(DxFileUploaderComponent) fileUploader: DxFileUploaderComponent;
  private uppy: IUppy<any, UppyFile<any>>;
  private visible: boolean = false;
  AdvanceMode: boolean = true;
  SimpleMode: boolean = false;
  SimpleUploaderOptions = {
    url: '',
    headers: {}
  }


  //tablename
  @Input()
  tableName: string = null;

  //Width
  @Input()
  width: string = null;
  //height
  @Input()
  height: string = null;

  // //text
  // @Input()
  // text: string = null;

  constructor(private fileService: UploadService, protected http: Http, protected eventsService: EventsService, protected httpHandler: HttpClientHandler) {
    let repo = new Repository(http, eventsService, httpHandler);
    this.SimpleUploaderOptions.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      "Authorization": "Basic " + localStorage.getItem("token")
    }
    this.SimpleUploaderOptions.url = repo.BaseURL + '/EDM/File/SaveTemp'
  }

  closeModal() {
    const dashboard = (<any>this.uppy).getPlugin('Dashboard')
    if (dashboard.isModalOpen()) {
      dashboard.closeModal()
    }

  }



  upload(data) {

    let listFiles = [];
    data.fileIDs.forEach(element => {
      listFiles.push(this.uppy.getFile(element).data)
    });
    if (listFiles.length > 0)
      return this.fileService.postFiles(listFiles, this.tableName).then(res => {
        this.fileService.fileservice.setClearUppy(this.uppy.reset, this.uppy);

        this.closeModal();
        return res;
      })
  }

  startUpload(file) {

  }


  ngOnInit() {



    this.initUppy()

    let that = this;
    this.uppy.on('upload', (data) => this.upload(data))
    this.uppy.on('Edit File', (data) => this.editfile(data))




    this.uppy.run();

    this.uppy.on("complete", result => {
      console.log("successful files:", result.successful);
      console.log("failed files:", result.failed);
    });
  }

  editfile(data) {

  }

  initUppy() {
    this.uppy = new Uppy({
      debug: true,
      editfile: true,
      autoProceed: false,
      restrictions: {
        maxFileSize: 100000000,
        // maxNumberOfFiles: 3,
        // minNumberOfFiles: 0,
        allowedFileTypes: ["*"]//["image/*", "video/*"]
      }
    });

    this.uppy.use(Dashboard, {
      target: 'body',
      metaFields: [
        { id: 'name', name: 'Name', placeholder: 'file name' },
        { id: 'license', name: 'License', placeholder: 'specify license' },
        { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
      ],
      trigger: '#uppy-select-files',
      inline: false,
      width: this.width || 750,
      height: this.height || 550,
      thumbnailWidth: 280,
      // defaultTabIcon: defaultTabIcon,
      showLinkToFileUploadResult: true,
      showProgressDetails: false,
      hideUploadButton: false,
      hideProgressAfterFinish: false,
      note: null,
      closeModalOnClickOutside: true,
      disableStatusBar: false,
      disableInformer: false,
      disableThumbnailGenerator: false,
      disablePageScrollWhenModalOpen: true,
      proudlyDisplayPoweredByUppy: false,

      onRequestCloseModal: () => this.closeModal(),
      locale: {
        strings: {
          selectToUpload: 'Select files to upload',
          closeModal: 'Close Modal',
          upload: 'Upload',
          importFrom: 'Import from',
          dashboardWindowTitle: 'Uppy Dashboard Window (Press escape to close)',
          dashboardTitle: 'Uppy Dashboard',
          copyLinkToClipboardSuccess: 'Link copied to clipboard.',
          copyLinkToClipboardFallback: 'Copy the URL below',
          copyLink: 'Copy link',
          fileSource: 'File source',
          done: 'Done',
          name: 'Name',
          removeFile: 'Remove file',
          editFile: 'Edit file',
          editing: 'Editing',
          finishEditingFile: 'Finish editing file',
          localDisk: 'Local Disk',
          myDevice: 'My Device',
          dropPasteImport: 'Drop files here, paste, import from one of the locations above or',
          dropPaste: 'Drop files here, paste or',
          browse: 'browse',
          showProgressDetails: true,
          fileProgress: 'File progress: upload speed and ETA',
          numberOfSelectedFiles: 'Number of selected files',
          uploadAllNewFiles: 'Upload all new files',
          emptyFolderAdded: 'No files were added from empty folder',
          uploadComplete: 'Upload complete',
          resumeUpload: 'Resume upload',
          pauseUpload: 'Pause upload',
          retryUpload: 'Retry upload',

          uploadXFiles: {
            0: 'Upload %{smart_count} file',
            1: 'Upload %{smart_count} files'
          },
          uploadXNewFiles: {
            0: 'Upload +%{smart_count} file',
            1: 'Upload +%{smart_count} files'
          },
          folderAdded: {
            0: 'Added %{smart_count} file from %{folder}',
            1: 'Added %{smart_count} files from %{folder}'
          }
        }
      }
    },
    );

    // this.uppy.thumbnailGeneration 
    // this.uppy.use(ProgressBar, {
    //   target: Dashboard,
    //   fixed: true,
    //   hideAfterFinish: true
    // })
  }
}
