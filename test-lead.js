import "dotenv/config";
import axios from "axios";

const leadId = "1869317380912225";

async function getLead() {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${process.env.META_GRAPH_VERSION}/${leadId}`,
      {
        params: {
          fields: "id,created_time,field_data",
          access_token: process.env.META_ACCESS_TOKEN,
        },
      }
    );

    console.log("Lead retrieved successfully:");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error(
      "Unable to retrieve lead:",
      error.response?.data || error.message
    );
  }
}

getLead();