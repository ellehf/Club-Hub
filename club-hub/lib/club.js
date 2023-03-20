/**
 * @file Club definition.
 */

import { v4 as uuidv4 } from "uuid";
import ROLES from "./roles";

class Club {
    #_id;
    #name;
    #members;
    #location;
    #time;
    #tags;
    #logo;
    #photos;
    #contact;
    #website;
    #news;
    #applications;

    /**
     * Constructs an instance of Club.
     *
     * @param {string} _id - Unique club ID.
     * @param {string} name - Name of club.
     * @param {Member[]} members - List of members in club.
     * @param {string} location - Meeting location.
     * @param {string} time - Meeting time.
     * @param {string[]} tags - List of club tags.
     * @param {string} logo - Club logo URL.
     * @param {string[]} photos - List of club photo URLs.
     * @param {string} contact - Club email contact info.
     * @param {string} website - Link to main club website.
     * @param {Event[]} news - List of club events.
     * @param {string[]} applications - List of user IDs of those who submitted an application.
     */
    constructor(
	_id = uuidv4(),
	name = "",
	members = [],
	location = "",
	time = "",
	tags = [],
	logo = "",
	photos = [],
	contact = "",
	website = "",
	news = [],
	applications = [],
    ) {
	if (!name) {
	    throw new Error("Invalid club name");
	}

	if (members.length < 1) {
	    throw new Error("A club must have at least one member");
	}

	const hasPresident = members.some((member) => member.isPresident());
	if (!hasPresident) {
	    throw new Error("A club must have at least one president");
	}

	this.#_id = _id;
	this.#name = name;
	this.#members = members;
	this.#location = location;
	this.#time = time;
	this.#tags = tags;
	this.#logo = logo;
	this.#photos = photos;
	this.#contact = contact;
	this.#website = website;
	this.#news = news;
        this.#applications = applications;
    }

    /**
     * Check whether two clubs are equal.
     *
     * @param {Club} club - Club to compare with.
     * @return {boolean} Whether the two clubs are equal.
     */
    equals(club) {
	return this.#_id === club.getId();
    }

    /**
     * Get unique club ID.
     *
     * @return {string} Club ID.
     */
    getId() {
	return this.#_id;
    }

    /**
     * Get name of club.
     *
     * @return {string} Name of club.
     */
    getName() {
	return this.#name;
    }

    /**
     * Change club name.
     *
     * @param {string} name - New club name.
     */
    setName(name = "") {
	if (!name) {
	    throw new Error("Invalid club name");
	}

	this.#name = name;
    }

    /**
     * Get list of presidents.
     *
     * @return {Member[]} List of presidents.
     */
    getPresidents() {
	return this.#members.filter((member) => member.isPresident());
    }

    /**
     * Promote member to club president.
     *
     * @param {Member} member - Member to promote to president.
     */
    addPresident(member) {
	if (member.isPresident()) {
	    throw new Error("Member is already a president");
	}

	member.setClubPosition(ROLES.PRESIDENT);
    }

    /**
     * Demote a club president.
     *
     * @param {Member} president - President to demote to lower club position.
     */
    delPresident(president) {
	if (!president.isPresident()) {
	    throw new Error("Member is not a president");
	}

	let presidents = this.getPresidents();
	if (presidents.length === 1) {
	    throw new Error("Club must have at least one active president");
	}

	president.setClubPosition(ROLES.MEMBER);
    }

    /**
     * Get list of members.
     *
     * @return {Member[]} List of members.
     */
    getMembers() {
	return this.#members;
    }

    /**
     * Check whether a Member instance is a member of the club.
     *
     * @param {Member} member - Member to look for in list.
     * @return {boolean} Whether a member is a part of the club.
     */
    isMember(member) {
	return this.#members.some((m) => m.equals(member));
    }

    /**
     * Add member to the club.
     *
     * @param {User} applicant - User who submitted an application to join club.
     */
    addMember(applicant) {
	const applicantId = applicant.getId();
	const hasApplication = this.#applications.some((application) => application === applicantId);
	if (!hasApplication) {
	    throw new Error("The user has not submitted an application for this club");
	}

	const memberships = applicant.getMemberships();
	if (memberships.hasOwnProperty(this.#_id)) {
	    throw new Error("Applicant already has membership for this club");
	}

	const member = new Member(crypto.randomUUID(), applicantId);
	this.#members.push(member);
	applicant.addMembership(this, member);
    }

    /**
     * Remove member from club.
     *
     * @param {User} user - User to remove from the club.
     */
    delMember(user) {
	if (this.#members.length === 1) {
	    throw new Error("A club must have at least one member");
	}

	const memberships = user.getMemberships();
	if (!memberships.hasOwnProperty(this.#_id)) {
	    throw new Error("User does not have membership for this club");
	}

	const memberId = memberships[this.#_id];
	const index = this.#members.findIndex((member) => member.getMemberId() === memberId);
	if (index < 0) {
	    throw new Error("Member does not exist");
	}

	this.#members.splice(index, 1);
	user.delMembership(this);
    }

    /**
     * Get meeting location.
     *
     * @return {string} Meeting location.
     */
    getLocation() {
	return this.#location;
    }

    /**
     * Change meeting location.
     *
     * @param {string} location - Club meeting location.
     */
    setLocation(location = "") {
	this.#location = location;
    }

    /**
     * Get meeting time.
     *
     * @return {string} Meeting time.
     */
    getTime() {
	return this.#time;
    }

    /**
     * Change meeting time.
     *
     * @param {string} time - Club meeting time.
     */
    setTime(time = "") {
	this.#time = time;
    }

    /**
     * Get list of club tags.
     *
     * @return {string[]} Club tags.
     */
    getTags() {
	return this.#tags;
    }

    /**
     * Add club tag.
     *
     * @param {string} Club tag to add.
     */
    addTag(tag) {
	const hasTag = this.#tags.some((t) => t === tag);
	if (hasTag) {
	    throw new Error("Club already contains the tag");
	}

	this.#tags.push(tag);
    }

    /**
     * Remove club tag.
     *
     * @param {string} Club tag to remove.
     */
    delTag(tag) {
	const index = this.#tags.findIndex((t) => t === tag);
	if (index < 0) {
	    throw new Error("Club does not contain the tag");
	}

	this.#tags.splice(index, 1);
    }

    /**
     * Get club logo.
     *
     * @return {string} Club logo URL.
     */
    getLogo() {
	return this.#logo;
    }

    /**
     * Set club logo.
     *
     * @param {string} logo - New club logo.
     */
    setLogo(logo = "") {
	this.#logo = logo;
    }

    /**
     * Get list of photo URLs.
     *
     * @return {string[]} List of photo URLs.
     */
    getPhotos() {
	return this.#photos;
    }

    /**
     * Add a link to a photo to the list of photos.
     *
     * @param {string} photo - Photo URL.
     */
    addPhoto(photo) {
	const hasPhoto = this.#photos.some((p) => p === photo);
	if (hasPhoto) {
	    throw new Error("Photo already exists");
	}

	this.#photos.push(photo);
    }

    /**
     * Remove photo URL from list of URLs.
     *
     * @param {string} photo - Photo URL.
     */
    delPhoto(photo) {
	const index = this.#photos.findIndex((p) => p === photo);
	if (index < 0) {
	    throw new Error("Photo does not exist");
	}

	this.#photos.splice(index, 1);
    }

    /**
     * Get club contact information.
     *
     * @return {string} - Club email information.
     */
    getContact() {
	return this.#contact;
    }

    /**
     * Change club contact information.
     *
     * @param {string} contact - New club email information.
     */
    setContact(contact = "") {
	this.#contact = contact;
    }

    /**
     * Get club website link.
     *
     * @return {string} - Club website link.
     */
    getWebsite() {
	return this.#website;
    }

    /**
     * Change club website information.
     *
     * @param {string} website - New club website link.
     */
    setWebsite(website = "") {
	this.#website = website;
    }

    /**
     * Get club news.
     *
     * @return {Event[]} - List of club events.
     */
    getNews() {
	return this.#news;
    }

    /**
     * Add event to club news.
     *
     * @param {Event} event - New event to add to club news.
     */
    addEvent(event) {
	const hasEvent = this.#news.some((e) => e.equals(event));
	if (hasEvent) {
	    throw new Error("Event already exists");
	}

	this.#news.push(event);
    }

    /**
     * Event to remove from club news.
     *
     * @param {Event} event - Event to be deleted from club news.
     */
    delEvent(event) {
	const index = this.#news.findIndex((e) => e.equals(event));
	if (index < 0) {
	    throw new Error("Event does not exist");
	}

	this.#news.splice(index);
    }

    /**
     * Get list of reviews.
     *
     * @return {Review[]} List of reviews.
     */
    getReviews() {
	const reviews = [];
	this.#members.forEach((member) => {
	    const review = member.getReview();
	    if (review) {
		reviews.push(review);
	    }
	});

	return reviews;
    }

    /**
     * Add member's review.
     *
     * @param {User} user - User who submitted a review for the club.
     * @param {Review} review - New review.
     */
    addReview(user, review) {
	const memberships = user.getMemberships();
	if (!memberships.hasOwnProperty(this.#_id)) {
	    throw new Error("User does not have membership for this club");
	}

	const memberId = memberships[this.#_id];
	const member = this.#members.find((member) => member.getMemberId() === memberId);
	if (!member) {
	    throw new Error("The user is not a member of the club");
	}

	member.addReview(review);
    }

    /**
     * Delete member's review.
     *
     * @param {User} user - User who submitted a review for the club.
     */
    delReview(user) {
	const memberships = user.getMemberships();
	if (!memberships.hasOwnProperty(this.#_id)) {
	    throw new Error("User does not have membership for this club");
	}

	const memberId = memberships[clubId];
	const member = this.#members.find((member) => member.getMemberId() === memberId);
	if (!member) {
	    throw new Error("The user is not a member of the club");
	}

	member.delReview();
    }

    /**
     * Get average rating of all reviews.
     *
     * @return {number} Average rating.
     */
    getRating() {
	const reviews = this.getReviews();
	const totalRating = reviews.reduce((accumulator, review) => accumulator + review.getRating(), 0);
	return totalRating / reviews.length;
    }

    /**
     * Get list of applications to club.
     *
     * @return {string[]} List of applicant user IDs.
     */
    getApplications() {
        return this.#applications;
    }

    /**
     * Add applicant to applications list.
     * 
     * @param {User} applicant - Applicant to add to applications list.
     */
    addApplication(applicant) {
	const applicantId = applicant.getId();
	const hasApplication = this.#applications.some((application) => application === applicantId);
	if (hasApplication) {
	    throw new Error("Applicant has already applied to this club");
	}

        this.#applications.push(applicantId);
    }

    /**
     * Remove applicant from applications list.
     * 
     * @param {User} applicant - Applicant to remove from applications list.
     */
    delApplication(applicant) {
	const applicantId = applicant.getId();
	const index = this.#applications.findIndex((application) => application === applicantId);
	if (index < 0) {
	    throw new Error("Application does not exist");
	}

	this.#applications.splice(index, 1);
    }

    /**
     * Get club population.
     *
     * @return {number} Club size.
     */
    getSize() {
        return this.#members.length;
    }

    /**
     * Disband club.
     */
    disband() {
	// TODO: Query API with fetch
    }

    /**
     * Convert this club to a JSON document.
     *
     * @return {Object} JSON representation of the club.
     */
    toJson() {
	return {
	    _id: this.#_id,
	    name: this.#name,
	    members: this.#members.map((member) => member.toJson()),
	    location: this.#location,
	    time: this.#time,
	    tags: this.#tags,
	    logo: this.#logo,
	    photos: this.#photos,
	    contact: this.#contact,
	    website: this.#website,
	    news: this.#news.map((event) => event.toJson()),
	    applications: this.#applications,
	};
    }
}

export default Club;
