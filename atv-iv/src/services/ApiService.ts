import axios from 'axios'
import HttpStatus from 'http-status-codes'

class ApiService {

  private readonly baseUrl: string
  public headers: Record<string, string>

  constructor() {
    this.baseUrl = "http://localhost:32831"
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }

  public get(url: string, params?: any) {
    return this.request('GET', url, undefined, params)
  }

  public post(url: string, data: any) {
    return this.request('POST', url, data)
  }

  public put(url: string, data: any) {
    return this.request('PUT', url, data)
  }

  public delete(url: string, data: any) {
    return this.request('DELETE', url, data)
  }

  private async request(method: string, url: string, data?: any, params?: any) {
    const config = {
      method,
      url: `${this.baseUrl}/${url}`,
      headers: this.headers,
      data,
      params
    }

    return axios.request(config)
  }
}

export default ApiService