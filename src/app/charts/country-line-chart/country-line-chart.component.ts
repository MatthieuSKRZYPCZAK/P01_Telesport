import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute} from "@angular/router";
import {Olympic} from "../../core/models/Olympic";
import {Subject, takeUntil} from "rxjs";


@Component({
  selector: 'app-country-line-chart',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './country-line-chart.component.html',
  styleUrl: './country-line-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CountryLineChartComponent implements OnInit, OnDestroy {
  view: [number, number] = [700, 400];
  countryData: { name: string, series: { name: string, value: number }[] }[] = [];
  totalMedals: number = 0;
  countryName: string = '';
  xAxisLabel: string = 'Dates';
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.countryName = params.get('name') || '';
        this.loadCountryData();
    });
  }

  /**
   * Host listener for the `resize` event on the window.
   * Updates the chart size dynamically when the window is resized.
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateChartSize();
  }

  /**
   * Updates the dimensions of the chart based on the window size.
   * The chart adapts to smaller screens with reduced width and height.
   */
  updateChartSize() {
    const isSmallScreen = window.innerWidth < 768;
    const width = isSmallScreen ? Math.max(window.innerWidth * 0.9, 300) : Math.min(window.innerWidth * 0.8, 700);
    const height = window.innerHeight * 0.4;
    this.view = [width, height];
  }

  /**
   * Loads the Olympic data for the selected country.
   * Processes the data to populate the chart with the number of medals won each year
   * and calculates the total medals.
   */
  loadCountryData(): void {
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((countries: Olympic[]) => {
        const country = countries.find(c => c.country === this.countryName);

      if (country) {
        this.countryData = [
          {
            name: 'Medals',
            series: country.participations.map(p => ({
              name: p.year.toString(),
              value: p.medalsCount
            }))
          },
        ];
        this.totalMedals = country.participations.reduce((sum, p) => sum + p.medalsCount, 0);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
