import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/services/animation';
import { Negocio } from 'src/app/models/negocio.model';
import { AuthService } from 'src/app/services/auth.service';
import { NegocioService } from 'src/app/services/negocio.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-lista-negocios',
  templateUrl: './lista-negocios.component.html',
  styleUrls: ['./lista-negocios.component.css'],
  animations: [fadeInOutAnimation]
})
export class ListaNegociosComponent implements OnInit {

  loading: boolean;
  servicos: Negocio[];
  oportunidades: Negocio[];
  negocioIdSelecionado: number;
  @ViewChild('dialogModal') dialogModal: ElementRef;
  
  constructor(
    private negocioService: NegocioService,    
    private authService :AuthService) { }
  
  ngOnInit() {
    this.loading = true;   
    this.negocioService.obterNegocios().subscribe((resp) => {
      this.loading = false;
      this.servicos = resp.filter(n => n.tipo == "0");
      this.oportunidades = resp.filter(n => n.tipo == "1");
    }, (error) => {
      this.loading = false;
      console.error(error.message);
    });
  }

  isAdmin() :boolean {
    return this.authService.isAdmin();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }  

  onToggleModal(avaliacaoFisicaId: number) {
    this.negocioIdSelecionado = avaliacaoFisicaId;
    this.dialogModal.nativeElement.classList.toggle('is-active');
  }

  onExcluirClick() {
    if (this.negocioIdSelecionado) {
      this.negocioService.excluirNegocio(this.negocioIdSelecionado).subscribe((resp) => {
        this.dialogModal.nativeElement.classList.toggle('is-active');
      }, (error) => {
        this.dialogModal.nativeElement.classList.toggle('is-active');
      });
    }
  }
}
