import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from '../../node_modules/rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { catchError, tap } from '../../node_modules/rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class HeroService {

    private heroesUrl = 'api/heroes';
    constructor(
        private httpClient: HttpClient,
        private messageService: MessageService) {
    }

    getHeroes(): Observable<Hero[]> {
        this.messageService.addMessage('HeroService: fetched heroes');
        return this.httpClient.get<Hero[]>(this.heroesUrl).pipe(
            tap(heroes => this.log('fetched heroes')),
            catchError(this.handleError('getHeroes', []))
        )
    }

    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        this.messageService.addMessage(`HeroService: fetch hero id = ${id}`);
        return this.httpClient.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        )
    }

    updateHero(hero: Hero): Observable<any> {
        return this.httpClient.put(this.heroesUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`update hero id=${hero.id}`)),
            catchError(this.handleError<any>('Update hero'))
        )
    }

    addHero(hero: Hero): Observable<Hero> {
        return this.httpClient.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
            tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
            catchError(this.handleError<Hero>('addHero'))
        )
    }

    deleteHero(hero: Hero | number) {
        const id = typeof hero === 'number' ? hero : hero.id;
        return this.httpClient.delete(`${this.heroesUrl}/${id}`, httpOptions).pipe(
            tap(_ => this.log(`delete hero id=${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
        )
    }

    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            return of([]);
        }
        return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
            tap(_ => this.log(`found heroes matching "${term}"`)),
            catchError(this.handleError<Hero[]>('searchHero', []))
        )
    }


    private log(message: string) {
        this.messageService.addMessage(`HeroService: ${message}`);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            this.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        }
    }
}
