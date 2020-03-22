import { Component, OnInit } from '@angular/core';
import {from, interval, Observable, timer} from 'rxjs';
import {Command, Device} from '../models/device.model';
import {DeviceApiService} from '../device-api.service';
import {SchedulingApiService} from '../scheduling-api.service';
import {DatetimeInfo} from '../models/datetimeinfo.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  devices: Device[];
  oneOn: boolean;
  currentDateTime: DatetimeInfo;
  fromHome: boolean;
  lightBulbClicked: number;

  constructor(private deviceApiService: DeviceApiService, private schedulingApiService: SchedulingApiService) {
    this.lightBulbClicked = 0;
  }

  ngOnInit() {
    timer(0, 1000).subscribe(() =>
    this.deviceApiService.getDevices().subscribe(devices => {
      this.oneOn = false;
      if (!this.devices) {
        this.devices = devices;
        this.devices.forEach(os => this.setStatus(os));
      } else {
        this.devices.forEach(os => {
          devices.forEach(ns => {
            if (os.topic === ns.topic) {
              os.commands.forEach(oc => {
                ns.commands.forEach(nc => {
                  if (nc.command === oc.command) {
                    oc.status = nc.status;
                    oc.nextOff = nc.nextOff;
                    oc.nextOn = nc.nextOn;
                  }
                });
              });
            }
          });
          this.setStatus(os);
        });
      }
    }));
    timer(0, 15000).subscribe(() => {
      this.schedulingApiService.getCurrentDateTime().subscribe(nextCurrentDateTime => {
        if (this.currentDateTime) {
          if (nextCurrentDateTime.current !== this.currentDateTime.current) {
            this.currentDateTime.current = nextCurrentDateTime.current;
          }
          if (nextCurrentDateTime.sunrise !== this.currentDateTime.sunrise) {
            this.currentDateTime.sunrise = nextCurrentDateTime.sunrise;
          }
          if (nextCurrentDateTime.sunset !== this.currentDateTime.sunset) {
            this.currentDateTime.sunset = nextCurrentDateTime.sunset;
          }
        } else {
          this.currentDateTime = nextCurrentDateTime;
        }
      });
    });
    this.schedulingApiService.getFromHome().subscribe(fromHome => this.fromHome = fromHome);
  }

  setStatus(s: Device) {
    s.commands.forEach((command) => {
      if (command.command && command.command.indexOf('POWER') === 0) {
        if (command.status === 'OFF') {
          command.powerStatus = false;
        } else {
          command.powerStatus = true;
          this.oneOn = true;
        }
      } else if (command.command === 'Dimmer') {
        command.dimmerValue = Number(command.status);
      } else if (command.command === 'Color') {
        command.colorValue1 = parseInt(command.status.substring(0, 2), 16);
        command.colorValue2 = parseInt(command.status.substring(2, 4), 16);
      }
    });
  }

  clickPower(powerDevice: Device, command: Command) {
      this.deviceApiService.updateDevice(powerDevice, command.command, 'toggle').subscribe((returnSwitch: Device) => {
        command.powerStatus = !command.powerStatus;
      });
  }

  setDeviceValue(device: Device, command: Command) {
    if (command.command === 'Dimmer') {
      this.deviceApiService.updateDevice(device, command.command, command.dimmerValue + '').subscribe((returnSwitch: Device) => {
        // do nothing
      });
    } else if (command.command === 'Color') {
      const hexValue = command.colorValue1.toString(16) + command.colorValue2.toString(16);
      this.deviceApiService.updateDevice(device, command.command, hexValue).subscribe((returnSwitch: Device) => {
        // do nothing
      });
    }
  }

  clickFromHome(event: MatCheckboxChange) {
    this.schedulingApiService.setFromHome(this.fromHome).subscribe();
  }

  all() {
    if (this.oneOn) {
      this.deviceApiService.all('OFF').subscribe();
    } else {
      this.deviceApiService.all('ON').subscribe();
    }
  }

  checkParty() {
    if (this.lightBulbClicked > 15) {
      this.deviceApiService.party().subscribe();
      this.lightBulbClicked = 0;
    } else if (this.lightBulbClicked > 10) {
      this.deviceApiService.party().subscribe();
    }
    this.lightBulbClicked++;
  }
}
