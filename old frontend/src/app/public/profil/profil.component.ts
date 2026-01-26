import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/apis/auth.service';
import { storage } from 'src/app/apis/config';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {




  constructor(private auth : AuthService , private route : ActivatedRoute){

  }

  id = this.route.snapshot.params['user_id']

  profil : any
  storage = storage
  ngOnInit(): void {
    this.auth.profil(this.id)
    .subscribe((data)=>{
      this.profil = data
    })
  }
}
