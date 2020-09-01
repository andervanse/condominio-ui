import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInOutAnimation } from 'src/app/services/animation';
import { AvisoService } from 'src/app/services/aviso.service';
import { Aviso } from 'src/app/models/aviso.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lista-avisos',
  templateUrl: './lista-avisos.component.html',
  styleUrls: ['./lista-avisos.component.css'],
  animations: [fadeInOutAnimation]
})
export class ListaAvisosComponent implements OnInit {
  loading: boolean;
  avisos: Aviso[];
  avisoIdSelecionado: number;
  @ViewChild('dialogModal') dialogModal: ElementRef;
  
  constructor(
    private avisoService: AvisoService,    
    private authService: AuthService) { }
  
  ngOnInit() {
    this.loading = true;   
    this.avisoService.obterAvisos().subscribe((resp) => {
      this.loading = false;
      this.avisos = resp;
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
    this.avisoIdSelecionado = avaliacaoFisicaId;
    this.dialogModal.nativeElement.classList.toggle('is-active');
  }

  onExcluirClick() {
    if (this.avisoIdSelecionado) {
      this.avisoService.excluirAviso(this.avisoIdSelecionado).subscribe((resp) => {
        this.avisos = resp;
        this.dialogModal.nativeElement.classList.toggle('is-active');
      }, (error) => {
        console.log(error);
        this.dialogModal.nativeElement.classList.toggle('is-active');
      });
    }
  }

}
