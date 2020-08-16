import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Negocio } from 'src/app/models/negocio.model';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NegocioService } from 'src/app/services/negocio.service';
import { isNullOrUndefined } from 'util';
import { fadeInOutAnimation } from 'src/app/services/animation';

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
  loading: boolean;
  uploadedFile: any;
  imagemUpload: any;
  tipos: any = ['Servico', 'Oportunidade']

  @ViewChild('avisoForm') postagemForm: FormGroup;
  @ViewChild('btnSalvar') btnSalvar: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private negocioService: NegocioService) { }

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

    private setFormFields() {

      if (isNullOrUndefined(this.negocio)) {
        this.negocio = this.negocioService.novaPostagem(this.usuarioId);
      }
  
      if (this.negocio) {
        if (this.negocio.urlsImagem)
          this.imagemUpload = this.negocio.urlsImagem[0];
      }
  
      if (!isNullOrUndefined(this.postagemForm)) {
        this.postagemForm.setValue({
          id: this.negocio.id || 0,
          usuarioId: this.negocio.usuarioId || '',
          ordem: this.negocio.ordem || '',
          titulo: this.negocio.titulo || '',
          texto: this.negocio.texto || '',
          tipo: this.negocio.tipo || ''
        });
      } 
    }

    changeTipo(e) {
      this.postagemForm.controls['tipo'].setValue(e.target.value, {
        onlySelf: true
      })
    }

    onNotificationClick() {
      this.mensagemErro = '';
    }

    onSubmit() {
      if (this.postagemForm.valid) {
  
        this.btnSalvar.nativeElement.classList.add('is-loading');
        this.negocio.id = this.postagemForm.value.id || 0;
        this.negocio.usuarioId = this.usuarioId;
        this.negocio.ordem = this.postagemForm.value.ordem;
        this.negocio.titulo = this.postagemForm.value.titulo;
        this.negocio.texto = this.postagemForm.value.texto;
        this.loading = true;
  
        if (this.uploadedFile) {
          const formData = new FormData();
          formData.append('image', this.uploadedFile);
          this.negocioService.uploadImagem(formData).subscribe((resp) => {
            this.negocio.urlsImagem.push(resp.urlLocation);
  
            this.salvarAviso(this.negocio);
            this.btnSalvar.nativeElement.classList.remove('is-loading');
            this.loading = false;
          }, (error) => {
            this.loading = false;
            console.error(error.message);
            this.mensagemErro = error.message;
            this.btnSalvar.nativeElement.classList.remove('is-loading');
          });
        } else {
          this.salvarAviso(this.negocio);
          this.btnSalvar.nativeElement.classList.remove('is-loading');
        }
      }
    } 
    
  imageUpload(e) {
    if (e.target.files[0]) {
      let reader = new FileReader();
      this.uploadedFile = e.target.files[0];
  
      reader.onloadend = () => {
        this.imagemUpload = reader.result;
      }
  
      reader.readAsDataURL(this.uploadedFile);
    }
  }

  apagarImagem() {
    this.imagemUpload = null;
    this.negocio.urlsImagem[0] = null;
  }
    
  private salvarAviso(negocio: Negocio) {
    this.negocioService.salvarNegocio(negocio).subscribe((resp) => {
      this.mensagemErro = '';
      this.router.navigate(['../home']);
      this.loading = false;
    }, (resp) => {
      this.loading = false;
      this.mensagemErro = 'Falha ao salvar';
      console.error(resp.message);
    });
  }
}
