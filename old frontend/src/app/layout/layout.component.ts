import { Component } from '@angular/core';
import { GeneralService } from '../apis/general.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent  {
  coordonnees: any = JSON.parse(localStorage.getItem('coordonnees') || '{}');
  constructor(private general: GeneralService) {}


  ngOnInit(): void {
    this.general.coordonnees().subscribe((data: any) => {
      this.coordonnees = data;
      localStorage.setItem('coordonnees', JSON.stringify(this.coordonnees));


    });
  }
}
