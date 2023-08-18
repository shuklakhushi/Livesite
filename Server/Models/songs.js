"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const songsSchema = new mongoose_1.Schema({
    songId: String,
    title: String,
    genre: String,
    artist: String,
    album: String,
    duration: String,
    releaseDate: String,
    label: String,
    trackNumber: Number,
    rating: String,
    composer: String,
    youtubeLink: String
});
const Songs = (0, mongoose_1.model)('Songs', songsSchema);
exports.default = Songs;
//# sourceMappingURL=songs.js.map