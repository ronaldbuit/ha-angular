import { Component, OnInit } from '@angular/core';
import {from, interval, Observable} from 'rxjs';
import {Device} from '../models/device.model';
import {DeviceApiService} from '../device-api.service';
import {SchedulingApiService} from '../scheduling-api.service';
import {DatetimeInfo} from '../models/datetimeinfo.model';
import {MatCheckboxChange} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  devices: Device[];
  oneOn: boolean;
  currentDateTime$: Observable<DatetimeInfo>;
  fromHome: boolean;

  constructor(private deviceApiService: DeviceApiService, private schedulingApiService: SchedulingApiService) {
  }

  ngOnInit() {
    interval(1000).subscribe((n) =>
    this.deviceApiService.getDevices().subscribe(devices => {
      this.oneOn = false;
      if (!this.devices) {
        this.devices = devices;
        this.devices.forEach(os => this.setStatus(os));
      } else {
        this.devices.forEach(os => {
          devices.forEach(ns => {
            if (ns.id === os.id && ns.status !== os.status) {
              os.status = ns.status;
              os.nextOff = ns.nextOff;
              os.nextOn = ns.nextOn;
            }
          });
          this.setStatus(os);
        });
      }
      this.devices.forEach(os => {
        if (os.isAll) {
          if (this.oneOn) {
            os.powerStatus = true;
            os.label = 'Alles uit';
          } else {
            os.powerStatus = false;
            os.label = 'Alles aan';
          }
        }
      });
    }));
    this.currentDateTime$ = this.schedulingApiService.getCurrentDateTime();
    interval(15000).subscribe(() => {
      this.currentDateTime$ = this.schedulingApiService.getCurrentDateTime();
    });
    this.schedulingApiService.getFromHome().subscribe(fromHome => this.fromHome = fromHome);
  }

  setStatus(s: Device) {
    s.commands.forEach((command, index) => {
      if (command === 'POWER') {
        if (s.status[index] === 'OFF') {
          s.powerStatus = false;
        } else {
          s.powerStatus = true;
          this.oneOn = true;
        }
      } else if (command === 'Dimmer') {
        s.dimmerValue = Number(s.status[index]);
      } else if (command === 'Color') {
        s.colorValue1 = parseInt(s.status[index].substring(0, 2), 16);
        s.colorValue2 = parseInt(s.status[index].substring(2, 4), 16);
      }
    });
  }

  clickPower(powerDevice: Device) {
    if (powerDevice.isAll) {
      this.deviceApiService.onOffSwitch(powerDevice, !powerDevice.powerStatus).subscribe((returnSwitch: Device) => {
        powerDevice.powerStatus = !powerDevice.powerStatus;
      });
    } else {
      this.deviceApiService.updateDevice(powerDevice, 'POWER', 'toggle').subscribe((returnSwitch: Device) => {
        powerDevice.powerStatus = !powerDevice.powerStatus;
      });
    }
  }

  setDeviceValue(device: Device, cmnd: string) {
    if (cmnd === 'Dimmer') {
      this.deviceApiService.updateDevice(device, cmnd, device.dimmerValue + '').subscribe((returnSwitch: Device) => {
        // do nothing
      });
    } else if (cmnd === 'Color') {
      const hexValue = device.colorValue1.toString(16) + device.colorValue2.toString(16);
      this.deviceApiService.updateDevice(device, cmnd, hexValue).subscribe((returnSwitch: Device) => {
        // do nothing
      });
    }
  }

  clickFromHome(event: MatCheckboxChange) {
    this.schedulingApiService.setFromHome(this.fromHome).subscribe();
  }
}
