export interface HospitalList {
  hospcode: string;
  hospname: string;
  enabled: boolean;
  zone_name: string;
  zone_code: string;
}

export interface ICreateHospital {
  zone_code: string;
  enabled: string;
  hospcode: string;
  hospname: string;
}

export interface IUpdateHospital {
  zone_code: string;
  enabled: string;
  hospname: string;
}