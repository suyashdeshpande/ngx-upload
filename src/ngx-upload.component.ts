import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'ngx-upload',
  templateUrl: 'ngx-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxUploadComponent),
      multi: true,
    }
  ]
})

export class NgxUploadComponent implements ControlValueAccessor {

  images: string[] = [];
  isDisabled = false;

  private onChange = (_: any) => {
  };
  private onTouched = (_: any) => {
  };

  constructor() {
  }


  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  writeValue(value: any): void {
    switch (typeof value) {
      case 'string':
        this.images = [value];
        break;
      case 'object':
        this.images = value instanceof Array ? [...value.filter(val => typeof val === 'string')] : [];
        break;
    }
  }
}
