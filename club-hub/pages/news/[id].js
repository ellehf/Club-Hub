import { useRouter } from 'next/router';
import { getClubList } from '../api/clubs/';
import { toEvent } from "/lib/conversions";
import Navbar from "../../components/taskBar.js";
import cp from '../../styles/clubpage.module.css'


/**
 *
 * @returns {JSX.Element}
 */
 export default function newsPage({ news }){
     const router = useRouter();
    let newsEvent = toEvent(news);
    const title = newsEvent.getTitle();
    const info = newsEvent.getInfo();
    const photo = newsEvent.getPhoto();
    const views = newsEvent.getViews();
    const likes = newsEvent.getLikes();
    const id = newsEvent.getId();

    
    return (
        <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            </link>
        </head>
        <body>
            <Navbar/>

            <div className={cp.clubInfoContainer}>
                <div className={cp.clubImage}>
                    <img src={photo} width={500}/>
                </div>
                
                <div className={cp.clubInfo}>
                    <div className={cp.clubTitle}>
                        {title}
                    </div>
                    

                        <br /> Info: {info} <br />
                        <br/><br/><br/><br/><br/><br/>
                        <br/> Views: {views} <br />
                    
                        <br /> Likes: {likes} <br />
            <button type="submit" className={cp.submit} onClick={async () => {await incLikes(id); router.reload()}}>Like</button>
                    
                </div>

            </div>

          
        </body>
    
            
        </html>



    )
}

async function incLikes(id) {
	const filter = { 'news._id': id };
	const update = { $inc: { 'news.$.likes': 1 } }; 
	await fetch('/api/clubs', {
	    method: 'PATCH',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ filter, update }),
	});
    
}


async function getServerSideProps(context) {
    const { id } = context.params;
    
    let clubs = await getClubList();
    let newsItem;
    for (let i = 0; i< clubs.length; i++){
      let newsList = clubs[i].getNews();
      for (let k = 0; k < newsList.length; k++){
        let currNews = newsList[k];
        let currId = currNews.getId();
        if (currId == id) {
            newsItem = currNews.toJson();
        }
      }
    }
    return { props: { news: newsItem } };
  }
  
  export { getServerSideProps };
