const express = require("express");
const User = require("../models/User");
const Report = require("../models/Report");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// GET Admin Stats
router.get("/stats", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const verifiedReports = await Report.countDocuments({ status: "approved" });

    res.json({ totalUsers, totalReports, verifiedReports });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});

// GET All Reports (with creator info)
router.get("/reports", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error: error.message });
  }
});

// PATCH Verify/Approve a report
router.patch("/reports/:id/verify", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "approved";
    await report.save();

    res.json({ message: "Report approved successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify report", error: error.message });
  }
});

module.exports = router;
