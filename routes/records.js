const express = require("express");
const router = express.Router();
const Record = require("../models/Record.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    const { tallyNum, plateNum } = req.body;
    const photo = req.file ? req.file.path : null;

    try {
      const newRecord = await Record.create({
        tallyNum,
        photo,
        plateNum,
        checkout: false,
      });

      res.json(newRecord);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Error creating record" });
    }
  }
);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const records = await Record.findAll();
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching records" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findByPk(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (record.photo) {
      const photoPath = path.join(__dirname, "..", record.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await record.destroy();
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting record" });
  }
});

// Route to get all records with checkout = false
router.get("/checkout/false", authMiddleware, async (req, res) => {
  try {
    const records = await Record.findAll({ where: { checkout: false } });
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching records" });
  }
});

// Route to get all records with checkout = true
router.get("/checkout/true", authMiddleware, async (req, res) => {
  try {
    const records = await Record.findAll({ where: { checkout: true } });
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching records" });
  }
});

// New POST route to set the checkout field to true
router.post("/:id/checkout", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    record.checkout = true;
    await record.save();

    res.status(200).json({ message: "Checkout updated successfully", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating checkout" });
  }
});

module.exports = router;
