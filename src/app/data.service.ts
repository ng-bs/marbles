import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Person, Film, Starship, Planet } from './sw.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'https://swapi.co/api';

  constructor(private http: HttpClient) { }

  getPeople(): Observable<Person[]> {
    const url = `${this.baseUrl}/people`;
    return this.http.get<any>(url).pipe(
      map(result => result.results)
    );
  }

  getPlanets(): Observable<Planet[]> {
    const url = `${this.baseUrl}/planets`;
    return this.http.get<any>(url).pipe(
      map(result => result.results)
    );
  }

  getStarships(): Observable<Starship[]> {
    const url = `${this.baseUrl}/starships`;
    return this.http.get<any>(url).pipe(
      map(result => result.results)
    );
  }

  getFilms(): Observable<Film[]> {
    const url = `${this.baseUrl}/films`;
    return this.http.get<any>(url).pipe(
      map(result => result.results)
    );
  }
}
