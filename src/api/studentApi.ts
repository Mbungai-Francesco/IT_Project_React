import axios from "axios";
import { link } from ".";
import type { Student } from "../types";
const route = "api/student"

export const createStudent = async (student : Student) => {
  try{
    // console.log("Authorization Header:", config.headers); // Log the authorization header
    const res = await axios.post(`${link}/${route}`, student)
    console.log("message", res.statusText);
    return res.data as Student
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const getStudents = async () => {
  try{
    const res = await axios.get(`${link}/${route}`)
    console.log(res.data);
    return res.data as Student[]
  }
  catch(error){
    console.error('Error:', error);
    throw new Error("Couldn't get students")
  }
}

export const getStudent = async (matricule : string) => {
  try{
    const res = await axios.get(`${link}/${route}/${matricule}`)
    console.log(res.data.data);
    return res.data as Student
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const updateStudent = async (matricule : string, student : Student) => {
  try{
    const res = await axios.put(`${link}/${route}/${matricule}`,student)
    console.log(res.data.data);
    return res.data as Student
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

export const deleteStudent = async (matricule : string) => {
  try{
    const res = await axios.delete(`${link}/${route}/${matricule}`)
    console.log(res.data);
    return true
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}