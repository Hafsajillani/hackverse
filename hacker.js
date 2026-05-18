import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

// ═══════════════════════════════════════════════
// GOOGLE FONTS INJECTION
// ═══════════════════════════════════════════════
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap";
document.head.appendChild(fontLink);

// ═══════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════
const INITIAL_DB = {
  users: [
    { id: 1, name: "Ayesha Raza", email: "ayesha@gmail.com", password: "1234", role: "participant", avatar: "AR", bio: "Full-stack developer passionate about AI.", skills: ["React","Python","ML"], location: "Lahore", github: "ayesharaza", linkedin: "ayesharaza", hackathonsJoined: [1,2], wins: 3 },
    { id: 2, name: "Hassan Ali", email: "hassan@gmail.com", password: "1234", role: "participant", avatar: "HA", bio: "Backend engineer who loves distributed systems.", skills: ["Node.js","AWS","Docker"], location: "Karachi", github: "hassanali", linkedin: "hassanali", hackathonsJoined: [1], wins: 1 },
    { id: 3, name: "Fatima Khan", email: "fatima@gmail.com", password: "1234", role: "participant", avatar: "FK", bio: "Mobile developer and UI/UX designer.", skills: ["Flutter","Firebase","UX"], location: "Islamabad", github: "fatimakhan", linkedin: "fatimakhan", hackathonsJoined: [2], wins: 2 },
    { id: 4, name: "Bilal Ahmed", email: "bilal@gmail.com", password: "1234", role: "participant", avatar: "BA", bio: "Web3 enthusiast.", skills: ["Solidity","Web3","Rust"], location: "Lahore", github: "bilalahmed", linkedin: "bilalahmed", hackathonsJoined: [], wins: 0 },
    { id: 10, name: "TechCorp Org", email: "org@techcorp.com", password: "1234", role: "organizer", avatar: "TC", bio: "Pakistan's leading tech innovation lab.", skills: [], location: "Lahore", github: "", linkedin: "", hackathonsJoined: [], wins: 0 },
    { id: 11, name: "HBL Lab", email: "org@hbl.com", password: "1234", role: "organizer", avatar: "HB", bio: "HBL Innovation Lab.", skills: [], location: "Karachi", github: "", linkedin: "", hackathonsJoined: [], wins: 0 },
  ],
  hackathons: [
    { id: 1, title: "AI Innovation Challenge 2025", organizerId: 10, organizer: "TechCorp Org", theme: "Artificial Intelligence", prize: "PKR 500,000", prize1: "PKR 200,000", prize2: "PKR 150,000", prize3: "PKR 100,000", participants: 1240, teams: 312, deadline: "2025-08-15", regOpen: "2025-05-01", regClose: "2025-08-10", subOpen: "2025-07-01", subClose: "2025-08-14", status: "open", tags: ["AI","ML","Deep Learning"], thumb: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80", cover: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&q=80", description: "Build the next generation of AI-powered solutions for Pakistan and beyond.", rules: "Teams of 2-4. Projects must be original. Open source preferred.", judging: "Innovation (30%), Technical Complexity (25%), Impact (25%), Presentation (20%)", sponsors: ["Microsoft","Google","AWS","NVIDIA"] },
    { id: 2, title: "FinTech Forge", organizerId: 11, organizer: "HBL Lab", theme: "Financial Technology", prize: "PKR 300,000", prize1: "PKR 120,000", prize2: "PKR 80,000", prize3: "PKR 60,000", participants: 890, teams: 210, deadline: "2025-07-30", regOpen: "2025-05-15", regClose: "2025-07-25", subOpen: "2025-06-15", subClose: "2025-07-29", status: "open", tags: ["Fintech","Blockchain","Payments"], thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80", description: "Reimagine financial services for the unbanked population of Pakistan.", rules: "Must use at least one financial API. Teams of 1-5.", judging: "Market Potential (35%), Technical Build (30%), UX Design (20%), Pitch (15%)", sponsors: ["HBL","Easypaisa","JazzCash"] },
    { id: 3, title: "HealthTech Pakistan", organizerId: 10, organizer: "TechCorp Org", theme: "Health", prize: "PKR 400,000", prize1: "PKR 160,000", prize2: "PKR 120,000", prize3: "PKR 80,000", participants: 540, teams: 134, deadline: "2025-09-30", regOpen: "2025-06-01", regClose: "2025-09-25", subOpen: "2025-08-01", subClose: "2025-09-28", status: "upcoming", tags: ["Health","IoT","Biotech"], thumb: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80", description: "Build technology solutions for Pakistan's healthcare challenges.", rules: "Teams of 2-5. Must have working prototype.", judging: "Clinical Impact (40%), Technical (30%), Feasibility (30%)", sponsors: ["AKUH","Shaukat Khanum","Sehat Kahani"] },
  ],
  registrations: [
    { id: 1, hackathonId: 1, userId: 1, registeredAt: "2025-05-10", status: "active" },
    { id: 2, hackathonId: 1, userId: 2, registeredAt: "2025-05-11", status: "active" },
    { id: 3, hackathonId: 1, userId: 3, registeredAt: "2025-05-12", status: "active" },
    { id: 4, hackathonId: 2, userId: 1, registeredAt: "2025-05-15", status: "active" },
    { id: 5, hackathonId: 2, userId: 3, registeredAt: "2025-05-16", status: "active" },
  ],
  projects: [
    { id: 1, hackathonId: 1, submittedBy: 1, title: "MediScan AI", team: "Team Alpha", tagline: "AI-powered medical image diagnosis for rural clinics", description: "We built a CV model that diagnoses 12 diseases from X-rays with 94% accuracy.", tech: ["Python","TensorFlow","FastAPI","React"], demo: "https://mediscan.demo", github: "https://github.com/alpha/mediscan", video: "", score: 94, rank: 1, submittedAt: "2025-07-28", cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80", notes: "" },
    { id: 2, hackathonId: 1, submittedBy: 2, title: "FarmBot Pakistan", team: "AgriTech Bros", tagline: "IoT crop monitoring for smallholders", description: "Solar-powered IoT sensors + ML predicts crop yield 3 weeks in advance.", tech: ["Arduino","Python","MQTT","Vue.js"], demo: "", github: "", video: "", score: 89, rank: 2, submittedAt: "2025-07-29", cover: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80", notes: "" },
  ],
  certificates: [
    { id: 1, hackathonId: 1, projectId: 1, userId: 1, rank: 1, label: "1st Place Winner", icon: "🥇", issuedAt: "2025-08-20", issued: true },
  ],
  winners: [
    { id: 1, hackathonId: 1, projectId: 1, rank: 1, assignedAt: "2025-08-16" },
    { id: 2, hackathonId: 1, projectId: 2, rank: 2, assignedAt: "2025-08-16" },
  ],
};

const DBContext = createContext(null);
function DBProvider({ children }) {
  const [db, setDB] = useState(INITIAL_DB);
  const query = useCallback((t) => db[t] || [], [db]);
  const insert = useCallback((table, row) => {
    setDB(prev => {
      const maxId = (prev[table] || []).reduce((m, r) => Math.max(m, r.id || 0), 0);
      return { ...prev, [table]: [...(prev[table] || []), { ...row, id: maxId + 1 }] };
    });
  }, []);
  const update = useCallback((table, id, patch) => setDB(prev => ({ ...prev, [table]: prev[table].map(r => r.id === id ? { ...r, ...patch } : r) })), []);
  const remove = useCallback((table, id) => setDB(prev => ({ ...prev, [table]: prev[table].filter(r => r.id !== id) })), []);
  const findOne = useCallback((table, fn) => (db[table] || []).find(fn), [db]);
  const findMany = useCallback((table, fn) => (db[table] || []).filter(fn), [db]);
  return <DBContext.Provider value={{ db, query, insert, update, remove, findOne, findMany }}>{children}</DBContext.Provider>;
}
function useDB() { return useContext(DBContext); }

// ═══════════════════════════════════════════════
// DESIGN TOKENS — Devpost palette + editorial style
// ═══════════════════════════════════════════════
const T = {
  // Devpost core palette
  teal:      "#003E54",   // deep teal — primary dark
  teal2:     "#005470",   // medium teal
  teal3:     "#006B8F",   // lighter teal
  emerald:   "#00C4A7",   // Devpost green accent
  emeraldL:  "#E6FAF7",   // light emerald tint
  orange:    "#FF6B35",   // Devpost orange accent
  orangeL:   "#FFF1EB",   // light orange tint
  cream:     "#FAFAF7",   // off-white background
  white:     "#FFFFFF",
  ink:       "#0D1E2C",   // near-black for text
  ink2:      "#2D4A5C",   // secondary text
  ink3:      "#6B8FA3",   // tertiary text
  border:    "#E0EBF0",
  border2:   "#C8DDE6",
  success:   "#00A887",
  warn:      "#E07B00",
  danger:    "#E0334C",
  purple:    "#6B4EFF",
  gold:      "#F5B800",
};

// Typography helpers — Al Jannat inspired
const F = {
  display: "'Playfair Display', Georgia, serif",   // big editorial headlines
  body:    "'DM Sans', system-ui, sans-serif",      // clean body text
  mono:    "'Space Mono', monospace",               // labels, stats
};

function daysLeft(d) {
  const diff = new Date(d) - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0)   return { label: "Ended",        color: T.ink3 };
  if (days === 0) return { label: "Last day!",     color: T.danger };
  if (days <= 7)  return { label: `${days}d left`, color: T.danger };
  if (days <= 30) return { label: `${days}d left`, color: T.warn };
  return             { label: `${days}d left`,     color: T.success };
}

// ═══════════════════════════════════════════════
// ATOMS
// ═══════════════════════════════════════════════
function Avatar({ initials, size = 36, color = T.teal }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0, fontFamily: F.mono, letterSpacing: "0.5px" }}>
      {initials}
    </div>
  );
}

function Tag({ label, color = "teal" }) {
  const styles = {
    teal:   { bg: T.emeraldL, text: T.teal2 },
    orange: { bg: T.orangeL, text: T.orange },
    gray:   { bg: "#F0F4F6", text: T.ink2 },
  };
  const s = styles[color] || styles.teal;
  return <span style={{ padding: "3px 11px", borderRadius: 3, background: s.bg, color: s.text, fontSize: 11, fontWeight: 700, display: "inline-block", fontFamily: F.mono, letterSpacing: "0.3px", textTransform: "uppercase" }}>{label}</span>;
}

function StatusPill({ status }) {
  const map = {
    open:     ["Open",     T.emerald, "#E6FAF7", T.teal2],
    closing:  ["Closing",  T.warn,    "#FFF3E0", "#7A4400"],
    upcoming: ["Upcoming", T.orange,  T.orangeL, "#C44A00"],
    ended:    ["Ended",    T.ink3,    "#F0F4F6", T.ink3],
  };
  const [l, dot, bg, tc] = map[status] || map.ended;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 3, background: bg, color: tc, fontSize: 10, fontWeight: 700, fontFamily: F.mono, letterSpacing: "0.8px", textTransform: "uppercase" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot }} />{l}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", small = false, style: ext = {}, disabled = false, full = false }) {
  const [hov, setHov] = useState(false);
  const base = {
    border: "none", borderRadius: 3, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.18s cubic-bezier(.4,0,.2,1)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: small ? "7px 16px" : "11px 24px", fontSize: small ? 12 : 13,
    fontFamily: F.body, opacity: disabled ? 0.45 : 1, width: full ? "100%" : undefined,
    letterSpacing: "0.3px",
  };
  const vs = {
    primary: { background: hov ? "#00A38C" : T.emerald, color: T.teal, boxShadow: hov ? "0 4px 14px rgba(0,196,167,0.4)" : "none" },
    orange:  { background: hov ? "#E55A20" : T.orange, color: "#fff", boxShadow: hov ? "0 4px 14px rgba(255,107,53,0.4)" : "none" },
    outline: { background: hov ? T.emeraldL : "transparent", color: T.emerald, border: `1.5px solid ${T.emerald}` },
    ghost:   { background: hov ? T.border : "transparent", color: T.ink2, border: `1px solid ${T.border}` },
    dark:    { background: hov ? T.teal2 : T.teal, color: "#fff" },
    danger:  { background: hov ? "#C02040" : T.danger, color: "#fff" },
    success: { background: hov ? "#008F74" : T.success, color: "#fff" },
    white:   { background: hov ? "#F0FEFA" : "#fff", color: T.teal, border: "none" },
    tealOutline: { background: hov ? "rgba(255,255,255,0.1)" : "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)" },
  };
  return (
    <button style={{ ...base, ...(vs[variant] || vs.primary), ...ext }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function Card({ children, style: ext = {}, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", border: `1px solid ${hov && onClick ? T.emerald : T.border}`, borderRadius: 6, overflow: "hidden", transition: "all 0.18s", boxShadow: hov && onClick ? "0 8px 28px rgba(0,196,167,0.12)" : "0 1px 4px rgba(0,0,0,0.04)", cursor: onClick ? "pointer" : "default", ...ext }}>
      {children}
    </div>
  );
}

function Wrap({ children, style: ext = {} }) {
  return <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", ...ext }}>{children}</div>;
}

function Input({ label, type = "text", value, onChange, placeholder, multiline = false, style: ext = {}, required = false }) {
  const [foc, setFoc] = useState(false);
  const s = { width: "100%", padding: "10px 13px", border: `1.5px solid ${foc ? T.emerald : T.border}`, borderRadius: 4, fontSize: 14, color: T.ink, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: F.body, transition: "border-color 0.15s", ...ext };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 700, color: T.ink2, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: F.mono }}>{label}{required && <span style={{ color: T.danger }}> *</span>}</label>}
      {multiline
        ? <textarea rows={4} value={value} onChange={onChange} placeholder={placeholder} style={{ ...s, resize: "vertical" }} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={s} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)} />}
    </div>
  );
}

function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,30,44,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: width, maxHeight: "92vh", overflow: "auto", boxShadow: "0 28px 72px rgba(0,0,0,0.28)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 26px", borderBottom: `2px solid ${T.emerald}` }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: F.display }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: T.ink3, lineHeight: 1, display:"flex", alignItems:"center", padding: "0 4px" }}>×</button>
        </div>
        <div style={{ padding: 26 }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const c = {
    success: { bg: T.emeraldL, border: T.emerald, text: T.teal2, icon: "✓" },
    error:   { bg: "#FEF0F3", border: T.danger,   text: T.danger, icon: "✕" },
    info:    { bg: "#EBF5FF", border: "#5BA3DC",  text: "#1A4A80", icon: "ℹ" },
  }[type] || {};
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 6, padding: "14px 20px", color: c.text, fontSize: 13, fontWeight: 600, boxShadow: "0 10px 28px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 10, maxWidth: 380, fontFamily: F.body }}>
      <span style={{ fontSize: 15, fontWeight: 800 }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: c.text, fontSize: 20, lineHeight: 1, padding: "0 2px" }}>×</button>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => { const id = Date.now(); setToasts(p => [...p, { id, msg, type }]); }, []);
  const rm = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  const TC = () => toasts.map(t => <Toast key={t.id} message={t.msg} type={t.type} onClose={() => rm(t.id)} />);
  return { show, ToastContainer: TC };
}

// ═══════════════════════════════════════════════
// NAVBAR — editorial dark teal bar
// ═══════════════════════════════════════════════
function Navbar({ page, setPage, user, setUser }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 200, background: T.teal, borderBottom: "2px solid rgba(0,196,167,0.3)" }}>
      <Wrap style={{ height: 64, display: "flex", alignItems: "center", gap: 0, padding: "0 28px" }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 11, flexShrink: 0, marginRight: 36 }}>
          <div style={{ width: 34, height: 34, borderRadius: 4, background: T.emerald, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10L7.5 4L10 7.5L13 4L17 10L13 16H7L3 10Z" fill={T.teal} />
              <path d="M8 10L10 7.5L12 10L10 12.5Z" fill="white" opacity="0.8"/>
            </svg>
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.5px", fontFamily: F.display, fontStyle: "italic" }}>HackVerse</span>
            <span style={{ fontSize: 9, background: T.orange, color: "#fff", borderRadius: 2, padding: "1px 5px", fontWeight: 700, letterSpacing: "1px", marginLeft: 7, fontFamily: F.mono }}>PK</span>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 0, marginRight: "auto" }}>
          {[["home","Browse"], ["host","Host a Hackathon"]].map(([p, l]) => (
            <button key={p} onClick={() => setPage(p)}
              style={{ background: "none", border: "none", padding: "8px 16px", fontSize: 13, fontWeight: 600, color: page === p ? T.emerald : "rgba(255,255,255,0.65)", cursor: "pointer", borderBottom: `2px solid ${page === p ? T.emerald : "transparent"}`, fontFamily: F.body, transition: "all 0.15s", letterSpacing: "0.2px" }}>
              {l}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <Avatar initials={user.avatar} size={34} color={user.role === "organizer" ? T.purple : T.emerald} />
              <button onClick={() => setPage(user.role === "organizer" ? "org-dashboard" : "dashboard")}
                style={{ background: "none", border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: F.body }}>{user.name}</button>
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 2, background: user.role === "organizer" ? "rgba(107,78,255,0.25)" : "rgba(0,196,167,0.2)", color: user.role === "organizer" ? "#C4B8FF" : T.emerald, fontWeight: 700, fontFamily: F.mono, letterSpacing: "0.8px", textTransform: "uppercase" }}>{user.role}</span>
              <Btn variant="tealOutline" small onClick={() => { setUser(null); setPage("home"); }}>Log out</Btn>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: "7px 14px", fontFamily: F.body }}>Log in</button>
              <Btn onClick={() => setPage("register")} style={{ background: T.orange, color: "#fff" }}>Sign up free →</Btn>
            </>
          )}
        </div>
      </Wrap>
    </header>
  );
}

// ═══════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════
const TOP_THEMES = [
  { name: "Machine Learning / AI", count: 61, prize: "$3,796,000" },
  { name: "FinTech", count: 32, prize: "$2,100,000" },
  { name: "Health", count: 27, prize: "$590,000" },
  { name: "Web3 / Blockchain", count: 22, prize: "$1,200,000" },
  { name: "Social Good", count: 19, prize: "$480,000" },
  { name: "Education", count: 14, prize: "$96,000" },
  { name: "IoT", count: 12, prize: "$310,000" },
  { name: "Cybersecurity", count: 10, prize: "$205,000" },
];

function HomePage({ setPage, setSelectedHackathon, user }) {
  const { query, findMany } = useDB();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const hackathons = query("hackathons");
  const registrations = query("registrations");

  const listed = hackathons.filter(h => {
    const ms = !search || h.title.toLowerCase().includes(search.toLowerCase()) || h.organizer.toLowerCase().includes(search.toLowerCase()) || h.theme.toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus === "all" || h.status === filterStatus;
    return ms && mf;
  });
  const isRegistered = (id) => user && registrations.some(r => r.hackathonId === id && r.userId === user.id && r.status === "active");

  return (
    <div style={{ background: T.cream, fontFamily: F.body }}>

      {/* ── HERO — Al Jannat editorial style ── */}
      <div style={{ background: T.teal, padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
        {/* Decorative background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,196,167,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,167,0.05) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
        {/* Big decorative text behind */}
        <div style={{ position: "absolute", top: -20, right: -30, fontSize: 260, fontFamily: F.display, fontStyle: "italic", fontWeight: 900, color: "rgba(0,196,167,0.05)", lineHeight: 1, letterSpacing: "-10px", userSelect: "none", pointerEvents: "none" }}>HACK</div>
        {/* Glowing orbs */}
        <div style={{ position: "absolute", bottom: -60, left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,196,167,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, right: "20%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Wrap style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(0,196,167,0.12)", border: "1px solid rgba(0,196,167,0.3)", borderRadius: 3, padding: "5px 16px", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, boxShadow: "0 0 8px rgba(0,196,167,0.8)" }} />
            <span style={{ fontSize: 11, color: T.emerald, fontWeight: 700, fontFamily: F.mono, letterSpacing: "1.5px", textTransform: "uppercase" }}>Pakistan's #1 Hackathon Platform</span>
          </div>

          {/* Editorial headline — Al Jannat style */}
          <h1 style={{ fontSize: "clamp(38px,5.5vw,72px)", fontFamily: F.display, fontWeight: 900, color: "#fff", lineHeight: 1.0, letterSpacing: "-2px", margin: "0 0 14px" }}>
            Build. Compete.<br />
            <span style={{ fontStyle: "italic", color: T.emerald }}>Win.</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: "0 auto 42px", maxWidth: 500, fontWeight: 300 }}>
            Discover competitions, submit projects, and earn recognition in Pakistan's fastest-growing hacker community.
          </p>

          {/* Search bar */}
          <div style={{ display: "flex", maxWidth: 600, margin: "0 auto 28px", borderRadius: 4, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.35)", border: "1.5px solid rgba(0,196,167,0.3)" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: T.ink3 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hackathons, themes, organizers…"
                style={{ width: "100%", padding: "16px 16px 16px 48px", border: "none", fontSize: 14, color: T.ink, outline: "none", boxSizing: "border-box", fontFamily: F.body, background: "#fff" }} />
            </div>
            <button style={{ padding: "16px 32px", background: T.emerald, color: T.teal, border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", fontFamily: F.mono, letterSpacing: "1px", textTransform: "uppercase", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#00A38C"}
              onMouseLeave={e => e.currentTarget.style.background = T.emerald}>
              Search
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Btn variant="white" onClick={() => setPage("register")} style={{ fontWeight: 800, padding: "12px 28px", fontSize: 14 }}>For participants →</Btn>
            <Btn variant="tealOutline" onClick={() => setPage("host")} style={{ fontWeight: 700, padding: "12px 28px", fontSize: 14 }}>For organizers →</Btn>
          </div>
        </Wrap>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background: T.ink, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Wrap style={{ display: "flex", justifyContent: "center", padding: "0 28px", flexWrap: "wrap" }}>
          {[["12,000+","Developers"], ["PKR 10M+","Prize Pool"], [hackathons.length,"Active Hackathons"], [query("projects").length,"Projects Built"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center", padding: "22px 44px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.emerald, letterSpacing: "-1px", fontFamily: F.display }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 3, fontFamily: F.mono, letterSpacing: "0.5px", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </Wrap>
      </div>

      {/* ── TRUSTED BY ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, padding: "16px 0" }}>
        <Wrap style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 28px", overflowX: "auto" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.ink3, textTransform: "uppercase", letterSpacing: "1.5px", flexShrink: 0, marginRight: 28, fontFamily: F.mono }}>Trusted by</span>
          {["Microsoft","Google","AWS","NVIDIA","HBL","Easypaisa","JazzCash"].map(s => (
            <span key={s} style={{ fontSize: 12, fontWeight: 800, color: T.ink2, padding: "5px 18px", borderRight: `1px solid ${T.border}`, whiteSpace: "nowrap", fontFamily: F.mono, letterSpacing: "0.5px", flexShrink: 0 }}>{s}</span>
          ))}
        </Wrap>
      </div>

      {/* ── MAIN CONTENT ── */}
      <Wrap style={{ padding: "44px 28px 90px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>

        {/* LEFT: Listings */}
        <div>
          {/* Filter bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.ink3, marginRight: 6, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "0.5px" }}>Filter:</span>
            {["all", "open", "upcoming", "ended"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: "6px 18px", borderRadius: 3, border: `1.5px solid ${filterStatus === s ? T.emerald : T.border}`, background: filterStatus === s ? T.emeraldL : "#fff", color: filterStatus === s ? T.teal2 : T.ink2, fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", transition: "all 0.15s", fontFamily: F.mono, letterSpacing: "0.5px" }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: T.ink3, fontFamily: F.mono }}>{listed.length} result{listed.length !== 1 ? "s" : ""}</span>
          </div>

          {listed.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: T.ink3, background: "#fff", borderRadius: 6, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 48, marginBottom: 14, filter: "grayscale(1)" }}>🔎</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, fontFamily: F.display }}>No hackathons found</div>
              <div style={{ fontSize: 13 }}>Try a different search or filter</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {listed.map(h => {
                const dl = daysLeft(h.deadline);
                const regCount = registrations.filter(r => r.hackathonId === h.id && r.status === "active").length;
                const registered = isRegistered(h.id);
                return (
                  <div key={h.id} onClick={() => { setSelectedHackathon(h); setPage("hackathon-detail"); }}
                    style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden", cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "stretch" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.emerald; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,196,167,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                    {/* Thumb with overlay text */}
                    <div style={{ width: 200, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                      <img src={h.thumb} alt={h.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 50%, rgba(255,255,255,0.15))" }} />
                      {/* Vertical label */}
                      <div style={{ position: "absolute", top: 14, left: -8, transform: "rotate(-90deg) translateX(-50%)", transformOrigin: "top left", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: F.mono, letterSpacing: "2px", textTransform: "uppercase", whiteSpace: "nowrap", top: 80, left: 16 }}>
                        {h.theme}
                      </div>
                    </div>
                    {/* Body */}
                    <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <StatusPill status={h.status} />
                          {registered && <span style={{ fontSize: 10, fontWeight: 700, color: T.success, background: T.emeraldL, padding: "3px 10px", borderRadius: 2, fontFamily: F.mono, letterSpacing: "0.5px" }}>✓ REGISTERED</span>}
                          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: dl.color, fontFamily: F.mono }}>{dl.label}</span>
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: T.ink, margin: "0 0 5px", lineHeight: 1.25, fontFamily: F.display }}>{h.title}</h3>
                        <p style={{ fontSize: 12, color: T.ink3, margin: "0 0 12px" }}>by <strong style={{ color: T.ink2 }}>{h.organizer}</strong> · 🌐 Online</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                          {h.tags.map(t => <Tag key={t} label={t} />)}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                        <div>
                          <span style={{ fontSize: 18, fontWeight: 900, color: T.ink, fontFamily: F.display }}>{h.prize} </span>
                          <span style={{ fontSize: 11, color: T.ink3, fontFamily: F.mono }}>prize pool</span>
                        </div>
                        <span style={{ fontSize: 12, color: T.ink3, fontFamily: F.mono }}>{regCount} registered</span>
                      </div>
                    </div>
                    {/* Right accent bar */}
                    <div style={{ width: 4, background: h.status === "open" ? T.emerald : h.status === "upcoming" ? T.orange : T.ink3, flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div style={{ background: "#fff", borderRadius: 6, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 18 }}>
            <div style={{ padding: "16px 20px", borderBottom: `2px solid ${T.emerald}`, background: T.teal }}>
              <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: F.mono }}>Top Hackathon Themes</h3>
            </div>
            <div style={{ padding: "8px 20px", background: T.cream, borderBottom: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "1fr 40px 80px" }}>
              {["Theme","#","Prizes"].map(h => (
                <span key={h} style={{ fontSize: 9, fontWeight: 700, color: T.ink3, textTransform: "uppercase", letterSpacing: "1px", fontFamily: F.mono }}>{h}</span>
              ))}
            </div>
            {TOP_THEMES.map((th, i) => (
              <div key={th.name} style={{ display: "grid", gridTemplateColumns: "1fr 40px 80px", padding: "10px 20px", borderBottom: i < TOP_THEMES.length - 1 ? `1px solid ${T.border}` : "none", alignItems: "center", cursor: "pointer", transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.cream}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: T.ink3, fontWeight: 700, minWidth: 14, fontFamily: F.mono }}>{i + 1}.</span>
                  <span style={{ fontSize: 11, color: T.teal2, fontWeight: 700, fontFamily: F.body }}>{th.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.ink2, fontFamily: F.mono }}>{th.count}</span>
                <span style={{ fontSize: 10, color: T.ink3, fontFamily: F.mono }}>{th.prize}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: T.teal, borderRadius: 6, padding: "26px 22px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: -20, right: -20, fontSize: 120, fontFamily: F.display, fontStyle: "italic", color: "rgba(0,196,167,0.08)", fontWeight: 900, lineHeight: 1, pointerEvents: "none" }}>Go</div>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
            <h4 style={{ fontSize: 16, fontWeight: 900, color: "#fff", margin: "0 0 8px", fontFamily: F.display, fontStyle: "italic" }}>Host your hackathon</h4>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 16px", fontWeight: 300 }}>All the tools to run world-class competitions — registration, judging, certificates.</p>
            <Btn variant="white" small full onClick={() => setPage("host")}>Get started free →</Btn>
          </div>
        </div>
      </Wrap>

      {/* ── FEATURED SECTION — dark editorial ── */}
      <div style={{ background: T.ink, padding: "68px 0" }}>
        <Wrap style={{ padding: "0 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.emerald, letterSpacing: "2px", textTransform: "uppercase", fontFamily: F.mono, marginBottom: 10 }}>Featured Events</div>
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#fff", margin: 0, fontFamily: F.display, fontStyle: "italic", letterSpacing: "-0.5px" }}>Online Hackathons</h2>
            </div>
            <button onClick={() => setPage("home")} style={{ background: "rgba(0,196,167,0.1)", border: "1px solid rgba(0,196,167,0.3)", color: T.emerald, fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 3, cursor: "pointer", fontFamily: F.mono, letterSpacing: "0.5px" }}>View all →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {hackathons.map(h => (
              <div key={h.id} onClick={() => { setSelectedHackathon(h); setPage("hackathon-detail"); }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden", cursor: "pointer", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(0,196,167,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                <div style={{ height: 130, position: "relative", overflow: "hidden" }}>
                  <img src={h.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,30,44,0.9) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, background: T.orange, color: "#fff", padding: "3px 8px", borderRadius: 2, fontFamily: F.mono, letterSpacing: "1px", textTransform: "uppercase" }}>FEATURED</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: "0 0 5px", fontFamily: F.display, lineHeight: 1.2 }}>{h.title}</h4>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <StatusPill status={h.status} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: T.emerald, fontFamily: F.display }}>{h.prize}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: F.mono }}>{h.participants?.toLocaleString()} participants</span>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </div>

      {/* ── HOW IT WORKS — clean white ── */}
      <div style={{ background: "#fff", padding: "80px 0" }}>
        <Wrap style={{ padding: "0 28px", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.orange, background: T.orangeL, padding: "5px 16px", borderRadius: 3, display: "inline-block", marginBottom: 18, fontFamily: F.mono, letterSpacing: "2px", textTransform: "uppercase" }}>How it works</div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 900, color: T.ink, margin: "0 0 56px", fontFamily: F.display, fontStyle: "italic", letterSpacing: "-0.5px" }}>Everything you need to<br /><span style={{ color: T.teal }}>hack, compete & win</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "🔍", n: "01", title: "Find your hackathon", desc: "Browse events by theme, prize pool, or deadline. Filter by online or in-person and register in one click." },
              { icon: "⚙️", n: "02", title: "Build your project", desc: "Form your team, ideate, and build. Submit your project with a demo link, GitHub repo, and video." },
              { icon: "🏆", n: "03", title: "Win & earn certificates", desc: "Get judged, see live leaderboards, and download your digital certificate to share on LinkedIn." },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: "36px 28px", borderRadius: 6, border: `1px solid ${T.border}`, textAlign: "left", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, fontFamily: F.display, fontStyle: "italic", color: "rgba(0,62,84,0.04)", fontWeight: 900, lineHeight: 1, pointerEvents: "none" }}>{s.n}</div>
                <div style={{ width: 44, height: 44, borderRadius: 4, background: i === 1 ? T.orange : T.emerald, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: i === 1 ? T.orange : T.teal2, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10, fontFamily: F.mono }}>Step {s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: T.ink, margin: "0 0 10px", fontFamily: F.display }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: T.ink2, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HACKATHON DETAIL
// ═══════════════════════════════════════════════
function HackathonDetailPage({ hackathon: initialH, setPage, user }) {
  const { query, insert, findMany, findOne, update } = useDB();
  const { show, ToastContainer } = useToast();
  const [tab, setTab] = useState("overview");
  const [showSubmit, setShowSubmit] = useState(false);

  const h = query("hackathons").find(hk => hk.id === initialH.id) || initialH;
  const registrations = findMany("registrations", r => r.hackathonId === h.id && r.status === "active");
  const projects = findMany("projects", p => p.hackathonId === h.id);
  const winners = findMany("winners", w => w.hackathonId === h.id);
  const certs = user ? findMany("certificates", c => c.hackathonId === h.id && c.userId === user.id) : [];
  const userReg = user ? findOne("registrations", r => r.hackathonId === h.id && r.userId === user.id && r.status === "active") : null;
  const userProj = user ? findOne("projects", p => p.hackathonId === h.id && p.submittedBy === user.id) : null;
  const regUsers = query("users").filter(u => registrations.some(r => r.userId === u.id));

  const handleRegister = () => {
    if (!user) { setPage("login"); return; }
    if (userReg) { show("Already registered!", "info"); return; }
    insert("registrations", { hackathonId: h.id, userId: user.id, registeredAt: new Date().toISOString().split("T")[0], status: "active" });
    show(`Registered for ${h.title}!`);
  };

  const rankedProjects = [...projects].sort((a, b) => {
    const wa = winners.find(w => w.projectId === a.id), wb = winners.find(w => w.projectId === b.id);
    if (wa && wb) return wa.rank - wb.rank;
    if (wa) return -1; if (wb) return 1;
    return b.score - a.score;
  });

  const TABS = ["overview", "participants", "projects", "winners"];

  return (
    <div style={{ background: T.cream, fontFamily: F.body }}>
      <ToastContainer />
      {/* Cover */}
      <div style={{ position: "relative", height: 320, overflow: "hidden", background: T.teal }}>
        <img src={h.cover} alt={h.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,62,84,0.3) 0%, rgba(0,62,84,0.9) 100%)` }} />
        {/* Decorative lines */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T.emerald}, ${T.orange})` }} />
        <Wrap style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", padding: "0 28px 30px", width: "100%", maxWidth: 1180, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ marginBottom: 10 }}><StatusPill status={h.status} /></div>
              <h1 style={{ fontSize: "clamp(22px,3.5vw,40px)", fontWeight: 900, color: "#fff", margin: "0 0 7px", fontFamily: F.display, fontStyle: "italic", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{h.title}</h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 12px" }}>by <strong style={{ color: "#fff" }}>{h.organizer}</strong> · 🌐 Online</p>
              <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: T.emerald, fontWeight: 900, fontSize: 22, fontFamily: F.display }}>{h.prize}</span>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: F.mono }}>· {registrations.length} registered</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {user && userReg && !userProj && h.status !== "ended" && <Btn onClick={() => setShowSubmit(true)} style={{ background: T.orange, color: "#fff" }}>📤 Submit Project</Btn>}
              {user && userProj && <span style={{ background: T.success, color: "#fff", fontSize: 12, fontWeight: 700, padding: "11px 20px", borderRadius: 4, fontFamily: F.mono, letterSpacing: "0.5px" }}>✓ SUBMITTED</span>}
              {!userReg && h.status !== "ended" && <Btn variant="white" onClick={handleRegister}>{user ? "🎯 Register Now" : "Sign in to Register"}</Btn>}
            </div>
          </div>
        </Wrap>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 64, zIndex: 100 }}>
        <Wrap style={{ display: "flex", padding: "0 28px" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "15px 20px", background: "none", border: "none", borderBottom: tab === t ? `3px solid ${T.emerald}` : "3px solid transparent", marginBottom: -1, fontSize: 13, fontWeight: tab === t ? 800 : 500, color: tab === t ? T.teal2 : T.ink3, cursor: "pointer", textTransform: "capitalize", fontFamily: F.body, transition: "color 0.15s" }}>
              {t}{t === "participants" ? ` (${registrations.length})` : t === "projects" ? ` (${projects.length})` : ""}
            </button>
          ))}
        </Wrap>
      </div>

      <Wrap style={{ padding: "30px 28px 80px", display: "grid", gridTemplateColumns: "1fr 290px", gap: 26, alignItems: "start" }}>
        <div>
          {tab === "overview" && (
            <div>
              <Card style={{ padding: 26, marginBottom: 16 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: T.ink3, marginBottom: 12, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>About</h2>
                <p style={{ fontSize: 14, color: T.ink2, lineHeight: 1.8, margin: 0 }}>{h.description}</p>
              </Card>
              <Card style={{ padding: 26, marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: T.ink3, marginBottom: 18, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>🏆 Prize Breakdown</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                  {[["🥇","1st Place",h.prize1,"#D97B00"],["🥈","2nd Place",h.prize2,"#6B7280"],["🥉","3rd Place",h.prize3,"#A06030"]].map(([icon,place,amt,col]) => (
                    <div key={place} style={{ textAlign: "center", padding: "20px 14px", border: `1px solid ${T.border}`, borderRadius: 6, background: T.cream }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                      <div style={{ fontSize: 10, color: T.ink3, fontWeight: 700, textTransform: "uppercase", marginBottom: 6, fontFamily: F.mono, letterSpacing: "0.8px" }}>{place}</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: col, fontFamily: F.display }}>{amt}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card style={{ padding: 26 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: T.ink3, marginBottom: 10, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>📋 Rules</h3>
                <p style={{ fontSize: 13, color: T.ink2, lineHeight: 1.8, margin: "0 0 18px" }}>{h.rules}</p>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: T.ink3, marginBottom: 10, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>⚖️ Judging</h3>
                <p style={{ fontSize: 13, color: T.ink2, lineHeight: 1.8, margin: "0 0 18px" }}>{h.judging}</p>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: T.ink3, marginBottom: 14, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>🤝 Sponsors</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {h.sponsors.map(s => <div key={s} style={{ padding: "6px 16px", border: `1px solid ${T.border}`, borderRadius: 3, fontSize: 12, fontWeight: 700, color: T.ink2, background: T.cream, fontFamily: F.mono }}>{s}</div>)}
                </div>
              </Card>
            </div>
          )}

          {tab === "participants" && (
            <Card style={{ padding: 24 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: T.ink3, marginBottom: 20, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>Participants ({registrations.length})</h2>
              {registrations.length === 0 ? <div style={{ textAlign: "center", padding: 56, color: T.ink3 }}>No participants yet.</div> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                  {regUsers.map(p => (
                    <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 14, border: `1px solid ${T.border}`, borderRadius: 6, transition: "border-color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = T.emerald}
                      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                      <Avatar initials={p.avatar} size={38} color={T.teal} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: T.ink3, marginBottom: 7, fontFamily: F.mono }}>📍 {p.location}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{p.skills.slice(0,2).map(s => <Tag key={s} label={s} />)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {tab === "projects" && (
            <Card style={{ padding: 24 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: T.ink3, marginBottom: 20, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>Projects ({projects.length})</h2>
              {projects.length === 0 ? (
                <div style={{ textAlign: "center", padding: 56, color: T.ink3 }}>
                  {userReg && !userProj && h.status !== "ended" ? <>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📤</div>
                    <div style={{ fontWeight: 700, marginBottom: 14, fontFamily: F.display, fontSize: 18 }}>You're registered — submit your project!</div>
                    <Btn onClick={() => setShowSubmit(true)}>Submit Project</Btn>
                  </> : "No projects yet."}
                </div>
              ) : projects.map(p => {
                const w = winners.find(w => w.projectId === p.id);
                return (
                  <div key={p.id} style={{ display: "flex", gap: 16, padding: "18px 0", borderBottom: `1px solid ${T.border}` }}>
                    <img src={p.cover} alt={p.title} style={{ width: 96, height: 64, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: T.ink, margin: 0, fontFamily: F.display }}>{p.title}</h3>
                        {w && <span style={{ fontSize: 10, background: "#FFF8E0", color: "#8A5C00", padding: "2px 8px", borderRadius: 2, fontWeight: 700, fontFamily: F.mono }}>{w.rank === 1 ? "🥇 1st" : w.rank === 2 ? "🥈 2nd" : "🥉 3rd"}</span>}
                      </div>
                      <p style={{ fontSize: 12, color: T.ink2, margin: "0 0 8px" }}>{p.tagline}</p>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{p.tech.map(t => <Tag key={t} label={t} />)}</div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 50 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: T.teal2, fontFamily: F.display }}>{p.score}</div>
                      <div style={{ fontSize: 10, color: T.ink3, fontFamily: F.mono, textTransform: "uppercase" }}>score</div>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}

          {tab === "winners" && (
            winners.length === 0 ? (
              <Card style={{ padding: 72, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
                <div style={{ fontWeight: 800, color: T.ink, fontSize: 20, marginBottom: 10, fontFamily: F.display, fontStyle: "italic" }}>Winners Not Announced Yet</div>
                <div style={{ color: T.ink3, fontSize: 13 }}>Check back after the hackathon ends.</div>
              </Card>
            ) : (
              <Card>
                <div style={{ padding: "20px 24px", borderBottom: `2px solid ${T.emerald}` }}>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: T.ink, margin: 0, fontFamily: F.display }}>🏆 Winners</h2>
                </div>
                {rankedProjects.filter(p => winners.some(w => w.projectId === p.id)).map(p => {
                  const w = winners.find(w => w.projectId === p.id);
                  const icons = { 1:"🥇",2:"🥈",3:"🥉" };
                  const cols = { 1: T.gold, 2:"#9CA3AF", 3:"#B45309" };
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ fontSize: 30 }}>{icons[w.rank]}</span>
                      <img src={p.cover} alt="" style={{ width: 70, height: 48, borderRadius: 4, objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: T.ink, fontSize: 14, fontFamily: F.display }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: T.ink3, fontFamily: F.mono }}>{p.team}</div>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 24, color: cols[w.rank], fontFamily: F.display }}>{p.score}</div>
                    </div>
                  );
                })}
              </Card>
            )
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: 120 }}>
          <Card style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.ink3, marginBottom: 14, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>📅 Timeline</div>
            {[["Reg. Opens",h.regOpen],["Reg. Closes",h.regClose],["Sub. Opens",h.subOpen],["Sub. Closes",h.subClose]].map(([l,d]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, color: T.ink2 }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: F.mono }}>{d}</span>
              </div>
            ))}
          </Card>
          {!userReg && h.status !== "ended" && <Btn full onClick={handleRegister} style={{ marginBottom: 10, padding: "13px", fontSize: 14, fontWeight: 800 }}>🎯 Register Now</Btn>}
          {userReg && !userProj && h.status !== "ended" && <Btn full variant="orange" style={{ marginBottom: 10, padding: "13px" }} onClick={() => setShowSubmit(true)}>📤 Submit Project</Btn>}
          {userProj && <div style={{ background: T.emeraldL, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: "14px 18px", textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.success }}>✓ Project Submitted</div>
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 3, fontFamily: F.mono }}>{userProj.title}</div>
          </div>}
          {certs.length > 0 && <Card style={{ padding: 18, marginTop: 10, background: "#FFFBEB", borderColor: "#F5D100" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#8A5C00", marginBottom: 10, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "1px" }}>🏅 Certificate</div>
            {certs.map(c => <div key={c.id} style={{ fontSize: 13, fontWeight: 700, color: "#8A5C00", marginBottom: 10 }}>{c.label}</div>)}
            <Btn full small style={{ background: T.gold, color: T.teal, fontWeight: 800 }}>⬇ Download</Btn>
          </Card>}
        </div>
      </Wrap>

      <SubmitProjectModal open={showSubmit} onClose={() => setShowSubmit(false)} hackathon={h} user={user} onSuccess={() => { setShowSubmit(false); show("🎉 Project submitted!"); setTab("projects"); }} />
    </div>
  );
}

function SubmitProjectModal({ open, onClose, hackathon: h, user, onSuccess }) {
  const { insert } = useDB();
  const [form, setForm] = useState({ title:"", tagline:"", description:"", tech:"", demo:"", github:"", video:"", team:"" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.title || !form.tagline || !form.description) return;
    insert("projects", { hackathonId: h.id, submittedBy: user.id, title: form.title, team: form.team || user.name, tagline: form.tagline, description: form.description, tech: form.tech.split(",").map(t => t.trim()).filter(Boolean), demo: form.demo, github: form.github, video: form.video, score: Math.floor(Math.random()*20)+75, rank: null, submittedAt: new Date().toISOString().split("T")[0], cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80", notes:"" });
    setForm({ title:"", tagline:"", description:"", tech:"", demo:"", github:"", video:"", team:"" });
    onSuccess();
  };
  return (
    <Modal open={open} onClose={onClose} title={`Submit Project — ${h?.title}`} width={580}>
      <Input label="Project Title" value={form.title} onChange={set("title")} placeholder="MediScan AI" required />
      <Input label="Team Name" value={form.team} onChange={set("team")} placeholder="Team Alpha" />
      <Input label="Tagline" value={form.tagline} onChange={set("tagline")} placeholder="One sentence about your project" required />
      <Input label="Description" value={form.description} onChange={set("description")} multiline placeholder="Describe what you built and why it matters…" required />
      <Input label="Technologies (comma-separated)" value={form.tech} onChange={set("tech")} placeholder="React, Python, TensorFlow" />
      <Input label="Demo URL" value={form.demo} onChange={set("demo")} placeholder="https://your-demo.com" />
      <Input label="GitHub Repository" value={form.github} onChange={set("github")} placeholder="https://github.com/team/project" />
      <Input label="Video Demo" value={form.video} onChange={set("video")} placeholder="https://youtube.com/watch?v=..." />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn onClick={submit} disabled={!form.title || !form.tagline || !form.description} style={{ background: T.orange, color: "#fff" }}>🚀 Submit Project</Btn>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════
function AuthPage({ mode, setPage, setUser }) {
  const { query, insert } = useDB();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"participant" });
  const [err, setErr] = useState("");
  const isLogin = mode === "login";
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    setErr("");
    if (isLogin) {
      const found = query("users").find(u => u.email === form.email && u.password === form.password);
      if (!found) { setErr("Invalid email or password."); return; }
      setUser(found); setPage(found.role === "organizer" ? "org-dashboard" : "dashboard");
    } else {
      if (!form.name || !form.email || !form.password) { setErr("Fill all fields."); return; }
      if (query("users").find(u => u.email === form.email)) { setErr("Email already registered."); return; }
      const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "U";
      const nu = { name:form.name, email:form.email, password:form.password, role:form.role, avatar:initials, bio:"", skills:[], location:"", github:"", linkedin:"", hackathonsJoined:[], wins:0 };
      insert("users", nu);
      setUser({ ...nu, id: Date.now() }); setPage(form.role === "organizer" ? "org-dashboard" : "dashboard");
    }
  };

  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.teal, padding: "56px 24px", position: "relative", overflow: "hidden", fontFamily: F.body }}>
      {/* Big decorative text */}
      <div style={{ position: "absolute", bottom: -40, right: -20, fontSize: 280, fontFamily: F.display, fontStyle: "italic", fontWeight: 900, color: "rgba(0,196,167,0.06)", lineHeight: 1, letterSpacing: "-10px", pointerEvents: "none" }}>
        {isLogin ? "Hi" : "Hey"}
      </div>
      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 6, background: T.emerald, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="30" height="30" viewBox="0 0 20 20" fill="none"><path d="M3 10L7.5 4L10 7.5L13 4L17 10L13 16H7L3 10Z" fill={T.teal}/><path d="M8 10L10 7.5L12 10L10 12.5Z" fill="white" opacity="0.8"/></svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 6px", fontFamily: F.display, fontStyle: "italic" }}>{isLogin ? "Welcome back" : "Join HackVerse"}</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300 }}>{isLogin ? "Sign in to your account" : "Join 12,000+ innovators"}</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 8, padding: "32px 36px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
          {isLogin && (
            <div style={{ background: T.emeraldL, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: T.teal2, fontFamily: F.mono }}>
              <strong>Demo:</strong> ayesha@gmail.com / 1234 (participant)<br/>org@techcorp.com / 1234 (organizer)
            </div>
          )}
          {err && <div style={{ background: "#FEF0F3", border: `1px solid ${T.danger}`, borderRadius: 4, padding: "11px 16px", marginBottom: 16, fontSize: 13, color: T.danger, fontWeight: 600 }}>{err}</div>}

          {!isLogin && <Input label="Full Name" value={form.name} onChange={set("name")} placeholder="Ayesha Raza" required />}
          <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required />

          {!isLogin && (
            <div style={{ marginBottom: 22 }}>
              <label style={{ display:"block", marginBottom:10, fontSize:11, fontWeight:700, color:T.ink2, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily: F.mono }}>I am a…</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {["participant","organizer"].map(r => (
                  <div key={r} onClick={() => setForm(f => ({...f, role:r}))}
                    style={{ padding:"16px 14px", border:`2px solid ${form.role===r ? T.emerald : T.border}`, borderRadius:6, cursor:"pointer", background:form.role===r ? T.emeraldL : "#fff", transition:"all 0.15s" }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{r==="participant" ? "👨‍💻" : "🏢"}</div>
                    <div style={{ fontSize:13, fontWeight:800, color:form.role===r ? T.teal2 : T.ink, textTransform:"capitalize", fontFamily: F.display }}>{r}</div>
                    <div style={{ fontSize:11, color:T.ink3, marginTop:2 }}>{r==="participant" ? "Join & build" : "Host events"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Btn full onClick={submit} style={{ padding:"13px", fontSize:14, fontWeight:800, marginBottom:18, background: T.orange, color: "#fff" }}>{isLogin ? "Sign in →" : "Create account →"}</Btn>
          <div style={{ textAlign:"center", fontSize:13, color:T.ink3 }}>
            {isLogin ? "No account? " : "Have an account? "}
            <span onClick={() => setPage(isLogin ? "register" : "login")} style={{ color:T.teal2, fontWeight:700, cursor:"pointer" }}>{isLogin ? "Sign up free" : "Sign in"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PARTICIPANT DASHBOARD
// ═══════════════════════════════════════════════
function ParticipantDashboard({ user, setUser, setPage, setSelectedHackathon }) {
  const { query, findMany, update } = useDB();
  const { show, ToastContainer } = useToast();
  const [tab, setTab] = useState("hackathons");
  const [editForm, setEditForm] = useState({ name:user.name, bio:user.bio||"", skills:(user.skills||[]).join(", "), github:user.github||"", linkedin:user.linkedin||"", location:user.location||"" });

  const hackathons = query("hackathons");
  const regs = findMany("registrations", r => r.userId===user.id && r.status==="active");
  const myH = hackathons.filter(h => regs.some(r => r.hackathonId===h.id));
  const myProjects = findMany("projects", p => p.submittedBy===user.id);
  const myCerts = findMany("certificates", c => c.userId===user.id && c.issued);
  const myWins = findMany("winners", w => { const p = query("projects").find(p => p.id===w.projectId); return p && p.submittedBy===user.id; });

  const save = () => {
    const updated = { ...user, name:editForm.name, bio:editForm.bio, skills:editForm.skills.split(",").map(s=>s.trim()).filter(Boolean), github:editForm.github, linkedin:editForm.linkedin, location:editForm.location };
    update("users", user.id, updated); setUser(updated); show("Profile saved!"); setTab("hackathons");
  };

  const TABS = ["hackathons","projects","certificates","edit profile"];

  return (
    <div style={{ background: T.cream, fontFamily: F.body }}>
      <ToastContainer />
      {/* Profile header */}
      <div style={{ background: T.teal, padding: "36px 0 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -30, fontSize: 200, fontFamily: F.display, fontStyle: "italic", fontWeight: 900, color: "rgba(0,196,167,0.06)", lineHeight: 1, pointerEvents: "none" }}>Profile</div>
        <Wrap style={{ padding: "0 28px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap", paddingBottom: 28 }}>
            <Avatar initials={user.avatar} size={72} color={T.emerald} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 6px", fontFamily: F.display, fontStyle: "italic" }}>{user.name}</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 12px", fontWeight: 300 }}>
                {user.bio || "No bio yet."}
                {user.location && <span style={{ marginLeft: 10, fontFamily: F.mono }}>📍 {user.location}</span>}
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
                {(user.skills||[]).map(s => <span key={s} style={{ fontSize:11, padding:"3px 12px", borderRadius:3, background:"rgba(0,196,167,0.15)", color:T.emerald, fontWeight:700, fontFamily:F.mono, letterSpacing:"0.3px" }}>{s}</span>)}
              </div>
              <div style={{ display:"flex", gap:32 }}>
                {[[myH.length,"Hackathons"],[myProjects.length,"Projects"],[myWins.length,"Wins"],[myCerts.length,"Certs"]].map(([v,l]) => (
                  <div key={l}>
                    <div style={{ fontSize:24, fontWeight:900, color:"#fff", fontFamily:F.display }}>{v}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <Btn variant="tealOutline" small onClick={() => setTab("edit profile")}>✏️ Edit Profile</Btn>
          </div>
          <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding:"13px 18px", background:"none", border:"none", borderBottom:`3px solid ${tab===t ? T.emerald : "transparent"}`, fontSize:12, fontWeight:tab===t?800:500, color:tab===t?"#fff":"rgba(255,255,255,0.45)", cursor:"pointer", textTransform:"capitalize", fontFamily:F.body, whiteSpace:"nowrap" }}>
                {t}
              </button>
            ))}
          </div>
        </Wrap>
      </div>

      <Wrap style={{ padding:"32px 28px 80px" }}>
        {tab === "hackathons" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:T.ink, margin:0, fontFamily:F.display, fontStyle:"italic" }}>My Hackathons ({myH.length})</h2>
              <Btn small variant="outline" onClick={() => setPage("home")}>Browse more →</Btn>
            </div>
            {myH.length === 0 ? (
              <Card style={{ padding:72, textAlign:"center" }}>
                <div style={{ fontSize:44, marginBottom:16 }}>🔍</div>
                <div style={{ fontWeight:800, color:T.ink, marginBottom:12, fontFamily:F.display, fontSize:20, fontStyle:"italic" }}>No hackathons yet</div>
                <Btn onClick={() => setPage("home")}>Browse Hackathons →</Btn>
              </Card>
            ) : (
              <Card>
                {myH.map((h,i) => {
                  const myP = query("projects").find(p => p.hackathonId===h.id && p.submittedBy===user.id);
                  return (
                    <div key={h.id} style={{ display:"flex", gap:16, padding:18, borderBottom:i<myH.length-1?`1px solid ${T.border}`:"none", alignItems:"center", cursor:"pointer", transition:"background 0.1s" }}
                      onClick={() => { setSelectedHackathon(h); setPage("hackathon-detail"); }}
                      onMouseEnter={e => e.currentTarget.style.background=T.cream}
                      onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                      <div style={{ width:56, height:56, borderRadius:5, overflow:"hidden", flexShrink:0 }}>
                        <img src={h.thumb} alt={h.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800, fontSize:14, color:T.ink, fontFamily:F.display }}>{h.title}</div>
                        <div style={{ fontSize:12, color:T.ink3, fontFamily:F.mono }}>{h.organizer}</div>
                      </div>
                      <StatusPill status={h.status} />
                      <span style={{ fontSize:11, fontWeight:700, color:myP?T.success:T.ink3, fontFamily:F.mono }}>{myP?"✓ SUBMITTED":"No submission"}</span>
                    </div>
                  );
                })}
              </Card>
            )}
          </div>
        )}

        {tab === "projects" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:900, color:T.ink, marginBottom:18, fontFamily:F.display, fontStyle:"italic" }}>My Projects ({myProjects.length})</h2>
            {myProjects.length === 0 ? (
              <Card style={{ padding:72, textAlign:"center" }}>
                <div style={{ fontSize:44, marginBottom:16 }}>📁</div>
                <div style={{ fontWeight:800, color:T.ink, marginBottom:10, fontFamily:F.display, fontSize:20 }}>No projects yet</div>
                <div style={{ fontSize:13, color:T.ink3 }}>Register and submit to see your projects here.</div>
              </Card>
            ) : myProjects.map(p => {
              const w = query("winners").find(w => w.projectId===p.id);
              const hk = query("hackathons").find(h => h.id===p.hackathonId);
              return (
                <Card key={p.id} style={{ padding:22, marginBottom:14, display:"flex", gap:18 }}>
                  <img src={p.cover} alt={p.title} style={{ width:96, height:68, borderRadius:5, objectFit:"cover", flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ fontWeight:800, fontSize:15, color:T.ink, fontFamily:F.display }}>{p.title}</span>
                      {w && <span style={{ fontSize:10, background:"#FFF8E0", color:"#8A5C00", padding:"2px 9px", borderRadius:2, fontWeight:700, fontFamily:F.mono }}>{w.rank===1?"🥇 Winner":w.rank===2?"🥈 2nd":"🥉 3rd"}</span>}
                    </div>
                    <div style={{ fontSize:12, color:T.ink3, marginBottom:7, fontFamily:F.mono }}>{hk?.title}</div>
                    <p style={{ fontSize:13, color:T.ink2, margin:"0 0 10px" }}>{p.tagline}</p>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{p.tech.slice(0,3).map(t => <Tag key={t} label={t} />)}</div>
                  </div>
                  <div style={{ textAlign:"center", minWidth:56 }}>
                    <div style={{ fontSize:26, fontWeight:900, color:T.teal2, fontFamily:F.display }}>{p.score}</div>
                    <div style={{ fontSize:10, color:T.ink3, fontFamily:F.mono, textTransform:"uppercase" }}>score</div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {tab === "certificates" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:900, color:T.ink, marginBottom:18, fontFamily:F.display, fontStyle:"italic" }}>Certificates ({myCerts.length})</h2>
            {myCerts.length === 0 ? (
              <Card style={{ padding:72, textAlign:"center" }}>
                <div style={{ fontSize:44, marginBottom:16 }}>🏅</div>
                <div style={{ fontWeight:800, color:T.ink, marginBottom:10, fontFamily:F.display, fontSize:20 }}>No certificates yet</div>
                <div style={{ fontSize:13, color:T.ink3 }}>Win a hackathon to earn your first certificate.</div>
              </Card>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
                {myCerts.map(c => {
                  const hk = query("hackathons").find(h => h.id===c.hackathonId);
                  const cols = {1:T.gold, 2:"#6B7280", 3:"#B45309"};
                  return (
                    <div key={c.id} style={{ padding:32, textAlign:"center", background:"linear-gradient(135deg,#FFFBEB,#FFF3C0)", border:"1px solid #F5D100", borderRadius:8, position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:-15, right:-15, fontSize:100, fontFamily:F.display, fontStyle:"italic", color:"rgba(245,184,0,0.12)", fontWeight:900, lineHeight:1, pointerEvents:"none" }}>Win</div>
                      <div style={{ fontSize:52, marginBottom:14 }}>{c.icon}</div>
                      <div style={{ fontSize:15, fontWeight:900, color:cols[c.rank]||T.warn, marginBottom:6, fontFamily:F.display, fontStyle:"italic" }}>{c.label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:4 }}>{hk?.title}</div>
                      <div style={{ fontSize:11, color:T.ink3, marginBottom:20, fontFamily:F.mono }}>Issued {c.issuedAt}</div>
                      <Btn full small style={{ background:T.gold, color:T.teal, fontWeight:800 }}>⬇ Download Certificate</Btn>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "edit profile" && (
          <div style={{ maxWidth:560 }}>
            <h2 style={{ fontSize:20, fontWeight:900, color:T.ink, marginBottom:18, fontFamily:F.display, fontStyle:"italic" }}>Edit Profile</h2>
            <Card style={{ padding:32 }}>
              <Input label="Full Name" value={editForm.name} onChange={e => setEditForm(f=>({...f,name:e.target.value}))} />
              <Input label="Location" value={editForm.location} onChange={e => setEditForm(f=>({...f,location:e.target.value}))} placeholder="Lahore, Pakistan" />
              <Input label="Bio" value={editForm.bio} onChange={e => setEditForm(f=>({...f,bio:e.target.value}))} multiline placeholder="Tell the community about yourself…" />
              <Input label="Skills (comma-separated)" value={editForm.skills} onChange={e => setEditForm(f=>({...f,skills:e.target.value}))} placeholder="React, Python, ML" />
              <Input label="GitHub Username" value={editForm.github} onChange={e => setEditForm(f=>({...f,github:e.target.value}))} />
              <Input label="LinkedIn URL" value={editForm.linkedin} onChange={e => setEditForm(f=>({...f,linkedin:e.target.value}))} />
              <div style={{ display:"flex", gap:10 }}>
                <Btn onClick={save} style={{ background:T.orange, color:"#fff" }}>Save Changes</Btn>
                <Btn variant="ghost" onClick={() => setTab("hackathons")}>Cancel</Btn>
              </div>
            </Card>
          </div>
        )}
      </Wrap>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ORGANIZER DASHBOARD — full CRUD
// ═══════════════════════════════════════════════
function OrgDashboard({ user, setPage, setSelectedHackathon }) {
  const { query, insert, update, remove, findMany } = useDB();
  const { show, ToastContainer } = useToast();
  const [tab, setTab] = useState("events");
  const [selId, setSelId] = useState(null);
  const [winnerAssigned, setWinnerAssigned] = useState({});
  const [certIssued, setCertIssued] = useState({});
  const [scoreEdits, setScoreEdits] = useState({});
  const [noteEdits, setNoteEdits] = useState({});
  const [editModal, setEditModal] = useState(null); // hackathon being edited
  const [deleteConfirm, setDeleteConfirm] = useState(null); // hackathon id to delete

  const BLANK_FORM = { title:"", theme:"", prize:"", description:"", rules:"", judging:"", prize1:"", prize2:"", prize3:"", regOpen:"", regClose:"", subOpen:"", subClose:"", sponsors:"" };
  const [createForm, setCreateForm] = useState(BLANK_FORM);
  const [editForm, setEditForm] = useState(BLANK_FORM);

  const allH = query("hackathons");
  const myH = allH.filter(h => h.organizerId === user.id);
  const selE = myH.find(h => h.id === selId) || myH[0] || null;
  const TABS = ["events","create event","registrations","submissions","winners","certificates"];

  const regs = selE ? findMany("registrations", r => r.hackathonId===selE.id && r.status==="active") : [];
  const subs = selE ? findMany("projects", p => p.hackathonId===selE.id) : [];
  const winners = selE ? findMany("winners", w => w.hackathonId===selE.id) : [];
  const certs = selE ? findMany("certificates", c => c.hackathonId===selE.id) : [];
  const sorted = [...subs].sort((a,b) => b.score-a.score);

  const cfSet = k => e => setCreateForm(f => ({...f,[k]:e.target.value}));
  const efSet = k => e => setEditForm(f => ({...f,[k]:e.target.value}));

  const create = () => {
    if (!createForm.title || !createForm.theme) { show("Title and Theme required.", "error"); return; }
    insert("hackathons", { title:createForm.title, organizerId:user.id, organizer:user.name, theme:createForm.theme, prize:createForm.prize||"TBD", prize1:createForm.prize1, prize2:createForm.prize2, prize3:createForm.prize3, participants:0, teams:0, deadline:createForm.subClose||"2025-12-31", regOpen:createForm.regOpen, regClose:createForm.regClose, subOpen:createForm.subOpen, subClose:createForm.subClose, status:"upcoming", tags:[createForm.theme], description:createForm.description, rules:createForm.rules, judging:createForm.judging, sponsors:createForm.sponsors.split(",").map(s=>s.trim()).filter(Boolean), thumb:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", cover:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80" });
    show(`✅ "${createForm.title}" published!`); setCreateForm(BLANK_FORM); setTab("events");
  };

  const openEdit = (h) => {
    setEditForm({ title:h.title, theme:h.theme, prize:h.prize, description:h.description, rules:h.rules, judging:h.judging, prize1:h.prize1||"", prize2:h.prize2||"", prize3:h.prize3||"", regOpen:h.regOpen||"", regClose:h.regClose||"", subOpen:h.subOpen||"", subClose:h.subClose||"", sponsors:(h.sponsors||[]).join(", "), status:h.status||"upcoming" });
    setEditModal(h);
  };

  const saveEdit = () => {
    if (!editForm.title || !editForm.theme) { show("Title and Theme required.", "error"); return; }
    update("hackathons", editModal.id, { title:editForm.title, theme:editForm.theme, prize:editForm.prize||"TBD", prize1:editForm.prize1, prize2:editForm.prize2, prize3:editForm.prize3, description:editForm.description, rules:editForm.rules, judging:editForm.judging, status:editForm.status, regOpen:editForm.regOpen, regClose:editForm.regClose, subOpen:editForm.subOpen, subClose:editForm.subClose, deadline:editForm.subClose||editModal.deadline, sponsors:editForm.sponsors.split(",").map(s=>s.trim()).filter(Boolean), tags:[editForm.theme] });
    show(`✅ "${editForm.title}" updated!`); setEditModal(null);
  };

  const confirmDelete = (h) => setDeleteConfirm(h);
  const doDelete = () => {
    // Also remove associated registrations, projects, winners, certs
    const regsToRemove = query("registrations").filter(r => r.hackathonId===deleteConfirm.id).map(r => r.id);
    const projsToRemove = query("projects").filter(p => p.hackathonId===deleteConfirm.id).map(p => p.id);
    const winnersToRemove = query("winners").filter(w => w.hackathonId===deleteConfirm.id).map(w => w.id);
    const certsToRemove = query("certificates").filter(c => c.hackathonId===deleteConfirm.id).map(c => c.id);
    regsToRemove.forEach(id => remove("registrations", id));
    projsToRemove.forEach(id => remove("projects", id));
    winnersToRemove.forEach(id => remove("winners", id));
    certsToRemove.forEach(id => remove("certificates", id));
    remove("hackathons", deleteConfirm.id);
    show(`Hackathon "${deleteConfirm.title}" deleted.`, "info");
    setDeleteConfirm(null);
    if (selId === deleteConfirm.id) setSelId(null);
  };

  const EventSel = () => (
    <select value={selE?.id||""} onChange={e => setSelId(parseInt(e.target.value)||null)}
      style={{ padding:"8px 14px", border:`1.5px solid ${T.border}`, borderRadius:4, fontSize:13, color:T.ink, background:"#fff", maxWidth:300, fontFamily:F.body }}>
      {myH.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
    </select>
  );

  const assignWinner = (projectId, rank) => {
    const ex = winners.find(w => w.projectId===projectId);
    if (ex) update("winners", ex.id, { rank }); else insert("winners", { hackathonId:selE.id, projectId, rank, assignedAt:new Date().toISOString().split("T")[0] });
    setWinnerAssigned(p => ({...p,[projectId]:rank}));
    show(`🏆 Rank ${rank} assigned!`);
  };

  const removeWinner = (projectId) => {
    const ex = winners.find(w => w.projectId===projectId);
    if (ex) { remove("winners", ex.id); setWinnerAssigned(p => { const n={...p}; delete n[projectId]; return n; }); show("Winner removed.", "info"); }
  };

  const issueCert = (proj, rank) => {
    if (certs.find(c => c.projectId===proj.id) || certIssued[proj.id]) { show("Already issued.", "info"); return; }
    const labels = {1:"1st Place Winner",2:"2nd Place Runner-Up",3:"3rd Place"};
    insert("certificates", { hackathonId:selE.id, projectId:proj.id, userId:proj.submittedBy, rank, label:labels[rank]||`Rank ${rank}`, icon:rank===1?"🥇":rank===2?"🥈":"🥉", issuedAt:new Date().toISOString().split("T")[0], issued:true });
    setCertIssued(p => ({...p,[proj.id]:true}));
    show(`🏅 Certificate issued for ${proj.title}!`);
  };

  const revokeCert = (certId, projTitle) => {
    remove("certificates", certId);
    show(`Certificate for ${projTitle} revoked.`, "info");
  };

  const changeStatus = (hackathonId, newStatus) => {
    update("hackathons", hackathonId, { status: newStatus });
    show(`Status updated to "${newStatus}"`);
  };

  const removeRegistration = (regId, userName) => {
    remove("registrations", regId);
    show(`${userName} removed from hackathon.`, "info");
  };

  const removeProject = (projId, projTitle) => {
    remove("projects", projId);
    const w = winners.find(w => w.projectId===projId);
    if (w) remove("winners", w.id);
    show(`Project "${projTitle}" removed.`, "info");
  };

  // Section header helper
  const SectionHeader = ({ title, sub, right }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:12 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:900, color:T.ink, margin:"0 0 4px", fontFamily:F.display, fontStyle:"italic" }}>{title}</h2>
        {sub && <p style={{ fontSize:12, color:T.ink3, margin:0, fontFamily:F.mono }}>{sub}</p>}
      </div>
      {right}
    </div>
  );

  return (
    <div style={{ background:T.cream, fontFamily:F.body }}>
      <ToastContainer />

      {/* Edit Hackathon Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit — ${editModal?.title}`} width={680}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ gridColumn:"1/-1" }}><Input label="Hackathon Title" value={editForm.title} onChange={efSet("title")} required /></div>
          <Input label="Theme / Category" value={editForm.theme} onChange={efSet("theme")} required />
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", marginBottom:6, fontSize:11, fontWeight:700, color:T.ink2, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:F.mono }}>Status</label>
            <select value={editForm.status} onChange={efSet("status")} style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${T.border}`, borderRadius:4, fontSize:14, color:T.ink, background:"#fff", outline:"none", fontFamily:F.body }}>
              {["upcoming","open","closing","ended"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
          <Input label="Total Prize Pool" value={editForm.prize} onChange={efSet("prize")} />
          <Input label="1st Prize" value={editForm.prize1} onChange={efSet("prize1")} />
          <Input label="2nd Prize" value={editForm.prize2} onChange={efSet("prize2")} />
          <Input label="3rd Prize" value={editForm.prize3} onChange={efSet("prize3")} />
          <Input label="Reg Opens" type="date" value={editForm.regOpen} onChange={efSet("regOpen")} />
          <Input label="Reg Closes" type="date" value={editForm.regClose} onChange={efSet("regClose")} />
          <Input label="Sub Opens" type="date" value={editForm.subOpen} onChange={efSet("subOpen")} />
          <Input label="Sub Closes" type="date" value={editForm.subClose} onChange={efSet("subClose")} />
        </div>
        <Input label="Description" value={editForm.description} onChange={efSet("description")} multiline />
        <Input label="Rules" value={editForm.rules} onChange={efSet("rules")} multiline />
        <Input label="Judging Criteria" value={editForm.judging} onChange={efSet("judging")} />
        <Input label="Sponsors (comma-separated)" value={editForm.sponsors} onChange={efSet("sponsors")} />
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <Btn onClick={saveEdit} style={{ background:T.orange, color:"#fff" }}>💾 Save Changes</Btn>
          <Btn variant="ghost" onClick={() => setEditModal(null)}>Cancel</Btn>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" width={440}>
        <div style={{ textAlign:"center", padding:"8px 0 16px" }}>
          <div style={{ fontSize:48, marginBottom:14 }}>⚠️</div>
          <h3 style={{ fontSize:18, fontWeight:800, color:T.ink, margin:"0 0 10px", fontFamily:F.display }}>Delete "{deleteConfirm?.title}"?</h3>
          <p style={{ fontSize:13, color:T.ink2, margin:"0 0 24px", lineHeight:1.7 }}>This will permanently delete the hackathon along with all its registrations, projects, winners, and certificates. This action cannot be undone.</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Btn variant="danger" onClick={doDelete}>Yes, Delete Everything</Btn>
            <Btn variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Btn>
          </div>
        </div>
      </Modal>

      {/* Dashboard Header */}
      <div style={{ background:T.teal, padding:"36px 0 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-30, fontSize:200, fontFamily:F.display, fontStyle:"italic", fontWeight:900, color:"rgba(0,196,167,0.05)", lineHeight:1, pointerEvents:"none" }}>Org</div>
        <Wrap style={{ padding:"0 28px", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:24 }}>
            <Avatar initials={user.avatar} size={60} color={T.purple} />
            <div>
              <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", margin:0, fontFamily:F.display, fontStyle:"italic" }}>{user.name}</h1>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:"4px 0 0", fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"1px" }}>Organizer Dashboard</p>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display:"flex", gap:36, flexWrap:"wrap", paddingBottom:24, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            {[[myH.length,"My Events"],[regs.length,"Registrations (selected)"],[subs.length,"Submissions (selected)"],[certs.length,"Certificates Issued"]].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontSize:26, fontWeight:900, color:"#fff", fontFamily:F.display }}>{v}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontFamily:F.mono, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Tabs */}
          <div style={{ display:"flex", overflowX:"auto", marginTop:2 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding:"13px 18px", background:"none", border:"none", borderBottom:`3px solid ${tab===t?T.emerald:"transparent"}`, fontSize:12, fontWeight:tab===t?800:500, color:tab===t?"#fff":"rgba(255,255,255,0.45)", cursor:"pointer", textTransform:"capitalize", fontFamily:F.body, whiteSpace:"nowrap" }}>
                {t}
              </button>
            ))}
          </div>
        </Wrap>
      </div>

      <Wrap style={{ padding:"32px 28px 80px" }}>

        {/* ── EVENTS ── */}
        {tab === "events" && (
          <div>
            <SectionHeader title="My Hackathons" sub={`${myH.length} event${myH.length!==1?"s":""} created`} right={<Btn onClick={() => setTab("create event")} style={{ background:T.orange, color:"#fff" }}>+ Create New Event</Btn>} />
            {myH.length === 0 ? (
              <Card style={{ padding:72, textAlign:"center" }}>
                <div style={{ fontSize:44, marginBottom:16 }}>🚀</div>
                <div style={{ fontWeight:800, color:T.ink, marginBottom:12, fontFamily:F.display, fontSize:22, fontStyle:"italic" }}>No hackathons yet</div>
                <Btn onClick={() => setTab("create event")} style={{ background:T.orange, color:"#fff" }}>Create your first event</Btn>
              </Card>
            ) : (
              <Card style={{ overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background:T.cream }}>
                    {["Hackathon","Status","Regs","Subs","Quick Status","Actions"].map(h => (
                      <th key={h} style={{ padding:"11px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:"1px", borderBottom:`1px solid ${T.border}`, fontFamily:F.mono }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {myH.map(h => {
                      const hR = query("registrations").filter(r => r.hackathonId===h.id && r.status==="active").length;
                      const hP = query("projects").filter(p => p.hackathonId===h.id).length;
                      return (
                        <tr key={h.id} style={{ borderBottom:`1px solid ${T.border}` }}
                          onMouseEnter={e => e.currentTarget.style.background=T.cream}
                          onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                          <td style={{ padding:"13px 18px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                              <div style={{ width:44, height:44, borderRadius:5, overflow:"hidden", flexShrink:0 }}>
                                <img src={h.thumb} alt={h.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                              </div>
                              <div>
                                <div style={{ fontWeight:800, fontSize:13, color:T.ink, fontFamily:F.display }}>{h.title}</div>
                                <div style={{ fontSize:11, color:T.ink3, fontFamily:F.mono }}>{h.theme}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"13px 18px" }}><StatusPill status={h.status} /></td>
                          <td style={{ padding:"13px 18px", fontWeight:800, fontSize:16, color:T.ink, fontFamily:F.display }}>{hR}</td>
                          <td style={{ padding:"13px 18px", fontWeight:800, fontSize:16, color:T.ink, fontFamily:F.display }}>{hP}</td>
                          <td style={{ padding:"13px 18px" }}>
                            <select value={h.status} onChange={e => changeStatus(h.id, e.target.value)}
                              style={{ padding:"5px 10px", border:`1px solid ${T.border}`, borderRadius:3, fontSize:11, color:T.ink2, background:"#fff", cursor:"pointer", fontFamily:F.mono }}>
                              {["upcoming","open","closing","ended"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td style={{ padding:"13px 18px" }}>
                            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                              <Btn small variant="ghost" onClick={() => { setSelId(h.id); setTab("registrations"); }}>Manage</Btn>
                              <Btn small variant="outline" onClick={() => openEdit(h)}>✏️ Edit</Btn>
                              <Btn small variant="danger" onClick={() => confirmDelete(h)}>🗑️</Btn>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}

        {/* ── CREATE EVENT ── */}
        {tab === "create event" && (
          <div style={{ maxWidth:740 }}>
            <SectionHeader title="Create a Hackathon" />
            <Card style={{ padding:32 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ gridColumn:"1/-1" }}><Input label="Hackathon Title" value={createForm.title} onChange={cfSet("title")} placeholder="AI Innovation Challenge 2026" required /></div>
                <Input label="Theme / Category" value={createForm.theme} onChange={cfSet("theme")} placeholder="Artificial Intelligence" required />
                <Input label="Total Prize Pool" value={createForm.prize} onChange={cfSet("prize")} placeholder="PKR 500,000" />
                <Input label="1st Prize" value={createForm.prize1} onChange={cfSet("prize1")} placeholder="PKR 200,000" />
                <Input label="2nd Prize" value={createForm.prize2} onChange={cfSet("prize2")} placeholder="PKR 150,000" />
                <Input label="3rd Prize" value={createForm.prize3} onChange={cfSet("prize3")} placeholder="PKR 100,000" />
                <Input label="Reg Opens" type="date" value={createForm.regOpen} onChange={cfSet("regOpen")} />
                <Input label="Reg Closes" type="date" value={createForm.regClose} onChange={cfSet("regClose")} />
                <Input label="Sub Opens" type="date" value={createForm.subOpen} onChange={cfSet("subOpen")} />
                <Input label="Sub Closes" type="date" value={createForm.subClose} onChange={cfSet("subClose")} />
              </div>
              <Input label="Description" value={createForm.description} onChange={cfSet("description")} multiline placeholder="What is this hackathon about?" />
              <Input label="Rules" value={createForm.rules} onChange={cfSet("rules")} multiline placeholder="Teams of 2–4. Projects must be original." />
              <Input label="Judging Criteria" value={createForm.judging} onChange={cfSet("judging")} placeholder="Innovation (30%), Technical (25%), Impact (25%), Pitch (20%)" />
              <Input label="Sponsors (comma-separated)" value={createForm.sponsors} onChange={cfSet("sponsors")} placeholder="Microsoft, Google, AWS" />
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <Btn onClick={create} style={{ background:T.orange, color:"#fff", fontWeight:800 }}>🚀 Publish Hackathon</Btn>
                <Btn variant="ghost" onClick={() => setTab("events")}>Cancel</Btn>
              </div>
            </Card>
          </div>
        )}

        {/* ── REGISTRATIONS ── */}
        {tab === "registrations" && (
          <div>
            <SectionHeader
              title={`Registrations (${regs.length})`}
              sub={selE ? `For: ${selE.title}` : "Select an event"}
              right={<EventSel />}
            />
            {!selE ? <div style={{ color:T.ink3, padding:56, textAlign:"center" }}>No events yet.</div>
            : regs.length === 0 ? <Card style={{ padding:56, textAlign:"center" }}><div style={{ color:T.ink3, fontFamily:F.mono }}>No registrations yet.</div></Card>
            : (
              <Card style={{ overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background:T.cream }}>
                    {["Participant","Skills","Location","Registered","Submitted","Actions"].map(h => (
                      <th key={h} style={{ padding:"11px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:"1px", borderBottom:`1px solid ${T.border}`, fontFamily:F.mono }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {regs.map(reg => {
                      const p = query("users").find(u => u.id===reg.userId);
                      if (!p) return null;
                      const hasP = query("projects").some(pr => pr.hackathonId===selE?.id && pr.submittedBy===p.id);
                      return (
                        <tr key={reg.id} style={{ borderBottom:`1px solid ${T.border}`, transition:"background 0.1s" }}
                          onMouseEnter={e => e.currentTarget.style.background=T.cream}
                          onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                          <td style={{ padding:"12px 18px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <Avatar initials={p.avatar} size={34} />
                              <div><div style={{ fontWeight:700, fontSize:13, color:T.ink }}>{p.name}</div><div style={{ fontSize:11, color:T.ink3, fontFamily:F.mono }}>{p.email}</div></div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 18px" }}><div style={{ display:"flex", gap:4 }}>{p.skills.slice(0,2).map(s => <Tag key={s} label={s} />)}</div></td>
                          <td style={{ padding:"12px 18px", fontSize:12, color:T.ink2, fontFamily:F.mono }}>{p.location||"—"}</td>
                          <td style={{ padding:"12px 18px", fontSize:12, color:T.ink2, fontFamily:F.mono }}>{reg.registeredAt}</td>
                          <td style={{ padding:"12px 18px" }}><span style={{ fontSize:11, fontWeight:700, color:hasP?T.success:T.ink3, fontFamily:F.mono }}>{hasP?"✓ YES":"No"}</span></td>
                          <td style={{ padding:"12px 18px" }}><Btn small variant="danger" onClick={() => removeRegistration(reg.id, p.name)}>Remove</Btn></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}

        {/* ── SUBMISSIONS ── */}
        {tab === "submissions" && (
          <div>
            <SectionHeader
              title={`Submissions (${subs.length})`}
              sub={selE ? `For: ${selE.title}` : "Select an event"}
              right={<EventSel />}
            />
            {subs.length === 0 ? <Card style={{ padding:56, textAlign:"center" }}><div style={{ color:T.ink3, fontFamily:F.mono }}>No submissions yet.</div></Card>
            : sorted.map(p => {
              const sub = query("users").find(u => u.id===p.submittedBy);
              const w = winners.find(w => w.projectId===p.id);
              return (
                <Card key={p.id} style={{ padding:22, marginBottom:14 }}>
                  <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:14 }}>
                    <img src={p.cover} alt={p.title} style={{ width:90, height:64, borderRadius:5, objectFit:"cover", flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontWeight:800, fontSize:15, color:T.ink, fontFamily:F.display }}>{p.title}</span>
                        {w && <span style={{ fontSize:10, background:"#FFF8E0", color:"#8A5C00", padding:"2px 8px", borderRadius:2, fontWeight:700, fontFamily:F.mono }}>{w.rank===1?"🥇 1st":w.rank===2?"🥈 2nd":"🥉 3rd"}</span>}
                      </div>
                      <div style={{ fontSize:12, color:T.ink3, marginBottom:7, fontFamily:F.mono }}>
                        {p.team}{sub && <span> · <strong style={{ color:T.ink2 }}>{sub.name}</strong></span>} · Submitted {p.submittedAt}
                      </div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{p.tech.map(t => <Tag key={t} label={t} />)}</div>
                    </div>
                    <div style={{ textAlign:"center", minWidth:90 }}>
                      <div style={{ fontSize:11, color:T.ink3, fontWeight:700, textTransform:"uppercase", marginBottom:6, fontFamily:F.mono }}>Score</div>
                      <input type="number" min="0" max="100"
                        value={scoreEdits[p.id]!==undefined ? scoreEdits[p.id] : p.score}
                        onChange={e => setScoreEdits(pr => ({...pr,[p.id]:e.target.value}))}
                        style={{ width:64, padding:"6px 8px", border:`2px solid ${T.border}`, borderRadius:4, fontSize:20, fontWeight:900, textAlign:"center", color:T.teal2, fontFamily:F.display, outline:"none" }} />
                      <div style={{ display:"flex", gap:5, marginTop:6 }}>
                        <Btn small variant="outline" style={{ flex:1, padding:"5px" }}
                          onClick={() => { const sc=parseInt(scoreEdits[p.id]); if(!isNaN(sc)&&sc>=0&&sc<=100){ update("projects",p.id,{score:sc}); show("Score saved!"); setScoreEdits(pr => { const n={...pr}; delete n[p.id]; return n; }); } }}>
                          Save
                        </Btn>
                        <Btn small variant="danger" style={{ padding:"5px 8px" }}
                          onClick={() => removeProject(p.id, p.title)}>
                          🗑️
                        </Btn>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:T.ink2, background:T.cream, borderRadius:5, padding:"12px 14px", margin:"0 0 12px", lineHeight:1.7 }}>{p.description}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:T.ink2, whiteSpace:"nowrap", fontFamily:F.mono }}>Judge's note:</span>
                    <input value={noteEdits[p.id]!==undefined?noteEdits[p.id]:(p.notes||"")}
                      onChange={e => setNoteEdits(pr => ({...pr,[p.id]:e.target.value}))}
                      placeholder="Add feedback for this team…"
                      style={{ flex:1, padding:"8px 12px", border:`1.5px solid ${T.border}`, borderRadius:4, fontSize:12, color:T.ink, background:"#fff", outline:"none", fontFamily:F.body }} />
                    <Btn small onClick={() => { update("projects",p.id,{notes:noteEdits[p.id]||""}); show("Note saved!"); }}>Save Note</Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ── WINNERS ── */}
        {tab === "winners" && (
          <div>
            <SectionHeader
              title="Assign Winners"
              sub={selE ? `For: ${selE.title}` : "Select an event"}
              right={<EventSel />}
            />
            {subs.length === 0 ? <Card style={{ padding:56, textAlign:"center" }}><div style={{ color:T.ink3, fontFamily:F.mono }}>No projects to rank yet.</div></Card>
            : (
              <div>
                <div style={{ background:T.emeraldL, border:`1px solid ${T.emerald}`, borderRadius:5, padding:"13px 18px", marginBottom:18, fontSize:13, color:T.teal2, fontFamily:F.body }}>
                  💡 Assign ranks below — they appear on the public hackathon page immediately. You can update or remove ranks at any time.
                </div>
                {sorted.map((p,i) => {
                  const ex = winners.find(w => w.projectId===p.id);
                  const cur = ex?.rank || winnerAssigned[p.id];
                  return (
                    <Card key={p.id} style={{ padding:18, marginBottom:10, display:"flex", alignItems:"center", gap:16 }}>
                      <div style={{ fontSize:22, width:38, textAlign:"center", flexShrink:0, fontFamily:F.display }}>{cur===1?"🥇":cur===2?"🥈":cur===3?"🥉":<span style={{ color:T.ink3, fontSize:16 }}>#{i+1}</span>}</div>
                      <img src={p.cover} alt="" style={{ width:56, height:40, borderRadius:4, objectFit:"cover", flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800, fontSize:14, color:T.ink, fontFamily:F.display }}>{p.title}</div>
                        <div style={{ fontSize:11, color:T.ink3, fontFamily:F.mono }}>{p.team}</div>
                      </div>
                      <div style={{ fontWeight:900, fontSize:22, color:T.teal2, minWidth:38, textAlign:"center", fontFamily:F.display }}>{p.score}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {cur ? (
                          <>
                            <span style={{ padding:"6px 16px", borderRadius:3, background:T.emeraldL, color:T.teal2, fontSize:11, fontWeight:700, border:`1px solid ${T.emerald}`, fontFamily:F.mono }}>✓ Rank {cur}</span>
                            <Btn small variant="ghost" onClick={() => removeWinner(p.id)}>Remove</Btn>
                          </>
                        ) : (
                          [["🥇 1st",1,"primary"],["🥈 2nd",2,"ghost"],["🥉 3rd",3,"ghost"]].map(([lbl,r,v]) => (
                            <Btn key={r} small variant={v} onClick={() => assignWinner(p.id,r)} style={v==="primary"?{background:T.orange,color:"#fff"}:{}}>{lbl}</Btn>
                          ))
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {tab === "certificates" && (
          <div>
            <SectionHeader
              title="Issue Certificates"
              sub={selE ? `For: ${selE.title}` : "Select an event"}
              right={<EventSel />}
            />
            {winners.length === 0 ? (
              <Card style={{ padding:72, textAlign:"center" }}>
                <div style={{ fontSize:44, marginBottom:16 }}>🏅</div>
                <div style={{ fontWeight:800, color:T.ink, marginBottom:10, fontFamily:F.display, fontSize:22, fontStyle:"italic" }}>Assign winners first</div>
                <Btn small onClick={() => setTab("winners")} style={{ background:T.orange, color:"#fff" }}>Go to Winners →</Btn>
              </Card>
            ) : (
              <div>
                <div style={{ background:T.emeraldL, border:`1px solid ${T.emerald}`, borderRadius:5, padding:"13px 18px", marginBottom:18, fontSize:13, color:T.teal2 }}>
                  ✅ Certificates appear in the participant's dashboard immediately after issuing. You can revoke them if needed.
                </div>
                {winners.sort((a,b)=>a.rank-b.rank).map(w => {
                  const p = subs.find(pr => pr.id===w.projectId);
                  if (!p) return null;
                  const issuedCert = certs.find(c => c.projectId===p.id);
                  const alreadyIssued = !!issuedCert || certIssued[p.id];
                  const sub = query("users").find(u => u.id===p.submittedBy);
                  return (
                    <Card key={w.id} style={{ padding:20, marginBottom:10, display:"flex", alignItems:"center", gap:16 }}>
                      <span style={{ fontSize:30 }}>{w.rank===1?"🥇":w.rank===2?"🥈":"🥉"}</span>
                      <img src={p.cover} alt="" style={{ width:64, height:46, borderRadius:4, objectFit:"cover" }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800, fontSize:14, color:T.ink, fontFamily:F.display }}>{p.title}</div>
                        <div style={{ fontSize:12, color:T.ink3, fontFamily:F.mono }}>
                          {p.team}
                          {sub&&<span> · <strong style={{ color:T.ink2 }}>{sub.name}</strong></span>}
                          {" · "}{w.rank===1?"1st Place":w.rank===2?"2nd Place":"3rd Place"}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        {alreadyIssued ? (
                          <>
                            <span style={{ padding:"7px 16px", borderRadius:3, background:T.emeraldL, color:T.success, fontSize:11, fontWeight:700, border:`1px solid ${T.emerald}`, fontFamily:F.mono }}>✓ Issued</span>
                            {issuedCert && <Btn small variant="ghost" onClick={() => revokeCert(issuedCert.id, p.title)}>Revoke</Btn>}
                          </>
                        ) : (
                          <Btn small variant="success" onClick={() => issueCert(p,w.rank)}>🏅 Issue Certificate</Btn>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Wrap>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HOST PAGE
// ═══════════════════════════════════════════════
function HostPage({ setPage, user }) {
  return (
    <div style={{ background: T.cream, fontFamily: F.body }}>
      <div style={{ background: T.teal, padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,196,167,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,167,0.05) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: -20, fontSize: 260, fontFamily: F.display, fontStyle: "italic", fontWeight: 900, color: "rgba(0,196,167,0.05)", lineHeight: 1, pointerEvents: "none" }}>Host</div>
        <Wrap style={{ padding: "0 28px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.emerald, letterSpacing: "2px", textTransform: "uppercase", fontFamily: F.mono, marginBottom: 18, display: "inline-block", background: "rgba(0,196,167,0.1)", padding: "5px 16px", borderRadius: 3 }}>For Organizers</div>
          <h1 style={{ fontSize: "clamp(28px,5vw,58px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 18px", fontFamily: F.display }}>
            Host a hackathon<br /><span style={{ fontStyle: "italic", color: T.emerald }}>that drives results.</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 36px", fontWeight: 300 }}>
            Registration, judging, leaderboards, and certificates — all in one place. Free for Pakistan's innovators.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            <Btn variant="white" onClick={() => setPage(user?.role==="organizer"?"org-dashboard":"register")} style={{ padding:"13px 32px", fontSize:14, fontWeight:800 }}>
              {user?.role==="organizer" ? "Go to Dashboard →" : "Get started free →"}
            </Btn>
            <Btn variant="tealOutline" onClick={() => setPage("home")} style={{ padding:"13px 32px", fontSize:14, fontWeight:700 }}>Browse hackathons</Btn>
          </div>
        </Wrap>
      </div>

      <Wrap style={{ padding: "72px 28px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, color:T.ink, margin:0, fontFamily:F.display, fontStyle:"italic" }}>Three simple steps to launch</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginBottom: 56 }}>
          {[
            {n:"01",icon:"📋",title:"Create your event",desc:"Set up your hackathon with custom prizes, timeline, rules, and judging criteria in minutes.",c:T.emerald},
            {n:"02",icon:"📣",title:"Reach participants",desc:"Publish to HackVerse's network of 12,000+ developers and share your registration link.",c:T.orange},
            {n:"03",icon:"🏆",title:"Judge & celebrate",desc:"Review submissions, score projects, assign winners, and issue digital certificates instantly.",c:T.purple},
          ].map(s => (
            <Card key={s.n} style={{ padding:36, textAlign:"left", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-10, right:-8, fontSize:80, fontFamily:F.display, fontStyle:"italic", color:`${s.c}10`, fontWeight:900, lineHeight:1 }}>{s.n}</div>
              <div style={{ width:48, height:48, borderRadius:5, background:s.c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:20 }}>{s.icon}</div>
              <div style={{ fontSize:10, fontWeight:700, color:s.c, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12, fontFamily:F.mono }}>Step {s.n}</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:T.ink, margin:"0 0 10px", fontFamily:F.display }}>{s.title}</h3>
              <p style={{ fontSize:13, color:T.ink2, lineHeight:1.75, margin:0 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
        <div style={{ background:T.teal, borderRadius:8, padding:"52px 56px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:28, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", bottom:-20, right:-20, fontSize:160, fontFamily:F.display, fontStyle:"italic", color:"rgba(0,196,167,0.07)", fontWeight:900, lineHeight:1, pointerEvents:"none" }}>Go</div>
          <div style={{ position:"relative", zIndex:1 }}>
            <h3 style={{ fontSize:24, fontWeight:900, color:"#fff", margin:"0 0 8px", fontFamily:F.display, fontStyle:"italic" }}>Ready to launch your hackathon?</h3>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.55)", margin:0 }}>Join hundreds of organizations using HackVerse across Pakistan.</p>
          </div>
          <Btn variant="white" onClick={() => setPage(user?.role==="organizer"?"org-dashboard":"register")} style={{ padding:"14px 36px", fontSize:14, fontWeight:800, flexShrink:0, position:"relative", zIndex:1 }}>
            {user?.role==="organizer" ? "Go to Dashboard →" : "Sign up as organizer →"}
          </Btn>
        </div>
      </Wrap>
    </div>
  );
}

// ═══════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════
function Footer({ setPage }) {
  return (
    <footer style={{ background: T.ink, color: "rgba(255,255,255,0.5)", fontFamily: F.body }}>
      {/* Accent line */}
      <div style={{ height: 3, background: `linear-gradient(to right, ${T.emerald} 0%, ${T.orange} 50%, ${T.purple} 100%)` }} />
      <Wrap style={{ padding: "56px 28px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 52 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:38, height:38, borderRadius:5, background:T.emerald, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M3 10L7.5 4L10 7.5L13 4L17 10L13 16H7L3 10Z" fill={T.teal}/><path d="M8 10L10 7.5L12 10L10 12.5Z" fill="white" opacity="0.8"/></svg>
              </div>
              <span style={{ fontWeight:900, fontSize:20, color:"#fff", fontFamily:F.display, fontStyle:"italic" }}>HackVerse</span>
              <span style={{ fontSize:9, background:T.orange, color:"#fff", borderRadius:2, padding:"2px 6px", fontWeight:700, letterSpacing:"1px", fontFamily:F.mono }}>PK</span>
            </div>
            <p style={{ fontSize:13, lineHeight:1.75, margin:"0 0 20px", maxWidth:220, fontWeight:300 }}>Pakistan's home for hackathons — where developers compete, build, and grow.</p>
            <div style={{ display:"flex", gap:8 }}>
              {["Twitter","Discord","LinkedIn"].map(s => (
                <div key={s} style={{ padding:"6px 14px", borderRadius:3, border:"1px solid rgba(255,255,255,0.1)", fontSize:11, color:"rgba(255,255,255,0.6)", cursor:"pointer", fontWeight:600, transition:"all 0.15s", fontFamily:F.mono }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="rgba(0,196,167,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}>{s}</div>
              ))}
            </div>
          </div>
          {[
            { heading:"HackVerse", links:[["Browse hackathons","home"],["Host a hackathon","host"],["Explore projects","home"],["Guides","home"]] },
            { heading:"Participants", links:[["Sign up","register"],["Find hackathons","home"],["Submit a project","home"],["Certificates","dashboard"]] },
            { heading:"Organizers", links:[["Host an event","host"],["Judging tools","host"],["Certificates","host"],["Pricing","host"]] },
            { heading:"Company", links:[["About",null],["Careers",null],["Contact",null],["Help",null]] },
          ].map(col => (
            <div key={col.heading}>
              <h5 style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", letterSpacing:"1.5px", margin:"0 0 16px", fontFamily:F.mono }}>{col.heading}</h5>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:10 }}>
                {col.links.map(([l,p]) => (
                  <li key={l}><span onClick={() => p && setPage(p)} style={{ fontSize:13, color:"rgba(255,255,255,0.5)", cursor:p?"pointer":"default", transition:"color 0.15s", fontWeight:400 }}
                    onMouseEnter={e => { if(p) e.target.style.color=T.emerald; }}
                    onMouseLeave={e => { e.target.style.color="rgba(255,255,255,0.5)"; }}>{l}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <span style={{ fontSize:12, fontFamily:F.mono }}>© 2026 HackVerse, Inc. All rights reserved.</span>
          <div style={{ display:"flex", gap:24 }}>
            {["Community Guidelines","Security","Privacy Policy","Terms of Service"].map(l => (
              <span key={l} style={{ fontSize:12, cursor:"pointer", transition:"color 0.15s", fontFamily:F.mono }}
                onMouseEnter={e => e.target.style.color=T.emerald}
                onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.5)"}>{l}</span>
            ))}
          </div>
        </div>
      </Wrap>
    </footer>
  );
}

// ═══════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════
function AppInner() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selH, setSelH] = useState(null);

  const noFooter = ["dashboard","org-dashboard"].includes(page);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} setSelectedHackathon={setSelH} user={user} />;
      case "hackathon-detail": return selH ? <HackathonDetailPage hackathon={selH} setPage={setPage} user={user} setSelectedHackathon={setSelH} /> : <HomePage setPage={setPage} setSelectedHackathon={setSelH} user={user} />;
      case "login": return <AuthPage mode="login" setPage={setPage} setUser={setUser} />;
      case "register": return <AuthPage mode="register" setPage={setPage} setUser={setUser} />;
      case "dashboard": return user ? <ParticipantDashboard user={user} setUser={setUser} setPage={setPage} setSelectedHackathon={setSelH} /> : <AuthPage mode="login" setPage={setPage} setUser={setUser} />;
      case "org-dashboard": return user ? <OrgDashboard user={user} setPage={setPage} setSelectedHackathon={setSelH} /> : <AuthPage mode="login" setPage={setPage} setUser={setUser} />;
      case "host": return <HostPage setPage={setPage} user={user} />;
      default: return <HomePage setPage={setPage} setSelectedHackathon={setSelH} user={user} />;
    }
  };

  return (
    <div style={{ fontFamily: F.body, color: T.ink, background: T.cream, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar page={page} setPage={setPage} user={user} setUser={setUser} />
      <div style={{ flex: 1 }}>{renderPage()}</div>
      {!noFooter && <Footer setPage={setPage} />}
    </div>
  );
}

export default function App() {
  return <DBProvider><AppInner /></DBProvider>;
}