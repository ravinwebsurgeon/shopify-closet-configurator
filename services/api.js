import axios from 'axios'

export const api = axios.create({
    baseURL:`https://shopify-closet-configurator-backend.vercel.app/api/`,
    headers:{
        "Content-Type": "application/json",
    }
})