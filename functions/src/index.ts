/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get SendGrid API key from environment config
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

export const emailOnContactUs = functions.firestore
  .document("contactus/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const userEmail = data.email || "Not provided";
    const userMessage = data.message || "No message";
    const sentTime = data.sentTimestamp?.toDate?.().toLocaleString() || "Unknown time";

    const msg = {
      to: "mfte.seattle@gmail.com",
      from: "mfte.seattle@gmail.com",
      subject: "New Contact Us Submission",
      html: `
        <p><strong>From:</strong> ${userEmail}</p>
        <p><strong>Sent At:</strong> ${sentTime}</p>
        <p><strong>Message:</strong></p>
        <p>${userMessage}</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("Contact email sent successfully");
    } catch (error) {
      console.error("Error sending contact email:", error);
    }
  });


