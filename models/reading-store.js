import { initStore } from "../utils/store-utils.js";
import {
  convertToBeaufort,
  convertWeatherCode,
  convertWindDirection,
  calculateWindChill
} from "../utils/conversion.js";

import { v4 as uuidv4 } from "uuid";

const db = initStore("readings");

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },

  async addReading(stationId, reading) {
    await db.read();
    reading._id = uuidv4();
    reading.stationid = stationId;

    const timeStamp = new Date();
    reading.date = `${timeStamp.getFullYear()}-${(timeStamp.getMonth() + 1).toString().padStart(2, '0')}-${timeStamp.getDate().toString().padStart(2, '0')}`;
    reading.time = `${timeStamp.getHours().toString().padStart(2, '0')}:${timeStamp.getMinutes().toString().padStart(2, '0')}`;

    const beaufortScale = convertToBeaufort(reading.windspeed);
    reading.beaufortScale = beaufortScale;

    const windDirection = convertWindDirection(reading.winddirection);
    reading.winddirection = windDirection;

    const windChill = calculateWindChill(reading.temp, reading.windspeed);
    reading.windchill = windChill;

    db.data.readings.push(reading);
    await db.write();
    return reading;
  },

  async getReadingsByStationId(id) {
    await db.read();
    return db.data.readings.filter((reading) => reading.stationid === id);
  },

  async getReadingById(id) {
    await db.read();
    return db.data.readings.find((reading) => reading._id === id);
  },

  async deleteReading(id) {
    await db.read();
    const index = db.data.readings.findIndex((reading) => reading._id === id);
    db.data.readings.splice(index, 1);
    await db.write();
  },

  async deleteAllReadings() {
    db.data.readings = [];
    await db.write();
  },

  async updateReading(reading, updatedReading) {
    reading.date = updatedReading.date;
    reading.time = updatedReading.time;
    reading.code = convertWeatherCode(updatedReading.code);
    reading.temp = updatedReading.temp;
    reading.windspeed = updatedReading.windspeed;
    reading.winddirection = updatedReading.winddirection;
    reading.windchill = updatedReading.windchill;
    reading.pressure = updatedReading.pressure;
    reading.latitude = updatedReading.latitude;
    reading.longitude = updatedReading.longitude;

    const beaufortScale = convertToBeaufort(updatedReading.windspeed);
    reading.beaufortScale = beaufortScale;

    const windDirection = convertWindDirection(updatedReading.winddirection);
    reading.windDirection = windDirection;

    const windChill = calculateWindChill(updatedReading.temp, updatedReading.windspeed);
    reading.windchill = windChill;

    await db.write();
  },

  async getLatestThreeReadings(stationId) {
    await db.read();
  
    const latestThreeReadings = db.data.readings
      .filter(reading => reading.stationid === stationId)
      .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
      .slice(0, 3);
  
    return latestThreeReadings;
  },
  

  determineTrend(latestThreeReadings) {
  if (latestThreeReadings.length < 3) {
      return 'insufficient-data';
  }

  if (latestThreeReadings[0].temp > latestThreeReadings[1].temp && latestThreeReadings[1].temp > latestThreeReadings[2].temp) {
      return 'rising';
  } else if (latestThreeReadings[0].temp < latestThreeReadings[1].temp && latestThreeReadings[1].temp < latestThreeReadings[2].temp) {
      return 'falling';
  } else {
      return 'stable';
  }
}


};