import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sms-qr-code',
  templateUrl: './sms-qr-code.component.html',
  styleUrls: ['./sms-qr-code.component.scss'],
})
export class SmsQrCodeComponent implements OnInit {
  smsDetailsFormGroup: FormGroup | undefined;

  constructor() { }

  ngOnInit() { }

}
