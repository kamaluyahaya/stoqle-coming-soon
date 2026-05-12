import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    // Add timeout to prevent hanging
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

async function sendWelcomeEmail(toEmail: string) {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error("Critical: SMTP Environment variables are missing!");
    throw new Error("SMTP Configuration missing");
  }

  const transporter = getTransporter();

  // Log configuration (masking password)
  console.log("Attempting to send email with config:", {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    from: process.env.MAIL_FROM,
  });

  const mailOptions = {
    from: `"Stoqle" <${process.env.MAIL_FROM}>`,
    to: toEmail,
    subject: "Welcome to the Stoqle Inner Circle! 🚀",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #f43f5e; font-style: italic; font-weight: bold;">stoqle</h2>
        <h3 style="color: #111827;">Welcome to the Inner Circle!</h3>
        <p>Hi there,</p>
        <p>Thank you for joining the Stoqle waitlist! We're excited to have you with us on this journey.</p>
        <p>Stoqle is building a revolutionary ecosystem where community meets commerce seamlessly. As an early adopter, you'll be among the first to experience the future of social commerce.</p>
        <div style="background-color: #fff1f2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffe4e6;">
          <p style="margin: 0; font-weight: bold; color: #f43f5e;">Your Early Access Perk:</p>
          <p style="margin: 5px 0 0 0;">Enjoy <strong>6 months of zero-fee trading</strong> once we launch!</p>
        </div>
        <p>We'll keep you updated on our progress and let you know as soon as we're ready for launch.</p>
        <p>Stay tuned,</p>
        <p><strong>The Stoqle Team</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">&copy; 2024 Stoqle Inc. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Error Details:", error);
    throw error;
  }
}

async function sendAdminNotification(newEmail: string) {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"Stoqle Waitlist" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_FROM_TO_ME, // Send to yourself
    subject: `🎉 New Waitlist Sign-up: ${newEmail}`,
    text: `You have a new waitlist sign-up!\n\nEmail: ${newEmail}\nTime: ${new Date().toISOString()}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}

export async function POST(req: Request) {
  console.log("POST /api/waitlist received a request");
  try {
    const { email } = await req.json();
    console.log("Email to add:", email);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Try to save to local file system (might fail on Vercel/serverless due to read-only FS)
    let isDuplicate = false;
    try {
      if (!fs.existsSync(WAITLIST_FILE)) {
        fs.writeFileSync(WAITLIST_FILE, JSON.stringify([]));
      }

      const data = fs.readFileSync(WAITLIST_FILE, "utf8");
      const waitlist = JSON.parse(data);

      isDuplicate = waitlist.some((entry: any) => entry.email === email);

      if (!isDuplicate) {
        waitlist.push({
          email,
          timestamp: new Date().toISOString(),
        });
        fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));
      }
    } catch (fsError) {
      console.warn("Could not write to filesystem (expected in serverless):", fsError);
      // We continue execution so the user still gets the email and a success message
    }

    if (isDuplicate) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    // Send Emails
    try {
      await sendWelcomeEmail(email);
      console.log(`Welcome email sent to: ${email}`);

      // Send admin notification so you don't lose the data!
      await sendAdminNotification(email);
    } catch (mailError) {
      console.error("Failed to send emails:", mailError);
      // In production, you might want to return an error if SMTP fails, 
      // but if the user successfully signs up, a 500 might confuse them.
      // Since FS might have failed too, we should throw if emails fail so they can try again.
      throw new Error("Failed to process waitlist and emails.");
    }

    return NextResponse.json(
      { message: "Successfully joined the waitlist" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist. Please try again." },
      { status: 500 }
    );
  }
}
