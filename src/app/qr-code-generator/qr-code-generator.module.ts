import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrCodeGeneratorPageRoutingModule } from './qr-code-generator-routing.module';

import { QrCodeGeneratorPage } from './qr-code-generator.page';
import { SmsQrCodeComponent } from './sms-qr-code/sms-qr-code.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ContactComponent } from './contact/contact.component';
import { CreateUrlQrCodeComponent } from './create-url-qr-code/create-url-qr-code.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    QrCodeGeneratorPageRoutingModule,
    NgxQRCodeModule,
  ],
  declarations: [
    QrCodeGeneratorPage,
    SmsQrCodeComponent,
    ContactComponent,
    CreateUrlQrCodeComponent,
  ]
})
export class QrCodeGeneratorPageModule { }
