import nodemailer from "nodemailer"
import config from "../config"

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass,
  },
})

// Interface for email data
interface EmailData {
  to: string
  subject: string
  content: string
}

// Send an email
export const sendEmail = async (emailData: EmailData): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"E-Commerce" <${config.email.auth.user}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.content,
    })

    console.log(`Email sent: ${info.messageId}`)

    // For Ethereal Email, log the preview URL
    if (config.email.host === "smtp.ethereal.email") {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify()
    console.log("Email configuration verified")
    return true
  } catch (error) {
    console.error("Email configuration error:", error)
    return false
  }
}

