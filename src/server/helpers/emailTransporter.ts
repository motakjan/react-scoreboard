import nodemailer from "nodemailer";

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "skrbrd@hotmail.com",
    pass: "EAbw:mWSu9P-Gt:",
  },
});

export const sendInvite = async (
  email: string,
  link: string
): Promise<void> => {
  try {
    const emailOptions: EmailOptions = {
      from: "skrbrd@hotmail.com",
      to: email,
      subject: "Invitation to join my application",
      html: `Click <a href="${link}">here</a> to join my application.`,
    };

    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.error(error);
  }
};
