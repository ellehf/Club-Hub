/**
 * @file Review definition.
 */

import { v4 as uuidv4 } from "uuid";

class Review {
    #_id;
    #rating;
    #info;
    #likes;
    #dislikes;

    /**
     * Constructs an instance of Review.
     *
     * @param {string} _id - Unique review ID.
     * @param {number} rating - Rating from 1 to 5.
     * @param {string} info - Text content of the review.
     * @param {number} likes - Number of likes.
     * @param {number} dislikes - Number of dislikes.
     */
    constructor(
	_id = uuidv4(),
	rating = 5,
	info = "",
	likes = 0,
	dislikes = 0,
    ) {
	if (rating < 1 || rating > 5) {
	    throw new Error("Rating must be between 1 and 5");
	}

	this.#_id = _id;
        this.#rating = rating;
        this.#info = info;
	this.#likes = likes;
	this.#dislikes = dislikes;
    }

    /**
     * Checks whether two events are equal.
     *
     * @param {Review} review - Review to compare with.
     * @return {boolean} Whether two reviews are equal.
     */
    equals(review) {
	return this.#_id === review.getId();
    }

    /**
     * Get review ID.
     *
     * @return {string} Review ID.
     */
    getId() {
	return this.#_id;
    }

    /**
     * Get review's rating.
     *
     * @return {number} Rating.
     */
    getRating() {
	return this.#rating;
    }

    /**
     * Change review's rating.
     *
     * @param {number} rating - New rating.
     */
    setRating(rating) {
	if (rating < 1 || rating > 5) {
	    throw new Error("Rating must be between 1 and 5");
	}

	this.#rating = rating;
    }

    /**
     * Get review's text content.
     *
     * @return {string} Review text.
     */
    getInfo() {
	return this.#info;
    }

    /**
     * Change review's text content.
     *
     * @param {string} info - New text content.
     */
    setInfo(info = "") {
	this.#info = info;
    }

    /**
     * Get review's number of likes.
     *
     * @return {number} Number of likes.
     */
    getLikes() {
	return this.#likes;
    }

    /**
     * Increment number of likes by 1.
     */
    like() {
	this.#likes++;
    }

    /**
     * Get review's number of dislikes.
     *
     * @return {number} Number of dislikes.
     */
    getDislikes() {
	return this.#dislikes;
    }

    /**
     * Increment number of dislikes by 1.
     */
    dislike() {
	this.#dislikes++;
    }

    /**
     * Get review's feedback score (likes - dislikes).
     *
     * @return {number} Feedback score.
     */
    getFeedbackScore() {
	return this.#likes - this.#dislikes;
    }

    /**
     * Convert this review to a JSON document.
     *
     * @return {Object} JSON representation of the review.
     */
    toJson() {
	return {
	    _id: this.#_id,
	    rating: this.#rating,
	    info: this.#info,
	    likes: this.#likes,
	    dislikes: this.#dislikes,
	};
    }
}

export default Review;
