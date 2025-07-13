import { Request, Response } from 'express';
import httpStatus from 'http-status';
import path from 'path';
import { PythonShell } from 'python-shell';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const predictSalary = catchAsync(async (req: Request, res: Response) => {
  const { role, jobTitle, location } = req.body;

  const pythonPath = path.join(
    process.cwd(),
    '..',
    'python',
    'path',
    'to',
    'venv',
    'bin',
    'python',
  );

  const options: Record<string, unknown> = {
    mode: 'text',
    pythonPath: pythonPath,
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, '../../scripts/'),
    args: [role, jobTitle, location],
  };

  const results = await PythonShell.run('predict.py', options);

  const predictionResult = JSON.parse(results[0]);

  if (predictionResult.error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error during prediction.',
      error: predictionResult.error,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Salary predicted successfully',
    data: predictionResult,
  });
});

export const predictionController = {
  predictSalary,
};
