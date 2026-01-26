import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/apis/general.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit{

  coordonnees: any = JSON.parse(localStorage.getItem('coordonnees') || '{}');

  constructor(private general : GeneralService){}

  ngOnInit(): void {
    this.general.coordonnees()
    .subscribe((data : any)=>this.coordonnees = data)
  }

}
