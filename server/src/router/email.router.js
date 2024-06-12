import express from "express";
import nodemailer from "nodemailer";
import bwipjs from 'bwip-js';
import fs from 'fs';

const router = new express.Router();

router.post("/confirm", async (req, res) => {
  const { userEmail, eventBanner, eventName, eventDate, eventTime, venue } =
    req.body;

  try {
    // Generate barcode
    const barcodeOptions = {
      bcid: 'code128',
      text: userEmail, // You can modify this to encode necessary information
      scale: 3,
      height: 10,
      includetext: true,
    };

    const barcodeBase64 = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(barcodeOptions, function (err, png) {
        if (err) {
          reject(err);
        } else {
          resolve(png);
        }
      });
    });

    // Write barcode image to a temporary file
    const barcodeFileName = `${Date.now()}-barcode.png`;
    fs.writeFileSync(barcodeFileName, barcodeBase64);

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const processedEventTime = eventTime.replace(/\s+/g, "").toUpperCase();

    const formattedTime = new Date(
      `2000-01-01T${processedEventTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Congratulations !! RSVP Confirmed!",
      html: `
        <h1>Congratulations! Your ticket for ${eventName} has been generated</h1>
        <div style="margin-bottom: 20px;">
          <img src=${eventBanner} style="width: 800px; height: auto; display: block; margin: 0 auto; padding: 5px;" />
        </div>
        <div style="margin-bottom: 20px;">
          <img src="cid:${barcodeFileName}" style="width: 400px; height: auto; display: block; margin: 0 auto;" />
        </div>
        <p>Event Date: ${formattedDate}</p>
        <p>Event Time: ${formattedTime}</p>
        <p>Venue: ${venue}</p>
      `,
      attachments: [{
        filename: barcodeFileName,
        path: barcodeFileName,
        cid: barcodeFileName
      }]
    };

    // Send email with attachments
    transporter.sendMail(mailOptions, (error, info) => {
      // Delete the temporary barcode image file
      fs.unlinkSync(barcodeFileName);

      if (error) {
        console.log("Error in sending mail:", error);
        res.status(500).json({ error: "Error in sending mail" });
      } else {
        console.log("Email sent successfully:", info.response);
        res.status(201).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;