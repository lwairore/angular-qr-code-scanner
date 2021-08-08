import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-sms-qr-code',
  templateUrl: './sms-qr-code.component.html',
  styleUrls: ['./sms-qr-code.component.scss'],
})
export class SmsQrCodeComponent implements OnInit, OnDestroy {
  smsDetailsFormGroup: FormGroup | undefined;
  isSubmitted = false;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  showQrCode = false;
  valueForQrCode: string | undefined;
  private _downloadQrCodeImageBlob: string[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  ngOnDestroy() { }

  ngOnInit() {
    this._buildSmsDetailsFormGroup();
  }

  private _buildSmsDetailsFormGroup(): void {
    this.smsDetailsFormGroup = this._formBuilder.group({
      phoneNumber: ['', Validators.compose([
        Validators.maxLength(20),
        Validators.pattern('^[0-9]+$')
      ])],
      message: ['', Validators.maxLength(120)]
    });
  }

  get errorControl() {
    return this.smsDetailsFormGroup?.controls;
  }

  showHiddenSmsDetailsForm(): void {
    this.valueForQrCode = undefined;
    this.showQrCode = false;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.smsDetailsFormGroup?.invalid ||
      (!this.smsDetailsFormGroup?.get('phoneNumber')?.value?.trim()?.length && !this.smsDetailsFormGroup?.get('message')?.value?.trim()?.length)) {
      console.log('Please provide all the required values!')
      return false;
    }

    this.valueForQrCode = 'SMSTO:' + this.smsDetailsFormGroup?.value?.phoneNumber.trim() +
      ':' + this.smsDetailsFormGroup?.value?.message.trim();

    this.showQrCode = true;
  }

  downloadQRCode() {
    const fileNameToDownload = 'image_qrcode';
    const coolQRCodeElement = this._document.getElementsByClassName('coolQRCode');
    if (!coolQRCodeElement.length) { return; }

    const base64Img = (coolQRCodeElement[0].children[0] as HTMLImageElement)['src'];
    fetch(base64Img)
      .then(res => res.blob())
      .then((blob) => {
        // IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileNameToDownload);
        } else { // Chrome
          const url = window.URL.createObjectURL(blob);
          this._downloadQrCodeImageBlob.push(url);
          const link = this._document.createElement('a');
          link.href = url;
          link.download = fileNameToDownload;
          link.click();
        }
      })
  }

}
