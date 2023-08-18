import { Schema, model } from 'mongoose';

// Games Interface - defines the structure of a person
interface ISongs {
  songId: string;
  title: string;
  genre: string;
  artist: string;
  album: string;
  duration: string;
  releaseDate: string;
  label: string;
  trackNumber: number;
  rating: string;
  composer: string;
  youtubeLink: string;
}

// Person Schema - defines the structure of a person using the Person Interface
const songsSchema = new Schema<ISongs>({
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

const Songs = model<ISongs>('Songs', songsSchema);

export default Songs;