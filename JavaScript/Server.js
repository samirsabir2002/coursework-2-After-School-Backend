const express = require("express");
const http = require("http");
const mongodb = require("mongodb").MongoClient;
const connectStringUri =
  "mongodb+srv://sameerdb:samir123@cluster0.nueoqmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const app = express();

app.use(express.json());
app.set("port", 300);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Orign", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(cors());

app.use(function (req, res, next) {
  console.log("Request IP:" + req.url);
  console.log("Request date:" + new Date());
  next();
});

let db;
let collection;

mongodb.connect(connectStringUri).then((client) => {
  try {
    db = client.db("afterschool");
    console.log(`Connected to database: ${db.databaseName}`);
  } catch (ex) {
    console.error("exception:" + ex);
  }
});

app.get("/", (req, res, next) => {
  res.send("Select a collection,e.g./collection/products");
});

app.param("collectionName", (req, res, next, collectionName) => {
  try {
    collection = db.collection(collectionName);
  } catch (ex) {
    console.error("Error accessing collection:", error);
  }
  return next();
});

app.get("/collection/:collectionName", async (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not  connceted");
    }

    if (!collection) {
      throw new Error("Collection not found");
    }

    var result = await collection.find({}).toArray();
    console.log("🚀 ~ req.collection.find ~ results:", result);
    res.send(result);
  } catch (error) {
    console.error("Error accessing collection:", error);
  }
});

const port = process.env.Port || 3000;
app.listen(port, () => {
  console.log("Server running at localhost:3000");
});
