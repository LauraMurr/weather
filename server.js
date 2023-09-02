import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { router } from "./routes.js";
import expressHandlebars from "express-handlebars";


const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());

// Handlebars setup with custom helper
const hbs = expressHandlebars.create({
  extname: '.hbs',
  helpers: {
    eq: (a, b) => a === b
  }
});

app.engine('.hbs', hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use("/", router);

const listener = app.listen(process.env.PORT || 4000, function () {
  console.log(`Laura's Weather App started on http://localhost:${listener.address().port}`);
});