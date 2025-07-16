import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TicketDetailsPage() {
  
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch ticket");
          setTicket(null);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, token]);

  if (loading) return <div className="text-center mt-10 text-muted-foreground">Loading ticket details...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!ticket) return <div className="text-center mt-10 text-muted-foreground">Ticket not found</div>;

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">🎟️ Ticket Details</h2>
          <p className="text-muted-foreground text-sm mt-1">ID: {ticket._id}</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg p-6 space-y-6">
          {/* Ticket Title and Description */}
          <div>
            <h3 className="text-2xl font-semibold mb-2">{ticket.title}</h3>
            <p className="text-muted-foreground text-base">{ticket.description}</p>
          </div>

          {/* Boxed Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-popover border border-border rounded-md p-4 shadow-sm">
              <p className="font-semibold text-sm mb-1">📌 Status</p>
              <p className="text-foreground">{ticket.status}</p>
            </div>

            {ticket.priority && (
              <div className="bg-popover border border-border rounded-md p-4 shadow-sm">
                <p className="font-semibold text-sm mb-1">🚦 Priority</p>
                <p className="text-foreground">{ticket.priority}</p>
              </div>
            )}

            {ticket.relatedSkills?.length > 0 && (
              <div className="bg-popover border border-border rounded-md p-4 shadow-sm col-span-full">
                <p className="font-semibold text-sm mb-1">🧠 Related Skills</p>
                <p className="text-foreground">{ticket.relatedSkills.join(", ")}</p>
              </div>
            )}

            {ticket.assignedTo && (
              <div className="bg-popover border border-border rounded-md p-4 shadow-sm">
                <p className="font-semibold text-sm mb-1">👤 Assigned To</p>
                <p className="text-foreground">{ticket.assignedTo.email}</p>
              </div>
            )}
          </div>

          {/* Helpful Notes */}
          {ticket.helpfulNotes && (
            <div className="bg-popover border border-border rounded-md p-4 shadow-sm">
              <p className="font-semibold text-sm mb-2">📋 Helpful Notes</p>
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Created At */}
          {ticket.createdAt && (
            <div className="text-sm text-muted-foreground text-right">
              🕒 Created At: {new Date(ticket.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
