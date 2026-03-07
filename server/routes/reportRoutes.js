const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const Report = require("../models/Report");
const User = require("../models/User");
const analyzeReport = require("../services/sarvamService");
const { classifyImageFromUrl } = require("../services/imageService");
const { sendHighSeverityAlert } = require("../services/alertService");
const findNearbyNGO = require("../utils/findNearbyNGO");
const clustering = require("density-clustering");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "hunger-hotspot", allowed_formats: ["jpg", "jpeg", "png", "webp"] },
});
const upload = multer({ storage });

// Any authenticated user can submit a report
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description, locationName, coordinates, latitude, longitude } = req.body;

    // Accept either a GeoJSON coordinates object or separate lat/lng fields
    let geoCoordinates;
    if (coordinates && coordinates.coordinates) {
      geoCoordinates = coordinates;
    } else if (latitude !== undefined && longitude !== undefined) {
      geoCoordinates = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    } else {
      return res.status(400).json({ message: "Location coordinates are required." });
    }

    // 🧠 Analyse with Sarvam AI
    const aiResult = await analyzeReport(`${title}. ${description}`);

    // 🖼️ Classify uploaded image with MobileNet (if provided)
    let imageLabels = [];
    if (req.file?.path) {
      imageLabels = await classifyImageFromUrl(req.file.path);
    }

    const report = await Report.create({
      title,
      description,
      locationName,
      coordinates: geoCoordinates,
      createdBy: req.user.id,
      aiSeverity: aiResult?.severity || "low",
      aiAnalysis: aiResult?.summary || "",
      imageUrl: req.file?.path || "",
    });

    // 🚨 Alert all NGOs when severity is high (fire-and-forget)
    if ((aiResult?.severity || "low") === "high") {
      const lat = geoCoordinates.coordinates[1];
      const lng = geoCoordinates.coordinates[0];
      Promise.all([
        User.find({ role: "ngo" }).select("email"),
        findNearbyNGO(lat, lng),
      ]).then(([ngoUsers, nearbyNGOs]) => {
        const emails = ngoUsers.map((u) => u.email);
        sendHighSeverityAlert(report, emails, nearbyNGOs);
      }).catch(() => {});
    }

    res.status(201).json({ message: "Report submitted successfully", report, aiAnalysis: aiResult, imageLabels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin - Re-analyze all reports missing AI severity (fixes existing data)
router.post("/re-analyze", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const reports = await Report.find({
      $or: [{ aiSeverity: { $exists: false } }, { aiSeverity: null }, { aiSeverity: "low" }],
    });

    let updated = 0;
    for (const report of reports) {
      const aiResult = await analyzeReport(`${report.title}. ${report.description}`);
      if (aiResult) {
        report.aiSeverity = aiResult.severity;
        report.aiAnalysis = aiResult.summary;
        await report.save();
        updated++;
      }
    }

    res.status(200).json({ message: `Re-analyzed ${updated} reports`, updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin - Get all reports
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const reports = await Report.find().populate("createdBy", "name email role");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Any authenticated user can view their own reports
router.get("/my-reports", protect, async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - Get approved reports for map
router.get("/approved", async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" }).populate("createdBy", "name");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - Get verified reports for map (alias for approved)
router.get("/verified", async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

// Public - Get live platform statistics (no auth required)
router.get("/public-stats", async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const approvedReports = await Report.countDocuments({ status: "approved" });
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const rejectedReports = await Report.countDocuments({ status: "rejected" });
    res.status(200).json({ totalReports, approvedReports, pendingReports, rejectedReports });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Public - Get recent approved reports for home page feed
router.get("/recent", async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("createdBy", "name")
      .select("title description locationName createdAt createdBy");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent reports" });
  }
});

// Any authenticated user can update their own report
router.put("/:id", protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    report.title = req.body.title || report.title;
    report.description = req.body.description || report.description;
    report.locationName = req.body.locationName || report.locationName;

    await report.save();

    res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin - Update report status (approve/reject)
router.put("/:id/status", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.status(200).json({ message: `Report ${status} successfully`, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin - Delete report
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.deleteOne();

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - Get nearby NGOs for a given lat/lng
router.get("/nearby-ngos", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng query params are required" });
    }
    const ngos = await findNearbyNGO(parseFloat(lat), parseFloat(lng));
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - DBSCAN AI Hotspot Clustering
router.get("/clusters", async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" });
    if (reports.length < 2) return res.status(200).json([]);

    const dataset = reports
      .filter((r) => r.coordinates?.coordinates?.length === 2)
      .map((r) => [r.coordinates.coordinates[1], r.coordinates.coordinates[0]]);

    const dbscan = new clustering.DBSCAN();
    // epsilon 0.05 ≈ ~5 km; minPts 2
    const clusterIndices = dbscan.run(dataset, 0.05, 2);

    const result = clusterIndices.map((indices, i) => {
      const clusterReports = indices.map((idx) => reports[idx]);
      const avgLat = clusterReports.reduce((s, r) => s + r.coordinates.coordinates[1], 0) / clusterReports.length;
      const avgLng = clusterReports.reduce((s, r) => s + r.coordinates.coordinates[0], 0) / clusterReports.length;
      const highCount = clusterReports.filter((r) => r.aiSeverity === "high").length;
      const risk = highCount >= clusterReports.length / 2 ? "HIGH" : clusterReports.some((r) => r.aiSeverity === "medium") ? "MEDIUM" : "LOW";
      const locationName = clusterReports[0]?.locationName || "Unknown Area";
      return { id: i + 1, center: [avgLat, avgLng], count: clusterReports.length, risk, area: locationName };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - Smart Resource Allocation: top priority areas by report count
router.get("/priority-areas", async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" });
    const areaMap = {};
    reports.forEach((r) => {
      const key = r.locationName || "Unknown";
      if (!areaMap[key]) areaMap[key] = { area: key, count: 0, highCount: 0 };
      areaMap[key].count++;
      if (r.aiSeverity === "high") areaMap[key].highCount++;
    });
    const sorted = Object.values(areaMap)
      .sort((a, b) => b.count - a.count || b.highCount - a.highCount)
      .slice(0, 10);
    res.status(200).json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - Analytics: severity distribution + monthly trend + per-location breakdown
router.get("/analytics", async (req, res) => {
  try {
    const reports = await Report.find();

    const severity = { low: 0, medium: 0, high: 0 };
    const locationMap = {};
    const monthMap = {};

    reports.forEach((r) => {
      // severity
      const sev = r.aiSeverity || "low";
      severity[sev] = (severity[sev] || 0) + 1;

      // per location
      const loc = r.locationName || "Unknown";
      locationMap[loc] = (locationMap[loc] || 0) + 1;

      // monthly (YYYY-MM)
      const month = r.createdAt.toISOString().slice(0, 7);
      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    const monthly = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    const perLocation = Object.entries(locationMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([location, count]) => ({ location, count }));

    res.status(200).json({ severity, monthly, perLocation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
