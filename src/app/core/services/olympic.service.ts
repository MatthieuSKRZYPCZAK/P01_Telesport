import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, delay} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from "../models/Olympic";

/**
 * Service responsible for fetching and managing Olympic data.
 */
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Loads initial Olympic data.
   *
   * @returns An observable that emits the list of `Olympic` objects.
   * @throws Throws an error if the data cannot be loaded.
   */
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Returns an observable of the Olympic data.
   *
   * @returns An observable emitting the current list of `Olympic` data.
   */
  getOlympics() {
    return this.olympics$.asObservable();
  }

  /**
   * Retrieves the current value of the Olympic data.
   *
   * @returns The current list of `Olympic` objects.
   */
  getOlympicValue() {
    return this.olympics$.value;
  }
}
