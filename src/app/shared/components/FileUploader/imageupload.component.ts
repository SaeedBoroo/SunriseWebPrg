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
import { ImageUploadModule } from "angular2-image-upload";


import { Repository } from '../../services/Repository';
import { Http } from '@angular/http';
import { EventsService } from 'angular-event-service/dist';
import { HttpClientHandler } from '../../errorHandler/http-error.tldr';



@Component({
  selector: 'dx-image-upload',
  templateUrl: './imageupload.component.html'
})
export class ImageUploadComponent implements OnInit {


  private visible: boolean = false;
  AddAction: string = '+';


  SimpleUploaderOptions = {
    url: '',
    headers: {}
  }

  test() {

  }

  // form tablename
  @Input()
  tableName: string = null;

  //Width
  @Input()
  width: string = null;
  //height
  @Input()
  height: string = null;
  constructor(private fileService: UploadService, protected http: Http, protected eventsService: EventsService, protected httpHandler: HttpClientHandler) {
    let repo = new Repository(http, eventsService, httpHandler);
    this.SimpleUploaderOptions.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      "Authorization": "Basic " + localStorage.getItem("token")
    }
    this.SimpleUploaderOptions.url = repo.BaseURL + '/EDM/File/SaveTemp'

  }


  uploadsimple(e) {
    let listFiles = [];


    listFiles.push(e.file);
    if (listFiles.length > 0) {
      this.AddAction = '';
      return this.fileService.postFiles(listFiles, this.tableName).then(res => {

        return res;
      })
    }
  }

  onRemoved(ev) {
    this.fileService.fileservice.removeFileByName(ev.file.name)
  }


  ngOnInit() {

  }
}
