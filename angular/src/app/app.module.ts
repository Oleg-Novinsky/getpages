import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { InterfaceComponent } from './components/interface/interface.component';

import {ProductsService} from './services/products.service';
import {GetpagesService} from './services/getpages.service';
import { LoginComponent } from './components/login/login.component';
import { GetpagesComponent } from './components/getpages/getpages.component';

const appRoutes: Routes = [
  {path: '', component: InterfaceComponent},
  {path: 'login', component: LoginComponent},
  {path: 'getpages', component: GetpagesComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    InterfaceComponent,
    LoginComponent,
    GetpagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ProductsService, GetpagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
