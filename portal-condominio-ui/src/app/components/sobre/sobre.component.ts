import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/services/animation';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css'],
  animations: [fadeInOutAnimation]
})
export class SobreComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
