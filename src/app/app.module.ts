import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule, MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import {faBan} from '@fortawesome/free-solid-svg-icons';
import {faLightbulb, faLightbulbOn, faSunrise, faSunset} from '@fortawesome/pro-regular-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatCheckboxModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(config: FaConfig, library: FaIconLibrary) {
    config.fallbackIcon = faBan;
    library.addIcons(faLightbulbOn, faLightbulb, faSunrise, faSunset);
  }
}
