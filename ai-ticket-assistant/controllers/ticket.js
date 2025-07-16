// Importing Inngest client to trigger background workflows
import { inngest } from "../inngest/client.js";

import Ticket from "../models/ticket.js";

import mongoose from "mongoose";

// CREATE TICKET CONTROLLER
export const createTicket = async (req, res) => {
  try {
    // Destructure title and description from request body
    const { title, description } = req.body;

    // Check if required fields are missing
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    console.log("Creating ticket for user ID:", req.user?._id);

    // Create a new ticket document in the database
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id,
    });

    // Trigger an Inngest event after ticket creation
    await inngest.send({
      name: "ticket/created", //event name
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    // Send success response with created ticket
    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });

  } catch (error) {
    console.error("Ticket creation failed:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📋 GET ALL TICKETS CONTROLLER
export const getTickets = async (req, res) => {
  try {
    // Get the logged-in user
    const user = req.user;
    console.log("Fetching tickets for user ID:", user._id, "Role:", user.role);

    let tickets = [];

    // If user is an admin or agent, return all tickets
    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      // If user is a regular user, return only their tickets
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt priority helpfulNotes relatedSkills assignedTo") // Select relevant fields
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    }

    console.log("Tickets found:", tickets.length);

    // Send ticket list response
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// 🧾 GET SINGLE TICKET CONTROLLER
export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id)
        .populate("assignedTo", ["email", "_id"]);
    } else {

      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      })
        .select("title description status createdAt priority helpfulNotes relatedSkills assignedTo")
        .populate("assignedTo", ["email", "_id"]);
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ ticket });

  } catch (error) {
    console.error("Error fetching ticket:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
