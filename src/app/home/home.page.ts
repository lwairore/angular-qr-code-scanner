import { Component, ElementRef, ViewChild } from '@angular/core';
import jsQR from 'jsqr';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('video', { static: false })
  private _video: ElementRef | undefined;

  constructor() { }

}
