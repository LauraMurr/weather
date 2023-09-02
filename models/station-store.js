import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { readingStore} from "../models/reading-store.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    console.log("Adding station:", station.title);
    station._id = v4();

    const latitude = station.latitude;
    const longitude = station.longitude;

    console.log("Lat", latitude);
    console.log("long", longitude);

    station.latitude = parseFloat(latitude);
    station.longitude = parseFloat(longitude);

    console.log("Parsed Lat", station.latitude);
    console.log("parsed long", station.longitude);

    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationById(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    if (!list) {
      console.error(`Station with ID: ${id} not found!`);
      return null;
  }
    list.readings = await readingStore.getReadingsByStationId(list._id)
    return list;
  },

  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },

  async getStationsByUserId(userid) {
    await db.read();
    const userStations = db.data.stations.filter((station) => station.userid === userid);
    return userStations.sort((a, b) => a.title.localeCompare(b.title));
},

};
