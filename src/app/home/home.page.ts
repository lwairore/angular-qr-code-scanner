import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import jsQR from 'jsqr';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('video', { static: false })
  private _video: ElementRef | undefined;
  @ViewChild('canvas', { static: false })
  private _canvas: ElementRef | undefined;
  @ViewChild('fileinput', { static: false })
  private _fileinput: ElementRef | undefined;

  private _canvasElement: any;
  private _videoElement: any;
  private _canvasContext: any;
  scanActive = false;
  scanResult: any;
  private _loading: HTMLIonLoadingElement | null = null;


  constructor(
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _plt: Platform
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && (window.navigator as any)?.standalone;
    if (this._plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }

  ngAfterViewInit() {
    this._canvasElement = this._canvas?.nativeElement;
    this._canvasContext = this._canvasElement.getContext('2d');
    this._videoElement = this._video?.nativeElement;
  }

  // Helper functions
  private async _showQrToast() {
    const toast = await this._toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open((this.scanResult as unknown as string | undefined), '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
  }

  reset() {
    this.scanResult = null;
  }


}
