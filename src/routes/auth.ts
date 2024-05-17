import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
    return res.json({ hi: true });
});

export default router;
