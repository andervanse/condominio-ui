import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Aviso } from 'src/app/models/aviso.model';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { AvisoService } from 'src/app/services/aviso.service';
import { fadeInOutAnimation } from 'src/app/services/animation';

@Component({
  selector: 'app-editar-aviso',
  templateUrl: './editar-aviso.component.html',
  styleUrls: ['./editar-aviso.component.css'],
  animations: [fadeInOutAnimation]
})
export class EditarAvisoComponent implements OnInit {

  usuarioId: number;
  avisoId: number;
  aviso: Aviso;
  mensagemErro: string;
  loading: boolean;
  uploadedFile: any;
  imagemUpload: any;
  @ViewChild('avisoForm') postagemForm: FormGroup;
  @ViewChild('btnSalvar') btnSalvar: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private avisoService: AvisoService) { }

    ngOnInit() {
      this.mensagemErro = '';
  
      this.route.params.subscribe((params) => {
        let usr = this.authService.obterUsuario();

        if (!usr) {
          this.router.navigate(['home']);
        }

        this.usuarioId = usr.id;
  
        if (params['aviso']) {
          this.avisoId = +params['aviso'];
          this.loading = true;

          if (this.avisoId > 0) {
            this.avisoService.obterAviso(this.avisoId).subscribe((aviso) => {
              this.aviso = aviso;
    
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
            this.aviso = new Aviso();
            this.loading = false;
          }
        }
      });
    }

    private setFormFields() {

      if (isNullOrUndefined(this.aviso)) {
        this.aviso = this.avisoService.novaPostagem(this.usuarioId);
      }
  
      if (this.aviso) {
        if (this.aviso.urlImagem)
          this.imagemUpload = this.aviso.urlImagem;
      }
  
      if (!isNullOrUndefined(this.postagemForm)) {
        this.postagemForm.setValue({
          id: this.aviso.id || 0,
          usuarioId: this.aviso.usuarioId || '',
          ordem: this.aviso.ordem || '',
          titulo: this.aviso.titulo || '',
          texto: this.aviso.texto || ''
        });
      } 
    }

    onNotificationClick() {
      this.mensagemErro = '';
    }

    onSubmit() {
      if (this.postagemForm.valid) {
  
        this.btnSalvar.nativeElement.classList.add('is-loading');
        this.aviso.id = this.postagemForm.value.id || 0;
        this.aviso.usuarioId = this.usuarioId;
        this.aviso.ordem = this.postagemForm.value.ordem;
        this.aviso.titulo = this.postagemForm.value.titulo;
        this.aviso.texto = this.postagemForm.value.texto;
        this.aviso.cor = 'yellow';
        this.loading = true;
  
        if (this.uploadedFile) {
          const formData = new FormData();
          formData.append('image', this.uploadedFile);
          this.avisoService.uploadImagem(formData).subscribe((resp) => {
            this.aviso.urlImagem = resp.urlLocation;
  
            this.salvarAviso(this.aviso);
            this.btnSalvar.nativeElement.classList.remove('is-loading');
            this.loading = false;
          }, (error) => {
            this.loading = false;
            console.error(error.message);
            this.mensagemErro = error.message;
            this.btnSalvar.nativeElement.classList.remove('is-loading');
          });
        } else {
          this.salvarAviso(this.aviso);
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
    this.aviso.urlImagem = null;
  }
    
  private salvarAviso(aviso: Aviso) {
    this.avisoService.salvarAviso(aviso).subscribe((resp) => {
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
