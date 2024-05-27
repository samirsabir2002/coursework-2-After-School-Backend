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

app.use(express.json()); // Middleware to parse JSON bodies
app.set("port", 300); // Set port for the server
app.use((req, res, next) => {
  res.setHeader("Access-Control-Orign", "*"); // Allow cross-origin requests
  res.header("Access-Control-Allow-Headers", "*"); // Allow all headers
  next();
});

app.use(cors()); // Enable CORS for all routes

app.use(function (req, res, next) {
  console.log("Request IP:" + req.url); // Log the request URL
  console.log("Request date:" + new Date()); // Log the request date
  next();
});

let db; // Variable to hold the database connection

// Connect to MongoDB
mongodb.connect(connectStringUri).then((client) => {
  try {
    db = client.db("afterschool"); // Select the database
    console.log(`Connected to database: ${db.databaseName}`); // Log successful connection
  } catch (ex) {
    console.error("exception:" + ex); // Log any exceptions
  }
});

// Default route
app.get("/", (req, res, next) => {
  res.send("Select a collection,e.g./collection/products"); // Instructions for selecting a collection
});

// Middleware to handle collection name parameter
app.param("collectionName", (req, res, next, collectionName) => {
  try {
    req.collection = db.collection(collectionName); // Set the collection in the request
  } catch (ex) {
    console.error("Error accessing collection:", error); // Log any errors
  }
  return next();
});

// Route to get all documents from a collection
app.get("/collection/:collectionName", (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not connected"); // Check if database is connected
    }

    if (!req.collection) {
      throw new Error("Collection not found"); // Check if collection is found
    }

    req.collection.find({}).toArray((e, result) => {
      console.log("🚀 ~ req.collection.find ~ results:", result); // Log the result
      res.send(result); // Send the result to the client
    });
  } catch (error) {
    console.error("Error accessing collection:", error); // Log any errors
  }
});

// Route to insert a document into a collection
app.post("/collection/:collectionName", (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not connected"); // Check if database is connected
    }

    if (!req.collection) {
      throw new Error("Collection not found"); // Check if collection is found
    }
    req.collection.insert(req.body, (e, result) => {
      console.log("🚀 ~ req.collection.insert ~ results:" + result.ops); // Log the result
      res.send(result.ops); // Send the result to the client
    });
  } catch (error) {
    console.error("Error accessing collection:", error); // Log any errors
  }
});

const objectID = require("mongodb").ObjectID;
// Route to update a document in a collection
app.put("/collection/:collectionName", async (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not connected"); // Check if database is connected
    }

    if (!req.collection) {
      throw new Error("Collection not found"); // Check if collection is found
    }

    req.collection.findone(
      { _id: new objectID(req.params.id) },
      (e, result) => {
        console.log("🚀 ~ app.put ~ result:", result); // Log the result
        res.send(Json_Result); // Send the result to the client
      }
    );
  } catch (error) {
    console.error("Error accessing collection:", error); // Log any errors
  }
});

// Route to search documents in a collection
app.post("/collection/:collectionName/search", async (req, res, next) => {
  try {
    if (!db) {
      throw new Error("Databse is not connected"); // Check if database is connected
    }

    if (!req.collection) {
      throw new Error("Collection not found"); // Check if collection is found
    }
    let query = new RegExp(req.body.query.trim(), "i"); // Create a regex for the search query
    req.collection
      .find({
        $or: [
          { subject: { $regex: query } }, // Search by subject
          { location: { $regex: query } } // Search by location
        ]
      })
      .toArray((e, result) => {
        console.log("🚀 ~ app.put ~ result:", result); // Log the result
        res.send(result); // Send the result to the client
      });
  } catch (error) {
    console.error("Error accessing collection:", error); // Log any errors
  }
});

// Route to reduce the availability of a product
app.put(
  "/collection/:collectionName/:id/reduce/:attributeValue/:spaceValue",
  async (req, res, next) => {
    try {
      if (!db) {
        throw new Error("Databse is not connected"); // Check if database is connected
      }

      if (!req.collection) {
        throw new Error("Collection not found"); // Check if collection is found
      }

      req.collection.update(
        { _id: new objectID(req.params.id) }, // Find the document by ID
        { $inc: { availability: -1 * parseInt(req.params.spaceValue) } }, // Decrement the availability
        { safe: true, multi: false }, // Ensure the operation is safe and affects only one document
        (e, result) => {
          console.log("🚀 ~ app.put ~ result:", result); // Log the result
          res.send(
            result.result.n === 1 ? { msg: "success" } : { msg: "error" }
          ); // Send success or error message
        }
      );
    } catch (error) {
      console.error("Error accessing collection:", error); // Log any errors
    }
  }
);

// Middleware to serve images
app.use((req, res, next) => {
  var Imagepath = path.join(__dirname, "../Images", req.url); // Construct the image path
  fs.stat(Imagepath, (err, fileinfo) => {
    if (err) {
      console.error("File not found:", Imagepath); // Log if file is not found
      next();
      return;
    }
    if (fileinfo.isFile())
      res.sendFile(Imagepath); // Serve the file if it exists
    else next(); // Otherwise, proceed to the next middleware
  });
});

const port = process.env.Port || 3000; // Set the port for the server
app.listen(port, () => {
  console.log("Server running at localhost:3000"); // Log that the server is running
});
