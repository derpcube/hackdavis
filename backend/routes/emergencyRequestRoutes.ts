import express from 'express';
import { createEmergencyRequest, getEmergencyRequests } from '../controllers/emergencyRequestController';

const router = express.Router();

router.post('/', createEmergencyRequest);
router.get('/', getEmergencyRequests);

export default router; 