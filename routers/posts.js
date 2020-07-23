const express = require('express');
const router = express.Router();

const Post = require('../models/Post');

router.get('/get', (req, res) => {
    Post.find({}, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
    })
})

router.get('/get/active', (req, res) => {
    Post.find({
        active: true
    }, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
    }).sort({
        added: -1
    })
})


router.get('/get/:id', (req, res) => {
    var id = req.params.id;
    Post.findById(id, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
    })
})

router.post('/add', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        added: Date.now(),
        author: req.body.author,
        image: req.body.image,
        tags: ['Druk', 'Reklama'],
        content: req.body.content,
        active: req.body.active
    })
    newPost.save()
        .then(data => {
            res.json(data);
            console.log(`Wpis dodany do bazy`);
        })
        .catch(err => {
            res.status(404);
        })
})

router.put('/update/:id', (req, res) => {
    var id = req.params.id;
    Post.findByIdAndUpdate(id, req.body, {
        new: true,
        useFindAndModify: false
    }, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
    })
})



router.delete('/delete/:id', function (req, res) {
    var id = req.params.id;
    Post.deleteOne({
        _id: id
    }, function (err) {
        if (err) return console.log(err);
        res.status(200).end();
    });
});

module.exports = router;