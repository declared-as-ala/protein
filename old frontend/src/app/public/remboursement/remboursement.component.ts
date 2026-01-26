import { Component } from '@angular/core';
import { GeneralService } from 'src/app/apis/general.service';

@Component({
  selector: 'app-remboursement',
  templateUrl: './remboursement.component.html',
  styleUrls: ['./remboursement.component.css']
})
export class RemboursementComponent {
  coordonnees: any = JSON.parse(localStorage.getItem('coordonnees') || '{}');

  constructor(private general : GeneralService){}

  ngOnInit(): void {
    this.general.coordonnees()
    .subscribe((data : any)=>this.coordonnees = data)
  }
}
