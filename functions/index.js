// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendEmailConfirmation = functions.database.ref('/messages/{pushId}').onWrite((event) => {
  const mensaje = event.data.val();

  const mailOptions = {
    from: '"DVN '+mensaje.vendedor+'" <'+mensaje.emailV+'>',
    to: mensaje.emailC,
    cc: mensaje.emailV,
  };

  // Building Email message.
  mailOptions.subject = 'Solicitud de ' + mensaje.solicitud;
  mailOptions.text = 'Este es un mensaje de confirmación de que hemos recibido tu solicitud: '+ mensaje.solicitud + "-" + mensaje.texto;

  return mailTransport.sendMail(mailOptions)
    .then(() => console.log(`email sent to:`, mensaje.cliente))
    .catch((error) => console.error('There was an error while sending the email:', error));
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const solicitud = req.query.solicitud;
  const cliente = req.query.cliente;
  const emailC = req.query.emailC;
  const vendedor = req.query.vendedor;
  const emailV = req.query.emailV;
  const texto = req.query.texto;

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({solicitud:solicitud, cliente:cliente, emailC:emailC, vendedor:vendedor, emailV:emailV, texto:texto }).then((snapshot) => {

    return res.status(200).send("OK");
  });
});
