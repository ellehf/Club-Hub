/**
 * @file Settings component definition.
 */

import React from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '/styles/Settings.module.css';
import Navbar from '/components/taskBar';
import findUserByEmail from '../api/users/email';
import { toUser } from '/lib/conversions';

/**
 * Display settings page.
 *
 * @return {ReactElement} Settings page to be displayed.
 */
function Settings({ data }) {
  const router = useRouter();
  const user = toUser(data);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const filter = { _id: user.getId() };
    const update = { $set: {} };

    const name = event.target.name.value;
    if (name) {
      update.$set.name = name;
    }

    const major = event.target.major.value;
    if (major) {
      update.$set.major = major;
    }

    const year = event.target.year.value;
    if (year) {
      update.$set.year = year;
    }

    if (Object.entries(update.$set).length > 0) {
      await fetch('/api/users', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ filter, update }),
      });

      router.reload();
    }
  }

  return (
    <React.Fragment>
      <Head>
	<title>Club Hub: Settings</title>
	<meta charSet='utf-8' />
	<meta name='viewport' content='initial-scale=1.0, width=device-width' />
	<link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />
      <p id={styles.title}>Edit Profile</p>
      <form id={styles.form} method='post' onSubmit={handleSubmit}>
	<div className={styles.field}>
	  <label className={styles.label} htmlFor='name'>Name:</label>
	  <input className={styles.input} type='text' name='name' placeholder={user.getName()} />
	</div>
	<div className={styles.field}>
	  <label className={styles.label} htmlFor='major'>Major:</label>
	  <input className={styles.input} type='text' name='major' placeholder={user.getMajor()} />
	</div>
	<div className={styles.field}>
	  <label className={styles.label} htmlFor='year'>Year:</label>
	  <input className={styles.input} type='text' name='year' placeholder={user.getYear()} />
	</div>
	<button id={styles.submit} type='submit'>Submit</button>
      </form>
    </React.Fragment>
  );
}


async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
	destination: '/login',
	permanent: false,
      },
    };
  }

  const user = await findUserByEmail(session.user.email);
  return { props: { data: user.toJson() } };
}

export { getServerSideProps };
export default Settings;
