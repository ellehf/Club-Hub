import styles from '/styles/EventCard.module.css';
import Link from 'next/link';

function EventCard({ id, title, image, caption }) {
  return (
    <Link href={`/news/${id}`} onClick={() => incViews(id)}>
      <div id={styles.container}>
        <p>{title}</p>
        <img id={styles.image} src={image} />
        <p>{caption}</p>
      </div>
    </Link>
  );
}

async function incViews(id) {
	const filter = { 'news._id': id };
	const update = { $inc: { 'news.$.views': 1 } }; 
	await fetch('/api/clubs', {
	    method: 'PATCH',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ filter, update }),
	});
}


export default EventCard;
