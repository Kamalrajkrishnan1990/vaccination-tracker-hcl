const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/vaccine-tracker')
  .then(() => console.log('MongoDB connected locally!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = User.findOne(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful!' });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required.' });
  }

  const existingUser = User.findOne(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  User.save({ email, password: hashedPassword });

  res.json({ message: 'User registered successfully!' });
});


app.get(
  '/patient-data',
  // roleMiddleware('patient'),
  async (req, res) => {
    try {
      const patient = await User.findById(req.userId)
        .select('-password')
        .lean();

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }


      if (patient._id.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to access this data'
        });
      }


      const vaccines = await Vaccine.find({ patientId: req.userId })
        .sort({ dateScheduled: 1 })
        .lean();


      const responseData = {
        patientInfo: {
          id: patient._id,
          fullName: patient.profile.fullName,
          email: patient.email,
          phone: patient.profile.phone,
          allergies: patient.profile.allergies || [],
          medicalHistory: patient.profile.medicalHistory || ''
        },
        vaccineRecords: vaccines.map(vaccine => ({
          id: vaccine._id,
          name: vaccine.name,
          status: vaccine.status,
          dateScheduled: vaccine.dateScheduled,
          dateAdministered: vaccine.dateAdministered || null,
          providerNotes: vaccine.providerNotes || ''
        })),
        summary: {
          totalVaccines: vaccines.length,
          completed: vaccines.filter(v => v.status === 'completed').length,
          upcoming: vaccines.filter(v => v.status === 'scheduled').length,
          overdue: vaccines.filter(v => v.status === 'overdue').length
        }
      };


      res.status(200).json({
        success: true,
        data: responseData,
        message: 'Patient data retrieved successfully'
      });

    } catch (error) {
      console.error('Error fetching patient data:', error);


      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid patient ID format'
        });
      }


      res.status(500).json({
        success: false,
        message: 'Failed to retrieve patient data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));