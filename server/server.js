const mongoose = require("mongoose");
const express = require("express");
const cron = require("node-cron");

const scraper = require("../scraper");

const app = express();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! 💥");
  console.log(err.name, ": ", err.message);
  console.log(err.stack);
  console.log(`Shutting down the server due to an uncaught exception`);
  process.exit(1);
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`Listening on port ${process.env.PORT || 8000}...`)
);

mongoose
  .connect(
    "mongodb+srv://danialsyed66:5nnv@U3!ESdtXCz@cluster0.wbd6n.mongodb.net/price-getter?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then((con) =>
    console.log(`Connected to MongoDB Host: ${con.connection.host}...`)
  );

cron.schedule("15 0 * * *", async function () {
  console.log("Running scraper...");
  await scraper();
});

process.on("unhandledRejection", (err) => {
  console.log("UNCAUGHT REJECTION!!! 💥");
  console.log(err.name, ": ", err.message);
  console.log(err.stack);
  console.log("Shutting down server due to unhandled rejection");

  process.exit(1);
});
