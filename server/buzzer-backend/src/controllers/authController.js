import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import admin from '../config/firebase.js';
import { registerSchema, loginSchema } from '../utils/authValidation.js';

const prisma = new PrismaClient();

const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

export const register = asyncHandler(async (req, res) => {
  let data;
  try {
    data = await validate(registerSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  // Verify Firebase ID token
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(data.idToken);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid idToken' });
  }

  const firebaseUid = decoded.uid;

  // Check if user already exists (by firebaseUid or mobileNumber)
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { firebaseUid },
        { mobileNumber: data.mobileNumber },
      ],
    },
  });
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      firebaseUid,
      email: null,
      password: null,
      image: null,
      type: null,
    },
  });

  return res.status(201).json(user);
});

export const login = asyncHandler(async (req, res) => {
  let data;
  try {
    data = await validate(loginSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  // Verify Firebase ID token
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(data.idToken);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid idToken' });
  }

  const firebaseUid = decoded.uid;

  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found. Please register.' });
  }

  return res.status(200).json(user);
});

