import { Request, Response } from "express";
import axios from "axios";

interface ChallanCheckRequest extends Request {
  body: {
    vehicleNumber: string;
  };
}

// IMPORTANT: The following is a template for integrating with a real-world challan API.
// You need to subscribe to a commercial challan API provider to get a valid API endpoint and key.
// Update your .env file with the credentials from your chosen provider.
const CHALLAN_API_ENDPOINT = process.env.CHALLAN_API_ENDPOINT;
const CHALLAN_API_KEY = process.env.CHALLAN_API_KEY;

/**
 * Checks for RTO challans against a vehicle number using a real API.
 */
export const checkChallan = async (req: ChallanCheckRequest, res: Response) => {
  const { vehicleNumber } = req.body;

  if (
    !vehicleNumber ||
    typeof vehicleNumber !== "string" ||
    vehicleNumber.trim().length < 4
  ) {
    return res
      .status(400)
      .json({ message: "A valid vehicle number is required." });
  }

  if (!CHALLAN_API_ENDPOINT || !CHALLAN_API_KEY) {
    console.error(
      "Challan API endpoint or key is not configured. Please check your .env file."
    );
    // Returning a mock response in development if no API key is provided.
    // In a production environment, you might want to return a 503 Service Unavailable error.
    return res.status(503).json({
      message: "Challan service is not configured. Returning mock data.",
      isMock: true,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      challanCount: 1,
      totalAmount: 500,
      challans: [
        {
          id: "MOCK-CHLN-2024-54321",
          date: new Date().toISOString(),
          offense: "Service Not Configured (Mock Data)",
          amount: 500,
          paymentStatus: "Pending",
          paymentLink: "https://echallan.parivahan.gov.in/",
        },
      ],
    });
  }

  const formattedVehicleNumber = vehicleNumber.trim().toUpperCase();

  try {
    console.log(`Checking challan for vehicle: ${formattedVehicleNumber}`);

    // This is a hypothetical API request structure.
    // You MUST adapt this to match the documentation of your chosen challan API provider.
    const response = await axios.post(
      CHALLAN_API_ENDPOINT,
      {
        vehicleNumber: formattedVehicleNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${CHALLAN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Assuming the API returns data in a similar structure to the old mock.
    // You MUST adapt this to match the actual response from your API provider.
    const challans = response.data.challans.map((challan: any) => ({
      ...challan,
      // Provide a direct link to the official government payment portal.
      paymentLink: `https://echallan.parivahan.gov.in/`,
    }));

    return res.status(200).json({
      vehicleNumber: formattedVehicleNumber,
      challanCount: response.data.challanCount,
      totalAmount: response.data.totalAmount,
      challans: challans,
      isMock: false,
    });
  } catch (error) {
    console.error("Error calling challan API:", error);

    let errorMessage =
      "Failed to check challan due to an external service error.";
    if (axios.isAxiosError(error) && error.response) {
      // Forwarding status and message from the external API if available
      return res
        .status(error.response.status)
        .json({ message: error.response.data.message || errorMessage });
    }

    return res.status(500).json({ message: errorMessage });
  }
};
