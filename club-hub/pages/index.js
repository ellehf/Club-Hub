/**
 * @file Implementation of homepage.
 */

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import placeholderPhoto from '../public/placeholderphoto.jpeg';
import { getClubList } from './api/clubs/';
import { toEvent } from "/lib/conversions";
import EventCard from '/components/event-card';

/**
 * Get today's date.
 *
 * @return {string} Today's date in a string format.
 */
function getToday() {
  const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  };

  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  };

  const date = new Date();
  const dayOfMonth = date.getDate();
  const dayOfWeek = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${days[dayOfWeek]}, ${months[month]} ${dayOfMonth}, ${year}`;
}

/**
 * Display ClubHub homepage.
 *
 * @return {ReactElement} - Home page to be displayed.
 */
function Home({news}) {
  const ids = [];
  let titles = [];
  let photos = [];
  let captions = [];
  for (let i = 0; i< 3; i++){
    let currJ = news[i];
    let currE = toEvent(currJ);
    ids.push(currE.getId());
    titles.push(currE.getTitle());
    photos.push(currE.getPhoto());
    captions.push(currE.getCaption());
  }
  
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    router.push(`./searchresults/${name}`);
    console.log('handle submit');
  }
    
  return (
    <React.Fragment>
      <Head>
	<title>Club Hub: Home</title>
	<meta charSet='utf-8' />
	<meta name='description' content='Find, join, and review your favorite UCLA clubs' />
	<meta name='viewport' content='initial-scale=1.0, width=device-width' />
	<link rel='icon' href='/favicon.ico' />
      </Head>

      <div id={styles.header}>
	<div id={styles.date}>
          {getToday()}
	</div>

	<div>
	  {session
	   ? <Link href='./account' id={styles.accountButton}>
	       <img src={session.user.image} id={styles.profileImage} referrerPolicy='no-referrer' />
	       {session.user.name}
	     </Link>
	   : <Link href="./login" id={styles.loginButton}>Login</Link>
	  }
	</div>
      </div>

      <div id={styles.logo}>
	<span id={styles.club}>CLUB.</span>
	<span id={styles.hub}>HUB</span>
      </div>

      <div id={styles.searchBarContainer}>
	<form method='get' onSubmit={handleSubmit}>
          <input type='search' id={styles.searchBar} name='name' placeholder="Find your next favorite club!" />
	</form>
      </div>

      <div id={styles.navigationContainer}>
        <Link href="./news" className = {styles.navigationChoice}>Recent News</Link>
	{session
	 ? <Link href="./account" className={styles.navigationChoice}>My Clubs</Link>
	 : <Link href="./login" className={styles.navigationChoice}>My Clubs</Link>
	}
        <Link href = "./clubs" className={styles.navigationChoice}>Browse Clubs</Link>
      </div>

      <div id={styles.newsContainer}>
	<EventCard id={ids[0]} title={titles[0]} image={photos[0]} caption={captions[0]}/>
	<EventCard id={ids[1]} title={titles[1]} image={photos[1]} caption={captions[1]}/>
	<EventCard id={ids[2]} title={titles[2]} image={photos[2]} caption={captions[2]}/>
      </div>
    </React.Fragment>
  );
}

async function getServerSideProps() {
  let clubs = await getClubList();
  let news = [];
  
  for (let i = 0; i< 3; i++){
    news.push(clubs[i].getNews()[0].toJson());
  }
  

  return { props: { news: news } };
}


export default Home;
export { getServerSideProps };
