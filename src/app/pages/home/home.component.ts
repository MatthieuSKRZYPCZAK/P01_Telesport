import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  protected totalJOs: number = 0;
  protected totalCountries: number = 0;

  constructor(private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((countries: Olympic[]) => {
      if (countries) {
        this.totalCountries = countries.length;
        this.totalJOs = countries.reduce((sum: number, country) => sum + country.participations.length, 0);
      }
    });
  }
}
