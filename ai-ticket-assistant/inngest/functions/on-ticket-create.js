import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import { NonRetriableError } from "inngest";
import analyzeTicket from "../../utils/ai.js";
import User from "../../models/user.js";

export const onTicketCreated = inngest.createFunction(
    { id: "on-ticket-created", retries: 2 },
    { event: "ticket/created" },
    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;

            // Step 1: Fetch the ticket
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await Ticket.findById(ticketId);
                if (!ticketObject) {
                    throw new NonRetriableError("Ticket not found");
                }
                return ticketObject;
            });

            // Step 2: Mark status as "TO DO"
            await step.run("update-ticket-status", async () => {
                await Ticket.findByIdAndUpdate(ticket._id, {
                    status: "TO DO",
                });
            });

            // Step 3: AI analysis
            console.log("STEP 3: Running Gemini AI analysis");
            console.log("Calling analyzeTicket() directly (outside step.run)");
            const aiResponse = await analyzeTicket(ticket);

            let relatedSkills = [];

            // Step 4: Update ticket with AI output
            await step.run("update-with-ai-response", async () => {
                if (aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: !["low", "medium", "high"].includes(aiResponse.priority)
                            ? "medium"
                            : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: "IN_PROGRESS",
                        relatedSkills: aiResponse.relatedSkills,
                    });
                    relatedSkills = aiResponse.relatedSkills;
                }
            });

            // Step 5: Assign a moderator
            await step.run("assign-moderator", async () => {
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i",
                        },
                    },
                });

                if (!user) {
                    user = await User.findOne({ role: "admin" });
                }

                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null,
                });

                return user;
            });

            return { success: true };
        } catch (error) {
            console.log("Error running steps", error.message);
            return { success: false };
        }
    }
);
