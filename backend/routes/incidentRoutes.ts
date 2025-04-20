import express from 'express';
import { createIncident, getIncidents } from '../controllers/incidentController';

const router = express.Router();

router.post('/', createIncident);
router.get('/', getIncidents);

export default router; 