import {Component, OnDestroy, OnInit} from '@angular/core';
import {Olympic} from "../../core/models/Olympic";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {CountryLineChartComponent} from "../../charts/country-line-chart/country-line-chart.component";
import {Subject, take, takeUntil} from "rxjs";
import {catchError} from "rxjs/operators";
import {LoaderComponent} from "../../ui/loader/loader.component";



@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CountryLineChartComponent,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {

  countryName: string = '';
  countryData: Olympic | undefined;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public numberOfEntries: number = 0;
  private destroy$ = new Subject<void>();
  public isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.countryName = params.get("name") || '';
        this.fetchCountryData();
      });
  }

  fetchCountryData(): void {
    this.isLoading = true;
    this.olympicService.getOlympics()
      .pipe(take(1))
      .subscribe(countries => {
        if(countries.length === 0) {
          this.olympicService.loadInitialData()
            .pipe(takeUntil(this.destroy$),
            catchError((error) => {
              this.router.navigate([''], { queryParams: { error: 'Error loading data' } });
              this.isLoading = false;
              return [];
            }))
            .subscribe(() => {
              this.searchCountryData();
            });
        } else {
          this.searchCountryData(countries);
        }

      });
  }

  private searchCountryData(countries?: Olympic[]) {
    this.isLoading = false;
    if(!countries) {
      countries = this.olympicService.getOlympicValue();
    }

    this.countryData = countries.find(
      country => country.country.toLowerCase() === this.countryName.toLowerCase()
    );
    if(this.countryData) {
      this.calculateTotals(this.countryData);
    } else {
      this.router.navigate([''], { queryParams: { error: 'Country not found'} });
    }
  }

  private calculateTotals(country: Olympic) {
    this.totalAthletes = country.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
    this.totalMedals = country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
    this.numberOfEntries = country.participations.length;
  }

  goBack() {
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
