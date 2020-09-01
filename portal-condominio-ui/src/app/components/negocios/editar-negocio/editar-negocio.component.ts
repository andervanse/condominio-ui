import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Negocio } from 'src/app/models/negocio.model';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NegocioService } from 'src/app/services/negocio.service';
import { isNullOrUndefined } from 'util';
import { fadeInOutAnimation } from 'src/app/services/animation';
import { ResizeImageService } from 'src/app/services/resize-image.service';

@Component({
  selector: 'app-editar-negocio',
  templateUrl: './editar-negocio.component.html',
  styleUrls: ['./editar-negocio.component.css'],
  animations: [fadeInOutAnimation]
})
export class EditarNegocioComponent implements OnInit {

  usuarioId: number;
  negocioId: number;
  negocio: Negocio;
  mensagemErro: string;
  tipo: string;
  loading: boolean;
  uploadedFile: any;
  imagemUpload: any;
  tipos: any = ['Servico', 'Oportunidade']

  @ViewChild('negocioForm') form: FormGroup;
  @ViewChild('btnSalvar') btnSalvar: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private negocioService: NegocioService,
    private resizeImageService: ResizeImageService) { }

    ngOnInit() {
      this.mensagemErro = '';
  
      this.route.params.subscribe((params) => {
        let usr = this.authService.obterUsuario();

        if (!usr) {
          this.router.navigate(['home']);
        }

        this.usuarioId = usr.id;
  
        if (params['negocio']) {
          this.negocioId = +params['negocio'];
          this.loading = true;

          if (this.negocioId > 0) {
            this.negocioService.obterNegocio(this.negocioId).subscribe((negocio) => {
              this.negocio = negocio;
    
              setTimeout(() => {
                this.setFormFields();
                this.loading = false;
              }, (500));
            }, (error) => { 
              this.loading = false;
              if (error.status == 404) {
                
                setTimeout(() => {
                  this.setFormFields();
                }, (500));
              }
            });
          } else {
            this.negocio = new Negocio();
            this.loading = false;
          }
        }
      });
    }

    private novoNegocio(usuarioId: number) :Negocio {
      let negocio = new Negocio();
      negocio.id = null;
      negocio.usuarioId = usuarioId;
      negocio.ordem = null;
      negocio.urlImagem = [];
      return negocio;
    } 

    private setFormFields() {

      if (isNullOrUndefined(this.negocio)) {
        this.negocio = this.novoNegocio(this.usuarioId);
      }
  
      if (this.negocio) {
        if (this.negocio.urlImagem)
          this.imagemUpload = this.negocio.urlImagem[0];
      }
  
      if (!isNullOrUndefined(this.form)) {
        this.form.setValue({
          id: this.negocio.id || 0,
          usuarioId: this.negocio.usuarioId || '',
          ordem: this.negocio.ordem || '',
          titulo: this.negocio.titulo || '',
          texto: this.negocio.texto || '',
          tipo: this.tipos[this.negocio.tipo]
        });
      } 
    }


    onNotificationClick() {
      this.mensagemErro = '';
    }

    onSubmit() {
      if (this.form.valid) {
  
        this.btnSalvar.nativeElement.classList.add('is-loading');
        this.negocio.id = this.form.value.id || 0;
        this.negocio.usuarioId = this.usuarioId;
        this.negocio.ordem = this.form.value.ordem;
        this.negocio.titulo = this.form.value.titulo;
        this.negocio.texto = this.form.value.texto;
        this.negocio.tipo = this.tipos.findIndex(t => t == this.form.value.tipo);
        this.loading = true;
  
        if (this.uploadedFile) {
            const formData = new FormData();
            formData.append('image', this.uploadedFile);
            this.negocioService.uploadImagem(formData).subscribe((resp) => {
            this.negocio.urlImagem = []
            this.negocio.urlImagem.push(resp.urlLocation);
  
            this.salvarNegocio(this.negocio);
               this.btnSalvar.nativeElement.classList.remove('is-loading');
               this.loading = false;
            }, (error) => {
               this.loading = false;
               console.error(error.message);
               this.mensagemErro = error.message;
               this.btnSalvar.nativeElement.classList.remove('is-loading');
            });
        } else {
          this.salvarNegocio(this.negocio);
          this.btnSalvar.nativeElement.classList.remove('is-loading');
        }
      }
    } 
    
  imageUpload(e) {

    if (e.target.files[0]) {      
      this.uploadedFile = e.target.files[0];

      this.resizeImageService
          .resize( { maxSize: 512, file: this.uploadedFile } )
          .then((result) => {
            this.imagemUpload = result;
          });
    }
  }

  apagarImagem() {
    this.imagemUpload = null;
    this.negocio.urlImagem[0] = null;
  }
    
  private salvarNegocio(negocio: Negocio) {
    this.negocioService.salvarNegocio(negocio).subscribe((resp) => {
      this.mensagemErro = '';
      this.router.navigate(['../negocios']);
      this.loading = false;
    }, (resp) => {
      this.loading = false;
      this.mensagemErro = 'Falha ao salvar';
      console.error(resp.message);
    });
  }
}
