import { Component, Inject, OnInit, Optional } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { Response } from 'express'
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    @Optional() @Inject(RESPONSE) private response: Response
  ) { }


  ngOnInit() {
    // Return 404 when running server side
    if (this.response) {
      this.response.status(404);
    }
  }
}
