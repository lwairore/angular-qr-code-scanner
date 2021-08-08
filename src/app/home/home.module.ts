import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { QrCodeGeneratorComponent } from '../qr-code-generator/qr-code-generator.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxQRCodeModule,
  ],
  declarations: [
    HomePage,
    QrCodeGeneratorComponent,
  ]
})
export class HomePageModule { }
