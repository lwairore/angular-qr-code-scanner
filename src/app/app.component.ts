import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _onlineEventUnlistener: (() => void) | undefined;
  private _offlineEventUnlistener: (() => void) | undefined;
  private _beforeinstallpromptUnlistener: (() => void) | undefined;
  private _appinstalledUnlistener: (() => void) | undefined;

  promptEvent: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _renderer2: Renderer2) { }

  ngOnDestroy() {
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
    this._onlineEventUnlistener = this._renderer2.listen('window', 'online', () =>
      this._displayNetworkStatus());

    this._offlineEventUnlistener = this._renderer2.listen('window', 'offline', () =>
      this._displayNetworkStatus());

    this._beforeinstallpromptUnlistener = this._renderer2
      .listen('window', 'beforeinstallprompt', (event) => this.promptEvent = event);

    this._appinstalledUnlistener = this._renderer2
      .listen('window', 'appinstalled', (event) => this.promptEvent = undefined);
  }

  private _displayNetworkStatus() {
    if (navigator.onLine) {
      this._renderer2.setStyle(
        this.document.body, 'filter', '');
    } else {
      this._renderer2.setStyle(
        this.document.body, 'filter', 'grayscale(1)');
    }
  }
}
