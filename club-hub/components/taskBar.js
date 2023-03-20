import React from 'react';
import Link from 'next/link';
import styles from '../styles/taskBar.module.css'
import {useSession, signIn, signOut} from 'next-auth/react'
import Searchbar from './searchBar';


/**
 * 
 * @returns {JSX.Element}
 * @constructor
 */

//TODO: change recent news so it links to news page

function Navbar() {
    const {data: session} = useSession();
    var loggedin;
    var myclubs;
    if(session){
        loggedin = 
            <>
                My Profile
            </>
    }else{
        loggedin =
            <>
                Sign In
            </> 
    }
  
    return (
    <ul className={styles.ul}>
        <li className={styles.li}>
        <a className={styles.a}>
            <Link href='/' >
                Club Hub
            </Link>
        </a>
        </li>
        <li className={styles.li}>
        <a className={styles.a}>
            <Link href='/clubs' >
            Explore Clubs
            </Link>
        </a>
        </li>

        <li className={styles.li}>
        <a className={styles.a}>
            <Link href='/news' >       
            Recent News
            </Link>
        </a>
        </li>

        <search className={styles.search}>
          <Searchbar/>
        </search>
        <li className={styles.li}>
        <a className={styles.a}>
            <Link href = "/account">
                {loggedin}
            </Link>
        </a>
        </li>
        
    </ul>
    )
  }
  
  export default Navbar;