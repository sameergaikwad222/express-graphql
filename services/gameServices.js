import { platform } from "os";
import Games from "../models/games.js";
import crypto from "crypto";

export async function getSingleGame(id = "") {
  if (!id || id === "") return null;
  try {
    const game = await Games.findOne({ id }).lean();
    if (game) return game;
    else return null;
  } catch (error) {
    console.log(`Error while getting resource from database ${error.message}`);
    return null;
  }
}

export async function getFilteredGames(filter = {}) {
  if (!filter || filter == {}) return null;
  try {
    const games = await Games.find(filter).lean();
    if (games.length > 0) return games;
    else return [];
  } catch (error) {
    console.log(`Error while getting resource from database ${error.message}`);
    return [];
  }
}

export async function insertMultipleGames(games = []) {
  if (!games || games.length <= 0) return [];
  games = games.filter((g) => g.title && g.platform.length > 0);
  if (games.length) {
    try {
      games.forEach((g) => {
        g.id = crypto.randomUUID();
      });
      const resp = await Games.insertMany(games);
      if (resp && resp.length > 0) return games;
    } catch (error) {
      console.log(`Error while inserting data: ${error.message}`);
      return [];
    }
  } else {
    return [];
  }
}

export async function updateSingleGame(id = "", game = {}) {
  if (!game || game == {} || !id || id === "") return null;
  //Remove unnecessary data.
  for (const key in game) {
    if (!["title", "platform"].includes(key)) {
      delete game[key];
    }
  }
  try {
    const doc = await Games.findOneAndUpdate({ id }, { $set: game });
    if (doc) return doc;
    else return null;
  } catch (error) {
    console.log(`Error while inserting data: ${error.message}`);
    return null;
  }
}

export async function deleteMultipleGames(ids = []) {
  if (!ids || ids.length <= 0) return [];

  try {
    const datatobeDeleted = await Games.find({ id: { $in: ids } }).lean();
    if (datatobeDeleted.length > 0) {
      const resp = await Games.deleteMany({
        id: { $in: ids },
      });
      if (resp.acknowledged) return datatobeDeleted;
      else return [];
    } else return [];
  } catch (error) {
    console.log(`Error while inserting data: ${error.message}`);
    return null;
  }
}
