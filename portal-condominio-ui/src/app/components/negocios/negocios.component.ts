import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/services/animation';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.css'],
  animations: [fadeInOutAnimation]
})
export class NegociosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }  
}
