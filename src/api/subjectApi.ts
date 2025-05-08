import axios from "axios";
import { link } from ".";
import type { Subject } from "../types";
const route = "api/subject";

export const createSubject = async (subject: Subject) => {
  try {
    const res = await axios.post(`${link}/${route}`, subject);
    console.log("message", res.statusText);
    return res.data as Subject;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getSubjects = async () => {
  try {
    const res = await axios.get(`${link}/${route}`);
    console.log(res.data);
    return res.data as Subject[]; 
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getSubjectsBySemester = async (semester : number) => {
  try {
    const res = await axios.get(`${link}/${route}/semester/${semester}`);
    console.log(res.data);
    return res.data as Subject[];
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getSubject = async (id: number) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}`);
    console.log(res.data.data);
    return res.data as Subject;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const updateSubject = async (id: number, subject: Subject) => {
  try {
    const res = await axios.put(`${link}/${route}/${id}`, subject);
    console.log(res.data.data);
    return res.data as Subject;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const deleteSubject = async (id: number) => {
  try {
    const res = await axios.delete(`${link}/${route}/${id}`);
    console.log(res.data);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};