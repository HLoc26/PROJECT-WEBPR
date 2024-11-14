import homepageRoute from "./routes/homepage-route";
app.use("/Homepage", homepageRoute);
app.use("/List", homepageRoute);
import editorRoute from "./routes/editor-route";
app.use("/Editor", editorRoute);