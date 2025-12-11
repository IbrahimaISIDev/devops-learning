const request = require("supertest");
const app = require("../src/server");

describe("API Hello DevOps - Tests", () => {
  // Test de la route principale
  describe("GET /", () => {
    it("devrait retourner un message de bienvenue", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Hello DevOps");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  // Test du health check
  describe("GET /health", () => {
    it("devrait retourner le statut healthy", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("healthy");
      expect(response.body).toHaveProperty("uptime");
      expect(typeof response.body.uptime).toBe("number");
    });
  });

  // Test des infos système
  describe("GET /info", () => {
    it("devrait retourner les informations système", async () => {
      const response = await request(app).get("/info");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("hostname");
      expect(response.body).toHaveProperty("platform");
      expect(response.body).toHaveProperty("memory");
      expect(response.body).toHaveProperty("cpus");
    });
  });

  // Test de la gestion d'erreur
  describe("GET /error", () => {
    it("devrait retourner une erreur 500", async () => {
      const response = await request(app).get("/error");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test d'une route inexistante
  describe("GET /route-inexistante", () => {
    it("devrait retourner 404", async () => {
      const response = await request(app).get("/route-inexistante");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("non trouvée");
    });
  });
});
