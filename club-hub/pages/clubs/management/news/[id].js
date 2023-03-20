/**
 * @file Club News Management component definition.
 */

import React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '/styles/ManagementNews.module.css';
import Navbar from '/components/taskBar';
import EventCard from '/components/event-card';
import findUserByEmail from '/pages/api/users/email';
import findClubById from '/pages/api/clubs/id';
import Event from '/lib/event';
import { toClub, toUser } from '/lib/conversions';

/**
 * Display club news management page.
 *
 * @return {ReactElement} Club News Management page to be displayed.
 */
function ManagementNews({ userData, clubData }) {
  const router = useRouter();
  const user = toUser(userData);
  const club = toClub(clubData);
    

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = event.target.title.value;
    const photo = event.target.image.value;
    const caption = event.target.caption.value;
    const info = event.target.info.value;
    const newEvent = new Event(undefined, title, info, photo, caption);

    const filter = { _id: club.getId() };
    const update = { $push: { news: newEvent.toJson() } };
    await fetch('/api/clubs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter, update }),
    });

    router.reload();
  };

  const handleDelete = async (event) => {
    const filter = { _id: club.getId() };
    const update = { $pull: { news: { _id: event.getId() } } };
    await fetch('/api/clubs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter, update }),
    });

    router.reload();
  };

  return (
    <React.Fragment>
      <Head>
	<title>Club Management: News</title>
	<meta charSet='utf-8' />
	<meta name='viewport' content='initial-scale=1.0, width=device-width' />
	<link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />
      <Link id={styles.back} href={`../${club.getId()}`}>Management Home</Link>
      <div id={styles.container}>
	<h1>Manage {club.getName()} News</h1>

	<form method='post' id={styles.form} onSubmit={handleSubmit}>
	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='title'>Title:</label>
	    <input className={styles.input} type='text' name='title' placeholder='Title' required />
	  </div>

	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='image'>Image:</label>
	    <input className={styles.input} type='text' name='image' placeholder='Image URL' />
	  </div>

	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='caption'>Caption:</label>
	    <input className={styles.input} type='text' name='caption' placeholder='Caption' />
	  </div>

	  <div className={styles.field}>
	    <p className={styles.label}>Info:</p>
	    <textarea rows='5' cols='80' name='info' placeholder='Info' />
	  </div>

	  <button id={styles.addEvent} type='submit'>Add Event</button>
	</form>

	<div id={styles.eventList}>
	  {
	    club.getNews().map((event) => {
	      return (
		<React.Fragment>
		  <EventCard id={event.getId()} title={event.getTitle()} image={event.getPhoto()} caption={event.getCaption()}/>
		  <input type='button' className={styles.deleteButton} value='Delete' onClick={() => handleDelete(event)} />
		</React.Fragment>
	      );
	    })
	  }
	</div>
      </div>
    </React.Fragment>
  );
}

async function getServerSideProps(context) {
  const session = await getSession(context);
  const { id } = context.params;

  if (!session) {
    return {
      redirect: {
	destination: '/login',
	permanent: false,
      },
    };
  }

  const user = await findUserByEmail(session.user.email);
  const club = await findClubById(id);
  const memberships = user.getMemberships();
  const memberId = memberships[club.getId()];

  if (memberId) {
    const presidents = club.getPresidents();
    for (let i = 0; i < presidents.length; i++) {
      if (presidents[i].getMemberId() === memberId) {
	return {
	  props: {
	    userData: user.toJson(),
	    clubData: club.toJson(),
	  },
	};
      }
    }
  }

  return {
    redirect: {
      destination: `/clubs/${club.getId()}`,
      permanent: false,
    },
  };
}

export { getServerSideProps };
export default ManagementNews;
