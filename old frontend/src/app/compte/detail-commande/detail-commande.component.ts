import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { CommandeService } from 'src/app/apis/commande.service';
import { GeneralService } from 'src/app/apis/general.service';

@Component({
  selector: 'app-detail-commande',
  templateUrl: './detail-commande.component.html',
  styleUrls: ['./detail-commande.component.css']
})
export class DetailCommandeComponent implements OnInit {

  constructor(private router : Router , private route : ActivatedRoute , private api : CommandeService){}
  id = this.route.snapshot.params['id']

  commande : any
  details : any
    ngOnInit(): void {
      if(!this.id){
        this.router.navigate(['/'])
      }

      localStorage.removeItem('last_checkout')


      this.api.details_commande(this.id)
      .subscribe((data : any)=>{

        this.commande = data.facture;
        this.details = data.details_facture


      })
    }

}
