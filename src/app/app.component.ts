import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _onlineEventUnlistener: (() => void) | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _renderer2: Renderer2) { }

  ngOnDestroy() { }

  ngOnInit() {
    this._onlineEventUnlistener = this._renderer2.listen('window', 'online', () =>
      this._displayNetworkStatus());
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
