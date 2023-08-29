import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { convertToBeaufort } from "../utils/conversion.js";
import { convertWeatherCode } from "../utils/conversion.js";
import {convertWindDirection} from "../utils/conversion.js";
import {calculateWindChill} from "../utils/conversion.js";


const db = initStore("readings");

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },

  async addReading(stationId, reading) {
    await db.read();
    reading._id = v4();
    reading.stationid = stationId;
    const beaufortScale = convertToBeaufort(reading.windspeed);
    reading.beaufortScale = beaufortScale;

    const windDirection = convertWindDirection(reading.winddirection);
    reading.winddirection = windDirection;

    const windChill = calculateWindChill(reading.temp, reading.windspeed);
    reading.windchill = windChill;

    reading.time = reading.time;
    reading.date = reading.date;

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
};