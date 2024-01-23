import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

const totalAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.totalAnalytics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics is retrieved successfully !',
    data: result,
  });
});

const enrolledSemesterAnalytics = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DashboardServices.enrolledSemesterAnalytics();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Analytics is retrieved successfully !',
      data: result,
    });
  },
);

const totalStudentAnalytics = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DashboardServices.totalStudentAnalytics();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Analytics is retrieved successfully !',
      data: result,
    });
  },
);

const totalFacultyAnalytics = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DashboardServices.totalFacultyAnalytics();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Analytics is retrieved successfully !',
      data: result,
    });
  },
);

export const DashboardControllers = {
  totalAnalytics,
  enrolledSemesterAnalytics,
  totalStudentAnalytics,
  totalFacultyAnalytics,
};
