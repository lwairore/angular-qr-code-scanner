import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrCodeGeneratorPage } from './qr-code-generator.page';
import { SmsQrCodeComponent } from './sms-qr-code/sms-qr-code.component';

const routes: Routes = [
  {
    path: '',
    component: QrCodeGeneratorPage,
    children: [
      {
        path: 'sms',
        component: SmsQrCodeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrCodeGeneratorPageRoutingModule { }
