import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibService {

  private axiosInstance = axios.create({
    baseURL: `${environment.apiUrl}/libs`
  });

  constructor () {
    this.axiosInstance.interceptors.request.use(config => {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(response => {
      return response;
    }, error => {
      return Promise.reject(error);
    })
  }

  async getHospitals(zoneCode: any) {
    const url = `/hospitals?zone_code=${zoneCode}`;
    return this.axiosInstance.get(url);
  }

  async getZones() {
    const url = `/zones`;
    return this.axiosInstance.get(url);
  }

}
