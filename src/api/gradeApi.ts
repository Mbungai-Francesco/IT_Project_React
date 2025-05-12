import axios from "axios";
import { link } from ".";
import type { Grade } from "@/types";

const route = "api/grade";

export const createGrade = async (grade: Grade) => {
  try {
    const {id, ...rest} = grade;
    const res = await axios.post(`${link}/${route}`, rest);
    console.log("message", res.statusText);
    return res.data as Grade;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getGrades = async () => {
  try {
    const res = await axios.get(`${link}/${route}`);
    console.log(res.data);
    return res.data as Grade[];
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getGrade = async (id: number) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}`);
    console.log(res.data.data);
    return res.data as Grade;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getGradesByStudMat = async (studentId: string) => {
  try {
    const res = await axios.get(`${link}/${route}/studentMat/${studentId}`);
    console.log(res.data);
    return res.data as Grade[];
  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Couldn't get the grades by student`)
  }
};

export const updateGrade = async (id: number, grade: Grade) => {
  try {
    const res = await axios.put(`${link}/${route}/${id}`, grade);
    console.log(res.data.data);
    return res.data as Grade;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const deleteGrade = async (id: number) => {
  try {
    const res = await axios.delete(`${link}/${route}/${id}`);
    console.log(res.data);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};