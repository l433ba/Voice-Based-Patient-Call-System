import express from 'express';
import { getPriority, generateDescription } from '../services/priorityService';

const router = express.Router();

router.post('/ai-test', async (req, res) => {
  try {
    const { disease } = req.body;
    
    if (!disease) {
      return res.status(400).json({
        success: false,
        message: 'Disease is required'
      });
    }

    console.log('Testing AI for disease:', disease);

    const startTime = Date.now();
    const [priority, description] = await Promise.all([
      getPriority(disease),
      generateDescription(disease)
    ]);
    const endTime = Date.now();

    res.json({
      success: true,
      data: {
        disease,
        priority,
        description,
        processingTime: `${endTime - startTime}ms`
      }
    });
  } catch (error) {
    console.error('AI test error:', error);
    res.status(500).json({
      success: false,
      message: 'AI test failed',
      error: (error as Error).message
    });
  }
});

export default router; 