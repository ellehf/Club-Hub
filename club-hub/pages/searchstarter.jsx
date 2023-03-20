import Head from 'next/head'
import Image from 'next/image'
import hp from '../styles/searchstarter.module.css'
import placeholderPhoto from '../public/placeholderphoto.jpeg'
import login from './login'

/*
let searchBar = (
    <script>
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        document.body.appendChild(input);
    </script>
)

*/



function newsItem(title="placeholder_title", image = placeholderPhoto, caption="placeholder_caption"){
    let newsItemBlock = (
        <div>
            <div>
                {title}
            </div>
            <div>
                {image}
            </div>
            <div>
                {caption}
            </div>
        </div>

    )
    return newsItemBlock;
}

function club_hub_logo() {
    const cht = (
        <span>
            <span id={hp.clubpart}>CLUB.</span>
            <span id={hp.hubpart}>HUB</span>
        </span>
    )

    return cht;
}

function create_search_bar() {
    /*
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    document.body.appendChild(input);
    */
    const label = document.createElement("label");
    label.setAttribute("for", "username");
    label.innerHTML = "Username: ";

    // insert label
    document.body.appendChild(label);

    // create textbox
    const input = document.createElement("input");
    input.setAttribute("id", "username");
    input.setAttribute("type", "text");

    // insert textbox
    document.body.appendChild(input);

}

function get_today() {
    const date = new Date();

    let day_of_month = date.getDate();
    let day_of_week = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();

    var month_dict = {
        0: 'January',
        1: 'February',
        2: "March",
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }

    var day_dict = {
        0: 'Sunday',
        1: 'Monday',
        2: "Tuesday",
        3: 'Wedneday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    let curr_date = day_dict[day_of_week] + ' ' + month_dict[month] + ' ' + day_of_month + ', ' + year;


    //let curr_date = String(month)+"/"+String(day)+"/"+String(year);
    return curr_date;
}

function check_login_state(){
    var login_state = false;

    if (login_state == false){
        return false;
    }
    else{
        return true;
    }

}

function my_clubs_pathway(){
    if (check_login_state()){
        return "./account/myclubs"
    }
    else{
        return "./login"
    }
}


export default function searchstarter() {
    //todays date
    let today = get_today();

    //club hub logo
    let ch_logo = club_hub_logo();

    //placeholder news item
    let news1 = newsItem();

    //check if logged in or not
    let my_clubs_href = my_clubs_pathway();


    const my_body = (

        <body>
            <div className = {hp.topofpage}>
          
                <div className = {hp.date}>
                    {today}
                </div>
                <div className={hp.loginButtonContainer}>
                    <a href="./login"  className={hp.loginButton}> 
                        <span className={hp.loginButton}> Login </span>
                       
                    </a>
                    
                </div>
            </div>

            <div className={hp.clubhubtitle}>
                {ch_logo}
            </div>

            <div className={hp.searchBarContainer}>

                <input id={hp.searchbarstarter}  placeholder="Find you next favorite club!"/>

            </div>

            <div className = {hp.homepageContainer}>  



                <div className = {hp.homepageChoice}>Recent News</div>
                
                

                <a href={my_clubs_href}>
                    <span className = {hp.homepageChoice}>My Clubs</span>
                </a>

                <a href = "./clubs">
                    <span className = {hp.homepageChoice}>
                        Browse Clubs
                    </span>
                </a>
                
                
            </div>

            <div className = {hp.newsBlockContainer}>
                <div className={hp.newsBlock}>
                    <div className={hp.newsBlockTitle}> 
                        news item1 title
                    </div>
                    <div className={hp.newsBlockPhoto}> 
                        <Image style={{ width: 200, height: 150 }} src={placeholderPhoto}/>
                    </div>
                    <div className={hp.newsBlockCaption}> 
                        placeholder caption  
                    </div>

                </div>
                <div className={hp.newsBlock}>
                    <div className={hp.newsBlockTitle}> 
                        news item2 title
                    </div>
                    <div className={hp.newsBlockPhoto}> 
                        <Image style={{ width: 200, height: 150 }} src={placeholderPhoto}/>
                    </div>
                    <div className={hp.newsBlockCaption}> 
                        placeholder caption  
                    </div>
                    
                </div>
                <div className={hp.newsBlock}>
                <   div className={hp.newsBlockTitle}> 
                        news item3 title
                    </div>
                    <div className={hp.newsBlockPhoto}> 
                        <Image style={{ width: 200, height: 150 }} src={placeholderPhoto}/>
                    </div>
                    <div className={hp.newsBlockCaption}> 
                        placeholder caption  
                    </div>

                    
                </div>
            </div>
        </body>


    )
    return my_body;
}