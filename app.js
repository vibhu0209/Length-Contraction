'use strict';
const $=id=>document.getElementById(id);
const state={data:null,curve:[],moving:!matchMedia('(prefers-reduced-motion: reduce)').matches,aligned:false,phase:.4,sweeping:false,sequence:0,pending:false,readings:[],lastTime:0,sweepTime:0,ready:false};
const number=(v,d=4)=>Math.abs(v)>0&&Math.abs(v)<.0001?v.toExponential(4):v.toLocaleString('en-US',{maximumFractionDigits:d});
const colour=r=>`hsl(${165-150*r} 64% 37%)`;
function error(text){$('error').hidden=!text;$('error').textContent=text;}
function stopSweep(){state.sweeping=false;$('sweep').textContent='Sweep speed';$('sweep').setAttribute('aria-pressed','false');}
function syncMotion(){ $('motion-toggle').textContent=state.moving?'Pause motion':'Play motion';$('motion-toggle').setAttribute('aria-pressed',String(state.moving)); }
async function calculate(length,beta){
 const seq=++state.sequence;state.pending=true;$('connection').textContent='Calculating in Python…';updateButtons();
 try{
  const response=await fetch(`/api/calculate?length=${encodeURIComponent(length)}&beta=${encodeURIComponent(beta)}`);
  const data=await response.json();if(seq!==state.sequence)return;
  if(!response.ok)throw new Error(data.error);
  state.data=data;state.ready=true;error('');$('connection').textContent='● Python connected · offline ready';
  $('speed').value=data.beta;$('speed-slider').value=data.beta;$('speed-value').textContent=number(data.beta,6)+'c';
  $('measured').textContent=number(data.length)+' m';$('shortening').textContent=number(data.delta_length)+' m';
  $('percent').textContent=number(data.contraction_percent,3)+'%';$('gamma').textContent=number(data.gamma,6);
  $('speed-si').textContent=`v = ${number(data.speed_m_s,3)} m/s · c = 299,792,458 m/s exactly`;
  document.documentElement.style.setProperty('--hue',165-150*data.contraction_percent/100);
  document.querySelectorAll('[data-beta]').forEach(b=>b.classList.toggle('active',Number(b.dataset.beta)===data.beta));
 }catch(e){if(seq!==state.sequence)return;stopSweep();error(e.message||'Python server unavailable. Keep START_APP.cmd running.');$('connection').textContent='Connection or input error';state.ready=false;}
 finally{if(seq===state.sequence){state.pending=false;updateButtons();}}
}
function updateButtons(){ $('record').disabled=!state.ready||state.pending||state.readings.length>=100;$('export').disabled=!state.readings.length;$('clear').disabled=!state.readings.length; }
function setBeta(beta){clearTimeout(timer);stopSweep();$('speed').value=beta;calculate($('proper-length').value,beta);}
$('experiment').addEventListener('submit',e=>{e.preventDefault();stopSweep();calculate($('proper-length').value,$('speed').value);});
let timer;
$('speed-slider').addEventListener('input',()=>{stopSweep();$('speed').value=$('speed-slider').value;clearTimeout(timer);timer=setTimeout(()=>calculate($('proper-length').value,$('speed-slider').value),35);});
for(const id of ['proper-length','speed'])$(id).addEventListener('input',()=>{++state.sequence;state.pending=false;state.ready=false;clearTimeout(timer);stopSweep();$('connection').textContent='Values edited · apply to calculate';updateButtons();});
document.querySelectorAll('[data-beta]').forEach(b=>b.addEventListener('click',()=>setBeta(b.dataset.beta)));
$('motion-toggle').addEventListener('click',()=>{state.moving=!state.moving;if(state.moving)state.aligned=false;syncMotion();});
$('align').addEventListener('click',()=>{state.moving=false;state.aligned=true;syncMotion();});
$('sweep').addEventListener('click',()=>{if(state.sweeping){stopSweep();return;}if(!$('experiment').reportValidity())return;state.sweeping=true;state.sweepTime=0;$('sweep').textContent='Stop sweep';$('sweep').setAttribute('aria-pressed','true');});
function renderReadings(){
 $('readings').replaceChildren();state.readings.forEach(r=>{const row=document.createElement('tr');[r.proper_length,r.beta,r.gamma,r.length,r.delta_length,r.contraction_percent].forEach(v=>{const cell=document.createElement('td');cell.textContent=number(v,6);row.append(cell)});$('readings').append(row)});
 $('record-status').textContent=state.readings.length?`${state.readings.length} calculated reading${state.readings.length===1?'':'s'} recorded this session. CSV is recomputed by Python at export.`:'No readings recorded. Set your values, then record a reading.';updateButtons();
}
$('record').addEventListener('click',()=>{if(state.ready&&!state.pending&&state.readings.length<100){state.readings.push({...state.data});renderReadings();}});
$('clear').addEventListener('click',()=>{state.readings=[];renderReadings();});
$('export').addEventListener('click',async()=>{try{const response=await fetch('/api/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.readings)});if(!response.ok)throw new Error((await response.json()).error);const url=URL.createObjectURL(await response.blob());const a=document.createElement('a');a.href=url;a.download='length_contraction_readings.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){error(e.message)}});
function surface(id){const canvas=$(id),rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1,w=rect.width,h=rect.height;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return {ctx,w,h};}
function text(ctx,t,x,y,colour='#5f7076',size=11,align='left'){ctx.fillStyle=colour;ctx.font=`${size}px Arial`;ctx.textAlign=align;ctx.fillText(t,x,y);}
function line(ctx,x1,y1,x2,y2,col='#dbe3e5'){ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function dimension(ctx,x,y,width,label,col){line(ctx,x,y,x+width,y,col);line(ctx,x,y-4,x,y+4,col);line(ctx,x+width,y-4,x+width,y+4,col);text(ctx,label,x+width/2,y-8,col,12,'center');}
function drawMotion(){const {ctx,w,h}=surface('motion');if(!state.data){text(ctx,'Apply your values to begin.',20,60);return;}const d=state.data,col=colour(d.contraction_percent/100),left=24,full=w-60,restWidth=full*.64,movingWidth=restWidth*d.ratio;
 text(ctx,'REST FRAME · proper length',left,23);ctx.fillStyle='#bfcbd0';ctx.fillRect(left,52,restWidth,30);dimension(ctx,left,103,restWidth,`L₀ = ${number(d.proper_length)} m`,'#536a75');
 line(ctx,left,134,w-18,134,'#eef1f2');text(ctx,'OBSERVER FRAME · parallel motion →',left,155);
 ctx.save();ctx.beginPath();ctx.rect(left,165,full+20,95);ctx.clip();
 const x=state.aligned?left:left+(state.phase%1)*(full-restWidth);
 ctx.strokeStyle='#bfcbd0';ctx.setLineDash([4,4]);ctx.strokeRect(x,181,restWidth,30);ctx.setLineDash([]);ctx.fillStyle=col;ctx.fillRect(x,181,movingWidth,30);
 // Fixed height and exact width ratio; light outline gives the uncontracted reference.
 dimension(ctx,x,237,movingWidth,`L = ${number(d.length)} m`,col);ctx.restore();
 text(ctx,state.aligned?'Simultaneous endpoints · Δt = 0':'Dashed outline: uncontracted length at the same position',left,h-2,'#5f7076',10);
}
function drawGraph(time){const {ctx,w,h}=surface('graph');if(!state.data||!state.curve.length)return;const d=state.data,left=55,right=w-20,top=30,bottom=h-42,col=colour(d.contraction_percent/100);const x=b=>left+b*(right-left),y=r=>bottom-r*(bottom-top);
 for(let k=0;k<=4;k++){const r=k/4;line(ctx,left,y(r),right,y(r),'#edf1f2');text(ctx,number(r*d.proper_length,2),left-9,y(r)+4,'#5f7076',10,'right');text(ctx,(r).toFixed(2).replace(/0+$/,'').replace(/\.$/,''),x(r),bottom+18,'#5f7076',10,'center');}
 line(ctx,left,top,left,bottom,'#b6c4c8');line(ctx,left,bottom,right,bottom,'#b6c4c8');
 ctx.setLineDash([5,4]);line(ctx,left,y(1),right,y(1),'#9aaab0');ctx.setLineDash([]);text(ctx,'Classical L₀',right,y(1)-9,'#7c8c93',10,'right');
 ctx.lineWidth=2.6;ctx.strokeStyle='#344f5a';ctx.beginPath();state.curve.forEach(([b,r],i)=>i?ctx.lineTo(x(b),y(r)):ctx.moveTo(x(b),y(r)));ctx.stroke();
 // Colour along the travelled portion of the parameter curve, not a CSS gradient.
 ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x(0),y(1));for(const [b,r]of state.curve){if(b>d.beta)break;ctx.lineTo(x(b),y(r));}ctx.lineTo(x(d.beta),y(d.ratio));ctx.stroke();
 const px=x(d.beta),py=y(d.ratio);ctx.setLineDash([3,4]);line(ctx,px,bottom,px,py,col);line(ctx,left,py,px,py,col);ctx.setLineDash([]);
 ctx.fillStyle=col;ctx.globalAlpha=.13;ctx.beginPath();ctx.arc(px,py,state.moving?9+2*Math.sin(time/250):10,0,2*Math.PI);ctx.fill();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(px,py,4.5,0,2*Math.PI);ctx.fill();
 const label=`${number(d.beta,6)}c · ${number(d.length,3)} m`;ctx.font='11px Arial';const tw=ctx.measureText(label).width,tx=Math.max(left+4,Math.min(right-tw,px-tw/2)),ty=py<top+40?py+25:py-14;ctx.fillStyle='white';ctx.fillRect(tx-4,ty-12,tw+8,18);text(ctx,label,tx,ty,col,11);
 text(ctx,'L (m)',left,14,'#172b32',11);text(ctx,'Relative speed v/c',left+(right-left)/2,h-4,'#5f7076',11,'center');
}
let lastSweepRequest=0;
function animate(time){const dt=state.lastTime?Math.min((time-state.lastTime)/1000,.1):0;state.lastTime=time;
 if(state.moving&&state.data)state.phase+=(state.data.beta*.22)*dt;
 if(state.sweeping){state.sweepTime+=dt;if(time-lastSweepRequest>110&&!state.pending){lastSweepRequest=time;const beta=.999*(1-Math.cos(state.sweepTime*Math.PI/9))/2;calculate($('proper-length').value,beta.toFixed(6));}}
 drawMotion();drawGraph(time);requestAnimationFrame(animate);
}
async function init(){syncMotion();updateButtons();try{const response=await fetch('/api/curve');if(!response.ok)throw new Error('Cannot load Python curve.');state.curve=await response.json();await calculate(100,.8);}catch(e){error(e.message);$('connection').textContent='Python unavailable';}requestAnimationFrame(animate);}
init();
