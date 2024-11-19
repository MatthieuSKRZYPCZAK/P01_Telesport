import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[]> = of([]);
  protected totalJOs: number = 0;
  protected totalCountries: number = 0;
  private subscription!: Subscription;
  public errorMessage: string | null = null;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.errorMessage = params['error'] || null;
    })
    this.olympics$ = this.olympicService.getOlympics().pipe(
      catchError((error) => {
        this.errorMessage = error instanceof HttpErrorResponse
        ? "Error loading data. Please try again later."
        : "An unexpected error occurred. Please try again later.";
        return of([]);
      })
    );
    this.subscription = this.olympics$.subscribe((countries: Olympic[]) => {
      if (countries) {
        this.totalCountries = countries.length;
        this.totalJOs = countries.reduce((sum: number, country) => sum + country.participations.length, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
