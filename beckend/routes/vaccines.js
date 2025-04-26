const router = require('express').Router();
const Vaccine = require('../models/Vaccine');
const authMiddleware = require('../middleware/auth');

router.get('/patient', authMiddleware, async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ patientId: req.user.id });
    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/provider', authMiddleware, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const vaccines = await Vaccine.find({ providerId: req.user.id });
    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const vaccine = new Vaccine({
      ...req.body,
      providerId: req.user.id
    });
    await vaccine.save();
    res.status(201).json(vaccine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/report', authMiddleware, async (req, res) => {
  try {
    const vaccine = await Vaccine.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user.id },
      { 
        dateAdministered: new Date(),
        status: 'pending-verification'
      },
      { new: true }
    );
    res.json(vaccine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/verify', authMiddleware, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const vaccine = await Vaccine.findOneAndUpdate(
      { _id: req.params.id, providerId: req.user.id },
      { 
        verifiedByProvider: true,
        status: 'completed'
      },
      { new: true }
    );
    res.json(vaccine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;