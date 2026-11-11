import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createAgent,AgentError} from './agent-core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const safeEqual=(a,b)=>{const aa=Buffer.from(String(a||'')),bb=Buffer.from(String(b||''));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb);};
const eventTypes=new Set(['resource_open','practice_answer','trial_calculate','resource_search','chat_complete']);
export function createAgentServer({env=process.env,fetchImpl,recordEvent}={}){
 const apiKey=env.DEEPSEEK_API_KEY,model=env.DEEPSEEK_MODEL||'deepseek-flash',answer=createAgent({apiKey,model,fetchImpl}),limits=new Map();
 const allowed=new Set(String(env.AGENT_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean)),metricsFile=path.join(root,'.agent-data/events.jsonl');
 const record=recordEvent||((event)=>{try{fs.mkdirSync(path.dirname(metricsFile),{recursive:true});fs.appendFileSync(metricsFile,JSON.stringify({...event,time:new Date().toISOString()})+'\n');}catch{console.error('Learning event could not be saved.');}});
 const readBody=async req=>{let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>36000)throw new AgentError('BODY_TOO_LARGE','请求过长，请缩短问题。',413);chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new AgentError('INVALID_JSON','请求格式不正确。');}};
 return http.createServer(async(req,res)=>{const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'},url=new URL(req.url,'http://localhost'),isAPI=url.pathname.startsWith('/api/');
  const json=(status,data)=>{res.writeHead(status,{...headers,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try{
   if(isAPI){const origin=req.headers.origin,host=req.headers.host,same=origin&&['http://'+host,'https://'+host].includes(origin);if(origin&&!same&&!allowed.has(origin))throw new AgentError('ORIGIN_DENIED','当前网站尚未获准连接此服务。',403);if(origin){headers['Access-Control-Allow-Origin']=origin;headers.Vary='Origin';headers['Access-Control-Allow-Headers']='Content-Type, Authorization';headers['Access-Control-Allow-Methods']='GET, POST, OPTIONS';}
    if(req.method==='OPTIONS'){res.writeHead(204,headers);res.end();return;}
    if(url.pathname==='/api/status'&&req.method==='GET'){json(200,{configured:!!apiKey,provider:'DeepSeek',model:apiKey?model:null,requiresClassCode:!!env.AGENT_CLASS_CODE,version:1});return;}
    if(url.pathname==='/api/metrics'&&req.method==='GET'){if(!env.AGENT_ADMIN_TOKEN||!safeEqual(req.headers.authorization,'Bearer '+env.AGENT_ADMIN_TOKEN))throw new AgentError('ADMIN_REQUIRED','此接口仅供教师使用。',403);const lines=fs.existsSync(metricsFile)?fs.readFileSync(metricsFile,'utf8').trim().split('\n').filter(Boolean):[];json(200,{events:lines.slice(-10000).map(x=>JSON.parse(x)),scope:'本服务真实记录的最近10000条匿名行为，不含静态页面之外的自动追踪。'});return;}
    if(!['/api/chat','/api/events'].includes(url.pathname)||req.method!=='POST'){json(404,{error:{code:'NOT_FOUND',message:'接口不存在。'}});return;}
    if(env.AGENT_CLASS_CODE&&!safeEqual(req.headers.authorization,'Bearer '+env.AGENT_CLASS_CODE))throw new AgentError('CLASS_CODE_REQUIRED','请输入本课堂的访问口令。',401);
    const key=req.socket.remoteAddress||'unknown',now=Date.now(),limit=limits.get(key)||{start:now,count:0};if(now-limit.start>60000){limit.start=now;limit.count=0;}limit.count++;limits.set(key,limit);if(limits.size>2000)for(const[k,v]of limits)if(now-v.start>60000)limits.delete(k);if(limit.count>30)throw new AgentError('RATE_LIMIT','操作较频繁，请一分钟后再试。',429);
    const body=await readBody(req),session=/^[a-z0-9-]{8,64}$/i.test(body.sessionId||'')?body.sessionId:null;
    if(url.pathname==='/api/events'){if(!eventTypes.has(body.type))throw new AgentError('INVALID_EVENT','不支持的学习记录。');const event={type:body.type,sessionId:session};if(/^[a-z0-9-]{1,50}$/i.test(body.resourceId||''))event.resourceId=body.resourceId;if(typeof body.correct==='boolean')event.correct=body.correct;record(event);json(200,{saved:true});return;}
    const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),90000);res.on('close',()=>{if(!res.writableEnded)abort.abort();});try{const result=await answer(body,{signal:abort.signal});record({type:'chat_complete',sessionId:session,model:result.model,tools:result.trace.map(t=>t.tool),usage:result.usage});json(200,result);}finally{clearTimeout(timeout);}return;
   }
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,headers).end();return;}
   const requested=url.pathname==='/'?'/agent.html':decodeURIComponent(url.pathname);let file=path.resolve(dist,'.'+requested);if(file!==dist&&!file.startsWith(dist+path.sep)){res.writeHead(403,headers).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,headers).end('Not found');return;}res.writeHead(200,{...headers,'Content-Type':mime[path.extname(file)]||'application/octet-stream'});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
  }catch(error){if(!res.headersSent)json(error instanceof AgentError?error.status:500,{error:{code:error instanceof AgentError?error.code:'SERVER_ERROR',message:error instanceof AgentError?error.message:'服务暂时无法完成请求。'}});else res.end();}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||4180),host=process.env.HOST||'127.0.0.1';createAgentServer().listen(port,host,()=>console.log('植知导学服务：http://'+host+':'+port+'/agent.html · DeepSeek '+(process.env.DEEPSEEK_API_KEY?'已配置':'待配置')));}
