export interface Device {
  id: string;
  commands: string[];
  status: string[];
  label: string;
  powerStatus: boolean;
  dimmerValue: number;
  colorValue: number;
  isAll: boolean;
}
