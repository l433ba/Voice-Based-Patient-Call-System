const express = require('express');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    // For now, return mock data
    const appointments = [
      {
        id: '1',
        date: '2024-03-20',
        time: '10:00 AM',
        department: 'Cardiology',
        status: 'confirmed',
        doctorName: 'Dr. Smith',
        type: 'Check-up'
      }
    ];
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

module.exports = router; 