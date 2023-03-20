/**
 * @file Club Management Home component definition.
 */

import React from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '/styles/ManagementHome.module.css';
import Navbar from '/components/taskBar.js';
import findUserByEmail from '/pages/api/users/email';
import findClubById from '/pages/api/clubs/id';
import { toClub, toUser } from '/lib/conversions';

/**
 * Display club management home page.
 *
 * @return {ReactElement} Club Management Home page to be displayed.
 */
function ManagementHome({ userData, clubData }) {
  const user = toUser(userData);
  const club = toClub(clubData);
  const router = useRouter();

  const handleClick = async (event) => {
    event.preventDefault();
    await fetch('/api/clubs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: club.getId() }),
    });

    const members = club.getMembers();
    members.forEach(async (member) => {
      const filter = { _id: member.getUserId() };
      const update = { $unset: {[`memberships.${club.getId()}`]: "" } };
      await fetch('/api/users', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ filter, update }),
      });
    });

    router.push('/account/');
  };

  return (
    <React.Fragment>
      <Head>
	<title>Club Management: Home</title>
	<meta charSet='utf-8' />
	<meta name='viewport' content='initial-scale=1.0, width=device-width' />
	<link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />
      <Link id={styles.back} href={`../${club.getId()}`}>Back to Club Page</Link>
      <div id={styles.options}>
	<h1 id={styles.header}>Manage {club.getName()}</h1>
	<Link className={styles.manage} href={`./info/${club.getId()}`}>Information</Link>
	<Link className={styles.manage} href={`./photos/${club.getId()}`}>Photos</Link>
	<Link className={styles.manage} href={`./news/${club.getId()}`}>News</Link>
	<button id={styles.disband} onClick={handleClick}>Disband</button> 
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
export default ManagementHome;
