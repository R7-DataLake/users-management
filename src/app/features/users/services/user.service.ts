import { Injectable } from '@angular/core'
import axios from 'axios'
import { environment } from '../../../../environments/environment'
import { ICreateUser, IUpdateUser } from '../../../core/model/user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

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
    const url = `/users?zone_code=${zoneCode}`
    return await this.axiosInstance.get(url)
  }

  async info(id: any) {
    const url = `/users/${id}/info`
    return await this.axiosInstance.get(url)
  }

  async save(user: ICreateUser) {
    return await this.axiosInstance.post('/users', user)
  }

  async update(id: any, user: IUpdateUser) {
    return await this.axiosInstance.put(`/users/${id}/edit`, user)
  }

  async changePassword(id: any, password: any) {
    return await this.axiosInstance.put(`/users/change-password`, {
      id,
      password
    })
  }
}
