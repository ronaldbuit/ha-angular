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
    return this.httpClient.post<Device>( environment.apiUrl + 'device/' + s.id, {id: s.id, value: newValue, command: cmnd});
  }

  onOffSwitch(s: Device, onOff: boolean): Observable<Device> {
    if (onOff) {
      return this.httpClient.post<Device>(environment.apiUrl + 'device/' + s.id, {id: s.id, value: 'ON', command: 'POWER'});
    } else {
      return this.httpClient.post<Device>(environment.apiUrl + 'device/' + s.id, {id: s.id, value: 'OFF', command: 'POWER'});
    }
  }
}
