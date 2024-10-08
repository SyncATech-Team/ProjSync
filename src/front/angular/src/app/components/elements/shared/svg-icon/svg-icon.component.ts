import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.css'
})
export class SvgIconComponent {
  @Input() name!: string;
  @Input() size = 16;
  @Input() fill = "currentColor"

  constructor() {}

  get iconUrl() {
    return `${window.location.href}#${this.name}`;
  }
}
