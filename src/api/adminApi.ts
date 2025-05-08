import axios from "axios";
import { link } from ".";
import type { Admin } from "@/types";
const route = "api/user"

export const createAdmin = async (admin : Admin) => {
  try{
    // console.log("Authorization Header:", config.headers); // Log the authorization header
    const res = await axios.post(`${link}/${route}`, admin)
    console.log("message", res.statusText);
    return res.data as Admin
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const getAdmins = async () => {
  try{
    const res = await axios.get(`${link}/${route}`)
    console.log(res.data);
    return res.data as Admin[]
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const getAdmin = async (id : number) => {
  try{
    const res = await axios.get(`${link}/${route}/${id}`)
    console.log(res.data.data);
    return res.data as Admin
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const updateAdmin = async (id : number, admin : Admin) => {
  try{
    const res = await axios.put(`${link}/${route}/${id}`,admin)
    console.log(res.data.data);
    return res.data as Admin
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const deleteAdmin = async (id : number) => {
  try{
    const res = await axios.delete(`${link}/${route}/${id}`)
    console.log(res.data);
    return true
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const loginUser = async (email : string, password : string) => {
  try{
    const res = await axios.post(`${link}/${route}/login`, {email, password})    
    return res.data as Admin
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}