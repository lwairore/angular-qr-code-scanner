import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sms-qr-code',
  templateUrl: './sms-qr-code.component.html',
  styleUrls: ['./sms-qr-code.component.scss'],
})
export class SmsQrCodeComponent implements OnInit {
  smsDetailsFormGroup: FormGroup | undefined;
  isSubmitted = false;

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._buildSmsDetailsFormGroup();
  }

  private _buildSmsDetailsFormGroup(): void {
    this.smsDetailsFormGroup = this._formBuilder.group({
      phoneNumber: ['', Validators.maxLength(20)],
      message: ['', Validators.maxLength(120)]
    });
  }

}
