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

    // Ensure the waitlist file exists
    if (!fs.existsSync(WAITLIST_FILE)) {
      fs.writeFileSync(WAITLIST_FILE, JSON.stringify([]));
    }

    // Read current waitlist
    const data = fs.readFileSync(WAITLIST_FILE, "utf8");
    const waitlist = JSON.parse(data);

    // Check for duplicates
    const isDuplicate = waitlist.some((entry: any) => entry.email === email);

    if (isDuplicate) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    // Add new entry
    const newEntry = {
      email,
      timestamp: new Date().toISOString(),
    };

    waitlist.push(newEntry);
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));

    // Send Welcome Email
    try {
      await sendWelcomeEmail(email);
      console.log(`Welcome email sent to: ${email}`);
    } catch (mailError) {
      console.error("Failed to send welcome email:", mailError);
      // We don't return an error to the user if only the email fails, 
      // as they are already successfully on the list.
    }

    return NextResponse.json(
      { message: "Successfully joined the waitlist" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
