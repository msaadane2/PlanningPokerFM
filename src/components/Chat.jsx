// fonction react
import { useEffect, useState } from "react";
// fonctions Firebase Firestore
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
// connexion à la base Firebase
import { db } from "../firebase";
// composant Chat
export default function Chat({ player = "Anonyme" }) {
  // liste des messages du chat
  const [messages, setMessages] = useState([]);
  // texte en cours d’écriture
  const [text, setText] = useState("");
  // Récupération des messages en temps réel
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);
  // Envoyer un message
  const sendMessage = async () => {
    const cleaned = text.trim();
    if (cleaned === "") return;
    //  on vide l'input pour pas garder le msg écrit
    setText("");
    await addDoc(collection(db, "messages"), {
      user: player,
      text: cleaned,
      createdAt: new Date(),
    });
  };
  // Supprimer tous les messages
  const deleteAllMessages = async () => {
    const snap = await getDocs(collection(db, "messages"));
    snap.forEach((d) => deleteDoc(d.ref));
  };
  return (
    <div
      style={{
        marginTop: 20,
        padding: 14,
        borderRadius: "18px",
        border: "1px solid rgba(148,163,184,0.25)",
        background: "rgba(15,23,42,0.9)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {}
        <h3 style={{ color: "#e5e7eb", margin: 0 }}>💬 Chat</h3>
        <button className="btn danger" onClick={deleteAllMessages}>
          Tout supprimer
        </button>
      </div>
      {/* Liste des messages */}
      <div
        style={{
          marginTop: 10,
          padding: 10,
          height: 150,
          overflowY: "auto",
          borderRadius: "14px",
          background: "#020617",
          border: "1px solid rgba(31,41,55,0.9)",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>
            Aucun message
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              fontSize: "0.92rem",
              lineHeight: 1.25,
            }}
          >
            <div style={{ flex: 1 }}>
              <b style={{ color: "#e5e7eb" }}>{m.user} :</b>{" "}
              <span style={{ color: "#e5e7eb" }}>{m.text}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Zone d’envoi */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message..."
          // envoi avec entrée
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button className="btn primary" onClick={sendMessage}>
          Envoyer
        </button>
      </div>
    </div>
  );
}
