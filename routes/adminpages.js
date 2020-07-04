var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var Page = require('../models/page');
const { exists } = require('../models/page');

// router.locals.errors = null;
/* GET index pages. */
router.get('/', function(req, res, next) {
  res.send('from admin route');
});

/* GET add pages. */
router.get('/add-page', (req, res, next)=>{
  var title = " ";
  var slug = " ";
  var content = " ";

  res.render('admin/admin_page',{
    title: title,
    slug: slug,
    content: content
  })
});

/* Post add pages. */
router.post('/add-page', (req, res, next)=>{
check('title','Title must have value').notEmpty();
check('content','Content must have value').notEmpty();

var title = req.body.title;
var slug = req.body.slug.replace(/|s+/g,'-').toLowerCase();
if(slug == "") slug = title.replace(/|s+/g,'-').toLowerCase();
var content = req.body.content;

var errorResponse = {
  messageTitle:`TITLE MUST HAVE VALUE..`,
  messageContent:`CONTENT MUST HAVE VALUE`
}

var errors = validationResult(req);

if(errors){
    res.render('admin/admin_page',{
    errors: errors,
    title: title,
    slug: slug,
    content: content
  });
     
  console.log(errorResponse.messageTitle, 
    errorResponse.messageContent);
 
  }else{
    Page.findOne({slug:slug}, (err, page)=>{
      if(page){
        req.flash('danger', 'Page slug exists, choose another');
        res.render('admin/admin_page',{
          title: title,
          slug: slug,
          content: content
        });
      }else{
        var page = new Page({
          title: title,
          slug: slug,
          content: content,
          sorting: 0
        });

        page.save((err)=>{
          if (err)
          return console.log('SPOT ERROR...' + err);

          req.flash('success', 'Page added !');
          res.redirect('/admin/pages');
        });
      }
    })
  }
 });




module.exports = router;
