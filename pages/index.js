import _fetch from '$lib/_fetch';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import _ from '$lib/cachestore';
import { NextPageContext } from 'next';

/**
 * 
 * @param {{_posts: {slug: string, title: string, txt: string, _id: string}[], cache: boolean}}} param0 
 * @returns 
 */
function Home({_posts, cache = false}) {
	const [posts, setPosts] = useState(_posts);
	const router = useRouter();
	function handleRouteChange(){
		console.log('handleRouteChange');
		_.posts = [...posts];
		//return () => {
			router.events.off('routeChangeStart', handleRouteChange);
		//};
	}
	useEffect(() => {
		router.events.on('routeChangeStart', handleRouteChange);
		
		async function fetchPosts(){
			if(cache){
				const data = await fetch(`/api/posts?all=1`);
				const {ok} = data;
				if(ok){
					const json = await data.json();
					setPosts(json);
				} else {
					console.log("Failed to fetch post", data);
				}
			}
		}
		fetchPosts();
		
		/*return () => {
			router.events.off('routeChangeStart', handleRouteChange);
		};*/
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Head>
				<title>Posts</title>
			</Head>
			
			{posts.map(post => (<span key={post._id}><Link href={`/${post.slug}`}><a>{post.title}</a></Link><br/></span>))}
		</>
	);
}

/**
 * 
 * @param {NextPageContext} ctx 
 * @returns 
 */
Home.getInitialProps = async (ctx) => {
	if(!ctx.req && _.posts.length){
		return {_posts: [..._.posts], cache: true};
	}
	const data = await _fetch(ctx.req, `/api/posts?all=1`);
	const {ok} = data;
	if(ok){
		const json = await data.json();
		return {_posts: json};
	} else {
		//console.log("Failed to fetch post", data);
	}
};

export default Home;
