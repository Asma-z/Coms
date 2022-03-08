const express = require("express");
const router = express.Router();
const { Department } = require("../models/Department");

const { auth } = require("../middleware/auth");

//=================================
//             Department services
//=================================

router.get("/:id", auth, (req, res) => {
  Department.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
router.get("/", auth, (req, res) => {
  var page = parseInt(req.params.page) || 0; //for next page pass 1 here
  var limit = parseInt(req.params.limit) || 3;
  Department.find({})
    .skip(page * limit)
    .populate("university college")
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      Department.countDocuments({}).exec((countErr, count) => {
        if (countErr) return res.status(400).json({ success: false, countErr });
        return res.status(200).json({
          success: true,
          total: count,
          page: page,
          pageSize: doc.length,
          departments: doc,
        });
      });
    });
});
router.post("/:id", (req, res) => {
  Department.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      else return res.status(200).json({ success: true, ...doc });
    }
  );
});
router.post("/", (req, res) => {
  const department = new Department(req.body);
  department.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
module.exports = router;
