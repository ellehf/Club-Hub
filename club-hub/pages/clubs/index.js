import Link from "next/link"
import styles from "../../styles/clubs.module.css"
import Navbar from "../../components/taskBar.js";
import clubOverview from "../../components/clubOverview.js"
import { getClubList } from "../api/clubs/index";
import { toClub } from '/lib/conversions';


function build_clubs(){
    let my_clubs = []
    for(let i = 0; i < clubs_info.length; i ++){
        let curr_club = clubs_info[i];
        let overview = clubOverview(curr_club[0], curr_club[1], curr_club[2], curr_club[3])
        my_clubs.push(overview)
    }
    return my_clubs
}

/**
 *
 * @returns {JSX.Element}
 */
function explore({clubdata}){

    var clubinfoarr = []
    for(let i = 0; i < clubdata.length; i++){
        let j = toClub(clubdata[i]);
        let clubname = j.getName();
        let clubphoto = j.getLogo();
        console.log(clubname)
        console.log(clubphoto)
        console.log(typeof(clubphoto))

        if (clubphoto == ''){
            console.log(clubname + " has no photo")
            clubphoto = "https://as1.ftcdn.net/v2/jpg/02/48/42/64/1000_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
        }
        console.log(clubphoto)
        let clublink = "./clubs/"+j.getId();
        let clubrating = j.getRating();
        clubinfoarr.push([clubname, clubrating, clubphoto, clublink])

    }

    var clubarr = []
    
    for(let i = 0; i < clubinfoarr.length; i++){
        let current = clubinfoarr[i];
        let current_overview = clubOverview(current[0], current[1], current[2], current[3])
        clubarr.push(current_overview)
    }
   
    return(
        <body className={styles.animatedbg}>
            <>
                <Navbar/>
                {clubarr}
            </>


        </body>
    )
}

async function getServerSideProps(context) {
    //const { id } = context.params;
    const data = await getClubList();

    let mydata = []
    for(let i = 0; i < data.length; i++){
        let addj = data[i].toJson();
        mydata.push(addj)

    }
    return {props: {clubdata : mydata }}
}

export { getServerSideProps };
export default explore;

