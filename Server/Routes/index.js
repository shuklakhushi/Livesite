"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const songs_1 = require("../Controllers/songs");
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), (req, res, next) => (0, songs_1.DisplaySongsList)(req, res, next));
router.get('/find/:id', passport_1.default.authenticate('jwt', { session: false }), (req, res, next) => (0, songs_1.DisplaySongsByID)(req, res, next));
router.post('/add', passport_1.default.authenticate('jwt', { session: false }), (req, res, next) => (0, songs_1.AddSongs)(req, res, next));
router.put('/update/:id', passport_1.default.authenticate('jwt', { session: false }), (req, res, next) => (0, songs_1.UpdateSongs)(req, res, next));
router.delete('/delete/:id', passport_1.default.authenticate('jwt', { session: false }), (req, res, next) => (0, songs_1.DeleteSongs)(req, res, next));
router.post('/register', (req, res, next) => (0, songs_1.ProcessRegistration)(req, res, next));
router.post('/login', (req, res, next) => (0, songs_1.ProcessLogin)(req, res, next));
router.get('/logout', (req, res, next) => (0, songs_1.ProcessLogout)(req, res, next));
exports.default = router;
//# sourceMappingURL=index.js.map