import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgxUploadComponent} from './ngx-upload.component';
import {UploaderComponent} from './components/uploader/uploader.component';
import {CropperComponent} from './components/cropper/cropper.component';
import {NGX_UPLOAD_CONFIG, NgxUploadService} from './services/ngx-upload.service';
import {INgxUploadConfig} from './interfaces/config';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [NgxUploadComponent, UploaderComponent, CropperComponent],
  declarations: [NgxUploadComponent, UploaderComponent, CropperComponent],
  providers: [NgxUploadService]
})
export class NgxUploadModule {
  static forRoot(config?: INgxUploadConfig): ModuleWithProviders {
    return {
      ngModule: NgxUploadModule,
      providers: [NgxUploadService, {
        provide: NGX_UPLOAD_CONFIG,
        useValue: config
      }]
    };
  }

  static forFeature(config?: INgxUploadConfig): ModuleWithProviders {
    return {
      ngModule: NgxUploadModule,
      providers: [NgxUploadService, {
        provide: NGX_UPLOAD_CONFIG,
        useValue: config
      }]
    };
  }
}
