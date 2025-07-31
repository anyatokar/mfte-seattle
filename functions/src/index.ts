import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as sgMail from "@sendgrid/mail";
import { IContactData } from "./IContactFormFields";
import { defineSecret } from "firebase-functions/params";

const SENDGRID_KEY = defineSecret("SENDGRID_KEY");

export const emailOnContactUsV2 = onDocumentCreated(
  {
    document: "contactus/{docId}",
    secrets: [SENDGRID_KEY],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.error("No Firestore snapshot available");
      return;
    }

    const data = snap.data() as IContactData;
    const { authorName, email, description, subject, message, sentTimestamp } =
      data;

    sgMail.setApiKey(SENDGRID_KEY.value());

    const msg = {
      to: "mfte.seattle@gmail.com",
      from: "mfte.seattle@gmail.com",
      subject: "Reply to your message from mfte-seattle.com",
      html: `
        <p><strong>From:</strong> ${authorName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${sentTimestamp.toDate().toLocaleString()}</p>
        <p><strong>Role:</strong> ${description}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    try {
      await sgMail.send(msg);
      logger.info("Contact email sent successfully");
    } catch (error) {
      logger.error("Error sending contact email:", error);
    }
  }
);
