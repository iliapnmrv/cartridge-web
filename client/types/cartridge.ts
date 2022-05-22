export interface ICartridge {
  id: number;
  name: string;
  amount: number;
  info?: string;
  logs?: ILog[];
}

export enum LogTypesEnum {
  add = "add",
  sub = "sub",
}

export interface ILog {
  id: number;
  description?: string;
  amount: number;
  type: LogTypesEnum;
  created_at: Date;
  cartridgeId: number;
}
