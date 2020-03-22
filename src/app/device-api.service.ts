import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Device} from './models/device.model';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceApiService {

  constructor(private httpClient: HttpClient) { }

  getDevices(): Observable<Device[]> {
    return this.httpClient.get<Device[]>(environment.apiUrl + 'device');
  }

  updateDevice(s: Device, cmnd: string, newValue: string): Observable<Device> {
    return this.httpClient.post<Device>( environment.apiUrl + 'device/' + s.topic, {topic: s.topic, value: newValue, command: cmnd});
  }

  all(newValue: string): Observable<void> {
    return this.httpClient.post<void>( environment.apiUrl + 'alldevices', {value: newValue});
  }

  party(): Observable<void> {
    return this.httpClient.post<void>( environment.apiUrl + 'party', {});
  }
}
