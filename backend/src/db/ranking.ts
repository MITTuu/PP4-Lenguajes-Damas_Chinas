import mongoose, { Schema, Document } from "mongoose";

export interface IRanking extends Document {
  gameId: string;
  winner: string;
  gameType: string;
  creator: string;
  date: Date;
}

const RankingSchema: Schema = new Schema({
  gameId: { type: String, required: true, unique: true },
  winner: { type: String, required: true },
  gameType: { type: String, required: true },
  creator: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const Ranking = mongoose.model<IRanking>("Ranking", RankingSchema);
