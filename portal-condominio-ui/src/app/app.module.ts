import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { DocumentosComponent } from './components/documentos/documentos.component';

import { VisitasComponent } from './components/visitas/visitas.component';
import { NegociosComponent } from './components/negocios/negocios.component';
import { Page404Component } from './components/page-not-found/page-404.component';
import { PortariaComponent } from './components/portaria/portaria.component';
import { OuvidoriaComponent } from './components/ouvidoria/ouvidoria.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FinanceiroComponent } from './components/financeiro/financeiro.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogoffComponent } from './components/logoff/logoff.component';
import { EditarAvisoComponent } from './components/avisos/editar-aviso/editar-aviso.component';
import { AvisoService } from './services/aviso.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AvisosComponent } from './components/avisos/avisos.component';
import { ListaAvisosComponent } from './components/avisos/lista-avisos/lista-avisos.component';
import { JwtInterceptor } from './services/interceptors/jwt-interceptor.service';
import { ErrorInterceptor } from './services/interceptors/error-interceptor.service';
import { LoadingInterceptor } from './services/interceptors/loading-interceptor.service';
import { LoadingService } from './services/loading.service';
import { EditarNegocioComponent } from './components/negocios/editar-negocio/editar-negocio.component';
import { ListaNegociosComponent } from './components/negocios/lista-negocios/lista-negocios.component';
import { NegocioService } from './services/negocio.service';
import { ResizeImageService } from './services/resize-image.service';


const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'  },
  { path: 'home',  component: HomeComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'logoff', component: LogoffComponent },  
  { path: 'documentos', component: DocumentosComponent },  
  { path: 'avisos', component: AvisosComponent, children:[
    { path: '', component: ListaAvisosComponent },
    { path: 'editar/:aviso', component: EditarAvisoComponent, canActivate: [AuthGuardService] } 
  ] },
  { path: 'negocios', component: NegociosComponent, children:[
    { path: '', component: ListaNegociosComponent },
    { path: 'editar/:negocio', component: EditarNegocioComponent, canActivate: [AuthGuardService] } 
  ] },     
  { path: 'portaria', component: PortariaComponent },  
  { path: 'visitas', component: VisitasComponent },  
  { path: 'negocios', component: NegociosComponent },  
  { path: 'financeiro', component: FinanceiroComponent },
  { path: 'ouvidoria', component: OuvidoriaComponent },  
  { path: 'sobre', component: SobreComponent },    
  { path: '**', component: Page404Component },
  
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    DocumentosComponent,
    AvisosComponent,
    VisitasComponent,
    NegociosComponent,
    Page404Component,
    PortariaComponent,
    OuvidoriaComponent,
    SobreComponent,
    FinanceiroComponent,
    LogoffComponent,
    EditarAvisoComponent,
    ListaAvisosComponent,
    ListaNegociosComponent,
    EditarNegocioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },    
    AuthService,
    AuthGuardService,
    AvisoService,
    NegocioService,
    LoadingService,
    ResizeImageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
