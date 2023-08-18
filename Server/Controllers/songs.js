"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSongs = exports.UpdateSongs = exports.AddSongs = exports.DisplaySongsByID = exports.DisplaySongsList = exports.ProcessLogout = exports.ProcessLogin = exports.ProcessRegistration = void 0;
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../Models/user"));
const songs_1 = __importDefault(require("../Models/songs"));
const index_1 = require("../Util/index");
;
function SanitizeArray(unsanitizedValue) {
    if (Array.isArray(unsanitizedValue)) {
        return unsanitizedValue.map((value) => value.trim());
    }
    else if (typeof unsanitizedValue === "string") {
        return unsanitizedValue.split(",").map((value) => value.trim());
    }
    else {
        return [];
    }
}
function ProcessRegistration(req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        emailAddress: req.body.EmailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName
    });
    user_1.default.register(newUser, req.body.password, (err) => {
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            console.error('All Fields Are Required');
            return res.json({ success: false, msg: 'ERROR: User Not Registered. All Fields Are Required' });
        }
        if (err) {
            console.error('Error: Inserting New User');
            if (err.name == "UserExistsError") {
                console.error('Error: User Already Exists');
            }
            return res.json({ success: false, msg: 'User not Registered Successfully!' });
        }
        return res.json({ success: true, msg: 'User Registered Successfully!' });
    });
}
exports.ProcessRegistration = ProcessRegistration;
function ProcessLogin(req, res, next) {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            return res.json({ success: false, msg: 'ERROR: User Not Logged in.' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                res.end(err);
            }
            const authToken = (0, index_1.GenerateToken)(user);
            return res.json({ success: true, msg: 'User Logged In Successfully!', user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    emailAddress: user.emailAddress
                }, token: authToken });
        });
        return;
    })(req, res, next);
}
exports.ProcessLogin = ProcessLogin;
function ProcessLogout(req, res, next) {
    req.logout(() => {
        console.log("User Logged Out");
    });
    res.json({ success: true, msg: 'User Logged out Successfully!' });
}
exports.ProcessLogout = ProcessLogout;
function DisplaySongsList(req, res, next) {
    songs_1.default.find({})
        .then(function (data) {
        res.status(200).json({ success: true, msg: "Song List Displayed Successfully", data: data });
    })
        .catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "ERROR: Something Went Wrong", data: null });
    });
}
exports.DisplaySongsList = DisplaySongsList;
function DisplaySongsByID(req, res, next) {
    try {
        let id = req.params.id;
        songs_1.default.findById({ _id: id })
            .then(function (data) {
            if (data) {
                res.status(200).json({ success: true, msg: "Songs Retrieved by ID Successfully", data: data });
            }
            else {
                res.status(404).json({ success: false, msg: "Songs ID Not Found", data: data });
            }
        })
            .catch(function (err) {
            console.error(err);
            res.status(400).json({ success: false, msg: "ERROR: Songs ID not formatted correctly", data: null });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "ERROR: Something Went Wrong", data: null });
    }
}
exports.DisplaySongsByID = DisplaySongsByID;
function AddSongs(req, res, next) {
    try {
        let songs = new songs_1.default({
            songID: req.body.songID,
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre,
            duration: req.body.duration,
            releaseDate: req.body.releaseDate,
            label: req.body.label,
            trackNumber: req.body.trackNumber,
            rating: req.body.rating,
            composer: req.body.composer,
            youtubeLink: req.body.youtubeLink
        });
        songs_1.default.create(songs)
            .then(function () {
            res.status(200).json({ success: true, msg: "Song Added Successfully", data: songs });
        })
            .catch(function (err) {
            console.error(err);
            if (err instanceof mongoose_1.default.Error.ValidationError) {
                res.status(400).json({ success: false, msg: "ERROR: Song Not Added. All Fields are required", data: null });
            }
            else {
                res.status(400).json({ success: false, msg: "ERROR: Song Not Added.", data: null });
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Something Went Wrong", data: null });
    }
}
exports.AddSongs = AddSongs;
function UpdateSongs(req, res, next) {
    try {
        let id = req.params.id;
        let songsToUpdate = new songs_1.default({
            _id: id,
            songID: req.body.songID,
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre,
            duration: req.body.duration,
            releaseDate: req.body.releaseDate,
            label: req.body.label,
            trackNumber: req.body.trackNumber,
            rating: req.body.rating,
            composer: req.body.composer,
            youtubeLink: req.body.youtubeLink
        });
        songs_1.default.updateOne({ _id: id }, songsToUpdate)
            .then(function () {
            res.status(200).json({ success: true, msg: "Song Updated Successfully", data: songsToUpdate });
        })
            .catch(function (err) {
            console.error(err);
            if (err instanceof mongoose_1.default.Error.ValidationError) {
                res.status(400).json({ success: false, msg: "ERROR: Song Not Updated. All Fields are required", data: null });
            }
            else {
                res.status(400).json({ success: false, msg: "ERROR: Song Not Updated.", data: null });
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Something Went Wrong", data: null });
    }
}
exports.UpdateSongs = UpdateSongs;
function DeleteSongs(req, res, next) {
    try {
        let id = req.params.id;
        songs_1.default.deleteOne({ _id: id })
            .then(function () {
            res.status(200).json({ success: true, msg: "Song Deleted Successfully", data: id });
        })
            .catch(function (err) {
            console.error(err);
            res.status(400).json({ success: false, msg: "ERROR: Song ID not formatted correctly", data: null });
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "ERROR: Something Went Wrong", data: null });
    }
}
exports.DeleteSongs = DeleteSongs;
//# sourceMappingURL=songs.js.map