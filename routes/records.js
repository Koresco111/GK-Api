// const express = require("express");
// const router = express.Router();
// const Record = require("../models/record");
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });
// const authMiddleware = require("../middleware/authMiddleware");

// // Route to create a new record
// router.post(
//   "/create",
//   authMiddleware,
//   upload.single("photo"),
//   async (req, res) => {
//     const tallyNum = req.body.tallyNum;
//     const photo = req.file.path;
//     const plateNum = req.body.plateNum;

//     try {
//       const newRecord = new Record({
//         tallyNum,
//         photo,
//         plateNum,
//         checkout: false,
//       });

//       const savedRecord = await newRecord.save();
//       res.json(savedRecord);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// // get all records
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const records = await Record.find();
//     res.status(200).json(records);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Route to delete a particular record by ID
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const record = await Record.findById(req.params.id);
//     if (!record) return res.status(404).json({ message: "Record not found" });
//     await Record.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Record deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Record = require("../models/Record.js"); // Update the model import
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

// Route to create a new record
router.post(
  "/create",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    const { tallyNum, plateNum } = req.body;
    const photo = req.file ? req.file.path : null; // Update to handle the case when no photo is uploaded

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

// get all records
router.get("/", authMiddleware, async (req, res) => {
  try {
    const records = await Record.findAll();
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching records" });
  }
});

// Route to delete a particular record by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findByPk(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    // Delete the photo file if exists
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

module.exports = router;
