import Reviews from "../models/reviews.js";

export async function getSingleReview(id = "") {
  try {
    const review = await Reviews.findOne({ id }).lean();
    if (review) return review;
    else null;
  } catch (error) {
    console.log(`Error while getting resource from database ${error.message}`);
    return null;
  }
}

export async function getFilteredReviews(filter = {}) {
  try {
    const reviews = await Reviews.find(filter).lean();
    if (reviews.length > 0) return reviews;
    else [];
  } catch (error) {
    console.log(`Error while getting resource from database ${error.message}`);
    return [];
  }
}
