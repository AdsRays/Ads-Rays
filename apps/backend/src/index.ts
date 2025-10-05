app.get("/api/campaigns", (_req, res) => {
  res.type("application/json").send([
    { id: 1, name: "Тестовая рекламная кампания № 1", creatives: 2 },
    { id: 2, name: "Тестовая рекламная кампания № 2", creatives: 2 },
    { id: 3, name: "Тестовая рекламная кампания № 3", creatives: 2 }
  ]);
});