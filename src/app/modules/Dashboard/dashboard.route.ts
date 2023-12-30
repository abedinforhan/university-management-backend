import express from 'express';
import { DashboardControllers } from './dashboard.controller';

const router = express.Router();

router.get(
  '/enrolled-semester-analytics',
  DashboardControllers.enrolledSemesterAnalytics,
);
router.get(
  '/total-student-analytics',
  DashboardControllers.totalStudentAnalytics,
);
router.get(
  '/total-faculty-analytics',
  DashboardControllers.totalFacultyAnalytics,
);

router.get('/total-analytics', DashboardControllers.totalAnalytics);
export const DashboardRoutes = router;
