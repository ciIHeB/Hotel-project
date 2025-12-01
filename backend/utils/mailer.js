const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_ENABLED = process.env.EMAIL_ENABLED !== 'false'; // default true
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = !!(process.env.SMTP_SECURE === 'true');
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

let transporter = null;
let warned = false;
if (EMAIL_ENABLED && smtpHost && smtpPort && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass }
  });
} else {
  if (!warned) {
    console.warn('Email disabled or SMTP creds missing. Set EMAIL_ENABLED=true and SMTP_* env vars to enable.');
    warned = true;
  }
}

async function sendMail({ to, subject, html }) {
  if (!to) return;
  if (!EMAIL_ENABLED || !transporter) {
    if (!warned) {
      console.warn('Skipping email send (disabled or transporter not configured).');
      warned = true;
    }
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Hotel <no-reply@hotel.local>',
      to,
      subject,
      html
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

function bookingConfirmationTemplate({ booking }) {
  const { bookingId, checkIn, checkOut, totalAmount, status } = booking;
  const trackUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/suivi-reservation?bookingId=${encodeURIComponent(bookingId)}`;
  return `
  <div style="font-family:Arial,sans-serif">
    <h2>Confirmation de demande de réservation</h2>
    <p>Merci pour votre demande. Voici les détails:</p>
    <ul>
      <li><strong>Référence:</strong> ${bookingId}</li>
      <li><strong>Arrivée:</strong> ${new Date(checkIn).toLocaleDateString()}</li>
      <li><strong>Départ:</strong> ${new Date(checkOut).toLocaleDateString()}</li>
      <li><strong>Montant estimé:</strong> ${totalAmount} $</li>
      <li><strong>Statut:</strong> ${status}</li>
    </ul>
    <p>Suivez votre réservation ici: <a href="${trackUrl}">${trackUrl}</a></p>
    <p>Nous vous contacterons pour confirmation finale.</p>
  </div>`;
}

function bookingStatusUpdateTemplate({ booking }) {
  const { bookingId, status, cancellationReason } = booking;
  const trackUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/suivi-reservation?bookingId=${encodeURIComponent(bookingId)}`;
  return `
  <div style="font-family:Arial,sans-serif">
    <h2>Mise à jour de votre réservation</h2>
    <p>Votre réservation <strong>${bookingId}</strong> a été mise à jour.</p>
    <p><strong>Nouveau statut:</strong> ${status}</p>
    ${status === 'cancelled' && cancellationReason ? `<p><strong>Raison:</strong> ${cancellationReason}</p>` : ''}
    <p>Voir les détails: <a href="${trackUrl}">${trackUrl}</a></p>
  </div>`;
}

module.exports = {
  sendMail,
  bookingConfirmationTemplate,
  bookingStatusUpdateTemplate
};
