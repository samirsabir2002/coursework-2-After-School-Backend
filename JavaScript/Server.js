const express = require("express");
const http = require("http");
const mongodb = require("mongodb").MongoClient;
const connectStringUri =
  "mongodb+srv://sameerdb:samir123@cluster0.nueoqmp.mongodb.net/";
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
// let collection;

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
    req.collection = db.collection(collectionName);
  } catch (ex) {
    console.error("Error accessing collection:", error);
  }
  return next();
});

app.get("/collection/:collectionName", (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not  connceted");
    }

    if (!req.collection) {
      throw new Error("Collection not found");
    }

    req.collection.find({}).toArray((e, result) => {
      console.log("🚀 ~ req.collection.find ~ results:", result);
      res.send(result);
    });
  } catch (error) {
    console.error("Error accessing collection:", error);
  }
});

app.post("/collection/:collectionName", (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not  connceted");
    }

    if (!req.collection) {
      throw new Error("Collection not found");
    }
    req.collection.insert(req.body, (e, result) => {
      console.log("🚀 ~ req.collection.insert ~ results:" + result.ops);
      res.send(result.ops);
    });
  } catch (error) {
    console.error("Error accessing collection:", error);
  }
});

const objectID = require("mongodb").ObjectID;
app.put("/collection/:collectionName", async (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not  connceted");
    }

    if (!req.collection) {
      throw new Error("Collection not found");
    }

    req.collection.findone(
      { _id: new objectID(req.params.id) },
      (e, result) => {
        console.log("🚀 ~ app.put ~ result:", result);
        res.send(Json_Result);
      }
    );
  } catch (error) {
    console.error("Error accessing collection:", error);
  }
});

app.post("/collection/:collectionName/search", async (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not  connceted");
    }

    if (!req.collection) {
      throw new Error("Collection not found");
    }
    let query = new RegExp(req.body.searchvalue.trim(), "i");
    req.collection
      .find({
        $or: [
          {
            subject: { $regex: query },
            location: { $regex: query }
          }
        ]
      })
      .toArray((e, result) => {
        console.log("🚀 ~ app.put ~ result:", result);
        res.send(result);
      });
  } catch (error) {
    console.error("Error accessing collection:", error);
  }
});
app.put(
  "/collection/:collectionName/:id/reduce/:attributeValue/:spaceValue",
  async (req, res, next) => {
    try {
      if (!db) {
        throw new Error("Databse is not  connceted");
      }

      if (!req.collection) {
        throw new Error("Collection not found");
      }

      req.collection.update(
        { _id: new objectID(req.params.id) },
        { $inc: { availability: -1 * parseInt(req.params.spaceValue) } },
        { safe: true, multi: false },
        (e, result) => {
          console.log("🚀 ~ app.put ~ result:", result);
          res.send(
            result.result.n === 1 ? { msg: "success" } : { msg: "error" }
          );
        }
      );
    } catch (error) {
      console.error("Error accessing collection:", error);
    }
  }
);

app.use((req, res, next) => {
  var Imagepath = path.join(__dirname, "../Images", req.url);
  fs.stat(Imagepath, (err, fileinfo) => {
    if (err) {
      console.error("File not found:", Imagepath);
      next();
      return;
    }
    if (fileinfo.isFile()) res.sendFile(Imagepath);
    else next();
  });
});

const port = process.env.Port || 3000;
app.listen(port, () => {
  console.log("Server running at localhost:3000");
});
