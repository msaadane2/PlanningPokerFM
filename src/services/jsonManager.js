// Sauvegarde un objet JavaScript dans un fichier JSON téléchargeable
export function saveStateAsJson(obj, filename = "state.json") {
  try {
    // création d’un fichier JSON à partir de l’objet
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    // création d’une URL temporaire pour le fichier
    const url = URL.createObjectURL(blob);
    // création d’un lien invisible pour lancer le téléchargement
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    // suppression de l’URL temporaire
    URL.revokeObjectURL(url);
  } catch (e) {
    // message d’erreur si l’export échoue
    alert("Impossible d'exporter le JSON");
  }
}
// Charge et lit un fichier JSON importé par l’utilisateur
export async function loadStateFromFile(file) {
  try {
    // lecture du contenu du fichier
    const text = await file.text();
    // conversion du texte en objet JavaScript
    return JSON.parse(text);
  } catch {
    // message d’erreur si le fichier n’est pas valide
    alert("Fichier JSON invalide.");
    return null;
  }
}
