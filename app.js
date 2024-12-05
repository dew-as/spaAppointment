const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load appointments from file
let appointments = loadAppointmentsFromFile();

// Function to load appointments from file
function loadAppointmentsFromFile() {
    try {
        const data = fs.readFileSync('appointments.txt', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Function to save appointments to file
function saveAppointmentsToFile(appointments) {
    const data = JSON.stringify(appointments, null, 2);
    fs.writeFileSync('appointments.txt', data);
}

// GET /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// POST /submit-booking
app.post('/submit-booking', (req, res) => {
    const { name, email, phone, service, time, date, notes } = req.body;
    console.log('Booking:', phone, name, email, service, time, date, notes);

    const existingAppointment = appointments.find((appointment) => appointment.phone === phone);

    if (existingAppointment) {
        // Update the existing appointment
        existingAppointment.name = name;
        existingAppointment.email = email;
        existingAppointment.service = service;
        existingAppointment.time = time;
        existingAppointment.date = date;
        existingAppointment.notes = notes;
        res.send('Appointment modified successfully!');
    } else {
        // Create a new appointment
        appointments.push({ name, email, phone, service, time, date, notes });
        res.send('Appointment booked successfully!');
    }

    saveAppointmentsToFile(appointments);
});

// POST /modify-appointment
app.post('/modify-appointment', (req, res) => {
    const { phone, name, email, service, time, date, notes } = req.body;
    console.log('Modify:', phone, name, email, service, time, date, notes);

    const existingAppointment = appointments.find((appointment) => appointment.phone === phone);

    if (existingAppointment) {
        // Update the existing appointment
        existingAppointment.name = name;
        existingAppointment.email = email;
        existingAppointment.service = service;
        existingAppointment.time = time;
        existingAppointment.date = date;
        existingAppointment.notes = notes;
        saveAppointmentsToFile(appointments);
        res.send('Appointment modified successfully!');
    } else {
        res.status(404).send('Appointment not found!');
    }
});

// POST /cancel-appointment
app.post('/cancel-appointment', (req, res) => {
    const { phone } = req.body;
    console.log('Cancelling appointment for phone:', phone);

    const index = appointments.findIndex((appointment) => appointment.phone === phone);
    if (index !== -1) {
        appointments.splice(index, 1);
        saveAppointmentsToFile(appointments);
        res.send('Appointment cancelled successfully!');
    } else {
        res.status(404).send('Appointment not found!');
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
