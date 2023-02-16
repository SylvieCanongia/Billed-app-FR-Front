
const jsonOrThrowIfError = async (response) => {
  if(!response.ok) throw new Error((await response.json()).message)
  return response.json()
}

/**
 * Manages availablity of the back-end and builds the base of the HTTP Requests
 */
class Api {
  constructor({baseUrl}) {
    this.baseUrl = baseUrl;
  }
  async get({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'GET'}))
  }
  async post({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'POST', body: data}))
  }
  async delete({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'DELETE'}))
  }
  async patch({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'PATCH', body: data}))
  }
}

const getHeaders = (headers) => {
  const h = { }
  if (!headers.noContentType) h['Content-Type'] = 'application/json'
  const jwt = localStorage.getItem('jwt')
  if (jwt && !headers.noAuthorization) h['Authorization'] = `Bearer ${jwt}`
  return {...h, ...headers}
}

// These methods can be called from inside the app and are managed by the Store class.
// For example from Bills.js container with dot notation ("return this.store.bills().list()" L32)
   
class ApiEntity {
  constructor({key, api}) {
    this.key = key;
    this.api = api;
  }
  async select({selector, headers = {}}) {
    return await (this.api.get({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
  async list({headers = {}} = {}) {
    return await (this.api.get({url: `/${this.key}`, headers: getHeaders(headers)}))
  }
  async update({data, selector, headers = {}}) {
    return await (this.api.patch({url: `/${this.key}/${selector}`, headers: getHeaders(headers), data}))
  }
  async create({data, headers = {}}) {
    return await (this.api.post({url: `/${this.key}`, headers: getHeaders(headers), data}))
  }
  async delete({selector, headers = {}}) {
    return await (this.api.delete({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
}

// Manages the actions to do in the application, by getting HTTP requests syntax from Api
// and internal requests by ApiEntity

class Store {
  constructor() {
    this.api = new Api({baseUrl: 'http://localhost:5678'})
  }

  user = uid => (new ApiEntity({key: 'users', api: this.api})).select({selector: uid})
  users = () => new ApiEntity({key: 'users', api: this.api})
  login = (data) => this.api.post({url: '/auth/login', data, headers: getHeaders({noAuthorization: true})})

  ref = (path) => this.store.doc(path)

  bill = bid => (new ApiEntity({key: 'bills', api: this.api})).select({selector: bid})
  bills = () => new ApiEntity({key: 'bills', api: this.api})
}

export default new Store()