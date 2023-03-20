import { NoFallbackError } from "next/dist/server/base-server";
import Navbar from "../../components/taskBar.js";


/**
 *
 * @returns {JSX.Element}
 */

function myclubs(){
    let my_page = (
        <div>
            <Navbar/>
            <span>
            list of my clubs 
            </span>
            <li>
                club 1 
            </li>
            <li>
                club 2
            </li>
        </div>
        
    )

    
    return my_page

}


export default myclubs;