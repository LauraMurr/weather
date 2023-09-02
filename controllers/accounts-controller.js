import { userStore } from "../models/user-store.js";

export const accountsController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

 

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("station", user.email);
      console.log(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },


  async getLoggedInUser(request) {
    const userEmail = request.cookies.station;
    console.log("userEmail:", userEmail); 
    const user = await userStore.getUserByEmail(userEmail);
    console.log("user:", user); 
    if (user) {
      user.firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
      user.lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);
    }
    return user;
  },

  async editProfile(request, response) {
    try {
      const user = await accountsController.getLoggedInUser(request);
      if (user) {
        const viewData = {
          title: "Edit Profile",
          user: user
        };
        response.render('editProfile-view', viewData);
      } else {
        response.redirect('/login');  // Redirect to login if user not found
      }
    } catch (err) {
      console.error("Error fetching user details for edit profile:", err);
      response.redirect('/dashboard'); // Redirect to dashboard on error
    }
  },
  
  
  
};