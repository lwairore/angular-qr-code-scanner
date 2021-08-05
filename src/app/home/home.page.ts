import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import jsQR from 'jsqr';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy, OnInit {
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

  imgObjectURLs: string[] = [];

  failedToReadQRCode = false;

  private _onlineEventUnlistener: (() => void) | undefined;
  private _offlineEventUnlistener: (() => void) | undefined;
  private _beforeinstallpromptUnlistener: (() => void) | undefined;
  private _appinstalledUnlistener: (() => void) | undefined;

  promptEvent: any;
  appIsOnline: boolean | undefined;

  constructor(
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _plt: Platform,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private _alertCtrl: AlertController,
    private readonly _updates: SwUpdate,
    private _dom: DomSanitizer
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && (window.navigator as any)?.standalone;
    if (this._plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }

    this._updates.available.subscribe(event => {
      this.showAppUpdateAlert();
    });
  }

  ngOnDestroy() {
    this._revokeObjectURLs();
    if (this._onlineEventUnlistener) {
      this._onlineEventUnlistener();
    }

    if (this._offlineEventUnlistener) {
      this._offlineEventUnlistener();
    }

    if (this._beforeinstallpromptUnlistener) {
      this._beforeinstallpromptUnlistener();
    }

    if (this._appinstalledUnlistener) {
      this._appinstalledUnlistener();
    }
  }

  ngOnInit() {
    this.appIsOnline = navigator?.onLine;
    this._onlineEventUnlistener = this._renderer2.listen('window', 'online', () =>
      this._displayNetworkStatus());

    this._offlineEventUnlistener = this._renderer2.listen('window', 'offline', () =>
      this._displayNetworkStatus());

    this._beforeinstallpromptUnlistener = this._renderer2
      .listen('window', 'beforeinstallprompt', (event) => this.promptEvent = event);

    this._appinstalledUnlistener = this._renderer2
      .listen('window', 'appinstalled', (event) => this.promptEvent = undefined);
  }

  ngAfterViewInit() {
    this._canvasElement = this._canvas?.nativeElement;
    this._canvasContext = this._canvasElement.getContext('2d');
    this._videoElement = this._video?.nativeElement;
  }

  showAppUpdateAlert() {
    const title = 'Updates are available';
    const message = 'New updates are available for QR Code Scanner.';
    this.presentAlert(title, message);
  }

  async presentAlert(title: string, msg: string) {
    const alert = await this._alertCtrl.create({
      header: title,
      message: msg,
      buttons: [
        {
          text: 'Update',
          handler: () => {
            this._document.location.reload();
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  installPwa(): void {
    this.promptEvent?.prompt();
  }

  private _displayNetworkStatus() {
    if (navigator.onLine) {
      this._renderer2.setStyle(
        this._document.body, 'filter', '');
      this.appIsOnline = true;
    } else {
      this._renderer2.setStyle(
        this._document.body, 'filter', 'grayscale(1)');
      this.appIsOnline = false;
    }
  }

  reset() {
    this.scanResult = null;
    this.stopScan();
  }

  stopScan() {
    this.scanActive = false;
    this._resetFailedToReadQRCode();
    const stream = this._videoElement?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(function (track: any) {
        track?.stop();
      });

      this._videoElement.srcObject = null;
    }
  }

  async startScan() {
    this._resetFailedToReadQRCode();
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

  convertCanvasToImage(imagedata: any) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx?.putImageData(imagedata, 0, 0);

    const src = URL.createObjectURL((this.dataURItoBlob(canvas.toDataURL())));

    this.imgObjectURLs.push(src);

    return src;
  }

  dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

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

      if (code && code?.data?.trim()?.length) {
        this._resetFailedToReadQRCode();
        this.stopScan();
        this.scanActive = false;
        this.scanResult = code.data;
        this._causeVibration();
        this.convertCanvasToImage(imageData);
      } else {
        this._notifyUserFailedToReadQRCode();
        if (this.scanActive) {
          requestAnimationFrame(this._scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this._scan.bind(this));
    }
  }

  private _notifyUserFailedToReadQRCode() {
    this.failedToReadQRCode = true;
    this.scanResult = null;
  }

  captureImage() {
    this._fileinput?.nativeElement.click();
  }

  private _resetFailedToReadQRCode() {
    this.failedToReadQRCode = false;
  }

  handleFile(event: any) {
    let file: any = <HTMLInputEvent>event.target.files
    if (!file?.length) { return; }
    file = file[0];

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

      if (code && code?.data?.trim()?.length) {
        this._resetFailedToReadQRCode();
        this.stopScan();
        this.scanResult = code.data;
        this._causeVibration()
      } else {
        this._notifyUserFailedToReadQRCode();
      }
    };
    this._revokeObjectURLs();
    img.src = URL.createObjectURL(file);
    this.imgObjectURLs.push(img.src);
  }

  private _revokeObjectURLs() {
    this.imgObjectURLs.forEach(url =>
      URL.revokeObjectURL(url));
  }

  readQRCodeIsURL(qrCodeValue: string): boolean {
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    return regex.test(qrCodeValue);
  }

  sanitizeImgSrcURL(url: string): SafeUrl {
    return this._dom.bypassSecurityTrustUrl(url);
  }

  canShare(): boolean {
    const navigator = window.navigator as any;
    return navigator?.share;
  }

  sharePropertyUsingTheWebShareApi() {
    const navigator = window.navigator as any;

    if (navigator.share) {
      let shareOptions: any = undefined;
      if (this.readQRCodeIsURL(this.scanResult)) {
        shareOptions = {
          url: this.scanResult
        };
      } else {
        if (this.scanResult?.trim()?.length) {
          shareOptions['title'] = this.scanResult;
        }
      }

      if (!shareOptions) { return; }
      navigator.share(shareOptions)
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch((err: { message: any; }) => {
          console.log(`Couldn't share because of`, err.message);
        });
    } else {
      console.log('web share not supported');
    }
  }
}
