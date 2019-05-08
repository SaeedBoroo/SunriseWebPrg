import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ServiceCaller } from '../../services/ServiceCaller';
import { FileHolder } from './upload.component';
import { FileService } from '../../services/FileService';

@Injectable()
export class UploadService {

  constructor(private http: Http, public service: ServiceCaller, public fileservice: FileService) {
  }

  public postFile(url: string, files: FileHolder[], headers?: Headers | { [name: string]: any }, partName: string = 'file', withCredentials?: boolean): Promise<any> {
    // if (!url || url === '') {
    //   throw new Error('Url is not set! Please set it before doing queries');
    // }

    const options: RequestOptionsArgs = new RequestOptions();

    if (withCredentials) {
      options.withCredentials = withCredentials;
    }

    if (headers) {
      options.headers = new Headers(headers);
    }


    // add custom form data
    let formData = new FormData();
    formData.append('enctype', 'multipart/form-data')
    // for (let key in customFormData) {
    //   formData.append(key, customFormData[key]);
    // }
    files.forEach(element => {

      formData.append(partName, element.file, element.file.name);
    });
    return this.service.postFile('/EDM/File/SaveFileByContainer', formData);
  }


  public postFiles(files: File[], tableName = '', headers?: Headers | { [name: string]: any }, partName: string = 'file', withCredentials?: boolean): Promise<any> {
    // if (!url || url === '') {
    //   throw new Error('Url is not set! Please set it before doing queries');
    // }

    const options: RequestOptionsArgs = new RequestOptions();

    if (withCredentials) {
      options.withCredentials = withCredentials;
    }

    if (headers) {
      options.headers = new Headers(headers);
    }

    // add custom form data
    let formData = new FormData();
    formData.append('enctype', 'multipart/form-data')
    // for (let key in customFormData) {
    //   formData.append(key, customFormData[key]);
    // }
    files.forEach(element => {
      formData.append(partName, element, element.name);
    });
    this.fileservice.setRawFileInfo(files);
    return this.service.postFile('/EDM/File/SaveTemp', formData).then(res => {

      if (res.FileNames) {
        this.fileservice.setFileInfo(res.FileNames, tableName)
      }
      return res;
    });
  }
}