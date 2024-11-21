import { Request, Response } from 'express';
import { Ranking } from '../db/ranking';

// Agregar un nuevo ranking
export const addRanking = async (req: Request, res: Response): Promise<Response> => {
  const { gameId, winner, gameType, creator } = req.body;

  if (!gameId || !winner || !gameType || !creator) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const newRanking = new Ranking({
      gameId,
      winner,
      gameType,
      creator,
    });

    const savedRanking = await newRanking.save();
    return res.status(201).json(savedRanking);
  } catch (error) {
    console.error("Error al guardar el ranking:", error);
    return res.status(500).json({ message: "Error al guardar el ranking" });
  }
};

// Obtener todos los rankings
export const getRankings = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Obtener los gameId únicos
    const uniqueGameIds = await Ranking.distinct("gameId");

    // Obtener los rankings correspondientes a esos gameId únicos
    const rankings = await Ranking.find({ gameId: { $in: uniqueGameIds } })
                                  .sort({ date: -1 })
                                  .exec();

    return res.status(200).json(rankings);
  } catch (error) {
    console.error("Error al obtener los rankings:", error);
    return res.status(500).json({ message: "Error al obtener los rankings" });
  }
};
