export interface IWorker {
  id: number;
  tabNom: string;
  name: string;
  position: string;
  dateOfBirth: Date;
  shift: string;
  lastMed?: Date;
  isException: boolean;
  harm?: IHarm;
  comment?: string;
}

export interface IHarm {
  id: number;
  position: string;
  harm: string;
  harmNum: string;
}
