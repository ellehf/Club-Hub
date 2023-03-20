/**
 * @file Event definition.
 */

import { v4 as uuidv4 } from "uuid";

class Event {
    #_id;
    #title;
    #info;
    #photo;
    #caption;
    #views;
    #likes;

    /**
     * Constructs an instance of Event.
     *
     * @param {string} _id - Unique event ID.
     * @param {string} title - Title of event.
     * @param {string} info - Event information.
     * @param {string} photo - Photo URL.
     * @param {string} caption - Photo caption.
     * @param {number} views - Number of views.
     * @param {number} likes - Number of likes.
     */
    constructor(
	_id = uuidv4(),
	title = "",
	info = "",
	photo = "",
	caption = "",
	views = 0,
	likes = 0,
    ) {
	if (!title) {
	    throw new Error("Must provide an event title");
	}

	this.#_id = _id;
	this.#title = title;
	this.#info = info;
	this.#photo = photo;
	this.#caption = caption;
	this.#views = views;
	this.#likes = likes;
    }

    /**
     * Checks whether two events are equal.
     *
     * @param {Event} event - Event to compare with.
     * @return {boolean} Whether the two events are equal.
     */
    equals(event) {
	return this.#_id === event.getId();
    }

    /**
     * Get event ID.
     *
     * @return {string} Event ID.
     */
    getId() {
	return this.#_id;
    }

    /**
     * Get event title.
     *
     * @return {string} Event title.
     */
    getTitle() {
	return this.#title;
    }

    /**
     * Change event title.
     *
     * @param {string} title - New event title.
     */
    setTitle(title = "") {
	if (!title) {
	    throw new Error("The event's new title is invalid");
	}

	this.#title = title;
    }

    /**
     * Get event information.
     *
     * @return {string} Event information.
     */
    getInfo() {
	return this.#info;
    }

    /**
     * Change event information.
     *
     * @param {string} info - New event information.
     */
    setInfo(info = "") {
	this.#info = info;
    }

    /**
     * Get photo associated with event.
     *
     * @return {string} Photo URL.
     */
    getPhoto() {
	return this.#photo;
    }

    /**
     * Change photo associated with event.
     *
     * @param {string} photo - New photo URL.
     */
    setPhoto(photo = "") {
	this.#photo = photo;
    }

    /**
     * Get photo's caption.
     *
     * @return {string} Photo caption.
     */
    getCaption() {
	return this.#caption;
    }

    /**
     * Change photo's caption.
     *
     * @param {string} caption - New photo's caption.
     */
    setCaption(caption = "") {
	this.#caption = caption;
    }

    /**
     * Get event's number of views.
     *
     * @return {number} Number of views.
     */
    getViews() {
	return this.#views;
    }

    /**
     * Increase number of views by 1.
     */
    view() {
	this.#views++;
    }

    /**
     * Get event's number of likes.
     *
     * @return {number} Number of likes.
     */
    getLikes() {
	return this.#likes;
    }

    /**
     * Increase number of likes by 1.
     */
    like() {
	this.#likes++;
    }

    /**
     * Decrease number of likes by 1.
     */
    unlike() {
	this.#likes--;
    }

    /**
     * Convert this event to a JSON document.
     *
     * @return {Object} JSON representation of the event.
     */
    toJson() {
	return {
	    _id: this.#_id,
	    title: this.#title,
	    info: this.#info,
	    photo: this.#photo,
	    caption: this.#caption,
	    views: this.#views,
	    likes: this.#likes,
	};
    }
}

export default Event;
