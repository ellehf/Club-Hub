import styles from "../styles/clubOverview.module.css"
import Link from "next/link";

/**
 *
 * @param name
 * @param rating
 * @param image
 * @returns {JSX.Element}
 */
    
export default function clubOverview(name= "club_name", rating = 3, image = "https://www.sololearn.com/Icons/Avatars/2341795.jpg", link = "/clubs/b882a804-0841-418c-8b66-be6705900d59" ){
    var stars = Array(5);
    //TODO: handle real number inputs
    for(let i = 0; i < 5; i++){
        if(rating > i){
            stars[i] = <div class={styles.fullstar}/>
        }else{
            stars[i] = <div class={styles.emptystar}/>
        }
    }
    let clubView = (
        <Link href = {link}>
            <div className = {styles.card}>
                
                <div class = {styles.container}>
                    <img claassName src = {image} width='200vw' height='200vw'/>
                    <h3>
                        {name}
                    </h3>
                    <p>
                        {stars}
                    </p>
                </div>
            </div>
        </Link>
  
    )
    return clubView;
}