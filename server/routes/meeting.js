const express = require("express");
const router = express.Router();
const { Meeting } = require("../models/Meeting");

const { auth } = require("../middleware/auth");
const { Faculty } = require("../models/Faculty");

//=================================
//             Meeting services
//=================================

router.get("/:id", auth, (req, res) => {
  res.status(200).json({});
});

router.post("/:id", auth, (req, res) => {
  return res.status(200).json({
    success: true,
  });
});
router.post("/", auth, (req, res) => {
  const meeting = new Meeting({
    ...req.body,
    members: [req.faculty._id, ...req.body.members],
  });
  meeting.save((err, doc) => {
    if (err) return res.json({ success: false, err: err });
    return res.status(200).json({
      success: true,
      doc: doc,
    });
  });
});
router.get("/", auth, (req, res) => {
  let page = parseInt(req.query.current - 1) || 0; //for next page pass 1 here
  let limit = parseInt(req.query.pageSize) || 3;
  let query = {};
  Meeting.find(query)
    .populate("committe university college")
    .skip(page * limit)
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      Meeting.countDocuments(query).exec((countErr, count) => {
        if (countErr) return res.status(400).json({ success: false, countErr });
        return res.status(200).json({
          success: true,
          total: count,
          page: page,
          pageSize: doc.length,
          meetings: doc,
        });
      });
    });
});
module.exports = router;
