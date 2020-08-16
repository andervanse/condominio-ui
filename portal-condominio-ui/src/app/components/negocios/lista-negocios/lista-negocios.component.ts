import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/services/animation';

@Component({
  selector: 'app-lista-negocios',
  templateUrl: './lista-negocios.component.html',
  styleUrls: ['./lista-negocios.component.css'],
  animations: [fadeInOutAnimation]
})
export class ListaNegociosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
