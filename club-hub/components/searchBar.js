import styles from '../styles/searchBar.module.css'
import { useState } from 'react';


function Searchbar(){

    const [inputval, setinputval] = useState('')

    function handleClick(e){                               
        console.log(inputval)
        
        /*document.getElementById('search').value= ''
        
        sessionStorage.setItem("search", inputval);
        */
       location.href = "/searchresults/" + inputval;
    }

    return(
        <>
            <input
                type='text'
                placeholder='Search for your favorite clubs...'
                className={styles.input}
                id="search"
                value={inputval} onChange={(e)=>setinputval(e.target.value)}
            />
            <button className={styles.btn} onClick={handleClick}>
                Search
            </button>
        </>
    )
}
export default Searchbar;