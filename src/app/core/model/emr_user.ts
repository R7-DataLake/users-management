export interface EMRUserList {
  id: string;
  cid: string;
  first_name: string;
  last_name: string;
  email: string;
  hospcode: string;
  hospname: string;
  enabled: boolean;
  is_deleted: boolean;
  is_verified: boolean;
  zone_name: string;
  last_login: string;
}

export interface ICreateEMRUser {
  cid: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  enabled: string;
  hospcode: string;
}

export interface IUpdateEMRUser {
  first_name: string;
  last_name: string;
  email: string;
  enabled: string;
  hospcode: string;
}