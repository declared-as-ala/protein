import { Component, Input, OnInit } from '@angular/core';
import { storage } from 'src/app/apis/config';
import { GeneralService } from 'src/app/apis/general.service';

@Component({
  selector: 'app-vente-flash',
  templateUrl: './vente-flash.component.html',
  styleUrls: ['./vente-flash.component.css'],
})
export class VenteFlashComponent implements OnInit {
  constructor(private general: GeneralService) {}

  products: any = [];
  ngOnInit(): void {
    this.general.ventes_flash().subscribe((data: any) => {
      this.products = data;


    });
  }
}
