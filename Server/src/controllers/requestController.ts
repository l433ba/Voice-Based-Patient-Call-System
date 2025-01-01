import { Request, Response } from 'express';
import { Patient } from '../models/Patient';
import { Request as PatientRequest } from '../models/Request';
import { socketService } from '../server';
import { AppError } from '../utils/AppError';
import { getPriority, generateDescription } from '../services/priorityService';

// Add a type for priority
type Priority = 'low' | 'medium' | 'high' | 'critical';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { fullName, contactNumber, roomNumber, bedNumber, disease } = req.body;

    // Check for duplicate active request
    const existingRequest = await PatientRequest.findOne({
      fullName,
      contactNumber,
      roomNumber,
      status: { $in: ['pending', 'assigned', 'in_progress'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'An active request already exists for this patient'
      });
    }

    // Generate AI fields first
    let priority: string = 'medium';
    let description: string = '';
    
    try {
      // Wait for both priority and description before creating request
      [priority, description] = await Promise.all([
        getPriority(disease),
        generateDescription(disease)
      ]);
      
      console.log('Generated AI fields:', { priority, description });
      
      // Ensure priority is valid
      if (!['low', 'medium', 'high', 'critical'].includes(priority)) {
        priority = 'medium';
      }
    } catch (aiError) {
      console.error('Error generating AI fields:', aiError);
      description = `Patient reported with ${disease}`;
      priority = 'medium';
    }

    // Create request with all fields including AI-generated ones
    const request = await PatientRequest.create({
      fullName,
      contactNumber,
      roomNumber,
      bedNumber,
      disease,
      status: 'pending',
      priority: priority as Priority,
      description,
      ...(req.user?._id && { patient: req.user._id })
    });

    // Emit to nurses via socket
    socketService.emitToRole('nurse', 'newRequest', {
      requestId: request._id,
      priority: request.priority,
      disease,
      patientName: fullName,
      roomNumber,
      description: request.description
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request'
    });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await PatientRequest.find()
      .populate('patient', 'fullName')
      .sort('-createdAt');

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests'
    });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await PatientRequest.findById(requestId);
    if (!request) {
      throw new AppError('Request not found', 404);
    }

    request.status = status;
    if (status === 'completed') {
      request.completedAt = new Date();
    }
    await request.save();

    // Notify all connected nurses about the status update
    socketService.emitToRole('nurse', 'request_status_updated', request);

    if (status === 'completed') {
      socketService.emitToRole('nurse', 'requestCompleted', request);
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      message: error instanceof AppError ? error.message : 'Failed to update request'
    });
  }
};

export const assignRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { nurseId } = req.body;

    const request = await PatientRequest.findById(requestId);
    if (!request) {
      throw new AppError('Request not found', 404);
    }

    request.nurse = nurseId;
    request.status = 'assigned';
    await request.save();

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error assigning request:', error);
    res.status(500).json({
      success: false,
      message: error instanceof AppError ? error.message : 'Failed to assign request'
    });
  }
};
