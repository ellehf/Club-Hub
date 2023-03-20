import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from "next/link"
import React from 'react'
import cp from '../../styles/clubpage.module.css'
import findClubById from "../api/clubs/id";
import findUserByEmail from '/pages/api/users/email';
import Navbar from "../../components/taskBar";
import Member from '/lib/member';
import { toEvent, toUser, toReview, toClub } from "../../lib/conversions";
import Review from '/lib/review';

function getStars(rating){
    let stars = [5];
    for(let i = 0; i < 5; i++){
        if(rating > i){
            stars[i] = <div class={cp.fullStar}/>
        }else{
            stars[i] = <div class={cp.emptyStar}/>
        }
    }
    return stars;
}

async function Like(id="") {
    const filter = { 'members.review._id': id };
        const update = { $inc: { 'members.$.review.likes': 1 } };
        await fetch('/api/clubs', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter, update }),
        });
}

async function Dislike(id="") {
    const filter = { 'members.review._id': id };
        const update = { $inc: { 'members.$.review.dislikes': 1 } };
        await fetch('/api/clubs', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter, update }),
        });
}

function createReviewsItem(reviewInfo="", like=0, dislike=0, star=[], id=""){
    return (
        <div className={cp.eachReview}>
            {star} <br />
            <br /> {reviewInfo} <br />
            <br /> <i class="fa fa-thumbs-up" onClick = {() => Like(id)}></i> {like} &emsp; <i class="fa fa-thumbs-down" onClick = {() => Dislike(id)}></i> {dislike}  <br />
        </div>
    );
}

function createReviewsItems(ratings, reviewInfos, likes, dislikes, reviewIds){
    let reviewsList = [];
    for(let i = 0; i < reviewInfos.length; i++){
        const reviewInfo = reviewInfos[i];
        const like = likes[i];
        const dislike = dislikes[i];
        const star = getStars(ratings[i]);
        const id = reviewIds[i];
        const reviewItem = createReviewsItem(reviewInfo, like, dislike, star, id);
        reviewsList.push(reviewItem);
    }
    return reviewsList;
}

/**
 *
 * @returns {JSX.Element}
 */
function Clubs({ club, user }){
    //Set club attributes
    const thisClub = toClub(club);
    let size = thisClub.getMembers().length;
    let clubPhotos = thisClub.getPhotos();
    let tags = thisClub.getTags();
    let email = thisClub.getContact();
    let newsList = thisClub.getNews();
    let reviewList = thisClub.getReviews();

    if (clubPhotos.length == 0){
        console.log('this club has no photos')
        clubPhotos = ['https://as1.ftcdn.net/v2/jpg/02/48/42/64/1000_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'] 
    }

    //Retreive list of news
    let news = [];
    for (let k = 0; k < newsList.length; k++)
        news.push(newsList[k].toJson());

    let titles = [];
    let photos = [];
    let newsInfo = [];
    let newsId = [];
    for (let i = 0; i< news.length; i++) {
        let currJ = news[i];
        let currE = toEvent(currJ);
        titles.push(currE.getTitle());
        photos.push(currE.getPhoto());
        newsInfo.push(currE.getInfo());
        newsId.push(currE.getId());
    }

    var this_news = (
        <div>

        </div>
    )
    if (newsInfo.length > 0){

        var this_news_arr = []

        for(let i = 0; i < titles.length; i++){
            const news_item = (
                <span className = {cp.newsitemcontainer}>
                    <Link href = {"../news/" + newsId[i].replace(/\s+/g, '-')} >
                            {titles[i]} <br />
                            <br /> <img src={photos[i]} width={250}/> <br />
                            <br /> {newsInfo[i]} <br />
                        </Link>
                </span>
                
            )

            const spacer = (
                <div>

                </div>
            )
            this_news_arr.push(news_item)
            this_news_arr.push(spacer)
        }
        /*
        this_news = (
            <Link href = {"../news/" + newsId[0].replace(/\s+/g, '-')}>
                            {titles[0]} <br />
                            <br /> <img src={photos[0]} width={250}/> <br />
                            <br /> {newsInfo[0]} <br />
                        </Link>
        )
        */
       this_news = this_news_arr;
    }

    if (newsInfo.length == 0){
        console.log('no news')
    }
    /*
    <Link href = {"../news/" + newsId[0].replace(/\s+/g, '-')}>
                            {titles[0]} <br />
                            <br /> <img src={photos[0]} width={250}/> <br />
                            <br /> {newsInfo[0]} <br />
                        </Link>
    */

    //Retrieve list of reviews
    let reviews = [];
    for (let k = 0; k < reviewList.length; k++)
        reviews.push(reviewList[k].toJson());

    let ratings = [];
    let reviewInfos = [];
    let likes = [];
    let dislikes = [];
    let stars = [];
    let reviewIds = []
    for (let i = 0; i< reviews.length; i++) {
        let currR = reviews[i];
        let currRe = toReview(currR);
        ratings.push(currRe.getRating());
        reviewInfos.push(currRe.getInfo());
        likes.push(currRe.getLikes());
        dislikes.push(currRe.getDislikes());
        reviewIds.push(currRe.getId());

    }

    const router = useRouter();
    const thisUser = toUser(user);
    const isMember = thisClub.getMembers().some((member) => member.getUserId() === thisUser.getId());
    const isPresident = thisClub.getPresidents().some((president) => president.getUserId() === thisUser.getId());
 
    const handleSubmit = async (event) => {
        event.preventDefault();

        const rating = Number(event.target.stars.value);
        const info = event.target.info.value;
        const review = new Review(undefined, rating, info);
        const filter = { _id: thisClub.getId(), 'members.userId': thisUser.getId() };
        const update = { $set: { 'members.$.review': review.toJson() } };
        await fetch('/api/clubs', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter, update }),
        });

        router.reload();
    }

    const join = async (event) => {
        event.preventDefault();

        const member = new Member(undefined, thisUser.getId());
        const clubFilter = { _id: thisClub.getId() };
        const clubUpdate = { $push: { members: member.toJson() } };
        await fetch('/api/clubs', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter: clubFilter, update: clubUpdate }),
        });

        const userFilter = { _id: thisUser.getId() };
        const userUpdate = { $set: { [`memberships.${thisClub.getId()}`]: member.getMemberId() } };
        await fetch('/api/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter: userFilter, update: userUpdate }),
        });

        router.reload();
    }
    //let stars = getStars(rating[0]);

    //tags sectiom
    let curr_club_tags = ""
    for(let i = 0; i < tags.length; i++){
        curr_club_tags = curr_club_tags + tags[i]
        if (i < tags.length-1){
            curr_club_tags = curr_club_tags + ', '
        }
    }

    return(
        <React.Fragment>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                </link>
            </head>
            <body>
            <Navbar/>

		<div className={cp.clubInfoContainer}>
                <div className={cp.clubImage}>
                    <img src={clubPhotos[0]} width={500}/>
                </div>

                <div className={cp.clubInfo}>
                    <div className={cp.clubTitle}>
                        {thisClub.getName()}
                    </div>

                    <br /> Club Population: {size} <br />

                    <br /> Meeting Time: {thisClub.getTime()} <br />

                    <br /> Meeting Location: {thisClub.getLocation()} <br />

                    <br /> Website: <Link href={thisClub.getWebsite()} > {thisClub.getWebsite()} </Link> <br />

                    <br /> Tags:  {curr_club_tags} <br />


                    <div className={cp.contactClubContainer}>
                        <a href={`mailto:${thisClub.getContact()}`}>
                            <div className ={cp.contactClub}>
                                Contact
                            </div>
                        </a>
                    </div>
		    <br />
		    { isPresident
		      ? <Link className={cp.manage} href={`./management/${thisClub.getId()}`}>Manage Club</Link>
		      : <React.Fragment />
		    }
                </div>

                <div className={cp.newsContainer}>
                    <div className={cp.newsTitle}>
                        Recent News
                    </div>

                    <div className={cp.news}>

                        {this_news}
                    </div>
                </div>


            </div>

            <div className={cp.secondRowContainer}>
                <div className={cp.leaveReviewTitle}>
                    Leave a Review!
                </div>

                <div className={cp.reviewTitle}>
                    Reviews
                </div>
            </div>

            <div className={cp.reviewsContainer}>
                <div className={cp.reviews}>
                    { isMember
                        ? <form method="post" onSubmit={handleSubmit}>
                            <label htmlFor="stars">Choose a rating:     </label>
                            <select name="stars" className={cp.input}>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            <div className={cp.input}>
                                <textarea name='info' placeholder="This club is..." rows = "5" cols = "50" className={cp.textarea}></textarea>
                            </div>
                            <button type="submit" className={cp.submit}>Submit</button>
                        </form>
                        : <button type='submit' className={cp.submit} onClick={join}>Join this club to leave a review</button>
                    }
                </div>

                <div className={cp.reviews}>
                    <br /> {createReviewsItems(ratings, reviewInfos, likes, dislikes, reviewIds)}  <br />
                </div>

            </div>
            </body>
        </React.Fragment>
    )
}

async function getServerSideProps(context) {
    const { id } = context.params;
    const session = await getSession(context);
    const clubData = await findClubById(id);
    const userData = await findUserByEmail(session.user.email);
    return {props: { club: clubData.toJson(), user: userData.toJson() }}
}

export { getServerSideProps };
export default Clubs;



