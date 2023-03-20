/**
 * @file Club Info Management component definition.
 */

import React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '/styles/ManagementInfo.module.css';
import Navbar from '/components/taskBar';
import findUserByEmail from '/pages/api/users/email';
import findClubById from '/pages/api/clubs/id';
import { toClub, toUser } from '/lib/conversions';

/**
 * Display club management page.
 *
 * @return {ReactElement} Club Management page to be displayed.
 */
function ManagementInfo({ userData, clubData }) {
  const router = useRouter();
  const user = toUser(userData);
  const club = toClub(clubData);
  const tags = club.getTags();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const filter = { _id: club.getId() };
    const update = { $set: {} };

    const logo = event.target.logo.value;
    if (logo) {
      update.$set.logo = logo;
    }

    const name = event.target.name.value;
    if (name) {
      update.$set.name = name;
    }

    const location = event.target.location.value;
    if (location) {
      update.$set.location = location;
    }

    const time = event.target.time.value;
    if (time) {
      update.$set.time = time;
    }

    const contact = event.target.contact.value;
    if (contact) {
      update.$set.contact = contact;
    }

    const website = event.target.website.value;
    if (website) {
      update.$set.website = website;
    }

    if (Object.entries(update.$set).length > 0) {
      await fetch('/api/clubs', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ filter, update }),
      });

      router.reload();
    }
  };

  const handleAddTag = async (event) =>  {
    event.preventDefault();

    const tag = event.target.tag.value;
    if (tag) {
      const filter = { _id: club.getId() };
      const update = {
	$addToSet: {
	  tags: tag,
	},
      };

      await fetch('/api/clubs', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ filter, update }),
      });

      router.reload();
    }
  };

  const handleDeleteTag = async (tag) => {
    const filter = { _id: club.getId() };
    const update = {
      $pull: {
	tags: tag,
      },
    };

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
	<title>Club Management: Information</title>
	<meta charSet='utf-8' />
	<meta name='viewport' content='initial-scale=1.0, width=device-width' />
	<link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />
      <Link id={styles.back} href={`../${club.getId()}`}>Management Home</Link>
      <div id={styles.container}>
	<h1>Manage {club.getName()} Information</h1>
	<form method='post' onSubmit={handleSubmit}>
	  <div className={styles.field}>Logo:</div>
	  <img src={club.getLogo()} width={150} height={150} />

	  <div className={styles.field}>
	    <input className={styles.input} type='text' name='logo' placeholder={club.getLogo()} />
	  </div>

	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='name'>Name:</label>
	    <input className={styles.input} type='text' name='name' placeholder={club.getName()} />
	  </div>

	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='location'>Location:</label>
	    <input className={styles.input} type='text' name='location' placeholder={club.getLocation()} />
	  </div>

	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='time'>Time:</label>
	    <input className={styles.input} type='text' name='time' placeholder={club.getTime()} />
	  </div>

	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='contact'>Contact:</label>
	    <input className={styles.input} type='text' name='contact' placeholder={club.getContact()} />
	  </div>

	  <div className={styles.field}>
	    <label className={styles.label} htmlFor='website'>Website:</label>
	    <input className={styles.input} type='text' name='website' placeholder={club.getWebsite()} />
	  </div>
	  <button className={styles.button} type='submit'>Submit</button>
	</form>

	<div className={styles.field}>Tags:</div>
	<form method='post' id={styles.tagContainer} onSubmit={handleAddTag}>
	  <div id={styles.tagList}>
	    {
	      club.getTags().map((tag) => {
		return (
		  <div className={styles.tag}>
		    {tag}<input type='button' className={styles.xButton} value='X' onClick={() => handleDeleteTag(tag)} />
		  </div>
		);
	      })
	    }			
	  </div>
	  <input className={styles.input} type='text' name='tag' placeholder='New tag...' />
	  <button className={styles.button} type='submit'>Add Tag</button>
	</form>
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
export default ManagementInfo;
