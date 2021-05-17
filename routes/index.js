var express = require('express');
const { route } = require('./blogs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.render('index');
});

// router.post('/api/insert', (req, res) => {
//   console.log(req.body);
//   res.render('index');
// });

module.exports = router;
