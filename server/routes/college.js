const express = require("express");
const router = express.Router();
const { College } = require("../models/College");

const { auth } = require("../middleware/auth");

//=================================
//             College services
//=================================
router.get("/:id", auth, (req, res) => {
  College.findOne({ _id: req.params.id }, (err, doc) => {
    if (!doc) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
// post to /api/12 update to college with of 12
router.post("/:id", (req, res) => {
  College.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      else return res.status(200).json({ success: true, ...doc });
    }
  );
});
router.get("/", auth, (req, res) => {
  let page = parseInt(req.query.current - 1) || 0; //for next page pass 1 here
  let limit = parseInt(req.query.pageSize) || 3;
  let query = {};
  College.find(query)
    .populate("dean")
    .skip(page * limit)
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      College.countDocuments(query).exec((countErr, count) => {
        if (countErr) return res.status(400).json({ success: false, countErr });
        return res.status(200).json({
          success: true,
          total: count,
          page: page,
          pageSize: doc.length,
          colleges: doc,
        });
      });
    });
});
// post api/college
router.post("/", (req, res) => {
  const college = new College(req.body);
  college.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else return res.status(200).json({ success: true, ...doc });
  });
});
module.exports = router;
