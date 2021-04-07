import express from "express";
import env from "dotenv";
import mongoose from "mongoose";
import auth from "./router/auth.js";
const app = express();

env.config();

app.use(express.json());
app.use("/", auth);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.09q6y.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
