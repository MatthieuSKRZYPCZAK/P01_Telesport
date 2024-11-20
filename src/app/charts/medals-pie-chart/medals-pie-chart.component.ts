import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {OlympicService} from "../../core/services/olympic.service";
import {Olympic} from "../../core/models/Olympic";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";


@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './medals-pie-chart.component.html',
  styleUrl: './medals-pie-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MedalsPieChartComponent implements OnInit, OnDestroy {

  view: [number, number] = [800, 400];
  olympicData: { name: string, value: number }[] = [];
  trimLabels: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.updateChartSize(window.innerWidth);
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (data: Olympic[]) => {
        this.olympicData = data.map(country => {
          const totalMedals = country.participations.reduce(
            (sum, participation) => sum + participation.medalsCount, 0
          );
          return {
            name: country.country,
            value: totalMedals
          };
        });
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    this.updateChartSize(target.innerWidth);
  }

  updateChartSize(width: number) {
    if (width < 768) {
      this.view = [300, 200]; // Taille pour les petits écrans
      this.trimLabels = true;
    }else {
      this.view = [700, 400]; // Taille pour les écrans de bureau
      this.trimLabels = false;
    }
  }

  onCountrySelect(event: { name: string }): void {
    const countryName = event.name;
    this.router.navigate(['/country', countryName]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
