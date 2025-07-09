import { inngest } from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({ event, step }) => {
        try {
            const { email } = event.data;

            // Step 1: Find the user
            const userObject = await step.run("get-user-email", async () => {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new NonRetriableError("User no longer exists in the database");
                }
                return user;
            });

            // Step 2: Send welcome mail
            await step.run("send-welcome-email", async () => {
                const subject = "Welcome to the app";
                const message = `Hi ${userObject.email},\n\nThanks for signing up!`;
                console.log("Sending welcome email to", userObject.email);
                await sendMail(userObject.email, subject, message);
                console.log("Mail sent");
            });

            return { success: true };
        } catch (error) {
            console.error("Error running signup function:", error.message);
            return { success: false };
        }
    }
);
