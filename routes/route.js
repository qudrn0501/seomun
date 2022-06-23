const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const router = express.Router();
const { check, validationResult } = require('express-validator');

router.use(expressLayouts);
//route, routing 파일과 경로를 지정
router.get('/', (req, res) => {
  res.render('seomun_main');
}); //서문시장야시장 메인페이지 지정

const db = require('./../db');


router.post('/store', [check('subject').isByteLength({ min: 1, max: 5000 })],
  function (req, res, next) {
    let errs = validationResult(req);
    console.log(errs); //콘솔 에러 출력하기
    if (errs['errors'].length > 0) {
      //화면에 에러 출력하기
      res.render('seomun_write', { errs: errs['errors'] });
    } else {
      let param = JSON.parse(JSON.stringify(req.body));
      let subject = param['subject'];
      let date = param['date'];
      let content = param['content'];
      let author = param['author'];
      let pw = param['pw'];
      let views = param['views'];
      db.insertMemo(subject, date, content, author, pw, views, () => {
        res.redirect('/notice');
      });

    }

  });

router.get('/updateMemo', (req, res) => {
  let id = req.query.id;

  db.getMemoById(id, (row) => {
    if (typeof id === 'undefined' || row.length <= 0) {
      res.status(404).json({ error: 'undefined memo' });
    } else {
      res.render('updateMemo', { row: row[0] });
    }
  });
});

router.post('/updateMemo',
  [check('subject').isByteLength({ min: 1, max: 5000 })],
  (req, res) => {
    let errs = validationResult(req);
    let param = JSON.parse(JSON.stringify(req.body));
    console.log(req.body);
    let id = param['id'];
    console.log(id);
    let subject = param['subject'];
    let date = param['date'];
    let content = param['content'];
    let author = param['author'];
    let pw = param['pw'];
    if (errs['errors'].length > 0) {
      db.getMemoById(id, (row) => {
        res.render('updateMemo', { row: row[0], errs: errs['errors'] });
      });
    } else {
      db.updateMemoById(id, subject, date, content, author, pw, () => {
        res.redirect('/notice');
      });
    }
  });

router.get('/deleteMemo', (req, res) => {
  let id = req.query.id;
  db.deleteMemoById(id, () => {
    res.redirect('/notice');
  });
});


router.get('/main', (req, res) => {
  res.render('seomun_main');
})

router.get('/intro', (req, res) => {
  res.render('seomun_intro');
})

router.get('/notice', (req, res) => {

  db.getAllMemos((rows) => {
    res.render('seomun_notice', { rows: rows })
  });
})

router.get('/write', (req, res) => {
  res.render('seomun_write');
});







router.get('/login', (req, res) => {
  res.render('seomun_login');
})

router.get('/joinus', (req, res) => {
  res.render('seomun_joinselect');
})

router.get('/joinnormal', (req, res) => {
  res.render('seomun_joinus');
})
router.get('/joinfood', (req, res) => {
  res.render('seomun_joinfood');
})
router.get('/joinfree', (req, res) => {
  res.render('seomun_joinfree');
})

router.get('/viewdb', (req, res) => {
  let id = req.query.id;

  db.countView(id); //조회수 추가
  db.getViewById(id, (row) => {
    if (typeof id === 'undefined' || row.length <= 0) {
      res.status(404).json({ error: 'undefined memo' });
    } else {
      res.render('seomun_view_db', { row: row[0] });
    }
  });
});

// router.get('/view1', (req, res) => {
//   res.render('seomun_view');
// })

router.get('/joinus1', (req, res) => {
  res.render('seomun_joinus_1');
})

module.exports = router;