/* jshint esversion:6 */
var express = require('express');
var router = express.Router();
const parse = require('../lib/json_parse');
/* GET home page. */
router.get('/get', function(req, res) {
  let id = req.query.id;
  switch(id){
    case 'postV5Data':
      let postV5Data = ()=>{
        const data = {};
        let query = req.query.data;
        for(let i in query){
          data[i] = parse(query[i]).vo;
        }
        return data;
      };

      res.json(postV5Data());
      break;

  }
});

router.post('/',function (req,res) {
  console.log(req);
});


module.exports = router;
