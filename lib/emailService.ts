// emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export async function sendConfirmationEmail(
  email: string,
  nombre: string,
  transactionId: string,
  total: number,
  pdfBuffer: Buffer
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmación de compra - Jack's Ecommerce",
    html: `
      <img src="cid:logoJacks" alt="Jack's Logo" width="200" />
      <h2>¡Gracias por tu compra, ${nombre}!</h2>
      <p>Tu pedido ha sido confirmado con éxito.</p>
      <p><strong>ID de la transacción:</strong> ${transactionId}</p>
      <p><strong>Total pagado:</strong> ₡${total.toFixed(2)}</p>
      <p>¡Gracias por confiar en Jack's!</p>
    `,
    attachments: [
      {
        filename: "logo1.png",
        path: "C:/Users/icortez/Desktop/Jacks Ecommerce/public/logo1.png",
        cid: "logoJacks",
      },
      {
        filename: `Factura_${transactionId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });  
}
