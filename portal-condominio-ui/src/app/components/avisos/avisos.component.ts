import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInOutAnimation } from 'src/app/services/animation';

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css'],
  animations: [fadeInOutAnimation]
})
export class AvisosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }  

}
