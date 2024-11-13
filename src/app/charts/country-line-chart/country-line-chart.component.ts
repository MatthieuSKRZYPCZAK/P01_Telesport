import {Component, OnInit} from '@angular/core';
import {LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute} from "@angular/router";
import {Olympic} from "../../core/models/Olympic";


@Component({
  selector: 'app-country-line-chart',
  standalone: true,
  imports: [
    PieChartModule,
    LineChartModule
  ],
  templateUrl: './country-line-chart.component.html',
  styleUrl: './country-line-chart.component.scss'
})
export class CountryLineChartComponent implements OnInit {
  view: [number, number] = [700, 400];
  countryData: { name: string, series: { name: string, value: number }[] }[] = [];
  totalEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;
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

  loadCountryData(): void {
    this.olympicService.getOlympics().subscribe((countries: Olympic[]) => {
      const country = countries.find(c => c.country === this.countryName);

      if (country) {
        // Prépare les données pour le graphique
        this.countryData = [
          {
            name: 'Medals',
            series: country.participations.map(p => ({
              name: p.year.toString(),
              value: p.medalsCount
            }))
          },
          {
            name: 'Athletes',
            series: country.participations.map(p => ({
              name: p.year.toString(),
              value: p.athleteCount
            }))
          }
        ];

        // Calcul des statistiques
        this.totalEntries = country.participations.length;
        this.totalMedals = country.participations.reduce((sum, p) => sum + p.medalsCount, 0);
        this.totalAthletes = country.participations.reduce((sum, p) => sum + p.athleteCount, 0);
      }
    });
  }
}
