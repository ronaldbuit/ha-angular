import { Component, OnInit } from '@angular/core';
import {interval, Observable} from 'rxjs';
import {Device} from '../models/device.model';
import {DeviceApiService} from '../device-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  devices: Device[];

  oneOn: boolean;

  constructor(private deviceApiService: DeviceApiService) {
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
      } else if (command === 'CT') {
        s.colorValue = Number(s.status[index]);
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
    } else if (cmnd === 'CT') {
      this.deviceApiService.updateDevice(device, cmnd, device.colorValue + '').subscribe((returnSwitch: Device) => {
        // do nothing
      });
    }
  }
}
