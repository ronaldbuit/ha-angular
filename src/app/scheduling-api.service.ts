import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {DatetimeInfo} from './models/datetimeinfo.model';
import {Device} from './models/device.model';

@Injectable({
  providedIn: 'root'
})
export class SchedulingApiService {

  constructor(private httpClient: HttpClient) {
  }

  getCurrentDateTime(): Observable<DatetimeInfo> {
    return this.httpClient.get<DatetimeInfo>(environment.apiUrl + 'scheduling/datetime');
  }

  getFromHome(): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.apiUrl + 'scheduling/fromhome');
  }

  setFromHome(fromHomeToSet: boolean): Observable<void> {
    return this.httpClient.post<void>(environment.apiUrl + 'scheduling/fromhome', {fromHome: fromHomeToSet});
  }
}
