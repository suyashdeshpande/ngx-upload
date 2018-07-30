import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HighlightModule} from 'ngx-highlightjs';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {FormsModule} from '@angular/forms';
import {NgxImgModule, NgxUploadModule} from '@suyash/ngx-upload';

@NgModule({
  imports: [
    CommonModule,
    NgxImgModule.forRoot(),
    NgxUploadModule.forRoot(),
    HomeRoutingModule,
    HighlightModule.forRoot({theme: 'zenburn'}),
    FormsModule
  ],
  declarations: [HomeComponent],
})
export class HomeModule {
}
