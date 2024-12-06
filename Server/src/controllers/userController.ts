import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserStatus } from '../types';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role, department, status } = req.query;
    const filter: any = { active: true };

    if (role) filter.role = role;
    if (department) filter.department = department;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .select('-password')
      .populate('department', 'name');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, department, room, active, status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (department) user.department = department;
    if (room) user.room = room;
    if (typeof active === 'boolean') user.active = active;
    if (status && Object.values(UserStatus).includes(status as UserStatus)) {
      user.status = status as UserStatus;
    }

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      room: user.room,
      active: user.active,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const getPendingNurses = async (req: Request, res: Response) => {
  try {
    const pendingNurses = await User.find({
      role: 'nurse',
      status: UserStatus.PENDING,
      active: true
    })
      .select('-password')
      .populate('department', 'name');

    res.json(pendingNurses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending nurses', error });
  }
};

export const approveNurse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(UserStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const nurse = await User.findOneAndUpdate(
      { _id: id, role: 'nurse' },
      { status },
      { new: true }
    ).select('-password');

    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    res.json(nurse);
  } catch (error) {
    res.status(500).json({ message: 'Error approving nurse', error });
  }
};

export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role, status } = req.query;

    if (!role) {
      return res.status(400).json({ message: 'Role parameter is required' });
    }

    // Build query based on parameters
    const query: any = { role };
    if (status) {
      query.status = status;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ firstName: 1, lastName: 1 });

    res.json({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const registerPatient = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, room } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists',
      });
    }

    // Create new patient user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      room,
      role: 'patient',
      status: 'approved', // Patients registered by nurses are automatically approved
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        room: user.room,
      },
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Error registering patient' });
  }
};