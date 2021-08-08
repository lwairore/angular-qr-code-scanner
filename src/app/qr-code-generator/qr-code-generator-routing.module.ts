import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrCodeGeneratorPage } from './qr-code-generator.page';

const routes: Routes = [
  {
    path: '',
    component: QrCodeGeneratorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrCodeGeneratorPageRoutingModule {}
