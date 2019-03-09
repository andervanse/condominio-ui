import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { DocumentosComponent } from './components/documentos/documentos.component';
import { AvisosComponent } from './components/avisos/avisos.component';
import { VisitasComponent } from './components/visitas/visitas.component';
import { NegociosComponent } from './components/negocios/negocios.component';
import { Page404Component } from './components/page-not-found/page-404.component';
import { PortariaComponent } from './components/portaria/portaria.component';
import { OuvidoriaComponent } from './components/ouvidoria/ouvidoria.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'  },
  { path: 'home',  component: HomeComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'documentos', component: DocumentosComponent },  
  { path: 'avisos', component: AvisosComponent },  
  { path: 'portaria', component: PortariaComponent },  
  { path: 'visitas', component: VisitasComponent },  
  { path: 'negocios', component: NegociosComponent },  
  { path: 'ouvidoria', component: OuvidoriaComponent },  
  { path: 'sobre', component: SobreComponent },    
  { path: '**', component: Page404Component }
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
    SobreComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
