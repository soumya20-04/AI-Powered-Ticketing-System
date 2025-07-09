import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-1.5-flash-8b",
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AI-Ticket Triage Assistant",
        system: `You are an expert AI assistant that processes technical support tickets.

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with only valid raw JSON.
- Do NOT include markdown, code fences, or comments.
- Output should be a raw JSON object only.`,
    });

    const response = await supportAgent.run(`Analyze the following support ticket:

- Title: ${ticket.title}
- Description: ${ticket.description}

Return JSON like:
{
  "summary": "...",
  "priority": "low" | "medium" | "high",
  "helpfulNotes": "...",
  "relatedSkills": ["React", "MongoDB"]
}
`);

    const raw = response.output?.[0]?.content || response.output?.[0]?.context || "";

    try {
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        console.log("🎯 Raw AI Response:", parsed);
        return parsed;
    } catch (err) {
        console.error("❌ Failed to parse Gemini response:", err.message);
        return null;
    }
};

export default analyzeTicket;
