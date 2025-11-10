const textarea = document.getElementById("keywords");
const saveButton = document.getElementById("save");
const enabledCheckbox = document.getElementById("enabled");

chrome.storage.sync.get(["keywords", "enabled"], ({ keywords, enabled }) => {
  textarea.value = (keywords || ["nubank", "roxinho", "nu"]).join("\n");
  enabledCheckbox.checked = enabled !== false; // padrão: ligado
});

saveButton.addEventListener("click", () => {
  const list = textarea.value
    .split("\n")
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const enabled = enabledCheckbox.checked;

  chrome.storage.sync.set({ keywords: list, enabled }, () => {
    alert("✅ Configurações salvas!");
  });
});

enabledCheckbox.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledCheckbox.checked });
});
