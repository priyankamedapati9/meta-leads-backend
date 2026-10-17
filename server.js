import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import Lead from "./Lead.js";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(express.json());
io.on("connection", async (socket) => {
    console.log("React Native connected:", socket.id);

    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        socket.emit("existingLeads", leads);
    } catch (error) {
        console.error("Failed to load existing leads:", error.message);
    }
});
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === "priya") {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
    res.sendStatus(200);

    try {
        const entries = req.body.entry || [];

        for (const entry of entries) {
            for (const change of entry.changes || []) {
                if (change.field !== "leadgen") continue;

                const leadId = change.value.leadgen_id;

                if (!leadId) continue;

                const response = await axios.get(
                    `https://graph.facebook.com/${process.env.META_GRAPH_VERSION}/${leadId}`,
                    {
                        params: {
                            fields: "id,created_time,field_data",
                            access_token: process.env.META_ACCESS_TOKEN
                        }
                    }
                );

                const fields = response.data.field_data || [];
                const getField = (name) =>
                    fields.find((field) => field.name === name)?.values?.[0] || "";

                await Lead.findOneAndUpdate(
                    { leadId: response.data.id },
                    {
                        leadId: response.data.id,
                        name: getField("full_name"),
                        email: getField("email"),
                        createdTime: response.data.created_time
                    },
                    { upsert: true, new: true, runValidators: true }
                );
                            io.emit("newLead", {
                    leadId: response.data.id,
                    name: getField("full_name"),
                    email: getField("email"),
                    createdTime: response.data.created_time
                });
                console.log("Lead saved:", response.data.id);
            }
        }
    } catch (error) {
        console.error(
            "Lead processing failed:",
            error.response?.data || error.message
        );
    }
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");

        httpServer.listen(process.env.PORT || 3000, () => {
            console.log("Server running on port 3000");
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

startServer();