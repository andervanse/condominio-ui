import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChild('navBarBurger') navBarBurger :ElementRef;
  @ViewChild('navBarMenu') navBarMenu :ElementRef;
  
  constructor() { }

  ngOnInit() {
  }

  onNavBarClick() {
    this.navBarBurger.nativeElement.classList.toggle('is-active');
    this.navBarMenu.nativeElement.classList.toggle('is-active');
  }
}
