import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { ICreateEMRUser, IUpdateEMRUser } from '../../../core/model/emr_user';

@Injectable({
  providedIn: 'root'
})
export class EmrUserService {

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

  async getUserList(zoneCode: any = '') {
    const url = `/emr-users?zone_code=${zoneCode}`
    return await this.axiosInstance.get(url)
  }

  async info(id: any) {
    const url = `/emr-users/${id}/info`
    return await this.axiosInstance.get(url)
  }

  async save(user: ICreateEMRUser) {
    return await this.axiosInstance.post('/emr-users', user)
  }

  async update(id: any, user: IUpdateEMRUser) {
    return await this.axiosInstance.put(`/emr-users/${id}/edit`, user)
  }

  async delete(id: any) {
    return await this.axiosInstance.put(`/emr-users/${id}/delete`)
  }

  async cancelDelete(id: any) {
    return await this.axiosInstance.put(`/emr-users/${id}/cancel-delete`)
  }

  async changePassword(id: any, password: any) {
    return await this.axiosInstance.put(`/emr-users/change-password`, {
      id,
      password
    })
  }

}
