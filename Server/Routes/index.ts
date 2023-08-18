import express from 'express';
let router = express.Router();
import passport from 'passport';

/* GET the movie controller */
import {DisplaySongsList, DisplaySongsByID, AddSongs, UpdateSongs, DeleteSongs, ProcessRegistration, ProcessLogin, ProcessLogout} from '../Controllers/songs';

router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) =>   DisplaySongsList(req, res, next) );

router.get('/find/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => DisplaySongsByID(req, res, next));

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res, next) => AddSongs(req, res, next));

router.put('/update/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => UpdateSongs(req, res, next));

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => DeleteSongs(req, res, next));


//Authentication routes
router.post('/register', (req, res, next) => ProcessRegistration(req, res, next));

router.post('/login', (req, res, next) => ProcessLogin(req, res, next));

router.get('/logout', (req, res, next) => ProcessLogout(req, res, next));

export default router;