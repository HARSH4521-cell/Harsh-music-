import {Readable} from 'node:stream';
const API='https://wlzbi-music-api.vercel.app/music?q=';
export const config={maxDuration:60};
export default async function handler(req,res){
  const q=String(req.query.q||'').trim();
  if(!q){res.statusCode=400;return res.end('Missing q')}
  try{
    const j=await (await fetch(API+encodeURIComponent(q))).json();
    if(!j.audio_url){res.statusCode=404;return res.end('Not found')}
    const h={'User-Agent':'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'};
    if(req.headers.range)h.Range=req.headers.range;
    const a=await fetch(j.audio_url,{headers:h});
    res.statusCode=a.status;
    for(const k of ['content-type','content-length','content-range','accept-ranges']){const v=a.headers.get(k);if(v)res.setHeader(k,v)}
    res.setHeader('Access-Control-Allow-Origin','*');
    if(!a.body){return res.end()}
    Readable.fromWeb(a.body).pipe(res);
    req.on('close',()=>{try{a.body.cancel()}catch{}});
  }catch(e){res.statusCode=502;res.end('Stream failed')}
}
