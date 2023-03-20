/**
 * @file Conversions from a JSON document to an instance of a class.
 */

import Club from "./club";
import Member from "./member";
import Review from "./review";
import Event from "./event";
import User from "./user";

/**
 * Convert a MongoDB JSON document into an instance of Club.
 *
 * @param {Object} document - MongoDB JSON document.
 * @return {Club} Instance of Club created from document.
 */
function toClub(document) {
    const {
	_id,
	name,
	members,
	location,
	time,
	tags,
	logo,
	photos,
	contact,
	website,
	news,
	applications
    } = document;

    return new Club(
	_id,
	name,
	members.map((member) => toMember(member)),
	location,
	time,
	tags,
	logo,
	photos,
	contact,
	website,
	news.map((event) => toEvent(event)),
	applications,
    );
}

/**
 * Convert a MongoDB JSON document into an instance of Member.
 *
 * @param {Object} document - MongoDB JSON document.
 * @return {Member} Instance of Member created from the document.
 */
function toMember(document) {
    const { memberId, userId, clubPosition, review } = document;
    return new Member(
	memberId,
	userId,
	clubPosition,
	review ? toReview(review) : review,
    );
}

/**
 * Convert a MongoDB JSON document into an instance of Review.
 *
 * @param {Object} document - MongoDB JSON document.
 * @return {Review} Instance of Review created from the document.
 */
function toReview(document) {
    const { _id, rating, info, likes, dislikes } = document;
    return new Review(
	_id,
	rating,
	info,
	likes,
	dislikes,
    );
}

/**
 * Convert a MongoDB JSON document into an instance of Event.
 *
 * @param {Object} document - MongoDB JSON document.
 * @return {Event} Instance of Event created from the document.
 */
function toEvent(document) {
    const { _id, title, info, photo, caption, views, likes } = document;
    return new Event(
	_id,
	title,
	info,
	photo,
	caption,
	views,
	likes,
    );
}

/**
 * Convert a MongoDB JSON document into an instance of User.
 *
 * @param {Object} document - MongoDB JSON document.
 * @return {User} Instance of User created from the document.
 */
function toUser(document) {
    const { _id, email, name, year, major, memberships, feedback } = document;
    return new User(
	_id,
	email,
	name,
	year,
	major,
	memberships,
	feedback,
    );
}

export { toClub, toMember, toReview, toEvent, toUser };
