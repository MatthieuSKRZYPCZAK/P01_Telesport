import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute} from "@angular/router";
import {Olympic} from "../../core/models/Olympic";


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
export class CountryLineChartComponent implements OnInit {
  view: [number, number] = [700, 400];
  countryData: { name: string, series: { name: string, value: number }[] }[] = [];
  totalMedals: number = 0;
  countryName: string = '';
  xAxisLabel: string = 'Dates';

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('name') || '';
      this.loadCountryData();
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateChartSize();
  }

  updateChartSize() {
    const width = Math.min(window.innerWidth, 768);
    const height = window.innerHeight * 0.4;
    this.view = [width, height];
  }

  loadCountryData(): void {
    this.olympicService.getOlympics().subscribe((countries: Olympic[]) => {
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
}
