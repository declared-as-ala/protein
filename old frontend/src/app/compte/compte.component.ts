import { Component } from '@angular/core';
import { storage } from '../apis/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent {


  now = (new Date()).getHours()
  constructor(private router : Router){
    if(!localStorage.getItem('token')){
      this.router.navigate(['/login'])
    }
  }
  user_name = localStorage.getItem('name')

  logout(){
    localStorage.clear();
    this.router.navigate(['/'])

  }
}
