import { accountsController } from "./accounts-controller.js";
import { stationStore } from "../models/station-store.js";


export const dashboardController = {
  async index(request, response) {
  const loggedInUser = await accountsController.getLoggedInUser(request);
  const userStations = await stationStore.getStationsByUserId(loggedInUser._id);

  const viewData = {
    title: "Station Dashboard",
    stations: userStations,
    loggedInUser: loggedInUser,
  };

  console.log("dashboard rendering");
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
