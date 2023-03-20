
import React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from "../../components/taskBar.js";
import styles from "../../styles/createclub.module.css"
import findUserByEmail from '/pages/api/users/email';
import { toUser } from '/lib/conversions';
import ROLES from '/lib/roles';
import Club from '/lib/club';
import Member from '/lib/member';

function create_club({data}){
    const router = useRouter();
    const user = toUser(data);
    const handleSubmit = async (event) => {
	event.preventDefault();

	const name = event.target.name.value;
	const member = new Member(undefined, user.getId(), ROLES.PRESIDENT);
	const club = new Club(undefined, name, [member]);
	await fetch('/api/clubs', {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(club.toJson()),
	});

	const filter = { _id: user.getId() };
	const update = { $set: { [`memberships.${club.getId()}`]: member.getMemberId() } };
	await fetch('/api/users', {
	    method: 'PATCH',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ filter, update }),
	});

	router.push('../account');
    };

    return (
	<React.Fragment>
            <Navbar/>
            <div className = {styles.pagetitle}>
                Create a New Club:
            </div>
            <form method='post' onSubmit={handleSubmit}>
                <div className = {styles.formContainer}>
		    <label htmlFor='name'>Name:</label>
                    <input type='text' name='name' className={styles.inputbox} required />
                    <button className = {styles.submitbutton}>Submit</button>
		</div>
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

    return {
	props: {
	    data: user.toJson(),
	},
    };
}

export { getServerSideProps };
export default create_club;


