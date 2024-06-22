import express from "express"; 
import dotenv from "dotenv";
import nodemailer from 'nodemailer'; 
dotenv.config(); 

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.static("public"));

const projectArray = [
    { title: "Project 1", description: "Description of project 1" },
    { title: "Project 2", description: "Description of project 2" },
    { title: "Project 3", description: "Description of project 3" }
];

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/projects", (req, res) => {
    res.render("projects", { projectArray });
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

const transporter = nodemailer.createTransport({
    service: 'hotmail', 
    auth: {
        user: process.env.MAIL_USERNAME, 
        pass: process.env.MAIL_PASSWORD 
    }
});

app.post('/mail', (req, res) => {
    const mailOptions = {
        from: process.env.MESSAGE_FROM,  
        to: process.env.MESSAGE_TO,      
        subject: req.body.sub,           
        text: req.body.txt               
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email', error: error.toString() });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email successfully sent!', info: info.response });
    });
});

app.get('/test-mail', (req, res) => {
    const mailOptions = {
        from: process.env.MESSAGE_FROM,
        to: process.env.MESSAGE_TO,
        subject: 'Test Email from Node.js',
        text: 'If you\'re seeing this email, your setup works!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Test email error:', error);
            return res.status(500).send("Error sending test email: " + error.message);
        }
        res.send("Test email sent successfully: " + info.response);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
