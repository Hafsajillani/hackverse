// ============================================================
//  HackVerse — Express + MySQL Backend
//  File: server.js  (place in project root)
//
//  Install deps first:
//    npm install express cors mysql2 dotenv bcryptjs
//
//  Create a .env file in the project root:
//    DB_HOST=localhost
//    DB_USER=root
//    DB_PASSWORD=your_password
//    DB_NAME=hackverse
//    PORT=5000
//
//  Run:  node server.js
// ============================================================

require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const mysql   = require("mysql2/promise");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" })); // Vite dev server
app.use(express.json());

// ── DB Connection Pool ──────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "jellyfish80@",
  database: process.env.DB_NAME     || "hackverse",
  waitForConnections: true,
  connectionLimit:    10,
});

// Utility: run a query and return rows
async function q(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ============================================================
//  AUTH
// ============================================================

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await q(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]   // use bcrypt.compare in production
    );
    if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];
    // Fetch skills
    const skills = await q("SELECT skill FROM user_skills WHERE user_id = ?", [user.id]);
    user.skills = skills.map(s => s.skill);

    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

    const exists = await q("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(409).json({ error: "Email already registered" });

    const avatar = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role, avatar) VALUES (?,?,?,?,?)",
      [name, email, password, role || "participant", avatar]
    );
    const newUser = await q("SELECT * FROM users WHERE id = ?", [result.insertId]);
    res.status(201).json({ ...newUser[0], skills: [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
//  USERS
// ============================================================

// GET /api/users
app.get("/api/users", async (req, res) => {
  try {
    const users = await q("SELECT * FROM users");
    for (const u of users) {
      const skills = await q("SELECT skill FROM user_skills WHERE user_id = ?", [u.id]);
      u.skills = skills.map(s => s.skill);
    }
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/users/:id
app.get("/api/users/:id", async (req, res) => {
  try {
    const users = await q("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (!users.length) return res.status(404).json({ error: "User not found" });
    const skills = await q("SELECT skill FROM user_skills WHERE user_id = ?", [req.params.id]);
    res.json({ ...users[0], skills: skills.map(s => s.skill) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/users/:id  — update profile
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, bio, location, github, linkedin, skills } = req.body;
    await pool.execute(
      "UPDATE users SET name=?, bio=?, location=?, github=?, linkedin=? WHERE id=?",
      [name, bio, location, github, linkedin, req.params.id]
    );
    // Replace skills
    if (Array.isArray(skills)) {
      await pool.execute("DELETE FROM user_skills WHERE user_id=?", [req.params.id]);
      for (const skill of skills) {
        await pool.execute(
          "INSERT IGNORE INTO user_skills (user_id, skill) VALUES (?,?)",
          [req.params.id, skill]
        );
      }
    }
    const updated = await q("SELECT * FROM users WHERE id=?", [req.params.id]);
    const skillRows = await q("SELECT skill FROM user_skills WHERE user_id=?", [req.params.id]);
    res.json({ ...updated[0], skills: skillRows.map(s => s.skill) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
//  HACKATHONS
// ============================================================

// GET /api/hackathons
app.get("/api/hackathons", async (req, res) => {
  try {
    const hackathons = await q("SELECT * FROM hackathons ORDER BY created_at DESC");
    for (const h of hackathons) {
      const tags = await q("SELECT tag FROM hackathon_tags WHERE hackathon_id=?", [h.id]);
      const sponsors = await q("SELECT sponsor FROM hackathon_sponsors WHERE hackathon_id=?", [h.id]);
      h.tags     = tags.map(t => t.tag);
      h.sponsors = sponsors.map(s => s.sponsor);
      // camelCase mapping for frontend
      h.organizerId = h.organizer_id;
      h.regOpen  = h.reg_open;
      h.regClose = h.reg_close;
      h.subOpen  = h.sub_open;
      h.subClose = h.sub_close;
    }
    res.json(hackathons);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/hackathons/:id
app.get("/api/hackathons/:id", async (req, res) => {
  try {
    const rows = await q("SELECT * FROM hackathons WHERE id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Hackathon not found" });
    const h = rows[0];
    const tags     = await q("SELECT tag     FROM hackathon_tags     WHERE hackathon_id=?", [h.id]);
    const sponsors = await q("SELECT sponsor FROM hackathon_sponsors WHERE hackathon_id=?", [h.id]);
    h.tags     = tags.map(t => t.tag);
    h.sponsors = sponsors.map(s => s.sponsor);
    h.organizerId = h.organizer_id;
    h.regOpen  = h.reg_open;  h.regClose = h.reg_close;
    h.subOpen  = h.sub_open;  h.subClose = h.sub_close;
    res.json(h);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/hackathons  — create
app.post("/api/hackathons", async (req, res) => {
  try {
    const {
      organizerId, organizer, title, theme, description, rules, judging,
      prize, prize1, prize2, prize3, status,
      regOpen, regClose, subOpen, subClose,
      tags = [], sponsors = []
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO hackathons
        (organizer_id, organizer, title, theme, description, rules, judging,
         prize, prize1, prize2, prize3, status,
         reg_open, reg_close, sub_open, sub_close, deadline,
         thumb, cover)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [organizerId, organizer, title, theme, description, rules, judging,
       prize||"TBD", prize1, prize2, prize3, status||"upcoming",
       regOpen, regClose, subOpen, subClose, subClose,
       "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
       "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80"]
    );
    const id = result.insertId;
    for (const tag     of tags)     await pool.execute("INSERT IGNORE INTO hackathon_tags     (hackathon_id,tag)     VALUES (?,?)", [id, tag]);
    for (const sponsor of sponsors) await pool.execute("INSERT IGNORE INTO hackathon_sponsors (hackathon_id,sponsor) VALUES (?,?)", [id, sponsor]);

    res.status(201).json({ id, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/hackathons/:id  — update
app.put("/api/hackathons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title, theme, description, rules, judging, status,
      prize, prize1, prize2, prize3,
      regOpen, regClose, subOpen, subClose,
      tags = [], sponsors = []
    } = req.body;

    await pool.execute(`
      UPDATE hackathons SET
        title=?, theme=?, description=?, rules=?, judging=?, status=?,
        prize=?, prize1=?, prize2=?, prize3=?,
        reg_open=?, reg_close=?, sub_open=?, sub_close=?, deadline=?
      WHERE id=?`,
      [title, theme, description, rules, judging, status,
       prize, prize1, prize2, prize3,
       regOpen, regClose, subOpen, subClose, subClose, id]
    );
    await pool.execute("DELETE FROM hackathon_tags     WHERE hackathon_id=?", [id]);
    await pool.execute("DELETE FROM hackathon_sponsors WHERE hackathon_id=?", [id]);
    for (const tag     of tags)     await pool.execute("INSERT IGNORE INTO hackathon_tags     (hackathon_id,tag)     VALUES (?,?)", [id, tag]);
    for (const sponsor of sponsors) await pool.execute("INSERT IGNORE INTO hackathon_sponsors (hackathon_id,sponsor) VALUES (?,?)", [id, sponsor]);

    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/hackathons/:id
app.delete("/api/hackathons/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM hackathons WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/hackathons/:id/status
app.patch("/api/hackathons/:id/status", async (req, res) => {
  try {
    await pool.execute("UPDATE hackathons SET status=? WHERE id=?", [req.body.status, req.params.id]);
    res.json({ message: "Status updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
//  REGISTRATIONS
// ============================================================

// GET /api/registrations?hackathonId=1&userId=2
app.get("/api/registrations", async (req, res) => {
  try {
    let sql    = "SELECT * FROM registrations WHERE 1=1";
    const vals = [];
    if (req.query.hackathonId) { sql += " AND hackathon_id=?"; vals.push(req.query.hackathonId); }
    if (req.query.userId)      { sql += " AND user_id=?";      vals.push(req.query.userId); }
    const rows = await q(sql, vals);
    // camelCase
    res.json(rows.map(r => ({ ...r, hackathonId: r.hackathon_id, userId: r.user_id, registeredAt: r.registered_at })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/registrations
app.post("/api/registrations", async (req, res) => {
  try {
    const { hackathonId, userId } = req.body;
    await pool.execute(
      "CALL sp_register_user(?,?)",
      [hackathonId, userId]
    );
    const rows = await q(
      "SELECT * FROM registrations WHERE hackathon_id=? AND user_id=?",
      [hackathonId, userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.message.includes("already registered"))
      return res.status(409).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/registrations/:id
app.delete("/api/registrations/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM registrations WHERE id=?", [req.params.id]);
    res.json({ message: "Removed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
//  PROJECTS
// ============================================================

// GET /api/projects?hackathonId=1&submittedBy=2
app.get("/api/projects", async (req, res) => {
  try {
    let sql    = "SELECT * FROM projects WHERE 1=1";
    const vals = [];
    if (req.query.hackathonId)  { sql += " AND hackathon_id=?";  vals.push(req.query.hackathonId); }
    if (req.query.submittedBy)  { sql += " AND submitted_by=?";  vals.push(req.query.submittedBy); }
    const projects = await q(sql, vals);
    for (const p of projects) {
      const tech = await q("SELECT tech FROM project_tech WHERE project_id=?", [p.id]);
      p.tech = tech.map(t => t.tech);
      p.hackathonId  = p.hackathon_id;
      p.submittedBy  = p.submitted_by;
      p.submittedAt  = p.submitted_at;
    }
    res.json(projects);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/projects
app.post("/api/projects", async (req, res) => {
  try {
    const { hackathonId, submittedBy, title, team, tagline, description, demo, github, video, tech = [] } = req.body;
    const score = Math.floor(Math.random() * 20) + 75;
    const [result] = await pool.execute(`
      INSERT INTO projects (hackathon_id, submitted_by, title, team, tagline, description, demo, github, video, score, cover)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [hackathonId, submittedBy, title, team, tagline, description, demo, github, video, score,
       "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80"]
    );
    const id = result.insertId;
    for (const t of tech) await pool.execute("INSERT IGNORE INTO project_tech (project_id,tech) VALUES (?,?)", [id, t]);
    res.status(201).json({ id, score, tech, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/projects/:id  — update score or notes
app.patch("/api/projects/:id", async (req, res) => {
  try {
    const { score, notes } = req.body;
    if (score !== undefined)
      await pool.execute("UPDATE projects SET score=? WHERE id=?", [score, req.params.id]);
    if (notes !== undefined)
      await pool.execute("UPDATE projects SET notes=? WHERE id=?", [notes, req.params.id]);
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/projects/:id
app.delete("/api/projects/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM projects WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
//  WINNERS
// ============================================================

// GET /api/winners?hackathonId=1
app.get("/api/winners", async (req, res) => {
  try {
    const rows = await q(
      "SELECT * FROM winners WHERE hackathon_id=?",
      [req.query.hackathonId]
    );
    res.json(rows.map(r => ({ ...r, hackathonId: r.hackathon_id, projectId: r.project_id, assignedAt: r.assigned_at })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/winners
app.post("/api/winners", async (req, res) => {
  try {
    const { hackathonId, projectId, rank } = req.body;
    // Upsert
    await pool.execute(`
      INSERT INTO winners (hackathon_id, project_id, rank)
      VALUES (?,?,?)
      ON DUPLICATE KEY UPDATE rank=VALUES(rank)`,
      [hackathonId, projectId, rank]
    );
    res.status(201).json({ message: "Winner assigned" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/winners/:id
app.delete("/api/winners/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM winners WHERE id=?", [req.params.id]);
    res.json({ message: "Removed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
//  CERTIFICATES
// ============================================================

// GET /api/certificates?hackathonId=1&userId=2
app.get("/api/certificates", async (req, res) => {
  try {
    let sql = "SELECT * FROM certificates WHERE 1=1";
    const vals = [];
    if (req.query.hackathonId) { sql += " AND hackathon_id=?"; vals.push(req.query.hackathonId); }
    if (req.query.userId)      { sql += " AND user_id=?";      vals.push(req.query.userId); }
    const rows = await q(sql, vals);
    res.json(rows.map(r => ({ ...r, hackathonId: r.hackathon_id, projectId: r.project_id, userId: r.user_id, issuedAt: r.issued_at })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/certificates
app.post("/api/certificates", async (req, res) => {
  try {
    const { hackathonId, projectId, userId, rank } = req.body;
    await pool.execute("CALL sp_issue_certificate(?,?,?,?)", [hackathonId, projectId, userId, rank]);
    res.status(201).json({ message: "Certificate issued" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/certificates/:id  — revoke
app.delete("/api/certificates/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM certificates WHERE id=?", [req.params.id]);
    res.json({ message: "Revoked" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
//  ANALYTICS ENDPOINTS  (uses SQL views)
// ============================================================

// GET /api/analytics/leaderboard/:hackathonId
app.get("/api/analytics/leaderboard/:hackathonId", async (req, res) => {
  try {
    const rows = await q(
      "SELECT * FROM vw_leaderboard WHERE hackathon_id=?",
      [req.params.hackathonId]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/analytics/registration-summary
app.get("/api/analytics/registration-summary", async (req, res) => {
  try {
    res.json(await q("SELECT * FROM vw_registration_summary"));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/analytics/top-skills
app.get("/api/analytics/top-skills", async (req, res) => {
  try {
    const rows = await q(`
      SELECT us.skill, COUNT(*) AS winner_count
      FROM user_skills us
      JOIN users u ON u.id = us.user_id
      WHERE u.wins > 0
      GROUP BY us.skill
      ORDER BY winner_count DESC
      LIMIT 10`);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => console.log(`✅ HackVerse API running at http://localhost:${PORT}`));