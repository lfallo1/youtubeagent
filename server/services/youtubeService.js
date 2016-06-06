var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    Superhero.getAllSuperheroes(function(err, superheroes) {
        if (err) res.json(err);
        res.json(superheroes);
    })
});

router.get('/:id', function(req, res, next) {
    Superhero.getSuperheroById(req.params.id, function (err, superhero) {
        if (err) {
            res.send(err);
        }
        res.json(superhero);
    })
});

module.exports = router;