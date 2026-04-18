document.getElementById("camera").addEventListener("change", async function(e) {

  const file = e.target.files[0];

  if (!file) {
    alert("Aucune image sélectionnée");
    return;
  }

  document.getElementById("result").style.display = "block";
  document.getElementById("plant").innerText = "Analyse en cours...";
  document.getElementById("advice").innerText = "";

  try {

    const form = new FormData();
    form.append("images", file);

    const plantRes = await fetch(
      "https://my-api.plantnet.org/v2/identify/all?api-key=TA_CLE_PLANTNET",
      { method: "POST", body: form }
    );

    const plantData = await plantRes.json();

    let plantName = "Plante inconnue";

    if (plantData?.results?.length > 0) {
      plantName =
        plantData.results[0].species?.commonNames?.[0] ||
        plantData.results[0].species?.scientificName;
    }

    const ai = await fetch("/api/diagnose", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ plant: plantName })
    });

    const data = await ai.json();

    document.getElementById("plant").innerText = plantName;
    document.getElementById("advice").innerText = data.text;

    speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));

  } catch (err) {

    document.getElementById("plant").innerText = "Erreur";
    document.getElementById("advice").innerText = "Réessayer avec une autre photo";

    alert("Erreur technique");
  }
});
