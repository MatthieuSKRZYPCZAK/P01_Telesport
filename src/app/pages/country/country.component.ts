import {Component, OnInit} from '@angular/core';
import {Olympic} from "../../core/models/Olympic";
import {ActivatedRoute} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {MedalsPieChartComponent} from "../../charts/medals-pie-chart/medals-pie-chart.component";
import {CountryLineChartComponent} from "../../charts/country-line-chart/country-line-chart.component";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    MedalsPieChartComponent,
    CountryLineChartComponent
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit {

  public olympics$: Observable<Olympic[]> = of([]);
  countryName: string = '';
  countryData: Olympic | undefined;
  protected totalMedals: number = 0;
  protected totalAthletes: number = 0;
  protected numberOfEntries: number = 0;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('name') || '';
      this.fetchCountryData();
    });
  }

  fetchCountryData(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(countries => {
      this.countryData = countries.find(country => country.country.toLowerCase() === this.countryName.toLowerCase());
      if (this.countryData) {
        this.totalAthletes = this.countryData.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
        this.totalMedals = this.countryData.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
        this.numberOfEntries = this.countryData.participations.length;
      }
    });
  }

}
