import { Request, Response } from 'express';
import { Patient } from '../models/Patient';
import { Request as PatientRequest } from '../models/Request';
import { socketService } from '../server';
import { AppError } from '../utils/AppError';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { description, priority } = req.body;
    const userId = req.user?._id;

    const patient = await Patient.findById(userId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const request = await PatientRequest.create({
      patient: patient._id,
      description,
      priority,
      status: 'pending'
    });

    // Notify nurses about new request
    socketService?.emitToRole('nurse', 'new_request', {
      request,
      patient: {
        id: patient._id,
        name: patient.fullName
      }
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: error instanceof AppError ? error.message : 'Failed to create request'
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
    await request.save();

    // Notify patient about status update
    const patient = await Patient.findById(request.patient);
    if (patient) {
      socketService?.emitToUser(patient._id.toString(), 'request_status_updated', {
        request,
        oldStatus: request.status,
        newStatus: status
      });
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