/**
 * @file Member definition.
 */

import { v4 as uuidv4 } from "uuid";
import ROLES from "./roles";

class Member {
    #memberId;
    #userId;
    #clubPosition;
    #review;

    /**
     * Constructs an instance of Member.
     *
     * @param {string} memberId - Unique member ID.
     * @param {string} userId - User ID of user associated with this member.
     * @param {string} clubPosition - Club position.
     * @param {Review} review - Club review.
     */
    constructor(
	memberId = uuidv4(),
	userId = "",
	clubPosition = ROLES.MEMBER,
	review = null,
    ) {
	if (!userId) {
	    throw new Error("A member must have a user ID");
	}

	this.#memberId = memberId;
        this.#userId = userId;
        this.#clubPosition = clubPosition;
	this.#review = review;
    }

    /**
     * Check whether two members are equal.
     *
     * @param {Member} member - Member to compare with.
     * @return {boolean} Whether two members are equal.
     */
    equals(member) {
	return this.#memberId === member.getMemberId();
    }

    /**
     * Get member ID.
     *
     * @return {string} Member ID.
     */
    getMemberId() {
	return this.#memberId;
    }

    /**
     * Get user ID of user associated with the member.
     *
     * @return {string} User ID.
     */
    getUserId() {
        return this.#userId;
    }

    /**
     * Get member's club position.
     *
     * @return {string} Member's position in club.
     */
    getClubPosition() {
        return this.#clubPosition;
    }

    /**
     * Change member's club position.
     *
     * @param {string} position - New club position.
     */
    setClubPosition(position) {
        this.#clubPosition = position;
    }

    /**
     * Get member's club review.
     *
     * @return {Review} Club review.
     */
    getReview() {
	return this.#review;
    }

    /**
     * Add review to member.
     *
     * @param {Review} review - New club review.
     */
    addReview(review) {
	this.#review = review;
    }

    /**
     * Update the review's rating and text content.
     *
     * @param {number} rating - Review rating from 1 to 5.
     * @param {string} info - Review text content.
     */
    updateReview(rating, info) {
	if (!this.#review) {
	    throw new Error("This member has not written a review");
	}

	if (rating) {
	    this.#review.setRating(rating);
	}

	if (info) {
	    this.#review.setInfo(info);
	}
    }

    /**
     * Delete review from member.
     */
    delReview() {
	this.#review = null;
    }

    /**
     * End club membership and remove member.
     *
     * @param {Club} club - Club a member would like to leave.
     */
    leaveClub(club) {
	if (this.isPresident()) {
	    club.delPresident(this);
	}

	club.delMember(this);
    }

    /**
     * Check whether member is a president of the club.
     *
     * @returns {boolean} Whether member is president.
     */
    isPresident() {
        return this.#clubPosition === ROLES.PRESIDENT;
    }

    /****************************************************************
     ******                                                    ******
     ******                 President Functions                ******
     ******                                                    ******
     ****************************************************************/

    /**
     * Update club name.
     *
     * @param {Club} club - Club being managed.
     * @param {string} name - New club name.
     */
    updateClubName(club, name) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

        club.setName(name);
    }

    /**
     * Update member's club position.
     * 
     * @param {Club} club - Club being managed.
     * @param {Member} member - Member to update position.
     * @param {string} position - New position.
     */
    updateMemberPosition(club, member, position) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	if (position === ROLES.PRESIDENT) {
	    club.addPresident(member);
	    return;
	}

	if (member.isPresident()) {
	    club.delPresident(member);
	}

	member.setClubPosition(position);
    }

    /**
     * Retire president to member.
     *
     * @param {Club} club - Club to retire from.
     */
    retire(club) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot retire as president from this club");
	}

        this.updateMemberPosition(club, this, ROLES.MEMBER);
    }

    /**
     * Kick out club member.
     *
     * @param {Club} club - Club being managed.
     * @param {Member} member - Member to remove.
     */
    kickMember(club, member) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

        member.leaveClub(club);
    }

    /**
     * Update club meeting location.
     *
     * @param {Club} club - Club being managed.
     * @param {string} location - New club meeting location.
     */
    updateMeetingLocation(club, location) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

        club.setLocation(location);
    }

    /**
     * Update club meeting time.
     *
     * @param {Club} club - Club being managed.
     * @param {string} time - New club meeting time.
     */
    updateMeetingTime(club, time) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

        club.setTime(time);
    }

    /**
     * Add club tag to club tag list.
     *
     * @param {Club} club - Club being managed.
     * @param {string} tag - Club tag to add.
     */
    addClubTag(club, tag) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.addTag(tag);
    }

    /**
     * Remove club tag from club tag list.
     *
     * @param {Club} club - Club being managed.
     * @param {string} tag - Club tag to remove.
     */
    delClubTag(club, tag) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.delTag(tag);
    }

    /**
     * Add club photo to club photo list.
     *
     * @param {Club} club - Club being managed.
     * @param {string} photo - Club photo to add.
     */
    addClubPhoto(club, photo) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.addPhoto(photo);
    }

    /**
     * Remove club photo from club photo list.
     *
     * @param {Club} club - Club being managed.
     * @param {string} photo - Club photo to remove.
     */
    delClubPhoto(club, photo) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.delPhoto(photo);
    }

    /**
     * Update club contact information.
     *
     * @param {Club} club - Club being managed.
     * @param {string} contact - New club contact information.
     */
    updateClubContact(club, contact) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.setContact(contact);
    }

    /**
     * Update club website link.
     *
     * @param {Club} club - Club being managed.
     * @param {string} website - New club website link.
     */
    updateClubWebsite(club, website) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.setWebsite(website);
    }

    /**
     * Add club event to news.
     *
     * @param {Club} club - Club being managed.
     * @param {Event} event - New event to add to club news.
     */
    addClubEvent(club, event) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.addEvent(event);
    }

    /**
     * Delete club event from news.
     *
     * @param {Club} club - Club being managed.
     * @param {Event} event - Event to remove from club news.
     */
    delClubEvent(club, event) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.delEvent(event);
    }

    /**
     * Accept and delete application.
     *
     * @param {Club} club - Club being managed.
     * @param {User} applicant - Applicant to accept.
     */
    acceptApplication(club, applicant) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.addMember(applicant);
	club.delApplication(applicant);
    }

    /**
     * Decline and delete application.
     *
     * @param {Club} club - Club being managed.
     * @param {User} applicant - Applicant to reject.
     */
    async declineApplication(club, applicant) {
	if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

        club.delApplication(applicant);
    }

    /**
     * Delete club.
     *
     * @param {Club} club - Club being managed.
     */
    disbandClub(club) {
        if (!club.isMember(this) || !this.isPresident()) {
	    throw new Error("This user cannot manage this club");
	}

	club.disband();
    }

    /**
     * Convert this member to a JSON document.
     *
     * @return {Object} JSON representation of the member.
     */
    toJson() {
	return {
	    memberId: this.#memberId,
	    userId: this.#userId,
	    clubPosition: this.#clubPosition,
	    review: this.#review ? this.#review.toJson() : this.#review,
	};
    }
}

export default Member;
