/**
 * @file Login component definition.
 */

import React from 'react';
import { getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Login.module.css';
import User from '/lib/user';
import findUserByEmail from '../api/users/email';
import { insertUser } from '../api/users/';

/**
 * Display login page.
 *
 * @return {ReactElement} Login page to be displayed.
 */
function Login() {
  return (
    <React.Fragment>
      <Head>
	<title>Club Hub: Login</title>
	<meta charSet='utf-8' />
	<meta name='viewport' content='initial-scale=1.0, width=device-width' />
	<link rel='icon' href='/favicon.ico' />
      </Head>

      <div id={styles.logo}>
	<Link href='/'>
	  <span id={styles.club}>CLUB.</span>
	  <span id={styles.hub}>HUB</span>
	</Link>
      </div>

      <div id={styles.signContainer}>
	<p>You are not signed in.</p>
	<button id={styles.button} onClick={signIn}>Sign In</button>
      </div>
    </React.Fragment>
  );
}

async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    const user = await findUserByEmail(session.user.email);
    if (!user) {
      await insertUser(
	new User(
	  undefined,
	  session.user.email,
	  session.user.name,
	)
      );
    }

    return {
      redirect: {
	destination: '/account',
	permanent: false,
      },
    };
  }

  return { props: {} };
}

export { getServerSideProps };
export default Login;
