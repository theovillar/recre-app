import React, { useState, useMemo, useEffect } from "react";
import {
  Compass, PlusCircle, BookMarked, UserCircle2, Search, MapPin,
  CalendarDays, Users, X, ChevronRight, Sparkles, Heart, Check,
  Baby, Trees, Palette, Music4, Puzzle, Bike, Coffee, Dumbbell,
  Landmark, Gamepad2, Film, Clock, ShieldCheck, Lock
} from "lucide-react";

// ---------- Design tokens ----------
const COLORS = {
  ink: "#2B2560",
  cloud: "#FFF9EE",
  sun: "#FFC93C",
  sky: "#4EC5F1",
  grass: "#6BCB77",
  coral: "#FF6F61",
  grape: "#8B5FBF",
  boy: "#4EC5F1",
  girl: "#FF8FB1",
};

const genreColor = (genre) => (genre === "F" ? COLORS.girl : COLORS.boy);
const genreLabel = (genre) => (genre === "F" ? "Fille" : "Garçon");

const CATEGORIES = [
  { id: "nature", label: "Nature", icon: Trees, color: COLORS.grass },
  { id: "creatif", label: "Créatif", icon: Palette, color: COLORS.grape },
  { id: "musique", label: "Musique", icon: Music4, color: COLORS.coral },
  { id: "jeux", label: "Jeux", icon: Puzzle, color: COLORS.sky },
  { id: "sport", label: "Sport", icon: Bike, color: COLORS.sun },
];

const catMeta = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

const ADULT_CATEGORIES = [
  { id: "cafe", label: "Café / Brunch", icon: Coffee, color: COLORS.sun },
  { id: "sport", label: "Sport", icon: Dumbbell, color: COLORS.grass },
  { id: "culture", label: "Sorties culture", icon: Landmark, color: COLORS.grape },
  { id: "bienetre", label: "Bien-être", icon: Sparkles, color: COLORS.sky },
  { id: "jeux", label: "Jeux de société", icon: Puzzle, color: COLORS.coral },
];

const TEEN_CATEGORIES = [
  { id: "sport", label: "Sport", icon: Dumbbell, color: COLORS.grass },
  { id: "jeuxvideo", label: "Jeux vidéo", icon: Gamepad2, color: COLORS.grape },
  { id: "musique", label: "Musique", icon: Music4, color: COLORS.coral },
  { id: "cinema", label: "Ciné / Sorties", icon: Film, color: COLORS.sky },
  { id: "creatif", label: "Créatif", icon: Palette, color: COLORS.sun },
];

const metaFrom = (categories, id) => categories.find((c) => c.id === id) || categories[0];

// ---------- Mock data ----------
const INITIAL_ACTIVITIES = [
  {
    id: 1,
    title: "Chasse aux trésors en forêt",
    category: "nature",
    lieu: "Parc de la Cascade",
    date: "Sam. 9 août · 10h00",
    age: "4-8 ans",
    places: 6,
    inscrits: 4,
    organisateur: "Léa M.",
    desc: "Une matinée à explorer les sentiers, chercher des indices en bois et repartir avec un trésor de forêt (pommes de pin dorées incluses).",
    participants: [
      { name: "Léa", genre: "F" }, { name: "Hugo", genre: "G" },
      { name: "Chloé", genre: "F" }, { name: "Nathan", genre: "G" },
    ],
  },
  {
    id: 2,
    title: "Atelier peinture à doigts",
    category: "creatif",
    lieu: "Chez Camille (jardin)",
    date: "Dim. 10 août · 14h30",
    age: "2-5 ans",
    places: 8,
    inscrits: 6,
    organisateur: "Camille R.",
    desc: "Grandes feuilles, peintures lavables et tabliers fournis. Prévoir des vêtements qui ne craignent rien !",
    participants: [
      { name: "Camille", genre: "F" }, { name: "Jade", genre: "F" },
      { name: "Louis", genre: "G" }, { name: "Mia", genre: "F" },
      { name: "Sacha", genre: "G" }, { name: "Adam", genre: "G" },
    ],
  },
  {
    id: 3,
    title: "Éveil musical en plein air",
    category: "musique",
    lieu: "Square des Tilleuls",
    date: "Mer. 13 août · 16h00",
    age: "1-4 ans",
    places: 10,
    inscrits: 3,
    organisateur: "Nassim B.",
    desc: "Comptines, petites percussions et rondes pour les tout-petits, animées par une intervenante musique.",
    participants: [
      { name: "Nassim", genre: "G" }, { name: "Alice", genre: "F" }, { name: "Léon", genre: "G" },
    ],
  },
  {
    id: 4,
    title: "Après-midi jeux de société géants",
    category: "jeux",
    lieu: "Salle des fêtes",
    date: "Sam. 16 août · 15h00",
    age: "5-10 ans",
    places: 12,
    inscrits: 9,
    organisateur: "Inès D.",
    desc: "Puissance 4 géant, memory XXL et kapla à volonté. Goûter partagé sur place.",
    participants: [
      { name: "Inès", genre: "F" }, { name: "Tom", genre: "G" }, { name: "Rose", genre: "F" },
      { name: "Gabriel", genre: "G" }, { name: "Anna", genre: "F" }, { name: "Ethan", genre: "G" },
      { name: "Zoé", genre: "F" }, { name: "Malo", genre: "G" }, { name: "Léa", genre: "F" },
    ],
  },
  {
    id: 5,
    title: "Initiation vélo sans stabilisateurs",
    category: "sport",
    lieu: "Piste cyclable du Lac",
    date: "Dim. 17 août · 10h00",
    age: "4-7 ans",
    places: 5,
    inscrits: 5,
    organisateur: "Thomas G.",
    desc: "Deux éducateurs sportifs pour accompagner les enfants qui se lancent sans petites roues.",
    participants: [
      { name: "Thomas", genre: "G" }, { name: "Juliette", genre: "F" }, { name: "Oscar", genre: "G" },
      { name: "Manon", genre: "F" }, { name: "Paul", genre: "G" },
    ],
  },
];

const KIDS = [
  { name: "Emma", age: 6, genre: "F" },
  { name: "Noah", age: 3, genre: "G" },
];

const ADULT_MEETUPS = [
  {
    id: 101,
    title: "Café des parents du quartier",
    category: "cafe",
    lieu: "Café Le Marronnier",
    date: "Mar. 12 août · 9h00",
    info: "Pendant que les enfants sont à l'école",
    places: 10,
    inscrits: 6,
    organisateur: "Sophie L.",
    desc: "Un moment convivial entre parents pour souffler, échanger des bons plans et faire connaissance, autour d'un café.",
    participants: ["Sophie", "Karim", "Elodie", "Marc", "Fanny", "Julien"],
  },
  {
    id: 102,
    title: "Footing détente entre parents",
    category: "sport",
    lieu: "Bords du canal",
    date: "Jeu. 14 août · 19h00",
    info: "Tous niveaux bienvenus",
    places: 12,
    inscrits: 5,
    organisateur: "Marc D.",
    desc: "Une sortie running à allure tranquille pour décompresser après le boulot, suivie d'un étirement collectif.",
    participants: ["Marc", "Alice", "Yasmine", "Paul", "Claire"],
  },
  {
    id: 103,
    title: "Visite de l'expo photo",
    category: "culture",
    lieu: "Médiathèque centrale",
    date: "Sam. 16 août · 11h00",
    info: "Visite libre, échange ensuite",
    places: 8,
    inscrits: 3,
    organisateur: "Elodie F.",
    desc: "On se retrouve pour visiter l'exposition puis prendre un verre juste à côté et discuter de tout et de rien.",
    participants: ["Elodie", "Nadia", "Vincent"],
  },
  {
    id: 104,
    title: "Atelier yoga en plein air",
    category: "bienetre",
    lieu: "Parc des Tilleuls",
    date: "Dim. 17 août · 9h30",
    info: "Tapis non fourni",
    places: 15,
    inscrits: 11,
    organisateur: "Claire B.",
    desc: "Une heure de yoga doux animée par une pratiquante du quartier, ouverte à tous les niveaux.",
    participants: ["Claire", "Julien", "Fanny", "Karim", "Sophie", "Paul", "Nadia"],
  },
  {
    id: 105,
    title: "Soirée jeux de société",
    category: "jeux",
    lieu: "Chez Julien",
    date: "Ven. 22 août · 20h00",
    info: "Chacun amène un jeu ou une boisson",
    places: 8,
    inscrits: 4,
    organisateur: "Julien P.",
    desc: "Une soirée détente entre parents, sans les enfants, autour de jeux de société et d'un apéro partagé.",
    participants: ["Julien", "Marc", "Alice", "Vincent"],
  },
];

const TEEN_MEETUPS = [
  {
    id: 201,
    title: "Tournoi FIFA à la médiathèque",
    category: "jeuxvideo",
    lieu: "Médiathèque - espace jeunesse",
    date: "Mer. 13 août · 14h00",
    info: "12-15 ans · encadré par l'équipe jeunesse",
    places: 12,
    inscrits: 8,
    organisateur: "Espace jeunesse",
    desc: "Petit tournoi amical sur consoles mises à disposition, animé par l'équipe de la médiathèque.",
    participants: ["Lucas", "Nina", "Yanis", "Camille", "Théo", "Sarah", "Enzo", "Léa"],
  },
  {
    id: 202,
    title: "City stade basket entre ados",
    category: "sport",
    lieu: "City stade du parc",
    date: "Sam. 16 août · 15h00",
    info: "13-17 ans · coaché par un éducateur sportif",
    places: 14,
    inscrits: 9,
    organisateur: "Service jeunesse de la ville",
    desc: "Session basket 3x3 encadrée par un éducateur sportif municipal, tous niveaux bienvenus.",
    participants: ["Rayan", "Chloé", "Maxime", "Lina", "Noa", "Jules", "Inès", "Sacha", "Tom"],
  },
  {
    id: 203,
    title: "Ciné-débat ado",
    category: "cinema",
    lieu: "MJC du centre",
    date: "Dim. 17 août · 16h30",
    info: "14-17 ans · animé par la MJC",
    places: 20,
    inscrits: 13,
    organisateur: "MJC",
    desc: "Projection suivie d'un débat animé par l'équipe de la MJC, autour d'un film choisi par les ados eux-mêmes.",
    participants: ["Manon", "Adam", "Zoé", "Nathan", "Jade", "Hugo", "Chloé"],
  },
  {
    id: 204,
    title: "Atelier BD & manga",
    category: "creatif",
    lieu: "Médiathèque - espace jeunesse",
    date: "Mar. 19 août · 14h00",
    info: "11-14 ans · matériel fourni",
    places: 10,
    inscrits: 6,
    organisateur: "Espace jeunesse",
    desc: "Initiation au dessin de BD et manga avec une illustratrice invitée, tout matériel fourni sur place.",
    participants: ["Emma", "Léon", "Alice", "Nathan", "Rose", "Malo"],
  },
  {
    id: 205,
    title: "Répétition ouverte du groupe ado",
    category: "musique",
    lieu: "Conservatoire municipal",
    date: "Ven. 22 août · 17h00",
    info: "12-17 ans · encadré par un professeur",
    places: 10,
    inscrits: 5,
    organisateur: "Conservatoire",
    desc: "Séance ouverte pour découvrir ou rejoindre le groupe des ados du conservatoire, encadrée par un professeur.",
    participants: ["Gabriel", "Anna", "Ethan", "Juliette", "Oscar"],
  },
];

// ---------- Small building blocks ----------
function Stamp({ category, size = 46, rotate = -8 }) {
  const meta = catMeta(category);
  const Icon = meta.icon;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px dashed ${meta.color}`,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 2px 6px rgba(43,37,96,0.12)",
        flexShrink: 0,
      }}
    >
      <Icon size={size * 0.45} color={meta.color} strokeWidth={2.4} />
    </div>
  );
}

function Avatar({ name, genre, size = 26, overlap = false }) {
  const color = genreColor(genre);
  return (
    <div
      title={`${name} (${genreLabel(genre)})`}
      style={{
        width: size, height: size, borderRadius: "50%", background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 800,
        fontSize: size * 0.42, border: "2px solid #fff",
        marginLeft: overlap ? -8 : 0, flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ParticipantsRow({ participants, max = 5 }) {
  if (!participants || participants.length === 0) return null;
  const shown = participants.slice(0, max);
  const extra = participants.length - shown.length;
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
      {shown.map((p, i) => (
        <Avatar key={i} name={p.name} genre={p.genre} overlap={i > 0} />
      ))}
      {extra > 0 && (
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: "#EDEAF4",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: COLORS.ink, fontFamily: "Nunito, sans-serif", fontWeight: 800,
          fontSize: 10.5, border: "2px solid #fff", marginLeft: -8,
        }}>
          +{extra}
        </div>
      )}
    </div>
  );
}

function PlainAvatar({ name, color, size = 26, overlap = false }) {
  return (
    <div
      title={name}
      style={{
        width: size, height: size, borderRadius: "50%", background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 800,
        fontSize: size * 0.42, border: "2px solid #fff",
        marginLeft: overlap ? -8 : 0, flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function PlainParticipantsRow({ names, color, max = 5 }) {
  if (!names || names.length === 0) return null;
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
      {shown.map((n, i) => (
        <PlainAvatar key={i} name={n} color={color} overlap={i > 0} />
      ))}
      {extra > 0 && (
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: "#EDEAF4",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: COLORS.ink, fontFamily: "Nunito, sans-serif", fontWeight: 800,
          fontSize: 10.5, border: "2px solid #fff", marginLeft: -8,
        }}>
          +{extra}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Nunito, sans-serif",
        fontWeight: 800,
        fontSize: 13,
        padding: "8px 14px",
        borderRadius: 999,
        border: `2px solid ${active ? color : "#E7E1D4"}`,
        background: active ? color : "#fff",
        color: active ? "#fff" : COLORS.ink,
        whiteSpace: "nowrap",
        transition: "all .15s ease",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function ActivityCard({ activity, onOpen, favorite, onToggleFav }) {
  const meta = catMeta(activity.category);
  const full = activity.inscrits >= activity.places;
  return (
    <div
      onClick={() => onOpen(activity)}
      style={{
        background: "#fff",
        borderRadius: 22,
        border: "2px solid #F0EADB",
        padding: 16,
        cursor: "pointer",
        position: "relative",
        transition: "transform .15s ease, box-shadow .15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(43,37,96,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(activity.id); }}
        style={{
          position: "absolute", top: 14, right: 14, background: "transparent",
          border: "none", cursor: "pointer", padding: 4,
        }}
        aria-label="Ajouter aux favoris"
      >
        <Heart
          size={20}
          color={favorite ? COLORS.coral : "#D8D2C2"}
          fill={favorite ? COLORS.coral : "none"}
          strokeWidth={2.2}
        />
      </button>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Stamp category={activity.category} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 11,
              letterSpacing: 0.6, textTransform: "uppercase", color: meta.color,
              marginBottom: 2,
            }}
          >
            {meta.label} · {activity.age}
          </div>
          <h3
            style={{
              fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 18,
              color: COLORS.ink, margin: "0 34px 6px 0", lineHeight: 1.15,
            }}
          >
            {activity.title}
          </h3>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
        <Row icon={<MapPin size={14} color={COLORS.ink} />} text={activity.lieu} />
        <Row icon={<CalendarDays size={14} color={COLORS.ink} />} text={activity.date} />
      </div>

      <ParticipantsRow participants={activity.participants} />

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={14} color={full ? COLORS.coral : COLORS.grass} />
          <span
            style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12.5,
              color: full ? COLORS.coral : COLORS.ink,
            }}
          >
            {full ? "Complet" : `${activity.places - activity.inscrits} place(s) libre(s)`}
          </span>
        </div>
        <ChevronRight size={18} color="#C7C0AE" />
      </div>
    </div>
  );
}

function Row({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {icon}
      <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 13.5, color: "#5C5578" }}>{text}</span>
    </div>
  );
}

function PillButton({ children, color = COLORS.sun, onClick, style, textColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 15,
        background: color, color: textColor || COLORS.ink, border: "none",
        padding: "13px 20px", borderRadius: 16, cursor: "pointer",
        boxShadow: `0 4px 0 ${shade(color, -18)}`,
        transition: "transform .1s ease",
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(3px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 0xff) + amt, b = (n & 0xff) + amt;
  r = Math.min(255, Math.max(0, r)); g = Math.min(255, Math.max(0, g)); b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ---------- Screens ----------
function Explorer({ activities, favorites, onToggleFav, onOpen }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("tous");

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const matchCat = cat === "tous" || a.category === cat;
      const matchQuery = a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.lieu.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activities, query, cat]);

  return (
    <div>
      <div style={{ padding: "4px 4px 14px" }}>
        <h1 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 26, color: COLORS.ink, margin: "0 0 4px" }}>
          Bonjour Sarah 👋
        </h1>
        <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6485", fontSize: 14.5, margin: 0 }}>
          {filtered.length} sortie(s) à partager avec vos enfants près de chez vous
        </p>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 8, background: "#fff",
        border: "2px solid #F0EADB", borderRadius: 16, padding: "10px 14px", marginBottom: 14,
      }}>
        <Search size={18} color="#B7AF98" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher une sortie, un lieu…"
          style={{
            border: "none", outline: "none", fontFamily: "Nunito, sans-serif",
            fontSize: 14.5, flex: 1, background: "transparent", color: COLORS.ink,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 16 }}>
        <Chip active={cat === "tous"} onClick={() => setCat("tous")} color={COLORS.ink}>
          Toutes
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} color={c.color}>
            {c.label}
          </Chip>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
        {filtered.map((a) => (
          <ActivityCard
            key={a.id}
            activity={a}
            onOpen={onOpen}
            favorite={favorites.includes(a.id)}
            onToggleFav={onToggleFav}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "#9A93AF", fontFamily: "Nunito, sans-serif" }}>
            Aucune sortie ne correspond. Essayez une autre recherche !
          </div>
        )}
      </div>
    </div>
  );
}

function CreateActivity({ onCreate }) {
  const [form, setForm] = useState({
    title: "", category: "nature", lieu: "", date: "", age: "", places: 6, desc: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = () => {
    if (!form.title || !form.lieu || !form.date) return;
    onCreate({ ...form, id: Date.now(), inscrits: 1, organisateur: "Vous", places: Number(form.places) || 1 });
    setSent(true);
    setTimeout(() => setSent(false), 2200);
    setForm({ title: "", category: "nature", lieu: "", date: "", age: "", places: 6, desc: "" });
  };

  const inputStyle = {
    width: "100%", border: "2px solid #F0EADB", borderRadius: 14, padding: "12px 14px",
    fontFamily: "Nunito, sans-serif", fontSize: 14.5, color: COLORS.ink, outline: "none",
    boxSizing: "border-box", background: "#fff",
  };
  const label = { fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12.5, color: "#6B6485", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.4 };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 24, color: COLORS.ink, margin: "4px 0 4px" }}>
        Proposer une sortie
      </h1>
      <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6485", fontSize: 14, margin: "0 0 18px" }}>
        Partagez une activité, d'autres parents pourront rejoindre avec leurs enfants.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={label}>Titre de la sortie</label>
          <input style={inputStyle} placeholder="Ex. Balade contée au parc" value={form.title} onChange={set("title")} />
        </div>

        <div>
          <label style={label}>Catégorie</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <Chip key={c.id} active={form.category === c.id} onClick={() => setForm({ ...form, category: c.id })} color={c.color}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>Lieu</label>
            <input style={inputStyle} placeholder="Parc, adresse…" value={form.lieu} onChange={set("lieu")} />
          </div>
          <div>
            <label style={label}>Date & heure</label>
            <input style={inputStyle} placeholder="Sam. 9 août · 10h" value={form.date} onChange={set("date")} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>Âge conseillé</label>
            <input style={inputStyle} placeholder="Ex. 4-8 ans" value={form.age} onChange={set("age")} />
          </div>
          <div>
            <label style={label}>Places disponibles</label>
            <input type="number" min={1} style={inputStyle} value={form.places} onChange={set("places")} />
          </div>
        </div>

        <div>
          <label style={label}>Description</label>
          <textarea rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "Nunito, sans-serif" }}
            placeholder="Que va-t-on faire ? Quoi apporter ?" value={form.desc} onChange={set("desc")} />
        </div>

        <PillButton color={COLORS.grass} textColor="#fff" onClick={submit} style={{ marginTop: 6 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <PlusCircle size={18} /> Publier la sortie
          </span>
        </PillButton>

        {sent && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, background: "#EAF8ED",
            color: COLORS.grass, fontFamily: "Nunito, sans-serif", fontWeight: 800,
            fontSize: 13.5, padding: "10px 14px", borderRadius: 12,
          }}>
            <Check size={16} /> Sortie publiée ! Elle apparaît dans l'onglet Explorer.
          </div>
        )}
      </div>
    </div>
  );
}

function MyOutings({ joined, activities }) {
  const myActivities = activities.filter((a) => joined.includes(a.id));
  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 24, color: COLORS.ink, margin: "4px 0 4px" }}>
        Mes sorties
      </h1>
      <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6485", fontSize: 14, margin: "0 0 18px" }}>
        Chaque sortie rejointe ajoute un tampon à votre passeport d'aventures.
      </p>

      <div style={{
        background: "#fff", border: "2px solid #F0EADB", borderRadius: 20, padding: 20, marginBottom: 22,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Sparkles size={18} color={COLORS.sun} />
          <span style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 16, color: COLORS.ink }}>
            Passeport d'aventures
          </span>
        </div>
        {myActivities.length === 0 ? (
          <p style={{ fontFamily: "Nunito, sans-serif", color: "#9A93AF", fontSize: 14 }}>
            Rejoignez une sortie dans l'onglet Explorer pour gagner votre premier tampon !
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {myActivities.map((a, i) => (
              <div key={a.id} style={{ textAlign: "center", width: 78 }}>
                <Stamp category={a.category} size={58} rotate={(i % 2 === 0 ? -1 : 1) * (6 + (i * 3) % 10)} />
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 11, fontWeight: 700, color: "#6B6485", marginTop: 6 }}>
                  {a.title.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {myActivities.map((a) => (
          <div key={a.id} style={{
            background: "#fff", border: "2px solid #F0EADB", borderRadius: 18, padding: 14,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Stamp category={a.category} size={40} rotate={0} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 15, color: COLORS.ink }}>{a.title}</div>
              <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 12.5, color: "#6B6485" }}>{a.date} · {a.lieu}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ joinedCount, validated, onToggleDemo }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: COLORS.sky,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 24, color: "#fff",
        }}>
          S
        </div>
        <div>
          <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 20, color: COLORS.ink }}>Sarah Bertrand</div>
          <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#6B6485" }}>{joinedCount} sortie(s) rejointe(s)</div>
        </div>
      </div>

      <ValidationStatus validated={validated} onToggleDemo={onToggleDemo} />

      <SectionLabel>Mes enfants</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {KIDS.map((k) => (
          <div key={k.name} style={{
            background: "#fff", border: "2px solid #F0EADB", borderRadius: 16, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: COLORS.sun,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Baby size={18} color={COLORS.ink} />
            </div>
            <div style={{ fontFamily: "Nunito, sans-serif" }}>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.ink }}>{k.name}</div>
              <div style={{ fontSize: 12.5, color: "#6B6485" }}>{k.age} ans</div>
            </div>
          </div>
        ))}
        <button style={{
          border: `2px dashed #D8D2C2`, background: "transparent", borderRadius: 16, padding: "12px 16px",
          fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#9A93AF", cursor: "pointer", fontSize: 13.5,
        }}>
          + Ajouter un enfant
        </button>
      </div>

      <SectionLabel>Préférences</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {CATEGORIES.map((c) => (
          <span key={c.id} style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12.5,
            background: `${c.color}20`, color: c.color, padding: "7px 12px", borderRadius: 999,
          }}>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ValidationStatus({ validated, onToggleDemo }) {
  return (
    <div style={{
      background: validated ? "#EAF8ED" : "#FFF4DD",
      border: `2px solid ${validated ? COLORS.grass : COLORS.sun}`,
      borderRadius: 20, padding: 18, marginBottom: 22,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: validated ? COLORS.grass : COLORS.sun,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {validated ? <ShieldCheck size={19} color="#fff" /> : <Clock size={19} color={COLORS.ink} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 15.5, color: COLORS.ink, marginBottom: 4 }}>
            {validated ? "Identité validée par la mairie" : "Validation de la mairie en attente"}
          </div>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#5C5578", lineHeight: 1.5, margin: 0 }}>
            {validated
              ? "Vous avez accès aux sorties enfants : Explorer, Créer une sortie et Mes sorties."
              : "Pour la sécurité des enfants, l'accès aux sorties enfants (Explorer, Créer, Mes sorties) n'est ouvert qu'aux parents dont l'identité a été vérifiée par la mairie de leur commune. Vous recevrez une notification dès que ce sera fait."}
          </p>
          {onToggleDemo && (
            <button
              onClick={onToggleDemo}
              style={{
                marginTop: 10, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12,
                background: "transparent", border: `2px solid ${COLORS.ink}`, color: COLORS.ink,
                borderRadius: 10, padding: "6px 12px", cursor: "pointer",
              }}
            >
              {validated ? "Simuler : repasser en attente (démo)" : "Simuler : validation par la mairie (démo)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 0.6,
      textTransform: "uppercase", color: "#B7AF98", marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
      <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 11.5, color: "#6B6485" }}>
        {label}
      </span>
    </div>
  );
}

function DetailModal({ activity, onClose, joined, onJoin }) {
  if (!activity) return null;
  const meta = catMeta(activity.category);
  const isJoined = joined.includes(activity.id);
  const full = activity.inscrits >= activity.places && !isJoined;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(43,37,96,0.45)",
        display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.cloud, width: "100%", maxWidth: 520, borderRadius: "26px 26px 0 0",
          padding: 24, maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <Stamp category={activity.category} size={56} rotate={-6} />
          <button onClick={onClose} style={{ background: "#fff", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer" }}>
            <X size={18} color={COLORS.ink} />
          </button>
        </div>

        <div style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 11.5, letterSpacing: 0.6,
          textTransform: "uppercase", color: meta.color, marginBottom: 4,
        }}>
          {meta.label} · {activity.age}
        </div>
        <h2 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 22, color: COLORS.ink, margin: "0 0 12px" }}>
          {activity.title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <Row icon={<MapPin size={15} color={COLORS.ink} />} text={activity.lieu} />
          <Row icon={<CalendarDays size={15} color={COLORS.ink} />} text={activity.date} />
          <Row icon={<Users size={15} color={COLORS.ink} />} text={`${activity.inscrits}/${activity.places} participants · organisé par ${activity.organisateur}`} />
        </div>

        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 14.5, color: "#5C5578", lineHeight: 1.6, marginBottom: 20 }}>
          {activity.desc}
        </p>

        {activity.participants && activity.participants.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <SectionLabel>Enfants déjà inscrits</SectionLabel>
              <div style={{ display: "flex", gap: 12 }}>
                <Legend color={COLORS.girl} label="Fille" />
                <Legend color={COLORS.boy} label="Garçon" />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activity.participants.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={p.name} genre={p.genre} size={30} />
                  <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: COLORS.ink }}>
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isJoined ? (
          <PillButton color={"#EAF8ED"} textColor={COLORS.grass} style={{ width: "100%", boxShadow: "none" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <Check size={18} /> Vous participez
            </span>
          </PillButton>
        ) : (
          <PillButton
            color={full ? "#EDEAF4" : COLORS.coral}
            textColor={full ? "#B7AF98" : "#fff"}
            onClick={() => !full && onJoin(activity.id)}
            style={{ width: "100%" }}
          >
            {full ? "Complet" : "Rejoindre avec mon enfant"}
          </PillButton>
        )}
      </div>
    </div>
  );
}

// ---------- Community meetups (adultes / ados) ----------
function CommunityCard({ item, categories, onOpen, favorite, onToggleFav }) {
  const meta = metaFrom(categories, item.category);
  const Icon = meta.icon;
  const full = item.inscrits >= item.places;
  return (
    <div
      onClick={() => onOpen(item)}
      style={{
        background: "#fff", borderRadius: 22, border: "2px solid #F0EADB",
        padding: 16, cursor: "pointer", position: "relative",
        transition: "transform .15s ease, box-shadow .15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(43,37,96,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(item.id); }}
        style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
        aria-label="Ajouter aux favoris"
      >
        <Heart size={20} color={favorite ? COLORS.coral : "#D8D2C2"} fill={favorite ? COLORS.coral : "none"} strokeWidth={2.2} />
      </button>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 46, height: 46, borderRadius: "50%", border: `2px dashed ${meta.color}`,
          background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          transform: "rotate(-8deg)", boxShadow: "0 2px 6px rgba(43,37,96,0.12)", flexShrink: 0,
        }}>
          <Icon size={20} color={meta.color} strokeWidth={2.4} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 0.6,
            textTransform: "uppercase", color: meta.color, marginBottom: 2,
          }}>
            {meta.label}
          </div>
          <h3 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 18, color: COLORS.ink, margin: "0 34px 6px 0", lineHeight: 1.15 }}>
            {item.title}
          </h3>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
        <Row icon={<MapPin size={14} color={COLORS.ink} />} text={item.lieu} />
        <Row icon={<CalendarDays size={14} color={COLORS.ink} />} text={item.date} />
        {item.info && <Row icon={<Users size={14} color={COLORS.ink} />} text={item.info} />}
      </div>

      <PlainParticipantsRow names={item.participants} color={meta.color} />

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={14} color={full ? COLORS.coral : COLORS.grass} />
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12.5, color: full ? COLORS.coral : COLORS.ink }}>
            {full ? "Complet" : `${item.places - item.inscrits} place(s) libre(s)`}
          </span>
        </div>
        <ChevronRight size={18} color="#C7C0AE" />
      </div>
    </div>
  );
}

function CommunityExplorer({ title, subtitle, categories, items, favorites, onToggleFav, onOpen, emptyText }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("tous");

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchCat = cat === "tous" || a.category === cat;
      const matchQuery = a.title.toLowerCase().includes(query.toLowerCase()) || a.lieu.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [items, query, cat]);

  return (
    <div>
      <div style={{ padding: "4px 4px 14px" }}>
        <h1 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 26, color: COLORS.ink, margin: "0 0 4px" }}>
          {title}
        </h1>
        <p style={{ fontFamily: "Nunito, sans-serif", color: "#6B6485", fontSize: 14.5, margin: 0 }}>
          {subtitle}
        </p>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 8, background: "#fff",
        border: "2px solid #F0EADB", borderRadius: 16, padding: "10px 14px", marginBottom: 14,
      }}>
        <Search size={18} color="#B7AF98" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher une rencontre, un lieu…"
          style={{ border: "none", outline: "none", fontFamily: "Nunito, sans-serif", fontSize: 14.5, flex: 1, background: "transparent", color: COLORS.ink }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 16 }}>
        <Chip active={cat === "tous"} onClick={() => setCat("tous")} color={COLORS.ink}>Toutes</Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} color={c.color}>{c.label}</Chip>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
        {filtered.map((item) => (
          <CommunityCard key={item.id} item={item} categories={categories} onOpen={onOpen}
            favorite={favorites.includes(item.id)} onToggleFav={onToggleFav} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "#9A93AF", fontFamily: "Nunito, sans-serif" }}>
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityDetailModal({ item, categories, onClose, joined, onJoin, joinLabel }) {
  if (!item) return null;
  const meta = metaFrom(categories, item.category);
  const Icon = meta.icon;
  const isJoined = joined.includes(item.id);
  const full = item.inscrits >= item.places && !isJoined;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(43,37,96,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.cloud, width: "100%", maxWidth: 520, borderRadius: "26px 26px 0 0", padding: 24, maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", border: `2px dashed ${meta.color}`,
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            transform: "rotate(-6deg)", boxShadow: "0 2px 6px rgba(43,37,96,0.12)",
          }}>
            <Icon size={24} color={meta.color} strokeWidth={2.4} />
          </div>
          <button onClick={onClose} style={{ background: "#fff", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer" }}>
            <X size={18} color={COLORS.ink} />
          </button>
        </div>

        <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 11.5, letterSpacing: 0.6, textTransform: "uppercase", color: meta.color, marginBottom: 4 }}>
          {meta.label}
        </div>
        <h2 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 22, color: COLORS.ink, margin: "0 0 12px" }}>
          {item.title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <Row icon={<MapPin size={15} color={COLORS.ink} />} text={item.lieu} />
          <Row icon={<CalendarDays size={15} color={COLORS.ink} />} text={item.date} />
          <Row icon={<Users size={15} color={COLORS.ink} />} text={`${item.inscrits}/${item.places} participants · organisé par ${item.organisateur}`} />
          {item.info && <Row icon={<Sparkles size={15} color={COLORS.ink} />} text={item.info} />}
        </div>

        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 14.5, color: "#5C5578", lineHeight: 1.6, marginBottom: 20 }}>
          {item.desc}
        </p>

        {item.participants && item.participants.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Déjà inscrit(e)s</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {item.participants.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <PlainAvatar name={n} color={meta.color} size={30} />
                  <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: COLORS.ink }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isJoined ? (
          <PillButton color={"#EAF8ED"} textColor={COLORS.grass} style={{ width: "100%", boxShadow: "none" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <Check size={18} /> Vous participez
            </span>
          </PillButton>
        ) : (
          <PillButton
            color={full ? "#EDEAF4" : COLORS.coral}
            textColor={full ? "#B7AF98" : "#fff"}
            onClick={() => !full && onJoin(item.id)}
            style={{ width: "100%" }}
          >
            {full ? "Complet" : joinLabel}
          </PillButton>
        )}
      </div>
    </div>
  );
}

// ---------- Root ----------
export default function RecreApp() {
  const [parentValidated, setParentValidated] = useState(false);
  const [tab, setTab] = useState("profil");
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [favorites, setFavorites] = useState([]);
  const [joined, setJoined] = useState([]);
  const [selected, setSelected] = useState(null);

  const [adultItems, setAdultItems] = useState(ADULT_MEETUPS);
  const [teenItems, setTeenItems] = useState(TEEN_MEETUPS);
  const [favAdult, setFavAdult] = useState([]);
  const [favTeen, setFavTeen] = useState([]);
  const [joinedAdult, setJoinedAdult] = useState([]);
  const [joinedTeen, setJoinedTeen] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null); // { item, kind: "adult" | "teen" }

  const toggleFav = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const join = (id) => {
    setJoined((j) => [...j, id]);
    const addKids = (a) => ({
      ...a,
      inscrits: a.inscrits + KIDS.length,
      participants: [...(a.participants || []), ...KIDS.map((k) => ({ name: k.name, genre: k.genre }))],
    });
    setActivities((acts) => acts.map((a) => a.id === id ? addKids(a) : a));
    setSelected((s) => s && s.id === id ? addKids(s) : s);
  };

  const createActivity = (a) => setActivities((acts) => [a, ...acts]);

  const toggleFavCommunity = (kind, id) => {
    const setFav = kind === "adult" ? setFavAdult : setFavTeen;
    setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  const joinCommunity = (kind, id) => {
    const setJoinedFn = kind === "adult" ? setJoinedAdult : setJoinedTeen;
    const setItemsFn = kind === "adult" ? setAdultItems : setTeenItems;
    setJoinedFn((j) => [...j, id]);
    setItemsFn((items) => items.map((it) => it.id === id ? { ...it, inscrits: it.inscrits + 1 } : it));
    setSelectedCommunity((s) => s && s.item.id === id ? { ...s, item: { ...s.item, inscrits: s.item.inscrits + 1 } } : s);
  };

  const TABS_ALL = [
    { id: "explorer", label: "Explorer", icon: Compass, kidsOnly: true },
    { id: "creer", label: "Créer", icon: PlusCircle, kidsOnly: true },
    { id: "mes-sorties", label: "Mes sorties", icon: BookMarked, kidsOnly: true },
    { id: "adultes", label: "Adultes", icon: Coffee },
    { id: "ados", label: "Ados", icon: Gamepad2 },
    { id: "profil", label: "Profil", icon: UserCircle2 },
  ];
  const TABS = TABS_ALL.filter((t) => !t.kidsOnly || parentValidated);

  // Si le parent n'est plus validé (démo) alors qu'il est sur un onglet enfants, on le repositionne
  useEffect(() => {
    const stillVisible = TABS.some((t) => t.id === tab);
    if (!stillVisible) setTab("profil");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentValidated]);

  return (
    <div style={{ background: COLORS.cloud, minHeight: "100vh", fontFamily: "Nunito, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus { border-color: ${COLORS.sky} !important; }
        ::placeholder { color: #C7C0AE; }
      `}</style>

      {/* Top bar (desktop) / logo (mobile) */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 20px", maxWidth: 960, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: COLORS.ink,
            display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-6deg)",
          }}>
            <Compass size={18} color={COLORS.sun} />
          </div>
          <span style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 20, color: COLORS.ink }}>
            Récré
          </span>
        </div>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "none", gap: 6 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer",
                background: tab === t.id ? COLORS.ink : "transparent",
                color: tab === t.id ? "#fff" : COLORS.ink,
                padding: "9px 16px", borderRadius: 12, fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: 14.5,
              }}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: 960, margin: "0 auto", padding: "0 20px 110px",
      }}>
        {tab === "explorer" && parentValidated && (
          <Explorer activities={activities} favorites={favorites} onToggleFav={toggleFav} onOpen={setSelected} />
        )}
        {tab === "creer" && parentValidated && <CreateActivity onCreate={createActivity} />}
        {tab === "mes-sorties" && parentValidated && <MyOutings joined={joined} activities={activities} />}
        {tab === "adultes" && (
          <CommunityExplorer
            title="Rencontres entre parents"
            subtitle="Des moments entre adultes, sans les enfants, pour se connaître entre parents du quartier."
            categories={ADULT_CATEGORIES}
            items={adultItems}
            favorites={favAdult}
            onToggleFav={(id) => toggleFavCommunity("adult", id)}
            onOpen={(item) => setSelectedCommunity({ item, kind: "adult" })}
            emptyText="Aucune rencontre ne correspond. Essayez une autre recherche !"
          />
        )}
        {tab === "ados" && (
          <CommunityExplorer
            title="Rencontres entre ados"
            subtitle="Des activités entre ados, toujours encadrées par une association, une MJC ou un professeur."
            categories={TEEN_CATEGORIES}
            items={teenItems}
            favorites={favTeen}
            onToggleFav={(id) => toggleFavCommunity("teen", id)}
            onOpen={(item) => setSelectedCommunity({ item, kind: "teen" })}
            emptyText="Aucune rencontre ne correspond. Essayez une autre recherche !"
          />
        )}
        {tab === "profil" && (
          <Profile
            joinedCount={joined.length}
            validated={parentValidated}
            onToggleDemo={() => setParentValidated((v) => !v)}
          />
        )}
      </div>

      {/* Bottom tab bar (mobile) */}
      <div
        className="mobile-nav"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff",
          borderTop: "2px solid #F0EADB", display: "flex", justifyContent: "space-around",
          padding: "10px 6px 14px", zIndex: 40, overflowX: "auto", gap: 2,
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                background: "none", border: "none", cursor: "pointer", flex: "1 0 56px",
              }}
            >
              <t.icon size={22} color={active ? COLORS.coral : "#B7AF98"} strokeWidth={active ? 2.6 : 2} />
              <span style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 10.5,
                color: active ? COLORS.coral : "#B7AF98",
              }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <DetailModal activity={selected} onClose={() => setSelected(null)} joined={joined} onJoin={join} />

      <CommunityDetailModal
        item={selectedCommunity?.item}
        categories={selectedCommunity?.kind === "teen" ? TEEN_CATEGORIES : ADULT_CATEGORIES}
        onClose={() => setSelectedCommunity(null)}
        joined={selectedCommunity?.kind === "teen" ? joinedTeen : joinedAdult}
        onJoin={(id) => joinCommunity(selectedCommunity?.kind, id)}
        joinLabel={selectedCommunity?.kind === "teen" ? "Rejoindre cette rencontre" : "Rejoindre ce moment"}
      />

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}
