import Authors from "../models/authors.js";

export async function getSingleAuthor(id = "") {
  if (!id || id === "") return null;
  try {
    const author = await Authors.findOne({ id }).lean();
    return author;
  } catch (error) {
    console.log(`Error while getting resource from database ${error.message}`);
    return null;
  }
}

export async function getFilteredAuthors(filter = {}) {
  if (!filter || filter == {}) return null;
  try {
    const authors = await Authors.find(filter).lean();
    if (authors.length > 0) return authors;
    else return [];
  } catch (error) {
    console.log(`Error while getting resource from database ${error.message}`);
    return [];
  }
}
