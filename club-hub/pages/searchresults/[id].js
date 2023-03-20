import Navbar from "../../components/taskBar.js";
import findClubsByName from "../api/clubs/name/index.js"
import clubOverview from "../../components/clubOverview.js";
import styles from "../../styles/searchresults.module.css"
import { toClub } from '/lib/conversions';

function searchresults({results}){

    var clubinfoarr = []
    for(let i = 0; i < results.length; i++){
        let j = toClub(results[i]);
        let clubname = j.getName();
        let clubphoto = j.getLogo();
        let clublink = "/clubs/"+j.getId();
        let clubrating = j.getRating();
        clubinfoarr.push([clubname, clubrating, clubphoto, clublink])

    }

    var clubarr = []
    
    if(results.length == 0){
        let displaythis = 
            <>
                <div className={styles.nonefound}>
                    No clubs found...
                </div>
                <div className={styles.nonefound}>
                    Try another search
                </div>
            </>
        clubarr.push(displaythis);
    }else{
        for(let i = 0; i < clubinfoarr.length; i++){
            let current = clubinfoarr[i];
            let current_overview = clubOverview(current[0], current[1], current[2], current[3])
            clubarr.push(current_overview)
        }
    }

    return (
        <>
            <Navbar/>
            <h1 className={styles.title}>
                Search Results:
                
            </h1>
            <div>
                {clubarr}
            </div>
        </>
    )
}

async function getServerSideProps(context) {
    const { id } = context.params;
    const data = await findClubsByName(id);
    
    let mydata = []
    for(let i = 0; i < data.length; i++){
        let addj = data[i].toJson();
        mydata.push(addj)

    }
    console.log(mydata);
    return {props: { results: mydata }}
}


export { getServerSideProps };
export default searchresults;

