import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import timestamp from 'time-stamp'
import Post from './Post'
import { query, collection, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const Home = ({ auth }) => {

  const [user, loading] = useAuthState(auth)
  const [postList, setPostList] = useState([])
  

  const hour = timestamp('HH')
  let dayTime;

  if(hour < 12) {
    dayTime = "Morning"
  } else {
    dayTime = "Evening"
  }
  
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('time'))
    const unsubscribe = onSnapshot(q, (querySnapshot) =>{
      let postsArr = []
      querySnapshot.forEach((doc) => {
        postsArr.push({...doc.data(), id:doc.id})
      });
      setPostList(postsArr)
    })
    return () => unsubscribe()
  }, [])
  return (
    <div className='m-10'>
      {user ? <h1 className='font-bold text-slate-900 text-5xl'>Good {dayTime}, {user.displayName}</h1> : loading? <></> : <></>}
      <p className='font-bold text-2xl pt-2 pb-4 text-slate-800'>Here are the latest posts:</p>
          {postList.map((post, index) => {
            return (
              <Post key={index} title={post.title} pfp={post.pfp} author={post.author} content={post.content} />
            )
          })}
    </div>
  )
}

export default Home