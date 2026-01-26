import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/apis/general.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  constructor(private general : GeneralService){}

  articles : any = []
  ngOnInit(): void {
      this.general.articles()
      .subscribe((data : any)=>{
        this.articles = data
      })
  }
}
