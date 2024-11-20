import {Component, OnDestroy, OnInit} from '@angular/core';
import {Olympic} from "../../core/models/Olympic";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {MedalsPieChartComponent} from "../../charts/medals-pie-chart/medals-pie-chart.component";
import {CountryLineChartComponent} from "../../charts/country-line-chart/country-line-chart.component";
import {Subject, take, takeUntil} from "rxjs";


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    MedalsPieChartComponent,
    CountryLineChartComponent,
    RouterLink
  ],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {

  countryName: string = '';
  countryData: Olympic | undefined;
  protected totalMedals: number = 0;
  protected totalAthletes: number = 0;
  protected numberOfEntries: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.olympicService.loadInitialData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.route.paramMap
          .pipe(takeUntil(this.destroy$))
          .subscribe(params => {
            this.countryName = params.get('name') || '';
            this.fetchCountryData();
          });
      });
  }

  fetchCountryData(): void {
    this.olympicService.getOlympics()
      .pipe(take(1))
      .subscribe(countries => {
        this.countryData = countries.find(country => country.country.toLowerCase() === this.countryName.toLowerCase());
          if (this.countryData) {
            this.totalAthletes = this.countryData.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
            this.totalMedals = this.countryData.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
            this.numberOfEntries = this.countryData.participations.length;
          } else {
            this.router.navigate([''], { queryParams: { error: 'Country not found'}});
          }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.router.navigate(['']);
  }
}
