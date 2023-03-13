import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private axiosInstance = axios.create({
    baseURL: `${environment.apiUrl}/reports`
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

  async getTotalUsers() {
    const url = `/total-users`;
    return this.axiosInstance.get(url);
  }

  async getLastSendings(start: any, end: any) {
    const url = `/last-sending?start=${start}&end=${end}`;
    return this.axiosInstance.get(url);
  }

}
