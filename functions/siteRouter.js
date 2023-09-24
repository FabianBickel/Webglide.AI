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

const db = admin.firestore();
const siteCollection = db.collection("sites");

const siteRouter = express.Router();

siteRouter.post("/build", async (request, response) => {
  const prompt = request.body.prompt;
  checkForUndefined(prompt);

  const webPage = await buildSite(prompt);
  const combinedContent = webPage.combined;

  const titleMatch = combinedContent.match(/<title>(.*?)<\/title>/);
  const siteTitle = titleMatch ? titleMatch[1] : "Untitled";

  const docRef = siteCollection.doc(); // Declare docRef here

  await docRef.set({
    content: combinedContent,
    title: siteTitle,
  });

  const responseObject = {
    id: docRef.id,
    title: siteTitle,
  };

  response.status(200).json(responseObject);
});

siteRouter.post("/sample", async (request, response) => {
  console.log(request);
  response
    .status(200)
    .json({ id: "vS18bYLIDDdmaPT7FTyj", title: "Company Landing Page" });
});

siteRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  checkForUndefined(id);

  const docRef = siteCollection.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    response.status(404).json("Site not found");
  } else {
    const site = doc.data();
    response.status(200).send(site.content);
  }
});

export default siteRouter;
