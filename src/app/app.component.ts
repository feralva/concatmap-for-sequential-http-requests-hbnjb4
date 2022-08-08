import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  forkJoin,
  Observable,
  of,
  Subject,
  BehaviorSubject,
  from,
  combineLatest,
} from 'rxjs';
import {
  delay,
  concatMap,
  mergeMap,
  tap,
  map,
  scan,
  toArray,
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: HttpClient) {
    let observable$ = from([
      { id: 1, name: 'hammer' },
      { id: 2, name: 'book' },
      { id: 3, name: 'onion' },
    ]).pipe(
      //tap((x) => console.log(x)),
      mergeMap((product) => of({ ...product, category: 'category' })),
      toArray()
      //),
      //concatMap((productWithCategory$) => productWithCategory$),
      //concatMap((productWithCategory) => productWithCategory),
      //toArray()
      //scan((acc, curr) => [...acc, curr], [] as any[])
    );

    //observable$.subscribe((data) => console.log(data));

    let observable2$ = of([
      { id: 1, name: 'hammer' },
      { id: 2, name: 'book' },
      { id: 3, name: 'onion' },
    ]).pipe(
      mergeMap(productos =>productos.map(p => of({ ...p, category: 'category' }))),
      mergeMap(product$=>product$),
      toArray()
    );

    observable2$.subscribe((data) => console.log(data));
  }

  public results$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  startRequests(): void {
    const requests = [
      this.http.get('https://jsonplaceholder.typicode.com/todos/1'),
      this.http.get('https://jsonplaceholder.typicode.com/todos/2'),
      this.http.get('https://jsonplaceholder.typicode.com/todos/3'),
      this.http.get('https://jsonplaceholder.typicode.com/todos/4'),
      this.http.get('https://jsonplaceholder.typicode.com/todos/5'),
      this.http.get('https://jsonplaceholder.typicode.com/todos/6'),
    ];

    from(requests)
      .pipe(concatMap((request) => request.pipe(delay(2200))))
      .subscribe((res) => {
        this.results$.next(this.results$.getValue().concat(res));
      });
  }
}
