import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private axiosInstance = axios.create({
    baseURL: environment.apiUrl
  });

  constructor () {
    this.axiosInstance.interceptors.response.use(response => {
      return response;
    }, error => {
      return Promise.reject(error);
    })
  }

  async login(username: any, password: any) {
    const url = `/login`;
    return this.axiosInstance.post(url, {
      username, password
    });
  }
}
