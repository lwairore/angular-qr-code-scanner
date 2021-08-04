import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private _onlineEventUnlistener: (() => void) | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _renderer2: Renderer2) { }

  ngOnInit() {
    this._onlineEventUnlistener = this._renderer2.listen('window', 'online', () =>
      this._displayNetworkStatus());
  }
}
