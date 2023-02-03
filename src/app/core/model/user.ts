export interface UserList {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  hospcode: string;
  hospname: string;
  enabled: boolean;
  zone_name: string;
  last_login: string;
}

export interface ICreateUser {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  enabled: string;
  hospcode: string;
}

export interface IUpdateUser {
  first_name: string;
  last_name: string;
  email: string;
  enabled: string;
  hospcode: string;
}