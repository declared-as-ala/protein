import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.css'],
})
export class SocialShareComponent {



  @Input() description : any;

  url : any
  constructor(private router : Router){
    this.url = this.router.url;
  }
}
