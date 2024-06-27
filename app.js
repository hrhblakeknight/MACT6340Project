import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import * as utils from "./utils/utils.js";
import * as db from "./utils/database.js";
import cors from 'cors'; // Import CORS

dotenv.config();

let projects = [];

const app = express();
app.use(cors());
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
    await db.connect()
    .then(async() => {
    projects = await db.getAllProjects();
    console.log(projects);
    res.render("index.ejs");
    })
});

app.get("/projects", async (req, res) => {
    await db.connect();
    projects = await db.getAllProjects();
    res.render("projects.ejs", { data: projects });
});

app.get("/project", (req, res) => {
    res.render("project.ejs");
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

app.use((req, res, next) => {
    res.status(404).send(`
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f0f0f0;
                    }
                    h1 {
                        font-size: 2em;
                        text-align: center;
                        color: #333;
                        animation: shake 0.5s infinite;
                    }
                    @keyframes shake {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                    .letter {
                        display: inline-block;
                        transition: transform 0.3s ease-out;
                    }
                    .falling {
                        transform: translateY(100vh);
                    }
                </style>
            </head>
            <body>
                <h1 id="error-message">This developer is an IDIOT and hasn't coded this page yet!</h1>
                <script>
                    const message = document.getElementById('error-message');
                    const letters = message.textContent.split('');
                    message.innerHTML = '';
                    letters.forEach(letter => {
                        const span = document.createElement('span');
                        if (letter === ' ') {
                            span.innerHTML = '&nbsp;';
                        } else {
                            span.textContent = letter;
                        }
                        span.classList.add('letter');
                        message.appendChild(span);
                    });
                    message.addEventListener('click', () => {
                        const spans = document.querySelectorAll('.letter');
                        spans.forEach((span, index) => {
                            setTimeout(() => {
                                span.classList.add('falling');
                            }, index * 100);
                        });
                    });
                </script>
            </body>
        </html>
    `);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
