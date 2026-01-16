import { Request, Response } from 'express';

interface ChallanCheckRequest extends Request {
  body: {
    vehicleNumber: string;
  };
}

/**
 * Checks for RTO challans against a vehicle number. (MOCKED)
 */
export const checkChallan = async (req: ChallanCheckRequest, res: Response) => {
  const { vehicleNumber } = req.body;

  if (!vehicleNumber || typeof vehicleNumber !== 'string' || vehicleNumber.trim().length < 4) {
    return res.status(400).json({ message: 'A valid vehicle number is required.' });
  }

  const formattedVehicleNumber = vehicleNumber.trim().toUpperCase();

  console.log(`[MOCK] Checking challan for vehicle: ${formattedVehicleNumber}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Return different mock responses based on the vehicle number
  if (formattedVehicleNumber.includes('1234')) {
    return res.status(200).json({
      vehicleNumber: formattedVehicleNumber,
      challanCount: 2,
      totalAmount: 2000,
      challans: [
        {
          id: 'CHLN-2024-98765',
          date: '2024-05-10T14:30:00Z',
          offense: 'Jumping a red light',
          amount: 1000,
          paymentStatus: 'Pending',
        },
        {
          id: 'CHLN-2024-11223',
          date: '2024-06-01T09:15:00Z',
          offense: 'Parking in a no-parking zone',
          amount: 1000,
          paymentStatus: 'Pending',
        },
      ],
    });
  }

  if (formattedVehicleNumber.includes('0000')) {
    return res.status(200).json({
      vehicleNumber: formattedVehicleNumber,
      challanCount: 0,
      totalAmount: 0,
      challans: [],
    });
  }

  // Default mock response
  return res.status(200).json({
    vehicleNumber: formattedVehicleNumber,
    challanCount: 1,
    totalAmount: 500,
    challans: [
      {
        id: 'CHLN-2024-54321',
        date: '2024-07-01T11:00:00Z',
        offense: 'Riding without a helmet',
        amount: 500,
        paymentStatus: 'Pending',
      },
    ],
  });
};
