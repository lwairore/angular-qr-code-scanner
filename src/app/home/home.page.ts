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

  private _imgObjectURLs: string[] = [];


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

  stopScan() {
    this.scanActive = false;
  }

  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this._videoElement.srcObject = stream;
    // Required for Safari
    this._videoElement.setAttribute('playsinline', true);

    this._loading = await this._loadingCtrl.create({});
    await this._loading.present();

    this._videoElement?.play();
    requestAnimationFrame(this._scan.bind(this));
  }

  private _causeVibration() {
    let newVariable: any;
    newVariable = window?.navigator;

    newVariable.vibrate = navigator.vibrate ||
      newVariable.webkitVibrate ||
      newVariable.mozVibrate ||
      newVariable.msVibrate;

    if (newVariable.vibrate) {
      // single vibration. duration of vibration in ms
      newVariable.vibrate(100);
    }
  }

  private async _scan() {
    if (this._videoElement.readyState === this._videoElement.HAVE_ENOUGH_DATA) {
      if (this._loading) {
        await this._loading.dismiss();
        this._loading = null;
        this.scanActive = true;
      }

      this._canvasElement.height = this._videoElement.videoHeight;
      this._canvasElement.width = this._videoElement.videoWidth;

      this._canvasContext.drawImage(
        this._videoElement,
        0,
        0,
        this._canvasElement.width,
        this._canvasElement.height
      );
      const imageData = this._canvasContext.getImageData(
        0,
        0,
        this._canvasElement.width,
        this._canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this._causeVibration();
        this._showQrToast();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this._scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this._scan.bind(this));
    }
  }

  captureImage() {
    this._fileinput?.nativeElement.click();
  }

  handleFile(files: FileList) {
    const file = files.item(0);

    var img = new Image();
    img.onload = () => {
      this._canvasContext.drawImage(img, 0, 0, this._canvasElement.width, this._canvasElement.height);
      const imageData = this._canvasContext.getImageData(
        0,
        0,
        this._canvasElement.width,
        this._canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanResult = code.data;
        this._causeVibration()
        this._showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }
}
