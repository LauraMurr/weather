import { accountsController } from "./accounts-controller.js";
import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { convertToBeaufort } from "../utils/conversion.js";
import { convertWeatherCode } from "../utils/conversion.js";
import {convertWindDirection} from "../utils/conversion.js";
import {calculateWindChill} from "../utils/conversion.js";
import {convertToFahrenheit} from "../utils/conversion.js";


export const dashboardController = {
  async index(request, response) {
  const loggedInUser = await accountsController.getLoggedInUser(request);
  const userStations = await stationStore.getStationsByUserId(loggedInUser._id);

  for (let station of userStations) {
    // Fetch readings for the current station
    const readings = await readingStore.getReadingsByStationId(station._id);  // Assuming you have such a function
    
    // Sort readings by date and time
    readings.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;  // sort in descending order
    });
    
    // Attach the latest reading to the station
    if (readings.length > 0) {
        station.latestReading = readings[0];
    }
}

  const viewData = {
    title: "Station Dashboard",
    stations: userStations,
    loggedInUser: loggedInUser,
  };

  console.log("dashboard rendering");
  console.log(userStations);
  response.render("dashboard-view", viewData);
},


  async addStation(request, response) {
  try {
    const loggedInUser = await accountsController.getLoggedInUser(request);
  
    const newStation = {
      title: request.body.title.toUpperCase(),
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      userid: loggedInUser._id, 
    };

    console.log(`adding station ${newStation.title}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  } catch (error) {
    console.error("Error adding station:", error);
    response.redirect("/dashboard"); 
  }
},


  async deleteStation(request, response) {
    const stationId = request.params.id;
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const stationToDelete = await stationStore.getStationById(stationId);
    if (stationToDelete.userid === loggedInUser._id) {
      console.log(`Deleting Station ${stationId}`);
      await stationStore.deleteStationById(stationId);
    }
    
    response.redirect("/dashboard");
  },
  
};
