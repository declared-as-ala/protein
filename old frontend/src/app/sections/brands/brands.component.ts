import { AfterViewInit, Component, OnInit , Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { storage } from 'src/app/apis/config';
import { GeneralService } from 'src/app/apis/general.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit , AfterViewInit {
  constructor(private general : GeneralService , private sanitizer: DomSanitizer
    ){

  }
  @Input() brands : any = []
  storage = storage

  IsVisible = false
  ngOnInit(): void {



  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.IsVisible= true
    }, 1000);
  }
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:true,
    autoplayTimeout:1000,
    autoplayHoverPause:true,
    dots: false,
    navSpeed: 200,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 4
      },
      740: {
        items: 5
      },
      940: {
        items: 6
      },
      1500:{
        items : 6
      },
      1900:{
        items : 6
      }, 2200:{
        items : 6
      }
    },
    nav: true
  }
}
