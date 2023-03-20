/**
 * @file Club Photo Management component definition.
 */

import React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '/styles/ManagementPhotos.module.css';
import Navbar from '/components/taskBar';
import findUserByEmail from '/pages/api/users/email';
import findClubById from '/pages/api/clubs/id';
import { toClub, toUser } from '/lib/conversions';

/**
 * Display club photo management page.
 *
 * @return {ReactElement} Club Photo Management page to be displayed.
 */
function ManagementPhotos({ userData, clubData }) {
  const router = useRouter();
  const user = toUser(userData);
  const club = toClub(clubData);
    

  const handleSubmit = async (event) => {
    event.preventDefault();

    const photo = event.target.photo.value;
    const filter = { _id: club.getId() };
    const update = { $addToSet: { photos: photo } };
    await fetch('/api/clubs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter, update }),
    });

    router.reload();
  };

  const handleDelete = async (photo) => {
    const filter = { _id: club.getId() };
    const update = { $pull: { photos: photo } };
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
	<title>Club Management: Photos</title>
	<meta charSet='utf-8' />
	<meta name='viewport' content='initial-scale=1.0, width=device-width' />
	<link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />
      <Link id={styles.back} href={`../${club.getId()}`}>Management Home</Link>
      <div id={styles.container}>
	<h1>Manage {club.getName()} Photos</h1>

	<form method='post' onSubmit={handleSubmit}>
	  <input className={styles.input} type='text' name='photo' placeholder='Photo URL' required />
	  <button id={styles.addPhoto} type='submit'>Add Photo</button>
	</form>

	<div id={styles.photoList}>
	  {
	    club.getPhotos().map((photo) => {
	      return (
		<div className={styles.photoContainer}>
		  <img className={styles.photo} src={photo} />
		  <input type='button' className={styles.deleteButton} value='Delete' onClick={() => handleDelete(photo)} />
		</div>
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
export default ManagementPhotos;
