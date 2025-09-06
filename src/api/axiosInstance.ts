import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.itbook.store/1.0', // обязательно https
  timeout: 30000,                           // было 15000 → ставим 30s
})
