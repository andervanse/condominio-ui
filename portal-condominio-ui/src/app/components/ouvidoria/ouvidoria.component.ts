import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/services/animation';

@Component({
  selector: 'app-ouvidoria',
  templateUrl: './ouvidoria.component.html',
  styleUrls: ['./ouvidoria.component.css'],
  animations: [fadeInOutAnimation]
})
export class OuvidoriaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
