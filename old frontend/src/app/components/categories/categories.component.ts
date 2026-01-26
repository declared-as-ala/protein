import { Component, Input, OnInit } from '@angular/core';
import { storage } from 'src/app/apis/config';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input() categories : any;
  storage  = storage


  ngOnInit(): void {

  }
}
