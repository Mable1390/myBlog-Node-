var express = require('express');
var router = express.Router();
var config = require('../config');
var strftime = require('strftime');
var shortid = require('shortid');

// create table
router.get('/api/create', (req, res) => {
    const db = config.dbConnection();
    db.run('CREATE TABLE blogs( \
        blog_id NVARCHAR(20) PRIMARY KEY NOT NULL,\
        blog_title NVARCHAR(20)  NOT NULL,\
        blog_content NVARCHAR(20)  NOT NULL,\
        blog_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,\
        status DEFAULT 1 NOT NULL \
    )', (err) => {
        if (err) {
            console.log("Table already exists.");
            return res.status(409).json({"status":'fail'});
            console.log("after return");
        }
        return res.status(200).json({"status": 'success'});
        
    });
});

router.post('/testing', (req, res) => {
    return res.status(200).json({
        "status": req.body,
    });
});

// insert
router.post('/api/insert', (req, res) => {
    const db = config.dbConnection();
    var reqBody = req.body;

    var date = new Date();
    var sqlite_date = strftime('%d-%m-%Y', date);
    console.log(sqlite_date);

    db.run(`INSERT INTO blogs (blog_id, blog_title, blog_content, blog_date, status) VALUES (?,?,?,?,?)`,
        [shortid.generate(), reqBody.blog_title, reqBody.blog_content, sqlite_date, 1],
        function (err, result) {
            if (err) {
                console.log(err);
                return res.status(400).json({ "error": err.message })
                
            }
            return res.status(200).json({
                "status": 'successfully inserted'
            });
        });
});

// update
router.post('/api/update', (req, res) => {
    const db = config.dbConnection();
    reqBody = req.body;

    var date = new Date();
    var sqlite_date = strftime('%d-%m-%Y', date);
    console.log(reqBody.blog_id);

    db.run(`UPDATE blogs set blog_title = ?, blog_content = ? WHERE blog_id = ?`,
    [reqBody.blog_title, reqBody.blog_content, reqBody.blog_id],
    function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).json({ "error": res.message })
        }
        return res.status(200).json({ updatedID: this.changes });
    });
});

// temponary delete
router.post('/api/delete/:id', (req, res) => {
    const db = config.dbConnection();
    reqBody = req.body;
    console.log(req.params.id);

    var date = new Date();
    var sqlite_date = strftime('%d-%m-%Y', date);
    console.log(reqBody.blog_id);

    db.run(`UPDATE blogs set status = 0 WHERE blog_id = ?`,
    [reqBody.blog_id],
    function (err, result) {
        if (err) {
            return res.status(400).json({ "error": res.message })
        }
        return res.status(200).json({ deletedID: this.changes });
    });
});

// permanent delete
router.delete('/api/real/:id', (req, res) => {
    const db = config.dbConnection();
    reqBody = req.body;
    console.log(req.params.id);
    db.run(`DELETE FROM blogs WHERE blog_id = ? AND status = 0`,
        req.params.id,
        
        function (err, result) {
            if (err) {
                return res.status(400).json({ "error": res.message })     
            }
            return res.status(200).json({ deletedID: this.changes });
        });
});

// undo delete
router.post('/api/undo', (req, res) => {
    const db = config.dbConnection();
    reqBody = req.body;
    db.run('UPDATE blogs set status = 1 WHERE blog_id = ?', [reqBody.blog_id],
    function (err, result) {
        if (err) {
            return res.status(400).json({ "error": res.message })
        }
        return res.status(200).json({ updatedID: this.changes });
    });
});

// select all (status = 1)
router.post('/api/all', (req, res) => {
    const db = config.dbConnection();
    db.all("SELECT * FROM blogs WHERE status = 1", [], (err, rows) => {
        if (err) {
          return res.status(400).json({"error":err.message});
        }
        return res.status(200).json({rows});
      });
});

// select all (status = 0)
router.post('/api/unactive', (req, res) => {
    const db = config.dbConnection();
    db.all("SELECT * FROM blogs WHERE status = 0", [], (err, rows) => {
        if (err) {
          return res.status(400).json({"error":err.message});
        }
        return res.status(200).json({rows});
      });
});

// select one
router.post('/api/blog/:id', (req, res) => {
    const db = config.dbConnection();
    db.get("SELECT * FROM blogs WHERE blog_id = ?",[req.params.id], (err, row) => {
        if (err) {
          return res.status(400).json({"error":err.message});
          
        }
        return res.status(200).json(row);
      });
});

module.exports = router;