import express from "express";
import checkForUndefined from "./checkForUndefined.js";
import buildSite from "./buildSite.js";
import fs from "fs";
import admin from "firebase-admin";

// Read serviceAccount JSON file synchronously
const serviceAccount = JSON.parse(
  fs.readFileSync(
    "./webglide-ai-firebase-adminsdk-pq6n0-c2ad167325.json",
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const siteRouter = express.Router();

siteRouter.post("/build", async (request, response) => {
  const prompt = request.body.prompt;
  checkForUndefined(prompt);

  const sitePromise = buildSite(prompt);
  const webPage = await sitePromise;
  const combinedContent = webPage.combined;

  const db = admin.firestore();

  // Extract title from combinedContent
  const titleMatch = combinedContent.match(/<title>(.*?)<\/title>/);
  const siteTitle = titleMatch ? titleMatch[1] : "Untitled";

  // Create a new document with an auto-generated ID in the "sites" collection
  const docRef = db.collection("sites").doc();

  docRef
    .set({
      content: combinedContent,
      title: siteTitle,
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  const responseObject = {
    id: docRef.id,
    title: siteTitle,
  }

  response.status(200).json(responseObject);
});

siteRouter.get("/sample", async (request, response) => {
  response.status(200).json({id:"kiWp3g64QpHcg8uKqabb", title:"Todo App"});
});

siteRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  checkForUndefined(id);

  const db = admin.firestore();

  const docRef = db.collection("sites").doc(id);

  const doc = await docRef.get();

  if (!doc.exists) {
    response.status(404).json("Site not found");
  } else {
    const site = doc.data();
    response.status(200).send(site.content);
  }
});

export default siteRouter;
