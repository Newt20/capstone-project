import { Router } from "express";

const router = Router();

// GET /api/health
router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "support-chat-backend" });
});

export default router;
