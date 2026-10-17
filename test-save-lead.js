import "dotenv/config";
import mongoose from "mongoose";
import axios from "axios";
import Lead from "./Lead.js";

async function testLead() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const response = await axios.get(
      `https://graph.facebook.com/${process.env.META_GRAPH_VERSION}/1869317380912225`,
      {
        params: {
          fields: "id,created_time,field_data",
          access_token: process.env.META_ACCESS_TOKEN,
        },
      }
    );

    const fields = response.data.field_data || [];
    const getField = (name) =>
      fields.find((field) => field.name === name)?.values?.[0] || "";

    const lead = await Lead.findOneAndUpdate(
      { leadId: response.data.id },
      {
        leadId: response.data.id,
        name: getField("full_name"),
        email: getField("email"),
        createdTime: response.data.created_time,
      },
      { upsert: true, new: true }
    );

    console.log("Lead saved successfully:", lead.toObject());
  } catch (error) {
    console.error(
      "Test failed:",
      error.response?.data || error.message
    );
  } finally {
    await mongoose.disconnect();
  }
}

testLead();