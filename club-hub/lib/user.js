/**
 * @file User definition.
 */

import { v4 as uuidv4 } from "uuid";

class User {
    #_id;
    #email;
    #name;
    #year;
    #major;
    #memberships;
    #feedback;

    /**
     * Constructs an instance of User.
     *
     * @param {string} _id - Unique user ID.
     * @param {string} email - User's Google email.
     * @param {string} name - User's full name.
     * @param {string} year - User's school year.
     * @param {string} major - Major user is pursuing.
     * @param {Object} memberships - Key-value pairs of club ID => member ID.
     * @param {Object} feedback - Feedback provided to reviews and events.
     */
    constructor(
	_id = uuidv4(),
	email = "",
	name = "",
	year = "",
	major = "",
	memberships = {},
	feedback = { reviews: {}, events: {} },
    ) {
	if (!name) {
	    throw new Error("User has invalid name");
	}

	if (!email) {
	    throw new Error("User must provide an email");
	}

	this.#_id = _id;
	this.#email = email;
        this.#name = name;
        this.#year = year;
        this.#major = major;
        this.#memberships = memberships;
	this.#feedback = feedback;
    }

    /**
     * Check whether two users are equal.
     *
     * @param {User} user - User to compare with.
     * @return {boolean} Whether the two users are equal.
     */
    equals(user) {
	return this.#_id === user.getId();
    }

    /**
     * Get user's ID.
     *
     * @return {ObjectId} User ID.
     */
    getId() {
	return this.#_id;
    }

    /**
     * Get user's email.
     *
     * @return {string} Email.
     */
    getEmail() {
	return this.#email;
    }

    /**
     * Get user's name.
     *
     * @return {string} Name.
     */
    getName() {
	return this.#name;
    }

    /**
     * Change user's name.
     *
     * @param {string} name - New name.
     */
    setName(name = "") {
	if (!name) {
	    throw new Error("User's new name is invalid");
	}

	this.#name = name;
    }

    /**
     * Get user's school year.
     * 
     * @return {string} School year.
     */
    getYear() {
	return this.#year;
    }

    /**
     * Change user's school year.
     *
     * @param {string} year - New school year.
     */
    setYear(year = "") {
	this.#year = year;
    }

    /**
     * Get user's major.
     * 
     * @return {string} User's major.
     */
    getMajor() {
	return this.#major;
    }

    /**
     * Change user's major.
     *
     * @param {string} major - New major.
     */
    setMajor(major = "") {
	this.#major = major;
    }

    /**
     * Get user's club memberships.
     *
     * @return {Object} Key-value pairs of club ID => member ID.
     */
    getMemberships() {
	return this.#memberships;
    }

    /**
     * Add new membership.
     *
     * @param {Club} club - Club to add to user's membership list.
     * @param {Member} member - Member to add to user's membership list.
     */
    addMembership(club, member) {
	const clubId = club.getId();
	const memberId = member.getMemberId();
	if (this.#memberships.hasOwnProperty(clubId)) {
	    throw new Error("User is already a member of the club");
	}

	this.#memberships[clubId] = memberId;
    }

    /**
     * Delete membership.
     *
     * @param {Club} club - Club to remove from user's membership list.
     */
    delMembership(club) {
	const clubId = club.getId();
	if (!this.#memberships.hasOwnProperty(clubId)) {
	    throw new Error("User is not a member of the club");
	}

	delete this.#memberships[clubId];
    }

    /**
     * Add new review.
     *
     * @param {Club} club - Club to submit review to.
     * @param {Review} review - Review user wishes to submit.
     */
    addReview(club, review) {
	club.addReview(this, review);
    }
    
    /**
     * Delete review.
     *
     * @param {Club} club - Club the user wishes to delete a review from.
     */
    delReview(club) {
	club.delReview(this);
    }

    /**
     * Send application to respective club.
     *
     * @param {Club} club - Club user is applying to.
     */
    applyToClub(club) {
        club.addApplication(this);
    }

    /**
     * Get user's feedback on reviews.
     *
     * @return {Object} Review feedback.
     */
    getReviewFeedback() {
	return this.#feedback.reviews;
    }

    /**
     * Add review feedback.
     *
     * @param {Review} review - Review to provide feedback to.
     * @param {number} feedback - +1 (like) or -1 (dislike).
     */
    addReviewFeedback(review, feedback) {
	if (feedback !== 1 && feedback !== -1) {
	    throw new Error("Review feedback must be either 1 or -1");
	}

	this.#feedback.reviews[review.getId()] = feedback;
	if (feedback === 1) {
	    review.like();
	} else if (feedback === -1) {
	    review.dislike();
	}
    }

    /**
     * Delete review feedback.
     *
     * @param {Review} review - Review to delete feedback.
     */
    delReviewFeedback(review) {
	const feedback = this.#feedback.reviews[review.getId()];
	if (feedback === 1) {
	    review.dislike();
	} else if (feedback === -1) {
	    review.like();
	}

	delete this.#feedback.reviews[review.getId()];
    }

    /**
     * Get user's feedback on events.
     *
     * @return {Object} Event feedback.
     */
    getEventFeedback() {
	return this.#feedback.events;
    }

    /**
     * Add event feedback.
     *
     * @param {Event} event - Event to like.
     */
    addEventFeedback(event) {
	this.#feedback.events[event.getId()] = 1;
	event.like();
    }

    /**
     * Delete event feedback.
     *
     * @param {Object} event - Event to unlike.
     */
    delEventFeedback(event) {
	event.unlike();
	delete this.#feedback.events[event.getId()];
    }

    /**
     * Convert this user to a JSON document.
     *
     * @return {Object} JSON representation of the user.
     */
    toJson() {
	return {
	    _id: this.#_id,
	    email: this.#email,
	    name: this.#name,
	    year: this.#year,
	    major: this.#major,
	    memberships: this.#memberships,
	    feedback: this.#feedback,
	}
    }
}

export default User;
