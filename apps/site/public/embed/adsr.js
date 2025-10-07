(function () {
  const rootId = document.currentScript.getAttribute("data-root");
  const apiUrl = document.currentScript.getAttribute("data-api");
  const root = document.getElementById(rootId);
  if (!root) return console.error("AdsRays: не найден контейнер root");

  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.maxWidth = "1200px";
  container.style.margin = "0 auto";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.gap = "10px";
  container.style.boxSizing = "border-box";
  container.style.padding = "10px";
  root.appendChild(container);

  function createTile(data) {
    const tile = document.createElement("div");
    tile.style.width = "90%";
    tile.style.maxWidth = "1200px";
    tile.style.minWidth = "320px";
    tile.style.height = "35px";
    tile.style.display = "flex";
    tile.style.alignItems = "center";
    tile.style.justifyContent = "space-between";
    tile.style.background = "#1A2049";
    tile.style.border = "1px solid #383F70";
    tile.style.borderRadius = "28px";
    tile.style.fontFamily = "PT Sans, sans-serif";
    tile.style.fontSize = "14px";
    tile.style.color = "#B3B3B3";
    tile.style.padding = "0 20px";
    tile.style.cursor = "pointer";
    tile.style.transition = "all 0.3s ease";

    function applyResponsive() {
      if (window.innerWidth < 768) {
        tile.style.height = "30px";
        tile.style.fontSize = "12px";
        tile.style.padding = "0 12px";
      } else {
        tile.style.height = "35px";
        tile.style.fontSize = "14px";
        tile.style.padding = "0 20px";
      }
    }
    applyResponsive();
    window.addEventListener("resize", applyResponsive);

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    const circle = document.createElement("div");
    circle.textContent = "+";
    circle.style.width = "20px";
    circle.style.height = "20px";
    circle.style.borderRadius = "50%";
    circle.style.background = "#595E81";
    circle.style.color = "#B3B3B3";
    circle.style.display = "flex";
    circle.style.alignItems = "center";
    circle.style.justifyContent = "center";
    circle.style.marginRight = "10px";
    left.appendChild(circle);
    const name = document.createElement("span");
    name.textContent = data.name;
    left.appendChild(name);

    const right = document.createElement("div");
    right.textContent = `В кампании ${data.creatives} креатива`;
    right.style.marginRight = "10px";
    right.style.flex = "0 0 auto";

    const indicators = document.createElement("div");
    indicators.style.display = "flex";
    indicators.style.gap = "8px";
    const yellow = document.createElement("div");
    yellow.style.width = "14px";
    yellow.style.height = "14px";
    yellow.style.borderRadius = "50%";
    yellow.style.background = "#FFF37D";
    const green = document.createElement("div");
    green.style.width = "14px";
    green.style.height = "14px";
    green.style.borderRadius = "50%";
    green.style.background = "#92C681";
    indicators.appendChild(yellow);
    indicators.appendChild(green);

    tile.appendChild(left);
    const rightWrap = document.createElement("div");
    rightWrap.style.display = "flex";
    rightWrap.style.alignItems = "center";
    rightWrap.style.gap = "10px";
    rightWrap.appendChild(right);
    rightWrap.appendChild(indicators);
    tile.appendChild(rightWrap);

    const panel = document.createElement("div");
    panel.style.maxHeight = "0px";
    panel.style.overflow = "hidden";
    panel.style.transition = "max-height 0.4s ease";
    panel.style.background = "#22284D";
    panel.style.borderRadius = "16px";
    panel.style.width = "90%";
    panel.style.maxWidth = "1200px";
    panel.style.margin = "0 auto";
    panel.style.boxSizing = "border-box";
    panel.style.padding = "0 20px";

    tile.addEventListener("click", () => {
      const expanded = panel.style.maxHeight !== "0px";
      panel.style.maxHeight = expanded ? "0px" : "200px";
      circle.textContent = expanded ? "+" : "–";
    });

    container.appendChild(tile);
    container.appendChild(panel);
  }

  fetch(apiUrl)
    .then((r) => r.json())
    .then((data) => {
      container.innerHTML = "";
      data.forEach(createTile);
    })
    .catch((err) => {
      console.error("Ошибка загрузки:", err);
      const msg = document.createElement("div");
      msg.textContent = "Ошибка загрузки данных";
      msg.style.color = "red";
      msg.style.marginTop = "20px";
      container.appendChild(msg);
    });
})();
