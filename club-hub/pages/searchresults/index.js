import Navbar from "../../components/taskBar.js";
import styles from "../../styles/searchresults.module.css"


export default function searchresults({results}) {
    //location.href = "/";
    return (
        <>
            <Navbar/>
            <h1 className= {styles.title}>
                Search Results:
            </h1>
            
                <div className={styles.nonefound}>
                    No clubs found...
                </div>
                <div className={styles.nonefound}>
                    Try another search
                </div>

        </>
    )
}
