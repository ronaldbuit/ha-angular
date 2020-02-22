export interface Device {
  id: string;
  commands: string[];
  status: string[];
  label: string;
  powerStatus: boolean;
  dimmerValue: number;
  colorValue1: number;
  colorValue2: number;
  isAll: boolean;
  nextOn: Date;
  nextOff: Date;
  visible: boolean;
}
