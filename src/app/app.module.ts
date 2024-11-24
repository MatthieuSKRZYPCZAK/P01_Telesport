import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {MedalsPieChartComponent} from "./charts/medals-pie-chart/medals-pie-chart.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoaderComponent} from "./ui/loader/loader.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxChartsModule,
        MedalsPieChartComponent,
        BrowserAnimationsModule,
        LoaderComponent
    ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
