import axios from "axios";
import { link } from ".";
import type { Room } from "../types";
const route = "api/room";

export const createRoom = async (room: Room) => {
  try {
    const res = await axios.post(`${link}/${route}`, room);
    console.log("message", res.statusText);
    return res.data as Room;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getRooms = async () => {
  try {
    const res = await axios.get(`${link}/${route}`);
    console.log(res.data);
    return res.data as Room[];
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getRoom = async (id: number) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}`);
    console.log(res.data.data);
    return res.data as Room;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Getting room ${id} failed`)
  }
};

export const updateRoom = async (id: number, room: Room) => {
  try {
    const res = await axios.put(`${link}/${route}/${id}`, room);
    console.log(res.data.data);
    return res.data as Room;
  } catch (error) {
    console.error('Error:', error);
    throw new Error("Room update failed")
  }
};

export const deleteRoom = async (id: number) => {
  try {
    const res = await axios.delete(`${link}/${route}/${id}`);
    console.log(res.data);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};