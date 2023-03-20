import styles from "../styles/reviewOverview.module.css"

/**
 *
 * @param name
 * @param rating
 * @param image
 * @returns {JSX.Element}
 */

export default function reviewOverview(title, info, rating){
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
        <div className = {styles.card}>
            
            <div class = {styles.container}>
                <div class = {styles.top}>
                <li className={styles.li}>
                    {title}
                </li>
                <li className={styles.li}>
                    {stars}
                </li>
                </div>
                <div class = {styles.top}>
                    {info}
                </div>
                
            </div>
        </div>
  
    )
    return clubView;
}