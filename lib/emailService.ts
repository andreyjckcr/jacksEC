import nodemailer from "nodemailer";
import path from "path";

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

/**
 * 📩 Envía un correo de confirmación de compra.
 */

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
        filename: "logoJacks.png",
        path: path.join(process.cwd(), "public", "logoJacks.png"),
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

/**
 * 🔑 Envía un correo de notificación cuando un usuario inicia sesión.
 */
export async function sendLoginNotification(email: string, nombre: string, ip: string, userAgent: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Inicio de sesión detectado - Jack's Ecommerce",
    html: `
      <img src="cid:logoJacks" alt="Jack's Logo" width="200" />
      <h2>Hola, ${nombre}</h2>
      <p>Se ha detectado un inicio de sesión en tu cuenta de Jack's Ecommerce.</p>
      <p><strong>IP:</strong> ${ip}</p>
      <p><strong>Dispositivo:</strong> ${userAgent}</p>
      <p>Si fuiste tú, no tienes que hacer nada. Si no reconoces este inicio de sesión, contacta con soporte.</p>
      <p>¡Gracias por confiar en Jack's!</p>
    `,
    attachments: [
      {
        filename: "logoJacks.png",
        path: path.join(process.cwd(), "public", "logoJacks.png"),
        cid: "logoJacks",
      },
    ],
  });
}
