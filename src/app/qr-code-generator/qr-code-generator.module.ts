import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrCodeGeneratorPageRoutingModule } from './qr-code-generator-routing.module';

import { QrCodeGeneratorPage } from './qr-code-generator.page';
import { SmsQrCodeComponent } from './sms-qr-code/sms-qr-code.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    QrCodeGeneratorPageRoutingModule
  ],
  declarations: [
    QrCodeGeneratorPage,
    SmsQrCodeComponent,
  ]
})
export class QrCodeGeneratorPageModule { }
