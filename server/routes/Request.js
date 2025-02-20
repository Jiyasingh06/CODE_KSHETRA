const express = require("express");
const router = express.Router();
const Food = require("./../models/Request");
const passport = require("passport");

// Allow only NGOs to request food
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = req.user;

        // Restrict access: Only NGOs can request food
        if (user.role !== "NGO") {
            return res.status(403).json({ error: "Access denied. Only NGOs can request food." });
        }

        // Extract request details
        const { Item_names, Item_quantity, requester_name, requester_email, requester_phone } = req.body;

        if (!Item_names || !Item_quantity || !requester_name || !requester_email || !requester_phone) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        // Save food request
        const newFoodRequest = await Food.create({
            Item_names,
            Item_quantity,
            requester_name,
            requester_email,
            requester_phone,
            user: req.user._id
        });

        return res.status(201).json({ message: "Food request created successfully!", request: newFoodRequest });

    } catch (error) {
        console.error("Error creating food request:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

// Delete a food request (Only NGOs can delete their own requests)
router.delete("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = req.user;

        // Restrict access: Only NGOs can delete requests
        if (user.role !== "NGO") {
            return res.status(403).json({ error: "Access denied. Only NGOs can delete their requests." });
        }

        const { Item_names } = req.body;
        if (!Item_names) {
            return res.status(400).json({ error: "Item name is required" });
        }

        const foodRequest = await Food.findOne({ Item_names, user: user._id });
        if (!foodRequest) {
            return res.status(404).json({ error: "Food request not found" });
        }

        await foodRequest.deleteOne();
        return res.status(200).json({ message: "Food request deleted successfully" });

    } catch (error) {
        console.error("Error deleting food request:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

// Get all food requests (Only NGOs can view their requests)
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = req.user;

        // Restrict access: Only NGOs can view their requests
        if (user.role !== "NGO") {
            return res.status(403).json({ error: "Access denied. Only NGOs can view food requests." });
        }

        const ngoRequests = await Food.find({ user: user._id });
        return res.status(200).json({ data: ngoRequests });

    } catch (error) {
        console.error("Error fetching food requests:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
