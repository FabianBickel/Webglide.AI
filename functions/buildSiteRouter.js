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

const buildSiteRouter = express.Router();

buildSiteRouter.get("/build", async (request, response) => {
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
      title: siteTitle,
      content: combinedContent,
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  response.status(200).json(siteTitle);
});

export default buildSiteRouter;
