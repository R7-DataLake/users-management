import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { ICreateHospital, IUpdateHospital } from '../../../core/model/hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private axiosInstance = axios.create({
    baseURL: environment.apiUrl
  })

  constructor () {
    this.axiosInstance.interceptors.request.use(config => {
      const token = sessionStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    });

    this.axiosInstance.interceptors.response.use(response => {
      return response
    }, error => {
      return Promise.reject(error)
    })
  }

  async getList(zoneCode: any = '') {
    const url = `/hospitals?zone_code=${zoneCode}`
    return await this.axiosInstance.get(url)
  }

  async info(hospcode: any) {
    const url = `/hospitals/${hospcode}/info`
    return await this.axiosInstance.get(url)
  }

  async save(hospital: ICreateHospital) {
    return await this.axiosInstance.post('/hospials', hospital)
  }

  async update(hospcode: any, hospital: IUpdateHospital) {
    return await this.axiosInstance.put(`/hospitals/${hospcode}/edit`, hospital)
  }
}
