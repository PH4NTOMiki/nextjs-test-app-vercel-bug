/**
 * 
 * @param {import('next').NextApiRequest} [req] 
 * @param {RequestInfo} info 
 * @param {RequestInit} [init] 
 * @returns {Promise<Response>}
 */
export default async function _fetch(req, info, init){
	if(req && typeof(info) === "string" && !info.startsWith("http")){
		info = `${req.headers['x-forwarded-proto']||'http'}://${req.headers.host||'127.0.0.1'}${info}`;
	}
	const request = init ? new Request(info, init) : new Request(info);
	
	if(req){
		request.headers.set('X-ServerRequest', 'true');
		if(req.headers['sec-ch-ua'])request.headers.set('sec-ch-ua', req.headers['sec-ch-ua']);
		if(req.headers['sec-ch-ua-mobile'])request.headers.set('sec-ch-ua-mobile', req.headers['sec-ch-ua-mobile']);
		if(req.headers['sec-ch-ua-platform'])request.headers.set('sec-ch-ua-platform', req.headers['sec-ch-ua-platform']);
		if(req.headers['user-agent'])request.headers.set('User-Agent', req.headers['user-agent']);
		if(req.headers.cookie)request.headers.set('Cookie', req.headers.cookie);
		if(req.headers.authorization)request.headers.set('Authorization', req.headers.authorization);
		if(req.headers.referer)request.headers.set('Referer', req.headers.referer);
		if(req.headers['accept-language'])request.headers.set('accept-language', req.headers['accept-language']);
	}
	return fetch(request);
}