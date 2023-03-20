import Navbar from "../../components/taskBar.js";
import styles from '../../styles/Home.module.css';
import placeholderPhoto from '../../public/placeholderphoto.jpeg';
import { getClubList } from '../api/clubs/';
import { toEvent } from "/lib/conversions";
import Link from "next/link";
import EventCard from '/components/event-card';

function createNewsItems(titles, photos, captions, ids){
  let newsList = [];
  for(let i = 0; i < titles.length; i++){
    const title = titles[i];
    const photo = photos[i];
    const caption = captions[i];
    const id = ids[i];
    newsList.push(<EventCard id={id} title={title} image={photo} caption={caption} />);
  }
  return newsList;
}

/**
 *
 * @returns {JSX.Element}
 */
 export default function newsPage({ news }){
  let titles = [];
  let photos = [];
  let captions = [];
  let ids = [];
  for (let i = 0; i< news.length; i++){
    let currJ = news[i];
    let currE = toEvent(currJ);
    titles.push(currE.getTitle());
    photos.push(currE.getPhoto());
    captions.push(currE.getCaption());
    ids.push(currE.getId());
  }
    return (
        <body className={styles.animatedbg}>
            <div>
            <Navbar/>
            </div>
            <div id={styles.newsContainer}>
            {createNewsItems(titles,photos,captions,ids)}
            </div>
           
        </body>

    )
}

async function getServerSideProps() {
    let clubs = await getClubList();
    let news = [];
    for (let i = 0; i< clubs.length; i++){
      let newsList = clubs[i].getNews();
      for (let k = 0; k < newsList.length; k++)
        news.push(newsList[k].toJson());
    }
  
    return { props: { news: news } };
  }
  
export { getServerSideProps };
