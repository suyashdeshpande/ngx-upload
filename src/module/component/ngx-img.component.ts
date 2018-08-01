import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NgxImgService} from '../service/ngx-img.service';
import {INgxUploadConfig} from '../../interfaces/config';
import {INgxErrorText, INgxText} from '../../interfaces/text';

@Component({
  selector: 'ngx-img',
  templateUrl: './ngx-img.component.html',
  styleUrls: ['./ngx-img.component.scss']
})
export class NgxImgComponent implements OnInit, OnDestroy {


  constructor(private _service: NgxImgService) {
  }

  @Input() fileName = '';
  // @Input() imgSrc = '';
  @Input() imgSrc: any = [];
  @Input() remove = true;
  @ViewChild('fileInput') fileInput: any;
  @Input() config: INgxUploadConfig;
  @Input() errorTexts: INgxErrorText;
  @Input() text: INgxText;

  selectedImages: object;
  hasPreview = false;
  hasError = false;
  isLoading = false;
  _config: INgxUploadConfig = {
    fileSize: 2048,
    minWidth: 0,
    maxWidth: 0,
    minHeight: 0,
    maxHeight: 0,
    fileType: ['image/gif', 'image/jpeg', 'image/png'],
    quality: 0.8,
    url: '/dummyUrl'
  };
  _text: INgxText = {
    default: 'Drag and drop',
    _default: 'Drag and drop or click',
    button: 'Choose File',
    try_again: 'Try Again',
    replace: 'Drag and drop or click to replace',
    reset: 'Remove',
    error: 'Oops, something wrong happened.'
  };
  _errorTexts: INgxErrorText = {
    fileSize: 'The file size is too big ({{ value }} max).',
    minWidth: 'The image width is too small ({{ value }}}px min).',
    maxWidth: 'The image width is too big ({{ value }}}px max).',
    minHeight: 'The image height is too small ({{ value }}}px min).',
    maxHeight: 'The image height is too big ({{ value }}}px max).',
    imageFormat: 'The image format is not allowed ({{ value }} only).',
    fileType: 'The file type is not allowed.'
  };
  errors: any = [];
  file: any;
  files: any = [];
  mode = 'upload';
  onSelectEventData: any;
  compressedFiles: any[] = [];
  croppedFiles: any = [];
  uploadSuccess: boolean = false;
  uploadFail: boolean = false;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onReset: EventEmitter<any> = new EventEmitter();


  ngOnInit() {
    this.reset();
    this._text = Object.assign(this._text, this.text);
    this._errorTexts = Object.assign(this._errorTexts, this.errorTexts);
    this._config = Object.assign(this._config, this.config);
  }

  fileChangeListener(e: any) {
    // console.log('file change event', e);
    this.hasError = false;
    this.errors = [];
    if (!e.target.files.length) {
      this.reset();
      return false;
    }
    this.files = e.target.files;
    // console.log('files are', this.files);

    this.file = e.target.files[0];

    if (!this.validate()) {
      this.hasError = true;
      this.reset();
      return false;
    }

    this.fileName = this.file.name;
    this.onChange.emit(this.file);

    for (let i in this.files) {
      if (this.files.hasOwnProperty(i)) {
        if (this.files[i].type.split('/')[0] === 'image') {
          this.isLoading = true;
          const reader: FileReader = new FileReader();
          reader.onloadend = (ev: any) => {
            // console.log('File Reader onLoad event', ev);
            this.imgSrc = [...this.imgSrc, ev.target.result];
            this.selectedImages = this.imgSrc;
            // console.log('img src', this.imgSrc);
            this.fileName = this.file.name;
            this.hasPreview = true;
            this.isLoading = false;
            if (this._config.crop) {
              if (this.files.length === 1) {
                this.mode = 'crop';
              }
            } else {
              this._service.compress(this.imgSrc[i], this._config).then((res: any) => {
                this.compressedFiles = [...this.compressedFiles, res];
              })
                .catch((err) => {
                  this.onSelectEvent(this.imgSrc);
                  console.error('Compress failed', err);
                });
            }
          };
          reader.readAsDataURL(this.files[i]);
        }
      }
    }
    this.onSelectEvent(this.compressedFiles);
  }

  reset() {
    this.mode = 'upload';
    this.file = null;
    // this.imgSrc = '';
    this.imgSrc = [];
    this.selectedImages = [];
    this.fileName = '';
    this.files = [];
    this.uploadFail = false;
    this.uploadSuccess = false;
    this.compressedFiles = [];
    this.croppedFiles = [];
    this.hasPreview = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.onReset.emit();
  }

  validate() {
    this.errors = [];
    if (this._config.fileType.length !== 0 && this._config.fileType.indexOf(this.file.type) === -1) {
      this.errors = [...this.errors, this._errorTexts.fileType];
    }

    if (this._config.fileSize !== 0 && (this.file.size / 1024) > this._config.fileSize) {
      this.errors = [...this.errors, this._errorTexts.fileSize.replace('{{ value }}', this.sizeToByte(this._config.fileSize))];
    }

    if (this._config.minWidth !== 0 && this._config.minWidth >= this.file.width) {
      this.errors = [...this.errors, this._errorTexts.minWidth.replace('{{ value }}', this._config.minWidth.toString())];
    }

    if (this._config.maxWidth !== 0 && this._config.maxWidth <= this.file.width) {
      this.errors = [...this.errors, this._errorTexts.maxWidth.replace('{{ value }}', this._config.maxWidth.toString())];
    }

    if (this._config.minHeight !== 0 && this._config.minHeight >= this.file.height) {
      this.errors = [...this.errors, this._errorTexts.minHeight.replace('{{ value }}', this._config.minHeight.toString())];
    }

    if (this._config.maxHeight !== 0 && this._config.maxHeight <= this.file.height) {
      this.errors = [...this.errors, this._errorTexts.maxHeight.replace('{{ value }}', this._config.maxHeight.toString())];
    }

    return !this.errors.length;
  }

  sizeToByte(size: number): string {
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    while (size >= 1024) {
      size /= 1024;
      ++i;
    }
    return size.toFixed(1) + ' ' + units[i];
  }

  onSelectEvent(data: any) {


    if (this.mode === 'crop') {
      // this.croppedFiles = [...this.croppedFiles, data];
      // console.log('on select event data after crop', data);
      switch (typeof data) {
        case 'string':
          this.imgSrc = [data];
          this.selectedImages = this.imgSrc;
          this.croppedFiles = [data];
          // console.log('imgSrc is string', this.imgSrc);
          break;
        case 'object':
          this.imgSrc = data;
          this.selectedImages = this.imgSrc;
          this.croppedFiles = data;
          // console.log('imgSrc is object', this.imgSrc);
          break;
        default:
      }
      if (this.config.crop.length === 1) {
        this.compressedFiles = data;
      } else {
        this.compressedFiles = [...this.compressedFiles, data];
      }
      // console.log('compressed files ', this.compressedFiles);
    }
    this.onSelect.emit(data);
    this.onSelectEventData = data;
    // console.log('selected images', this.selectedImages);
    // console.log('on select event', data);
  }

  upload() {
    if (this.mode === 'crop') {
      this.croppedFiles.forEach(file => {
        this._service.upload(file, this.config.url)
          .subscribe(res => {
            this.uploadSuccess = true;
            setTimeout(() => {
              this.uploadSuccess = false;
            }, 4000);
            // console.log('Uploaded successfully');
          }, er => {
            this.reset();
            this.uploadFail = true;
            setTimeout(() => {
              this.uploadFail = false;
            }, 4000);
            // console.log('Upload Failed');
          });
      });
    } else {
      console.log(this.compressedFiles);
      this.compressedFiles.forEach(file => {
        this._service.upload(file, this.config.url)
          .subscribe(res => {
            this.uploadSuccess = true;
            setTimeout(() => {
              this.uploadSuccess = false;
            }, 4000);
            // console.log('Uploaded successfully');
          }, er => {
            this.reset();
            this.uploadFail = true;
            setTimeout(() => {
              this.uploadFail = false;
            }, 4000);
            // console.log('Upload Failed');
          });
      });
    }
  }

  ngOnDestroy() {
    this.reset();
  }

  delete(img: string) {
    this.imgSrc = this.imgSrc.filter(x => x !== img);
    this.selectedImages = this.imgSrc;
    if (this.mode === 'upload') {
      this.compressedFiles.filter(x => x !== img);
    }
    if (!this.imgSrc.length) {
      this.reset();
    }
  }

}
