const express = require("express");
const router = express.Router();
const Alumni = require("../models/Alumni");

// CREATE - Register new alumni (with Promise demonstration)
router.post("/register", async (req, res) => {
  try {
    // Simulating a delay using Promise (for demonstration)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const alumni = new Alumni(req.body);
    const savedAlumni = await alumni.save();

    res.status(201).json({
      success: true,
      message: "Alumni registered successfully!",
      data: savedAlumni,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// READ - Get all alumni (with Promise demonstration)
router.get("/directory", async (req, res) => {
  try {
    // Simulating a delay using Promise (for demonstration)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { batch, company, search } = req.query;
    let query = {};

    // Filter by batch
    if (batch) {
      query.batch = batch;
    }

    // Filter by company
    if (company) {
      query.currentCompany = { $regex: company, $options: "i" };
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const alumni = await Alumni.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alumni.length,
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// READ - Get single alumni by ID
router.get("/:id", async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE - Update alumni profile (with Promise demonstration)
router.put("/:id", async (req, res) => {
  try {
    // Simulating a delay using Promise (for demonstration)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: alumni,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE - Delete alumni profile (with Promise demonstration)
router.delete("/:id", async (req, res) => {
  try {
    // Simulating a delay using Promise (for demonstration)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alumni profile deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get statistics (for admin dashboard)
router.get("/admin/stats", async (req, res) => {
  try {
    const totalAlumni = await Alumni.countDocuments();
    const verifiedAlumni = await Alumni.countDocuments({ isVerified: true });

    // Group by batch
    const batchStats = await Alumni.aggregate([
      {
        $group: {
          _id: "$batch",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // Group by company
    const companyStats = await Alumni.aggregate([
      {
        $group: {
          _id: "$currentCompany",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAlumni,
        verifiedAlumni,
        unverifiedAlumni: totalAlumni - verifiedAlumni,
        batchStats,
        topCompanies: companyStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Verify alumni (admin function)
router.patch("/:id/verify", async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alumni verified successfully!",
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
