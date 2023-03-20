import '../styles/globals.css'
import {SessionProvider} from 'next-auth/react'
import { useEffect, useState } from 'react'

//fix for hydration issue !!
function MyApp({ Component, pageProps, session }) {
    const [pageLoaded,setPageLoaded] = useState(false);

    useEffect(()=>{
        setPageLoaded(true);
    },[]);

    return (
        <SessionProvider session={session}>
            {(pageLoaded) ?
                <Component {...pageProps} />
                : null
            }
        </SessionProvider>
    )
}

export default MyApp
