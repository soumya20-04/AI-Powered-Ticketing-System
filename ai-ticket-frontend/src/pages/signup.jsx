import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          skills: skills.split(",").map((s) => s.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      } else {
        alert("Signup successful!");
        navigate("/login");
      }

      // Save token & user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/tickets");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background text-foreground transition-all">
      <Card className="w-full max-w-md border border-border rounded-2xl bg-card shadow-xl animate-in fade-in slide-in-from-bottom duration-500">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-extrabold">🚀 Create Account</h2>
            <p className="text-sm text-muted-foreground">Join our support platform today!</p>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-100 border border-red-300 p-2 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-md border border-border bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter secure password"
                className="w-full px-4 py-2 rounded-md border border-border bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="skills">Skills</label>
              <input
                id="skills"
                type="text"
                placeholder="e.g. JavaScript, React"
                className="w-full px-4 py-2 rounded-md border border-border bg-popover text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md font-semibold text-white bg-primary hover:bg-primary/80 transition-all"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
