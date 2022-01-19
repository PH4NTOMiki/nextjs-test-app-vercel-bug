import _fetch from '$lib/_fetch';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import _ from '$lib/cachestore';
import { NextPageContext } from 'next';

/**
 * 
 * @param {{_post: {slug: string, title: string, txt: string, _id: string}, cache: boolean}}} param0 
 * @returns 
 */
function Post({_post, cache = false}) {
	const [post, setPost] = useState(_post);
	const router = useRouter();
	useEffect(() => {
		async function fetchPosts(){
			if(cache){
				const data = await fetch(`/api/posts?slug=${router.query.slug}`);
				const {ok} = data;
				if(ok){
					const json = await data.json();
					setPost({...json});
					const _index = _.posts.findIndex(item => item.slug === router.query.slug);
					if(_index>-1)_.posts[_index] = json;
				} else {
					console.log("Failed to fetch post", data);
				}
			}
			if(!_.posts.length){
				const data = await fetch(`/api/posts?all=1`);
				const {ok} = data;
				if(ok){
					const json = await data.json();
					_.posts = json;
				} else {
					console.log("Failed to fetch post", data);
				}
			}
		}
		fetchPosts();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	return (
	<>
	<Head>
		<title>{post.title}</title>
	</Head>
	
	<h1>{post.title}</h1>
	<p>{post.txt}</p>
	<Link href="/"><a>Back</a></Link>
	</>
  );
}

/**
 * 
 * @param {NextPageContext} ctx 
 * @returns 
 */
Post.getInitialProps = async (ctx) => {
	if(!ctx.req && _.posts.length){
		const found = _.posts.find(item => item.slug === ctx.query.slug);
		console.log({found});
		if(found){
			return {_post: found, cache: true};
		}
	}
	console.log('after check');
	const data = await _fetch(ctx.req, `/api/posts?slug=${ctx.query.slug}`);
	const {ok} = data;
	if(ok){
		const json = await data.json();
		return {_post: json};
	} else {
		//console.log("Failed to fetch post", data);
	}
};

export default Post;
