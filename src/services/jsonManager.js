// Sauvegarde un objet JavaScript dans un fichier JSON téléchargeable
export function saveStateAsJson(obj, filename = "state.json") {
  try {
    // on transforme l'objet en JSON lisible
    const json = JSON.stringify(obj, null, 2);
    // on crée un fichier "virtuel" JSON
    const blob = new Blob([json], { type: "application/json" });
    // on crée une URL temporaire pour ce fichier
    const url = URL.createObjectURL(blob);
    // on crée un lien de téléchargement
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    //certains navigateurs veulent le lien
    document.body.appendChild(a);
    a.click();
    a.remove();
    // on attend un peu avant de supprimer l’URL (sinon téléchargement peut échouer)
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 500);
  } catch (e) {
    console.error(e);
    alert("Impossible d'exporter le JSON");
  }
}
// Charge et lit un fichier JSON importé par l’utilisateur
export async function loadStateFromFile(file) {
  try {
    // si pas de fichier
    if (!file) return null;
    // lecture du contenu du fichier
    const text = await file.text();
    const obj = JSON.parse(text);
    // petite vérification
    if (!obj || typeof obj !== "object") {
      alert("Fichier JSON invalide.");
      return null;
    }
    return obj;
  } catch (e) {
    console.error(e);
    alert("Fichier JSON invalide.");
    return null;
  }
}
