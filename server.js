const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON data

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/employeesDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Create Employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  job: String,
});


const path = require('path'); // To handle file paths

// Serve HTML file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Change the path to where your HTML file is located
});


const Employee = mongoose.model('Employee', employeeSchema);

// Routes for CRUD operations

// Create Employee (POST)
app.post('/api/employees', async (req, res) => {
  const { name, email, phone, job } = req.body;
  try {
    const newEmployee = new Employee({ name, email, phone, job });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Employees (GET)
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Employee (PUT)
app.put('/api/employees/:id', async (req, res) => {
  const { name, email, phone, job } = req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { name, email, phone, job }, { new: true });
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Employee (DELETE)
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Server listening
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});