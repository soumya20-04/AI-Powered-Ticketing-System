import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Tickets() {
  // Form input state
  const [form, setForm] = useState({ title: "", description: "" });

  // Ticket list state
  const [tickets, setTickets] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Auth and navigation
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Optional: get user info from localStorage
  let user = localStorage.getItem("user");
  if (user) user = JSON.parse(user);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch tickets from backend
  const fetchTickets = async () => {
    setFetching(true);
    try {
      const res = await fetch("http://localhost:3000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets();
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-background text-foreground">
      <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-500">

        {/* ---------- Page Header with Logout ---------- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Ticket Board</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Submit and view all your issues
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user && <p className="text-sm text-muted-foreground">Hi, {user.email}</p>}
            <button
              onClick={logout}
              className="text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ---------- Create Ticket Form ---------- */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ticket Title"
              className="w-full px-4 py-2 rounded-md border border-border bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              disabled={loading}
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ticket Description"
              className="w-full px-4 py-2 rounded-md border border-border bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
              disabled={loading}
              rows={4}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-semibold text-white transition duration-200 ${
                loading
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/80"
              }`}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* ---------- Ticket List ---------- */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Tickets</h2>
          {fetching ? (
            <p className="text-muted-foreground text-center">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-muted-foreground text-center">No tickets submitted yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/tickets/${ticket._id}`}
                  className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-bold text-foreground">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
