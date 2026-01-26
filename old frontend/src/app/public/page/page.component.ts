import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/apis/general.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit{
  coordonnees: any = JSON.parse(localStorage.getItem('coordonnees') || '{}');

  constructor(private route : ActivatedRoute , private general : GeneralService ,  private sanitizer: DomSanitizer){}

  page : any;
  slug  = this.route.snapshot.params['slug']
map : any = ''

faqs : any = []
  ngOnInit(): void {
    if(this.slug == 'qui-sommes-nous'){
      this.map = this.sanitizer.bypassSecurityTrustHtml(this.coordonnees.gelocalisation);

    }
    this.general.page(this.slug)
    .subscribe((data)=>this.page = data)

    this.general.faqs()
    .subscribe((data)=>this.faqs = data)


  }

}
