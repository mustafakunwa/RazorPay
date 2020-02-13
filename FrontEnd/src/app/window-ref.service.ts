
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Observable, of, throwError, pipe } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class APiService {
  url = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  createPayment(): Observable<any> {
    return this.http
      .get<any>(this.url + 'CreatePayment')
      .pipe(catchError(this.handleErrorObservable));
  }

  Callback(data: any): Observable<any> {
    return this.http
      .post<any>(this.url + 'Callback', data)
      .pipe(catchError(this.handleErrorObservable));
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return throwError(error);
  }
}
export class WindowRefService {

  constructor(@Inject(PLATFORM_ID) private platformId: object
  ) { }

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
  }
}

