import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";
import {ActivatedRoute} from "@angular/router";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  protected totalJOs: number = 0;
  protected totalCountries: number = 0;
  private destroy$ = new Subject<void>();
  public errorMessage: string | null = null;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit(): void {
    this.listenToQueryParams();
    this.loadOlympicsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private listenToQueryParams() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.errorMessage = params['error'] || null;
      });
  }

  private loadOlympicsData() {
    this.olympicService.loadInitialData()
      .pipe(
        catchError(error => {
          this.errorMessage = "Error loading data.";
          console.error(error);
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((countries: Olympic[]) => {
        if (countries && countries.length > 0) {
          this.totalCountries = countries.length;
          this.totalJOs = countries.reduce(
            (sum: number, country) => sum + country.participations.length,
            0
          );
        }
      });
  }
}
