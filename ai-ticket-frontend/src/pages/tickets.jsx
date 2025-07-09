import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);

  const fetchTickets = async () => {
    setFetching(true);
    try {
      const res = await fetch(`http://localhost:3000/api/tickets`, {
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
      const res = await fetch(`http://localhost:3000/api/tickets`, {
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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="input input-bordered w-full"
          required
          disabled={loading}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          className="textarea textarea-bordered w-full"
          required
          disabled={loading}
        ></textarea>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">All Tickets</h2>
      {fetching ? (
        <p className="text-center">Loading tickets...</p>
      ) : (
        <div className="space-y-3">
          {tickets.length === 0 && <p>No tickets submitted yet.</p>}
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              className="card shadow-md p-4 bg-gray-800 rounded-md block hover:bg-gray-700 transition-colors duration-200"
              to={`/tickets/${ticket._id}`}
            >
              <h3 className="font-bold text-lg text-white">{ticket.title}</h3>
              <p className="text-gray-300 text-sm">{ticket.description}</p>
              <p className="text-gray-500 text-xs mt-1">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
