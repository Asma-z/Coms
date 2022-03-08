const express = require("express");
const router = express.Router();
const { Task } = require("../models/Committe-Task");

const { auth } = require("../middleware/auth");

//=================================
//             task services
//=================================

router.get("/:id", auth, (req, res) => {
  Task.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.post("/:id", (req, res) => {
  Task.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.post("/", (req, res) => {
  const task = new Task(req.body);
  task.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
module.exports = router;
