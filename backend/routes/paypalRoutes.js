const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

// PayPal API base
const base = "https://api-m.sandbox.paypal.com"; 

// PayPal access token
const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    `${base}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
};

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const { eventTitle, totalAmount } = req.body;
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${base}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            description: eventTitle,
            amount: {
              currency_code: "USD",
              value: totalAmount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ orderID: response.data.id });
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Capture order
router.post("/capture-order/:orderID", async (req, res) => {
  try {
    const { orderID } = req.params;
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${base}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Capture order error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to capture order" });
  }
});

module.exports = router;
