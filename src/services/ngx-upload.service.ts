import {Injectable, InjectionToken} from '@angular/core';

export let NGX_UPLOAD_CONFIG = new InjectionToken('ngx-upload-config');


@Injectable()
export class NgxUploadService {

  constructor() {
  }
}
