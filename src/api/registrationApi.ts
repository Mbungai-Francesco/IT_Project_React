import axios from "axios";
import { link } from ".";
import type { Registration } from "@/types";
const route = "api/registration";

export const createRegistration = async (registration: Registration) => {
  try {
    const res = await axios.post(`${link}/${route}`, registration);
    console.log("message", res.statusText);
    return res.data as Registration;
  } catch (error) {
    console.error('Error:', error);
    throw new Error("Creation failed")
  }
};

export const getRegistrations = async () => {
  try {
    const res = await axios.get(`${link}/${route}`);
    console.log(res.data);
    return res.data as Registration[];
  } catch (error) {
    console.error('Error:', error);
    throw new Error("Get failed")
  }
};

export const getRegistration = async (id: number) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}`);
    console.log(res.data.data);
    return res.data as Registration;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const updateRegistration = async (id: number, registration: Registration) => {
  try {
    const res = await axios.put(`${link}/${route}/${id}`, registration);
    console.log(res.data.data);
    return res.data as Registration;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const deleteRegistration = async (id: number) => {
  try {
    const res = await axios.delete(`${link}/${route}/${id}`);
    console.log(res.data);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};