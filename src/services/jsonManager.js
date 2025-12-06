export function saveStateAsJson(obj, filename = "state.json") {
  try {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Impossible d'exporter le JSON");
  }
}

export async function loadStateFromFile(file) {
  try {
    const text = await file.text();
    return JSON.parse(text);
  } catch {
    alert("Fichier JSON invalide.");
    return null;
  }
}
