import React from 'react';
import { useRouter } from 'next/router';
import {useSession, signOut, getSession} from 'next-auth/react';
import Navbar from "../../components/taskBar.js";
import clubOverview from '../../components/clubOverview';
import styles from "../../styles/account.module.css"
import reviewOverview from '../../components/reviewOverview.js';
import findUserByEmail from '../api/users/email/index.js';
import { getClubList } from '../api/clubs/index.js';
import getRating from '../../lib/club.js';
import { toClub } from '/lib/conversions';

//This is our account page

/**
 *
 * @returns {JSX.Element}
 */
const account = ({clubs, reviews}) => {
  const {data: session, status} = useSession();
  const router = useRouter();

  if (status === 'authenticated') {

    //Get club list for user
    //Return list of clubs user is a part of in this object

    var clublist = [];
    for(let i = 0; i < clubs.length; i++){
        const club = toClub(clubs[i]);
        console.log(club.getRating());
        clublist.push(clubOverview(club.getName(), club.getRating(), club.getLogo(), `/clubs/${club.getId()}`));
    }

    //Get review list for user:
    //Return review overview item

    var reviewlist = [];
    
    for(let i = 0; i < reviews.length; i++){
        let j = reviews[i][1];
        let title = reviews[i][0];
        let rating = j['rating'];
        let info = j["info"];
        reviewlist.push(reviewOverview(title, info, rating));
    }


    return (
    <div> 
        <Navbar/>
        <div className = {styles.gridcontainer}>
            <div className={styles.topzone}>
                <div className={styles.contained}>
                    <img className src = {session.user.image} />
                </div>
                <div className={styles.contained}>
                    <h1 class>
                        Welcome {parse_name(session.user.name)}
                    </h1>
                </div>
                <div className={styles.contained}>
                    <button className = {styles.signOutHome} onClick={() => createClub()}>Create Club</button>
                    
                </div>
                <div className={styles.contained}>
                    <button className = {styles.signOutHome} onClick={() => settings()}>Settings</button>
                    
                </div>
                <div className={styles.contained}>
                    <button className = {styles.signOutHome} onClick={() => signOut()}>Sign out</button>
                    
                </div>
            </div>
        
            <div className={styles.clubzone}>
                <h1 className={styles.colheader}>Clubs: </h1>
                {clublist}
            </div>
            <div className={styles.reviewzone}>
                <h1  className={styles.colheader}>Reviews: </h1>
                {reviewlist}
            </div> 
        </div>
    </div>
    );
  } else {
    return (
        <div>
            <p>You are not signed in.</p>
        </div>
    );
  }
};

export default account;

/**
 *
 * @param context
 * @returns {Promise<{props: {session: Session}}|{redirect: {destination: string}}>}
 */
export const getServerSideProps = async (context) => {
    const session = await getSession(context);
        if (!session) {
            return {
                redirect: {
                    destination: '/login'
                }
            }
        }
        else{
            const user = await findUserByEmail(session.user.email);
            
            if(user){
                const id = user.toJson()["_id"];
                const clubdata = await getClubList();
                let mydata = []
                for(let i = 0; i < clubdata.length; i++){
                    let addj = clubdata[i].toJson();
                    mydata.push(addj)
                }
                let clublist = [];
                let reviewlist = [];
                for(let i = 0; i < mydata.length; i++){
                    let addj = mydata[i]["members"];
                    for(let j = 0; j < addj.length; j++){
                        if(addj[j]["userId"] == id){
                            clublist.push(mydata[i])
                            if(addj[j]["review"] != null){
                                reviewlist.push([mydata[i]["name"], addj[j]["review"]])
                            }
                        }
                    }
                }
                return{
                    props: {reviews: reviewlist, clubs: clublist, session}
                }
            }
        }
    return {    
        props: {session},
    };
};

//Return first name with correct capitalization.
function parse_name(name){
    var text;
    text = name.split(" ");
    if(text.length > 0){
        return(text[0].charAt(0).toUpperCase() + text[0].slice(1).toLowerCase());
    }else{
        return(name);
    }
}

//Redirect users to settings page
function settings(){
    location.href = "/settings"
    return true;
}

function createClub(){
    location.href = "/create_club"
    return true;
}





/*


export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("nextjs-mongodb-demo");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("posts").insertOne(bodyObject);
      res.json(myPost.ops[0]);
      break;
    case "GET":
      const allPosts = await db.collection("allPosts").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
}


export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("sample_mflix");

       const movies = await db
           .collection("movies")
           .find({})
           .sort({ metacritic: -1 })
           .limit(10)
           .toArray();

       res.json(movies);
   } catch (e) {
       console.error(e);
   }
};

*/
