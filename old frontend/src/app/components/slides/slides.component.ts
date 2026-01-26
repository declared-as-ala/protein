import { Component, Input, OnInit, Inject, PLATFORM_ID, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { storage } from 'src/app/apis/config';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css']
})
export class SlidesComponent implements OnInit, AfterViewInit {

  @Input() slides: any;
  data: any = [];
  screenwidth = 1000;
  storage = storage;

  @ViewChild('swiperEl') swiperEl!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenwidth = window.innerWidth;
    }
    this.applyResponsiveSlides();
  }

  ngAfterViewInit(): void {
    // Initialize Swiper after View is ready
    if (this.swiperEl && this.swiperEl.nativeElement.initialize) {
      this.swiperEl.nativeElement.initialize();
    }
  }

  @HostListener('window:resize')
  getScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.screenwidth = window.innerWidth;
      this.applyResponsiveSlides();
    }
  }

  applyResponsiveSlides() {
    if (!this.slides) return;

    if (this.screenwidth > 700) {
      this.data = this.slides.filter((s: any) => s.type === 'web');
    } else {
      this.data = this.slides.filter((s: any) => s.type === 'mobile');
    }
  }
}
