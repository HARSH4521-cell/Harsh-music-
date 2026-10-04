const API='https://wlzbi-music-api.vercel.app/music?q=';
export default async function handler(req,res){
  const q=String(req.query.q||'').trim();
  res.setHeader('Access-Control-Allow-Origin','*');
  if(!q)return res.status(400).json({success:false,error:'Missing q'});
  try{
    const r=await fetch(API+encodeURIComponent(q));
    const j=await r.json();
    if(!j.success||!j.audio_url)return res.status(404).json({success:false,error:'Not found'});
    res.setHeader('Cache-Control','s-maxage=120');
    res.status(200).json({success:true,title:j.title,channel:j.channel,thumbnail:j.thumbnail,video_url:j.video_url});
  }catch(e){res.status(502).json({success:false,error:'Upstream failed'})}
}
