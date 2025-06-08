const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors'); // Import cors

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes and origins
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.htm as the main page from the 'public' directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.htm'));
});

// app.use(express.static(path.join(__dirname, 'public')));

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).send('Παρακαλούμε συμπληρώστε όλα τα πεδία της φόρμας.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send('Παρακαλούμε εισάγετε μια έγκυρη διεύθυνση email.');
    }

    // Nodemailer transporter setup
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'maddison53@ethereal.email',
            pass: 'jn7jnAPss4f63QBp6D'
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'ana2trandiou@gmail.com',
        replyTo: email,
        subject: `Νέο μήνυμα από ${name} μέσω της φόρμας επικοινωνίας`,
        text: `Όνομα: ${name}\nEmail: ${email}\n\nΜήνυμα:\n${message}`,
        html: `<p><strong>Όνομα:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Μήνυμα:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        res.status(200).send('Ευχαριστούμε! Το μήνυμά σας έχει σταλεί.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Κάτι πήγε στραβά και δεν μπορέσαμε να στείλουμε το μήνυμά σας.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
