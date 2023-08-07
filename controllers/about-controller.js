export const aboutController = {
  index(request, response) {
    const viewData = {
      title: "About Laura's Weather App",
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
