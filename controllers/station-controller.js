import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { convertToBeaufort } from "../utils/conversion.js";
import { convertWeatherCode } from "../utils/conversion.js";
import {convertWindDirection} from "../utils/conversion.js";
import {calculateWindChill} from "../utils/conversion.js";



export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const reversedReadings = [...station.readings].reverse();
    const viewData = {
      title: "Station",
      station: { ...station, readings: reversedReadings },
    };
    response.render("station-view", viewData);
  },

  async addReading(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReading = {
      code: convertWeatherCode(Number(request.body.code)),
      temp: Number(request.body.temp),
      windspeed: Number(request.body.windspeed),
      winddirection: Number(request.body.winddirection),
      pressure: Number(request.body.pressure),
    };
    const windDirection = convertWindDirection(newReading.winddirection);
    const beaufortScale = convertToBeaufort(newReading.windspeed);
    const windChill = calculateWindChill(newReading.temp, newReading.windspeed);
    newReading.windchill = windChill;
    

    console.log(`adding reading ${newReading.code}, ${newReading.temp}, ${newReading.windspeed},`);
    console.log("Station Readings:", station.readings);
    console.log("Windspeed:", newReading.windspeed);
    console.log("Beaufort Scale:", beaufortScale);
    console.log("Wind direction:", windDirection);
    console.log("Wind Chill:", windChill);

    await readingStore.addReading(station._id, newReading);
    response.redirect("/station/" + station._id);
  },

  async deleteReading(request, response) {
    const stationId = request.params.stationid;
    const readingId = request.params.readingid;
    console.log(`Deleting Reading ${readingId} from Station ${stationId}`);
    await readingStore.deleteReading(readingId);
    response.redirect("/station/" + stationId);
  },
  
};