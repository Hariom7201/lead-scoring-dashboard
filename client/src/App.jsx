import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [leads, setLeads] = useState([]);

  const [form, setForm] = useState({
    name: "",
    budget: "",
    urgency: "Medium",
    questionsAsked: "",
    siteVisit: false
  });

  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:5000/api/leads");
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/leads", form);

    fetchLeads();

    setForm({
      name: "",
      budget: "",
      urgency: "Medium",
      questionsAsked: "",
      siteVisit: false
    });
  };

  const deleteLead = async (id) => {
    await axios.delete(`http://localhost:5000/api/leads/${id}`);
    fetchLeads();
  };

  return (
    <div className="container">
      <h1>Lead Scoring Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Customer Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Budget"
          value={form.budget}
          onChange={(e) =>
            setForm({ ...form, budget: e.target.value })
          }
        />

        <select
          value={form.urgency}
          onChange={(e) =>
            setForm({ ...form, urgency: e.target.value })
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="number"
          placeholder="Questions Asked"
          value={form.questionsAsked}
          onChange={(e) =>
            setForm({
              ...form,
              questionsAsked: e.target.value
            })
          }
        />

        <label>
          Interested in Site Visit?
          <input
            type="checkbox"
            checked={form.siteVisit}
            onChange={(e) =>
              setForm({
                ...form,
                siteVisit: e.target.checked
              })
            }
          />
        </label>

        <button type="submit">Add Lead</button>
      </form>

      <div className="lead-grid">
        {leads.map((lead) => (
          <div key={lead._id} className="card">
            <h3>{lead.name}</h3>
            <p>Budget: ₹{lead.budget}</p>
            <p>Urgency: {lead.urgency}</p>
            <p>Questions: {lead.questionsAsked}</p>
            <p>Status: {lead.score}</p>

            <button onClick={() => deleteLead(lead._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;