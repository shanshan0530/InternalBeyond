/* ============================================================
   sign.js — Internal Beyond 外置模块:Sign(古典占星 · 现代占星 · 天文历表)
   安装:把本文件与 InternalBeyond.html 放在同一文件夹,
   在 HTML 中 <script src="game/game_module.js"></script> 一行下方新增:
   <script src="sign.js"></script>
   即可。导航入口自动出现在 Memory 与 API 之间,不改动网页其他部分。
   计算全部在本地完成,不联网;数据仅存于浏览器本地(ib_sign_*)。
   位置精度约 1 角分(适用年份约 1800–2050,超出范围精度下降)。
   ============================================================ */
(function(){
'use strict';
var IS_DOM = (typeof document!=='undefined');
if(IS_DOM && window.IBSign) return;

/* ═══════════ 0. 数学与格式工具 ═══════════ */
var D2R=Math.PI/180, R2D=180/Math.PI, AUKM=149597870.7;
function n360(x){x%=360;return x<0?x+360:x}
function w180(x){x=n360(x);return x>180?x-360:x}
function sd(x){return Math.sin(x*D2R)} function cd(x){return Math.cos(x*D2R)} function td(x){return Math.tan(x*D2R)}
function p2(n){return (n<10?'0':'')+n}
var SIGN_CN=['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'];
var SIGN_G=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map(function(g){return g+'\uFE0E'});
var ELEM=['火','土','风','水'];
function fmtLon(l){l=n360(l);var s=Math.floor(l/30),d=l-s*30,dd=Math.floor(d),mm=Math.round((d-dd)*60);if(mm===60){mm=0;dd++;}if(dd===30){dd=0;s=(s+1)%12}
  return {s:s,txt:dd+'°'+p2(mm)+'′',full:SIGN_G[s]+' '+SIGN_CN[s]+' '+dd+'°'+p2(mm)+'′'}}
function fmtDegMin(x){var sg=x<0?'−':'+';x=Math.abs(x);var d=Math.floor(x),m=Math.round((x-d)*60);if(m===60){m=0;d++}return sg+d+'°'+p2(m)+'′'}
function fmtRA(a){a=n360(a)/15;var h=Math.floor(a),m=Math.round((a-h)*60);if(m===60){m=0;h=(h+1)%24}return p2(h)+'h'+p2(m)+'m'}
function fmtHM(ms,tz){if(ms==null)return '—';var d=new Date(ms+tz*3600000);return p2(d.getUTCHours())+':'+p2(d.getUTCMinutes())}
function fmtDate(ms,tz){var d=new Date(ms+tz*3600000);return d.getUTCFullYear()+'-'+p2(d.getUTCMonth()+1)+'-'+p2(d.getUTCDate())}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

/* ═══════════ 1. 时间 ═══════════ */
function jdOf(ms){return ms/86400000+2440587.5}
function deltaT(y){
  if(y>=2005&&y<=2050){var t=y-2000;return 62.92+0.32217*t+0.005589*t*t}
  if(y>=1986&&y<2005){var t2=y-2000;return 63.86+0.3345*t2-0.060374*t2*t2+0.0017275*t2*t2*t2+0.000651814*Math.pow(t2,4)+0.00002373599*Math.pow(t2,5)}
  var u=(y-1820)/100;return -20+32*u*u}
function epochOf(ms){var jd=jdOf(ms);var y=new Date(ms).getUTCFullYear()+new Date(ms).getUTCMonth()/12;
  var jde=jd+deltaT(y)/86400;return {ms:ms,jd:jd,jde:jde,T:(jde-2451545)/36525}}

/* ═══════════ 2. 章动 / 黄赤交角 / 岁差 ═══════════ */
function nutObl(T){var om=n360(125.04452-1934.136261*T),Ls=n360(280.4665+36000.7698*T),Lm=n360(218.3165+481267.8813*T);
  var dpsi=(-17.20*sd(om)-1.32*sd(2*Ls)-0.23*sd(2*Lm)+0.21*sd(2*om))/3600;
  var deps=(9.20*cd(om)+0.57*cd(2*Ls)+0.10*cd(2*Lm)-0.09*cd(2*om))/3600;
  var eps0=23.43929111-(46.8150*T+0.00059*T*T-0.001813*T*T*T)/3600;
  return {dpsi:dpsi,eps:eps0+deps}}
function precL(T){return (5029.0966*T+1.11113*T*T)/3600}

/* ═══════════ 3. 行星(JPL 近似开普勒根数, J2000 黄道, 1800–2050) ═══════════ */
var KEP=[
[0.38709927,0.00000037,0.20563593,0.00001906,7.00497902,-0.00594749,252.25032350,149472.67411175,77.45779628,0.16047689,48.33076593,-0.12534081],
[0.72333566,0.00000390,0.00677672,-0.00004107,3.39467605,-0.00078890,181.97909950,58517.81538729,131.60246718,0.00268329,76.67984255,-0.27769418],
[1.00000261,0.00000562,0.01671123,-0.00004392,-0.00001531,-0.01294668,100.46457166,35999.37244981,102.93768193,0.32327364,0,0],
[1.52371034,0.00001847,0.09339410,0.00007882,1.84969142,-0.00813131,-4.55343205,19140.30268499,-23.94362959,0.44441088,49.55953891,-0.29257343],
[5.20288700,-0.00011607,0.04838624,-0.00013253,1.30439695,-0.00183714,34.39644051,3034.74612775,14.72847983,0.21252668,100.47390909,0.20469106],
[9.53667594,-0.00125060,0.05386179,-0.00050991,2.48599187,0.00193609,49.95424423,1222.49362201,92.59887831,-0.41897216,113.66242448,-0.28867794],
[19.18916464,-0.00196176,0.04725744,-0.00004397,0.77263783,-0.00242939,313.23810451,428.48202785,170.95427630,0.40805281,74.01692503,0.04240589],
[30.06992276,0.00026291,0.00859048,0.00005105,1.77004347,0.00035372,-55.12002969,218.45945325,44.96476227,-0.32241464,131.78422574,-0.00508664],
[39.48211675,-0.00031596,0.24882730,0.00005170,17.14001206,0.00004818,238.92903833,145.20780515,224.06891629,-0.04062942,110.30393684,-0.01183482]];
function helio(i,T){var k=KEP[i],a=k[0]+k[1]*T,e=k[2]+k[3]*T,I=k[4]+k[5]*T,L=k[6]+k[7]*T,wb=k[8]+k[9]*T,O=k[10]+k[11]*T;
  var w=wb-O,M=w180(L-wb),ed=e*R2D,E=M+ed*sd(M);
  for(var it=0;it<10;it++){var dE=(M-(E-ed*sd(E)))/(1-e*cd(E));E+=dE;if(Math.abs(dE)<1e-9)break}
  var xw=a*(cd(E)-e),yw=a*Math.sqrt(1-e*e)*sd(E);
  var cw=cd(w),sw=sd(w),cO=cd(O),sO=sd(O),cI=cd(I),sI=sd(I);
  return [(cw*cO-sw*sO*cI)*xw+(-sw*cO-cw*sO*cI)*yw,(cw*sO+sw*cO*cI)*xw+(-sw*sO+cw*cO*cI)*yw,sw*sI*xw+cw*sI*yw]}

/* ═══════════ 4. 月亮(Meeus 截断 ELP 级数, 平春分点 of date) ═══════════ */
var MLR=[[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],
[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],
[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],
[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],
[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],
[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003],[2,0,-1,2,-2602,0],
[2,-1,-2,0,2390,10056],[1,0,1,0,-2348,6322],[2,-2,0,0,2236,-9884],[0,1,2,0,-2120,5751],[0,2,0,0,-2069,0],
[2,-2,-1,0,2048,-4950],[2,0,1,-2,-1773,4130],[2,0,0,2,-1595,0],[4,-1,-1,0,1215,-3958],[0,0,2,2,-1110,0],
[3,0,-1,0,-892,3258],[2,1,1,0,-810,2616],[4,-1,-2,0,759,-1897],[0,2,-1,0,-713,-2117],[2,2,-1,0,-700,2354],
[2,1,-2,0,691,0],[2,-1,0,-2,596,0],[4,0,1,0,549,-1423],[0,0,4,0,537,-1117],[4,-1,0,0,520,-1571],[1,0,-2,0,-487,-1739],
[2,1,0,-2,-399,0],[0,0,2,-2,-381,-4421],[1,1,1,0,351,0],[3,0,-2,0,-340,0],[4,0,-3,0,330,0],[2,-1,2,0,327,0],
[0,2,1,0,-323,1165],[1,1,-1,0,299,0],[2,0,3,0,294,0],[2,0,-1,-2,0,8752]];
var MB=[[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],
[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],
[2,1,0,-1,-3359],[2,-1,-1,1,2463],[2,-1,0,1,2211],[2,-1,-1,-1,2065],[0,1,-1,-1,-1870],[4,0,-1,-1,1828],[0,1,0,1,-1794],
[0,0,0,3,-1749],[0,1,-1,1,-1565],[1,0,0,1,-1491],[0,1,1,1,-1475],[0,1,1,-1,-1410],[0,1,0,-1,-1344],[1,0,0,-1,-1335],
[0,0,3,1,1107],[4,0,0,-1,1021],[4,0,-1,1,833],[0,0,1,-3,777],[4,0,-2,1,671],[2,0,0,-3,607],[2,0,2,-1,596],
[2,-1,1,-1,491],[2,0,-2,1,-451],[0,0,3,-1,439],[2,0,2,1,422],[2,0,-3,-1,421],[2,1,-1,1,-366],[2,1,0,1,-351],
[4,0,0,1,331],[2,-1,1,1,315],[2,-2,0,-1,302],[0,0,1,3,-283],[2,1,1,-1,-229],[1,1,0,-1,223],[1,1,0,1,223],
[0,1,-2,-1,-220],[2,1,-1,-1,-220],[1,0,1,1,-185],[2,-1,-2,-1,181],[0,1,2,1,-177],[4,0,-2,-1,176],[4,-1,-1,-1,166],
[1,0,1,-1,-164],[4,0,1,-1,132],[1,0,-1,-1,-119],[4,-1,0,-1,115],[2,-2,0,1,107]];
function moonPos(T){
  var Lp=n360(218.3164477+481267.88123421*T-0.0015786*T*T+T*T*T/538841-T*T*T*T/65194000);
  var D=n360(297.8501921+445267.1114034*T-0.0018819*T*T+T*T*T/545868-T*T*T*T/113065000);
  var M=n360(357.5291092+35999.0502909*T-0.0001536*T*T+T*T*T/24490000);
  var Mp=n360(134.9633964+477198.8675055*T+0.0087414*T*T+T*T*T/69699-T*T*T*T/14712000);
  var F=n360(93.2720950+483202.0175233*T-0.0036539*T*T-T*T*T/3526000+T*T*T*T/863310000);
  var E=1-0.002516*T-0.0000074*T*T,E2=E*E;
  var A1=n360(119.75+131.849*T),A2=n360(53.09+479264.290*T),A3=n360(313.45+481266.484*T);
  var sl=0,sr=0,sb=0,i,t,arg,f;
  for(i=0;i<MLR.length;i++){t=MLR[i];arg=t[0]*D+t[1]*M+t[2]*Mp+t[3]*F;f=(Math.abs(t[1])===1)?E:(Math.abs(t[1])===2)?E2:1;
    sl+=t[4]*f*sd(arg);sr+=t[5]*f*cd(arg)}
  for(i=0;i<MB.length;i++){t=MB[i];arg=t[0]*D+t[1]*M+t[2]*Mp+t[3]*F;f=(Math.abs(t[1])===1)?E:(Math.abs(t[1])===2)?E2:1;
    sb+=t[4]*f*sd(arg)}
  sl+=3958*sd(A1)+1962*sd(Lp-F)+318*sd(A2);
  sb+=-2235*sd(Lp)+382*sd(A3)+175*sd(A1-F)+175*sd(A1+F)+127*sd(Lp-Mp)-115*sd(Lp+Mp);
  return {lam:n360(Lp+sl/1e6),bet:sb/1e6,dist:385000.56+sr/1000}}
function meanNode(T){return n360(125.0445479-1934.1362891*T+0.0020754*T*T+T*T*T/467441)}
function meanLilith(T){return n360(83.3532465+4069.0137287*T-0.0103200*T*T-T*T*T/80053+180)}

/* ═══════════ 5. 全体天体状态(视黄经 of date) ═══════════ */
/* 索引:0太阳 1月亮 2水 3金 4火 5木 6土 7天 8海 9冥 10北交 11莉莉丝 */
var B_CN=['太阳','月亮','水星','金星','火星','木星','土星','天王星','海王星','冥王星','北交点','莉莉丝'];
var B_G=['☉','☽','☿','♀','♂','♃','♄','♅','♆','♇','☊','⚸'].map(function(g){return g+'\uFE0E'});
function bodiesAt(ep){
  var T=ep.T,no=nutObl(T),p=precL(T);
  var mo=moonPos(T);
  var lj=mo.lam-p,cb=cd(mo.bet),dau=mo.dist/AUKM;
  var mv=[dau*cb*cd(lj),dau*cb*sd(lj),dau*sd(mo.bet)];
  var emb=helio(2,T),earth=[emb[0]-0.0123*mv[0],emb[1]-0.0123*mv[1],emb[2]-0.0123*mv[2]];
  var out=new Array(12);
  /* 太阳 */
  var sx=-earth[0],sy=-earth[1],sz=-earth[2],R=Math.sqrt(sx*sx+sy*sy+sz*sz);
  var slJ=n360(Math.atan2(sy,sx)*R2D),sb2=Math.asin(sz/R)*R2D;
  var sunApp=n360(slJ+p+no.dpsi-20.4898/3600);
  out[0]={lam:sunApp,lamJ:slJ,bet:sb2,dist:R,r:0,i:0};
  /* 月亮 */
  out[1]={lam:n360(mo.lam+no.dpsi),lamJ:lj,bet:mo.bet,dist:mo.dist,r:0,i:1};
  /* 行星(含单次光行时修正与周年光行差) */
  var map=[null,null,0,1,3,4,5,6,7,8];
  for(var b=2;b<=9;b++){var ki=map[b];
    var h=helio(ki,T),g=[h[0]-earth[0],h[1]-earth[1],h[2]-earth[2]];
    var d0=Math.sqrt(g[0]*g[0]+g[1]*g[1]+g[2]*g[2]);
    var h2=helio(ki,T-d0*0.0057755183/36525);
    g=[h2[0]-earth[0],h2[1]-earth[1],h2[2]-earth[2]];
    var d=Math.sqrt(g[0]*g[0]+g[1]*g[1]+g[2]*g[2]),r=Math.sqrt(h2[0]*h2[0]+h2[1]*h2[1]+h2[2]*h2[2]);
    var lJ=n360(Math.atan2(g[1],g[0])*R2D),bt=Math.asin(g[2]/d)*R2D;
    var ab=-20.4898/3600*cd(lJ-slJ)/Math.max(cd(bt),0.2);
    out[b]={lam:n360(lJ+p+no.dpsi+ab),lamJ:lJ,bet:bt,dist:d,r:r,i:b}}
  out[10]={lam:meanNode(T),lamJ:n360(meanNode(T)-p),bet:0,dist:null,r:0,i:10};
  out[11]={lam:meanLilith(T),lamJ:n360(meanLilith(T)-p),bet:0,dist:null,r:0,i:11};
  return {list:out,eps:no.eps,dpsi:no.dpsi,sunLam:sunApp,sunR:R}}

/* ═══════════ 6. 坐标 / 恒星时 / 上升中天 / 宫位 ═══════════ */
function equOf(lam,bet,eps){var a=n360(Math.atan2(sd(lam)*cd(eps)-td(bet)*sd(eps),cd(lam))*R2D);
  var d=Math.asin(sd(bet)*cd(eps)+cd(bet)*sd(eps)*sd(lam))*R2D;return {ra:a,dec:d}}
function gmstOf(jd){var Tu=(jd-2451545)/36525;
  return n360(280.46061837+360.98564736629*(jd-2451545)+0.000387933*Tu*Tu-Tu*Tu*Tu/38710000)}
function lonFromRA(ra,eps){return n360(Math.atan2(sd(ra),cd(ra)*cd(eps))*R2D)}
function ascMc(ramc,phi,eps){var mc=lonFromRA(ramc,eps);
  var asc=n360(Math.atan2(cd(ramc),-(sd(ramc)*cd(eps)+td(phi)*sd(eps)))*R2D);
  if(n360(asc-mc)>=180)asc=n360(asc+180);
  return {asc:asc,mc:mc}}
function housesOf(sys,asc,mc,ramc,phi,eps){
  var c=new Array(13),i;
  if(sys==='whole'){var s0=Math.floor(asc/30)*30;for(i=1;i<=12;i++)c[i]=n360(s0+(i-1)*30);return {c:c,sys:sys}}
  if(sys==='equal'){for(i=1;i<=12;i++)c[i]=n360(asc+(i-1)*30);return {c:c,sys:sys}}
  function it(off,f){var ra=ramc+off;
    for(var k=0;k<40;k++){var lam=lonFromRA(ra,eps),dec=Math.asin(sd(eps)*sd(lam))*R2D;
      var x=td(phi)*td(dec);if(Math.abs(x)>=0.995)return null;
      var ad=Math.asin(x)*R2D,nra=ramc+off+f*ad;
      if(Math.abs(w180(nra-ra))<1e-7){ra=nra;break}ra=nra}
    return lonFromRA(ra,eps)}
  var c11=it(30,1/3),c12=it(60,2/3),c2=it(120,2/3),c3=it(150,1/3);
  if(c11==null||c12==null||c2==null||c3==null){
    var s1=Math.floor(asc/30)*30;for(i=1;i<=12;i++)c[i]=n360(s1+(i-1)*30);return {c:c,sys:'whole',fallback:true}}
  c[1]=asc;c[10]=mc;c[11]=c11;c[12]=c12;c[2]=c2;c[3]=c3;
  c[4]=n360(mc+180);c[5]=n360(c11+180);c[6]=n360(c12+180);c[7]=n360(asc+180);c[8]=n360(c2+180);c[9]=n360(c3+180);
  return {c:c,sys:sys}}
function inArc(x,a,b){x=n360(x-a);b=n360(b-a);return x<b}
function houseOf(lam,c){for(var i=1;i<=12;i++){if(inArc(lam,c[i],c[i%12+1]))return i}return 1}
function altAz(ra,dec,lst,phi){var H=n360(lst-ra);
  var alt=Math.asin(sd(phi)*sd(dec)+cd(phi)*cd(dec)*cd(H))*R2D;return alt}

/* ═══════════ 7. 全盘计算 ═══════════ */
function computeChart(ms,tz,lat,lon,houseSys){
  var ep=epochOf(ms),bs=bodiesAt(ep);
  var ep1=epochOf(ms-43200000),ep2=epochOf(ms+43200000);
  var b1=bodiesAt(ep1).list,b2=bodiesAt(ep2).list;
  var gast=n360(gmstOf(ep.jd)+bs.dpsi*cd(bs.eps));
  var lst=n360(gast+lon);
  var am=ascMc(lst,lat,bs.eps);
  var H=housesOf(houseSys,am.asc,am.mc,lst,lat,bs.eps);
  var list=bs.list.map(function(b,i){
    var spd=w180(b2[i].lam-b1[i].lam);
    var eq=equOf(b.lam,b.bet,bs.eps);
    return {i:i,lam:b.lam,lamJ:b.lamJ,bet:b.bet,dist:b.dist,r:b.r,spd:spd,retro:spd<0,
      ra:eq.ra,dec:eq.dec,house:houseOf(b.lam,H.c),alt:altAz(eq.ra,eq.dec,lst,lat)}});
  var day=list[0].alt>0;
  var elong=Math.acos(Math.max(-1,Math.min(1,cd(list[1].bet)*cd(list[1].lam-list[0].lam))))*R2D;
  var psi=n360(list[1].lam-list[0].lam);
  return {ep:ep,tz:tz,lat:lat,lon:lon,bodies:list,eps:bs.eps,lst:lst,asc:am.asc,mc:am.mc,
    houses:H,day:day,sunR:bs.sunR,moonPsi:psi,moonK:(1-cd(elong))/2}}

/* ═══════════ 8. 升落 / 中天 / 行星时 / 节气 ═══════════ */
function h0Of(i,dist){if(i===0)return -0.8333;
  if(i===1){var par=Math.asin(6378.14/dist)*R2D;return 0.7275*par-0.5667}
  return -0.5667}
function altsAt(ms,lat,lon){var ep=epochOf(ms),bs=bodiesAt(ep);
  var lst=n360(gmstOf(ep.jd)+bs.dpsi*cd(bs.eps)+lon),out=new Array(10);
  for(var i=0;i<10;i++){var eq=equOf(bs.list[i].lam,bs.list[i].bet,bs.eps);
    out[i]={alt:altAz(eq.ra,eq.dec,lst,lat)-h0Of(i,bs.list[i].dist),raw:0}}
  return out}
function dailyEvents(ms0,tz,lat,lon){ /* ms0 = 当地 0 点的 UTC 毫秒 */
  var STEP=20*60000,N=73,alts=[],t,i;
  for(t=0;t<=N;t++)alts.push(altsAt(ms0+t*STEP,lat,lon));
  var ev=[];
  for(i=0;i<10;i++){var rise=null,set=null,trI=0,trV=-99;
    for(t=0;t<N;t++){var a=alts[t][i].alt,b=alts[t+1][i].alt;
      if(a<=0&&b>0&&rise==null)rise=refine(ms0+t*STEP,ms0+(t+1)*STEP,i,lat,lon,true);
      if(a>=0&&b<0&&set==null)set=refine(ms0+t*STEP,ms0+(t+1)*STEP,i,lat,lon,false);
      if(alts[t][i].alt>trV){trV=alts[t][i].alt;trI=t}}
    var tr=null;
    if(trI>0&&trI<N){var y0=alts[trI-1][i].alt,y1=alts[trI][i].alt,y2=alts[trI+1][i].alt,
      dn=(y0-2*y1+y2);var off=dn!==0?0.5*(y0-y2)/dn:0;tr=ms0+(trI+off)*STEP}
    ev[i]={rise:rise,set:set,transit:tr,circum:(rise==null&&set==null)?(trV>0?'恒显':'不升'):null}}
  return ev}
function refine(a,b,i,lat,lon,up){for(var k=0;k<14;k++){var m=(a+b)/2,v=altsAt(m,lat,lon)[i].alt;
  if((v>0)===up)b=m;else a=m}return (a+b)/2}
var CHALD=[6,5,4,0,3,2,1]; /* 土木火日金水月(天体索引) */
var DAY_RULER=[0,1,4,2,5,3,6]; /* 周日..周六 → 日月火水木金土 */
function planetaryHours(nowMs,tz,lat,lon){
  var loc=new Date(nowMs+tz*3600000);
  var mid=Date.UTC(loc.getUTCFullYear(),loc.getUTCMonth(),loc.getUTCDate())-tz*3600000;
  var evT=dailyEvents(mid,tz,lat,lon)[0];
  if(evT.rise==null||evT.set==null)return null;
  if(nowMs<evT.rise){mid-=86400000;evT=dailyEvents(mid,tz,lat,lon)[0];if(evT.rise==null||evT.set==null)return null}
  var evN=dailyEvents(mid+86400000,tz,lat,lon)[0];
  if(evN.rise==null)return null;
  var wd=new Date(mid+tz*3600000+43200000).getUTCDay();
  var ruler=DAY_RULER[wd],start=CHALD.indexOf(ruler);
  var slots=[],dl=(evT.set-evT.rise)/12,nl=(evN.rise-evT.set)/12,k;
  for(k=0;k<12;k++)slots.push({a:evT.rise+k*dl,b:evT.rise+(k+1)*dl,p:CHALD[(start+k)%7],day:true});
  for(k=0;k<12;k++)slots.push({a:evT.set+k*nl,b:evT.set+(k+1)*nl,p:CHALD[(start+12+k)%7],day:false});
  return {slots:slots,ruler:ruler,sunrise:evT.rise,sunset:evT.set}}
var TERM_CN=['春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒','立春','雨水','惊蛰'];
function sunLamAt(ms){return bodiesAt(epochOf(ms)).sunLam}
function termSolve(ms,target){var t=ms;for(var k=0;k<8;k++){t-=w180(sunLamAt(t)-target)/0.98565*86400000}return t}
function solarTerms(ms){var l=sunLamAt(ms),idx=Math.floor(n360(l)/15)%24;
  return {cur:TERM_CN[idx],curAt:termSolve(ms,idx*15),next:TERM_CN[(idx+1)%24],nextAt:termSolve(ms+86400000,((idx+1)%24)*15)}}

/* ═══════════ 9. 星等 / 天文星座(黄道带近似) ═══════════ */
function magOf(i,r,d,R,k){
  if(i===0)return -26.74;
  var ph=Math.acos(Math.max(-1,Math.min(1,(r*r+d*d-R*R)/(2*r*d))))*R2D,l5=5*Math.log10(r*d);
  switch(i){case 2:return -0.42+l5+0.0380*ph-0.000273*ph*ph+0.000002*ph*ph*ph;
    case 3:return -4.40+l5+0.0009*ph+0.000239*ph*ph-0.00000065*ph*ph*ph;
    case 4:return -1.52+l5+0.016*ph;case 5:return -9.40+l5+0.005*ph;
    case 6:return -8.88+l5+0.044*ph;case 7:return -7.19+l5;case 8:return -6.87+l5;case 9:return -1.01+l5}
  return null}
function moonMag(d,k){return -12.5-2.5*Math.log10(Math.max(k,0.0005))+5*Math.log10(d/385000.56)}
var CON_E=[29.09,53.47,90.43,118.11,138.17,174.24,217.80,241.14,248.03,266.30,299.71,327.88,351.57];
var CON_N=['白羊座','金牛座','双子座','巨蟹座','狮子座','室女座','天秤座','天蝎座','蛇夫座','人马座','摩羯座','宝瓶座','双鱼座'];
function constOf(lamJ){lamJ=n360(lamJ);if(lamJ<CON_E[0]||lamJ>=CON_E[12])return '双鱼座';
  for(var i=0;i<12;i++)if(lamJ>=CON_E[i]&&lamJ<CON_E[i+1])return CON_N[i];return '双鱼座'}

/* ═══════════ 10. 古典尊贵 / 区分 ═══════════ */
var RULER=[4,3,2,1,0,2,3,4,5,6,6,5];
var MOD_R={7:'冥王星',10:'天王星',11:'海王星'};
var EXALT={0:[0,19],1:[1,3],2:[5,15],3:[11,27],4:[9,28],5:[3,15],6:[6,21]};
var TRIP=[[0,5,6],[3,1,4],[6,2,5],[3,4,1]];
var SU=0,MO=1,ME=2,VE=3,MA=4,JU=5,SA=6;
var TERMS=[[[JU,6],[VE,12],[ME,20],[MA,25],[SA,30]],[[VE,8],[ME,14],[JU,22],[SA,27],[MA,30]],
[[ME,6],[JU,12],[VE,17],[MA,24],[SA,30]],[[MA,7],[VE,13],[ME,19],[JU,26],[SA,30]],
[[JU,6],[VE,11],[SA,18],[ME,24],[MA,30]],[[ME,7],[VE,17],[JU,21],[MA,28],[SA,30]],
[[SA,6],[ME,14],[JU,21],[VE,28],[MA,30]],[[MA,7],[VE,11],[ME,19],[JU,24],[SA,30]],
[[JU,12],[VE,17],[ME,21],[SA,26],[MA,30]],[[ME,7],[JU,14],[VE,22],[SA,26],[MA,30]],
[[ME,7],[VE,13],[JU,20],[MA,25],[SA,30]],[[VE,12],[JU,16],[ME,19],[MA,28],[SA,30]]];
var FACE=[MA,SU,VE,ME,MO,SA,JU];
function termRuler(lam){var s=Math.floor(n360(lam)/30),d=n360(lam)-s*30,t=TERMS[s];
  for(var i=0;i<5;i++)if(d<t[i][1])return t[i][0];return t[4][0]}
function faceRuler(lam){return FACE[Math.floor(n360(lam)/10)%7]}
function dignityOf(p,lam,isDay){
  if(p>6)return null;
  var s=Math.floor(n360(lam)/30),sc=0,b=[];
  if(RULER[s]===p){sc+=5;b.push(['庙','g'])}
  if(RULER[(s+6)%12]===p){sc-=5;b.push(['陷','r'])}
  var ex=EXALT[p];
  if(ex&&ex[0]===s){sc+=4;b.push(['旺','g'])}
  if(ex&&(ex[0]+6)%12===s){sc-=4;b.push(['落','r'])}
  var tr=TRIP[s%4];if((isDay?tr[0]:tr[1])===p||tr[2]===p){sc+=3;b.push(['三分','g'])}
  if(termRuler(lam)===p){sc+=2;b.push(['界','g'])}
  if(faceRuler(lam)===p){sc+=1;b.push(['面','g'])}
  return {score:sc,badges:b}}

/* ═══════════ 11. 相位 ═══════════ */
var ASP=[{k:0,cn:'合',g:'☌',cls:'conj'},{k:60,cn:'六合',g:'✶',cls:'soft'},{k:90,cn:'刑',g:'□',cls:'hard'},
{k:120,cn:'拱',g:'△',cls:'soft'},{k:180,cn:'冲',g:'☍',cls:'hard'}];
var ORBS={tight:{0:5,60:3,90:5,120:5,180:5},std:{0:8,60:4,90:7,120:8,180:8},wide:{0:10,60:6,90:8,120:9,180:10}};
function calcAspects(pts,orbSet,cross){
  var out=[],i,j,a;
  for(i=0;i<pts.length;i++)for(j=cross?0:i+1;j<(cross?cross.length:pts.length);j++){
    var A=pts[i],B=cross?cross[j]:pts[j];
    var sep=Math.abs(w180(A.lam-B.lam));
    for(a=0;a<ASP.length;a++){var K=ASP[a],lim=orbSet[K.k]+((A.i===0||A.i===1||B.i===0||B.i===1)?1:0);
      var orb=Math.abs(sep-K.k);
      if(orb<=lim){var ap=null;
        if(A.spd!=null&&B.spd!=null&&Math.abs(A.spd)<20&&Math.abs(B.spd)<20){
          var s2=Math.abs(w180((A.lam+A.spd*0.05)-(B.lam+B.spd*0.05)));
          ap=Math.abs(s2-K.k)<orb}
        out.push({a:A,b:B,asp:K,orb:orb,app:ap});break}}}
  out.sort(function(x,y){return x.orb-y.orb});return out}

/* ═══════════ 12. 月相 ═══════════ */
function phaseName(psi){var n=['新月','娥眉月','上弦月','盈凸月','满月','亏凸月','下弦月','残月'];
  var i=Math.floor(((psi+22.5)%360)/45);return n[i]}
function moonSVGPath(cx,cy,r,psi){
  var k=(1-cd(psi))/2,wax=n360(psi)<180,rx=Math.abs(cd(psi))*r;
  var so=wax?1:0;
  var si=(k<0.5)?(wax?0:1):(wax?1:0);
  return 'M '+cx+' '+(cy-r)+' A '+r+' '+r+' 0 0 '+so+' '+cx+' '+(cy+r)+' A '+rx.toFixed(2)+' '+r+' 0 0 '+si+' '+cx+' '+(cy-r)+' Z'}

/* ════════ Node 环境:导出引擎供测试;浏览器环境:构建界面 ════════ */
if(typeof module!=='undefined'&&module.exports){
  module.exports={epochOf:epochOf,bodiesAt:bodiesAt,gmstOf:gmstOf,computeChart:computeChart,
    dailyEvents:dailyEvents,planetaryHours:planetaryHours,solarTerms:solarTerms,ascMc:ascMc,
    housesOf:housesOf,equOf:equOf,altAz:altAz,dignityOf:dignityOf,constOf:constOf,calcAspects:calcAspects,
    sunLamAt:sunLamAt,nutObl:nutObl,fmtLon:fmtLon};
  return}

/* ═══════════ 13. 样式 ═══════════ */
var CSS=''+
'#page-sign{max-width:1140px}'+
'#page-sign{--sgl:rgba(190,208,240,0.5);--sgl2:rgba(190,208,240,0.18);--sgt:#dfe7f5;--sgm:#93a5c6;--sga:var(--accent-light);'+
'--sgfire:#d9987a;--sgearth:#a9bd8b;--sgair:#9fc0e8;--sgwater:#88a8d8;--sggood:#7cc4b2;--sgbad:#d8909a;--sgconj:#d8c78f;'+
'--sgcard:rgba(182,204,238,0.06);--sgbd:rgba(186,206,242,0.12)}'+
'body:not(.theme-infernal) #page-sign.page.active{--sgl:rgba(30,70,125,0.5);--sgl2:rgba(30,70,125,0.16);--sgt:#152c58;--sgm:#4b6690;'+
'--sga:#2a6bb0;--sgfire:#b4653f;--sgearth:#5e7d3f;--sgair:#2f6cb0;--sgwater:#2f5a96;--sggood:#1f8a72;--sgbad:#b04a58;--sgconj:#a08328;'+
'--sgcard:rgba(251,253,255,0.5);--sgbd:rgba(205,228,249,0.35)}'+
'.sg-card{background:var(--sgcard);border:1px solid var(--sgbd);border-radius:12px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:16px 18px;color:var(--sgt)}'+
'.sg-toolbar{display:flex;flex-wrap:wrap;gap:14px 22px;margin-bottom:20px;align-items:flex-end}'+
'.sg-group{display:flex;flex-direction:column;gap:6px}'+
'.sg-lab{font-family:Raleway,sans-serif;font-weight:300;font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--sgm)}'+
'.sg-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}'+
'.sg-in{background:rgba(120,150,200,0.10);border:1px solid var(--sgbd);border-radius:9px;color:var(--sgt);padding:6px 9px;font-size:0.8rem;font-family:"Noto Sans SC",sans-serif;outline:none;transition:border-color 0.3s}'+
'.sg-in:focus{border-color:var(--sga)}'+
'body:not(.theme-infernal) #page-sign.page.active .sg-in{background:rgba(245,250,255,0.65);border-color:rgba(170,210,245,0.4);color:#1a3262}'+
'.sg-in.w60{width:64px}.sg-in.w90{width:96px}.sg-in.w130{width:136px}'+
'.sg-chip{padding:5px 14px;border-radius:20px;border:1px solid var(--sgbd);background:transparent;color:var(--sgm);font-size:0.76rem;cursor:pointer;font-family:"Noto Sans SC",sans-serif;transition:all 0.3s}'+
'.sg-chip.on{color:var(--sgt);border-color:var(--sga);background:rgba(114,168,216,0.14);box-shadow:0 0 10px rgba(114,168,216,0.12)}'+
'.sg-main{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,1fr);gap:20px;margin-bottom:22px}'+
'@media(max-width:960px){.sg-main{grid-template-columns:1fr}}'+
'.sg-wheelwrap{display:flex;flex-direction:column;align-items:center;gap:10px}'+
'#sg-wheel{width:100%;max-width:640px;height:auto;display:block}'+
'.sg-cap{font-size:0.74rem;color:var(--sgm);text-align:center;line-height:1.7}'+
'.sg-houses{display:flex;flex-wrap:wrap;gap:5px 12px;justify-content:center;font-size:0.7rem;color:var(--sgm);font-variant-numeric:tabular-nums}'+
'.sg-houses b{color:var(--sgt);font-weight:400}'+
'.sg-clock{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:1.9rem;letter-spacing:0.06em;color:var(--sgt);line-height:1.1}'+
'.sg-clock small{font-size:0.95rem;font-weight:400;color:var(--sgm);letter-spacing:0.04em}'+
'.sg-gl-row{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed var(--sgl2);font-size:0.8rem;align-items:center}'+
'.sg-gl-row:last-child{border-bottom:none}'+
'.sg-gl-k{color:var(--sgm);flex-shrink:0}.sg-gl-v{color:var(--sgt);text-align:right;font-variant-numeric:tabular-nums;line-height:1.6}'+
'.sg-st{font-family:Raleway,"Noto Sans SC",sans-serif;font-weight:300;font-size:0.72rem;letter-spacing:0.24em;text-transform:uppercase;color:var(--sgm);margin:26px 0 10px;display:flex;align-items:center;gap:12px}'+
'.sg-st::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,var(--sgl2),transparent)}'+
'.sg-tablewrap{overflow-x:auto}'+
'.sg-table{width:100%;border-collapse:collapse;font-size:0.79rem;font-variant-numeric:tabular-nums;white-space:nowrap}'+
'.sg-table th{font-family:Raleway,"Noto Sans SC",sans-serif;font-weight:300;font-size:0.64rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--sgm);text-align:left;padding:7px 12px;border-bottom:1px solid var(--sgl2)}'+
'.sg-table td{padding:7px 12px;border-bottom:1px dashed var(--sgl2);color:var(--sgt)}'+
'.sg-table tr:last-child td{border-bottom:none}'+
'.sg-table tr:hover td{background:rgba(114,168,216,0.07)}'+
'.sg-gly{font-family:"Segoe UI Symbol","Noto Sans Symbols 2","Noto Sans Symbols","Noto Sans SC",sans-serif}'+
'.sg-badge{display:inline-block;padding:1px 7px;border-radius:9px;font-size:0.66rem;margin:0 2px;border:1px solid}'+
'.sg-badge.g{color:var(--sggood);border-color:var(--sggood)}'+
'.sg-badge.r{color:var(--sgbad);border-color:var(--sgbad)}'+
'.sg-retro{display:inline-block;padding:0 5px;border-radius:7px;font-size:0.62rem;color:var(--sgbad);border:1px solid var(--sgbad);margin-left:5px;vertical-align:1px}'+
'.sg-asplay{display:grid;grid-template-columns:auto minmax(240px,1fr);gap:22px;align-items:start}'+
'@media(max-width:860px){.sg-asplay{grid-template-columns:1fr}}'+
'#sg-aspgrid{border-collapse:collapse;font-size:0.8rem}'+
'#sg-aspgrid td,#sg-aspgrid th{width:30px;height:30px;text-align:center;border:1px solid var(--sgl2);padding:0}'+
'#sg-aspgrid th{color:var(--sgm);font-weight:400}'+
'#sg-aspgrid td.conj{color:var(--sgconj)}#sg-aspgrid td.soft{color:var(--sggood)}#sg-aspgrid td.hard{color:var(--sgbad)}'+
'.sg-asplist{display:flex;flex-direction:column;gap:2px;font-size:0.8rem;max-height:380px;overflow-y:auto}'+
'.sg-aspitem{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border-radius:8px;font-variant-numeric:tabular-nums}'+
'.sg-aspitem:hover{background:rgba(114,168,216,0.08)}'+
'.sg-aspitem .t{width:auto;min-width:120px;color:var(--sgt)}'+
'.sg-aspitem .o{color:var(--sgm)}'+
'.sg-aspitem.conj .g2{color:var(--sgconj)}.sg-aspitem.soft .g2{color:var(--sggood)}.sg-aspitem.hard .g2{color:var(--sgbad)}'+
'.sg-hours{display:grid;grid-template-columns:1fr 1fr;gap:0 26px}'+
'@media(max-width:700px){.sg-hours{grid-template-columns:1fr}}'+
'.sg-hr{display:flex;gap:12px;font-size:0.76rem;padding:4px 8px;border-radius:7px;font-variant-numeric:tabular-nums;color:var(--sgm)}'+
'.sg-hr b{font-weight:400;color:var(--sgt);width:5.2em}'+
'.sg-hr.now{background:rgba(114,168,216,0.14);color:var(--sgt);box-shadow:inset 0 0 0 1px var(--sga)}'+
'.sg-note{font-size:0.68rem;color:var(--sgm);opacity:0.75;margin-top:26px;line-height:1.8}'+
'.sg-wheel-l{stroke:var(--sgl);fill:none}'+
'.sg-wheel-l2{stroke:var(--sgl2);fill:none}'+
'.sg-wheel-t{fill:var(--sgt)}'+
'.sg-wheel-m{fill:var(--sgm)}'+
'.sg-asp-line.conj{stroke:var(--sgconj)}.sg-asp-line.soft{stroke:var(--sggood)}.sg-asp-line.hard{stroke:var(--sgbad)}'+
'.sg-el0{fill:var(--sgfire)}.sg-el1{fill:var(--sgearth)}.sg-el2{fill:var(--sgair)}.sg-el3{fill:var(--sgwater)}'+
'#page-sign .sg-glance .sg-moon-dark{fill:rgba(130,155,200,0.16)}'+
'#page-sign .sg-glance .sg-moon-lit{fill:var(--sgt);opacity:0.9}';

/* ═══════════ 14. 页面骨架 ═══════════ */
var TZ_LIST=[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3.5,-3,-2,-1,0,1,2,3,3.5,4,4.5,5,5.5,5.75,6,6.5,7,8,8.75,9,9.5,10,10.5,11,12,12.75,13,14];
function tzLabel(v){var s=v<0?'−':'+';var a=Math.abs(v),h=Math.floor(a),m=Math.round((a-h)*60);
  return 'UTC'+s+h+(m?':'+p2(m):'')}
function buildHTML(){
  var tzOpts=TZ_LIST.map(function(v){return '<option value="'+v+'">'+tzLabel(v)+'</option>'}).join('');
  return ''+
'<div class="module-intro"><div class="module-intro-top"><h2>Sign</h2>'+
'<span class="module-intro-sub"><span class="mi-sub-int">Astrolabe &amp; Ephemeris</span><span class="mi-sub-inf">As above, so below</span></span></div>'+
'<div class="module-intro-rule"></div>'+
'<div class="module-intro-desc">古典占星 · 现代占星 · 天文历表。全部计算在本页面内完成,不联网;地点与命盘仅保存在本设备。</div></div>'+
'<div class="sg-card sg-toolbar">'+
'<div class="sg-group"><span class="sg-lab">Time · 时刻</span><div class="sg-row">'+
'<button class="sg-chip on" id="sg-mode-now">此刻</button><button class="sg-chip" id="sg-mode-fix">指定时刻</button>'+
'<input type="date" class="sg-in" id="sg-d" disabled><input type="time" class="sg-in" id="sg-t" disabled>'+
'<select class="sg-in" id="sg-tz" disabled>'+tzOpts+'</select></div></div>'+
'<div class="sg-group"><span class="sg-lab">Place · 地点</span><div class="sg-row">'+
'<input class="sg-in w130" id="sg-place" placeholder="地点名称">'+
'<input class="sg-in w90" id="sg-lat" placeholder="纬度(北+)"><input class="sg-in w90" id="sg-lon" placeholder="经度(东+)">'+
'<button class="btn" id="sg-geo">使用当前位置</button></div></div>'+
'<div class="sg-group"><span class="sg-lab">System · 体系</span><div class="sg-row">'+
'<select class="sg-in" id="sg-house"><option value="whole">整宫制(古典)</option><option value="placidus">Placidus(现代)</option><option value="equal">等宫制</option></select>'+
'<select class="sg-in" id="sg-orb"><option value="tight">容许度 · 紧</option><option value="std" selected>容许度 · 标准</option><option value="wide">容许度 · 宽</option></select></div></div>'+
'<div class="sg-group"><span class="sg-lab">Charts · 命盘</span><div class="sg-row">'+
'<select class="sg-in" id="sg-saved"><option value="">未选择命盘</option></select>'+
'<input class="sg-in w90" id="sg-name" placeholder="命名">'+
'<button class="btn" id="sg-save">保存此盘</button><button class="btn" id="sg-del">删除</button>'+
'<label style="display:flex;align-items:center;gap:6px;font-size:0.76rem;cursor:pointer;color:inherit">'+
'<input type="checkbox" id="sg-transit" style="width:auto;accent-color:var(--accent)" disabled>行运对照</label>'+
'<button class="btn" id="sg-copy">复制文本报告</button></div></div>'+
'</div>'+
'<div class="sg-main">'+
'<div class="sg-card sg-wheelwrap"><div class="sg-cap" id="sg-wheel-cap"></div><svg id="sg-wheel" viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg"></svg><div class="sg-houses" id="sg-houses"></div></div>'+
'<div class="sg-card sg-glance" id="sg-glance"></div></div>'+
'<div class="sg-st">Positions · 行星位置</div><div class="sg-card sg-tablewrap"><table class="sg-table" id="sg-pos"></table></div>'+
'<div class="sg-st">Aspects · 相位</div><div class="sg-card"><div class="sg-asplay"><div class="sg-tablewrap"><table id="sg-aspgrid"></table></div><div class="sg-asplist" id="sg-asplist"></div></div></div>'+
'<div class="sg-st">Dignities · 古典尊贵</div><div class="sg-card sg-tablewrap" id="sg-digwrap"><table class="sg-table" id="sg-dig"></table></div>'+
'<div class="sg-st">Planetary Hours · 行星时</div><div class="sg-card" id="sg-hourwrap"><div class="sg-hours" id="sg-hours"></div></div>'+
'<div class="sg-st">Almanac · 观测数据</div><div class="sg-card sg-tablewrap"><table class="sg-table" id="sg-astro"></table></div>'+
'<div class="sg-note">计算说明:行星位置采用开普勒根数近似(适用约 1800–2050 年),月亮采用截断周期项级数;位置精度约 1 角分,升落时刻精度约 1 分钟。坐标为地心视位置;"天文星座"按黄道带近似判定。数据满足排盘与日常观星,不适用于专业望远镜指向。</div>'}

/* ═══════════ 15. 状态 ═══════════ */
var S={mode:'now',tz:-(new Date().getTimezoneOffset())/60,lat:39.904,lon:116.407,place:'北京(默认,请设置)',
  house:'whole',orb:'std',charts:[],chartSel:'',transit:false,timer:null,last:null,lastT:null,daily:null,dailyKey:'',hours:null};
function loadS(){try{
  var s=JSON.parse(localStorage.getItem('ib_sign_settings')||'{}');
  if(s.lat!=null){S.lat=s.lat;S.lon=s.lon;S.place=s.place||'';}
  if(s.house)S.house=s.house;if(s.orb)S.orb=s.orb;
  S.charts=JSON.parse(localStorage.getItem('ib_sign_charts')||'[]')}catch(e){}}
function saveS(){try{localStorage.setItem('ib_sign_settings',JSON.stringify({lat:S.lat,lon:S.lon,place:S.place,house:S.house,orb:S.orb}));
  localStorage.setItem('ib_sign_charts',JSON.stringify(S.charts))}catch(e){}}
function say(m){if(typeof toast==='function')toast(m);else try{console.log(m)}catch(e){}}
function $(id){return document.getElementById(id)}

/* ═══════════ 16. 渲染:星盘 ═══════════ */
var WHEEL_BODIES=[0,1,2,3,4,5,6,7,8,9,10];
function pt(cx,cy,r,ang){return [cx+r*cd(ang),cy-r*sd(ang)]}
function spreadLams(items,minGap){
  var s=items.slice().sort(function(a,b){return a.lam-b.lam});
  for(var pass=0;pass<3;pass++)for(var i=0;i<s.length;i++){
    var a=s[i],b=s[(i+1)%s.length];var gap=n360(b.lam-a.lam);
    if(gap<minGap){var push=(minGap-gap)/2;a.lam=n360(a.lam-push);b.lam=n360(b.lam+push)}}
  return s}
function renderWheel(natal,tran){
  var svg=$('sg-wheel');if(!svg)return;
  var cx=340,cy=340,asc=natal.asc;
  function A(lam){return n360(lam-asc+180)}
  var bi=!!tran;
  var R_SIGN_O=322,R_SIGN_I=292,R_TICK=268,R_CUSP=bi?226:R_TICK;
  var R_PL=bi?196:208,R_PLTX=bi?172:184,R_ASPV=bi?156:166,R_TPL=246,R_TTX=null;
  var o='';
  o+='<circle cx="340" cy="340" r="'+R_SIGN_O+'" class="sg-wheel-l" stroke-width="1"/>';
  o+='<circle cx="340" cy="340" r="'+R_SIGN_I+'" class="sg-wheel-l" stroke-width="0.8"/>';
  o+='<circle cx="340" cy="340" r="'+R_TICK+'" class="sg-wheel-l2" stroke-width="0.8"/>';
  if(bi)o+='<circle cx="340" cy="340" r="'+R_CUSP+'" class="sg-wheel-l2" stroke-width="0.8"/>';
  o+='<circle cx="340" cy="340" r="'+R_ASPV+'" class="sg-wheel-l2" stroke-width="0.8"/>';
  var t1='',t5='',t10='',i,pp,qq;
  for(i=0;i<360;i++){var ln=(i%10===0)?9:(i%5===0)?6:3.2;
    pp=pt(cx,cy,R_SIGN_I,A(i));qq=pt(cx,cy,R_SIGN_I-ln,A(i));
    var seg='M'+pp[0].toFixed(1)+' '+pp[1].toFixed(1)+'L'+qq[0].toFixed(1)+' '+qq[1].toFixed(1);
    if(i%10===0)t10+=seg;else if(i%5===0)t5+=seg;else t1+=seg}
  o+='<path d="'+t1+'" class="sg-wheel-l2" stroke-width="0.5"/><path d="'+t5+'" class="sg-wheel-l" stroke-width="0.6" opacity="0.55"/><path d="'+t10+'" class="sg-wheel-l" stroke-width="0.8" opacity="0.8"/>';
  for(i=0;i<12;i++){
    pp=pt(cx,cy,R_SIGN_O,A(i*30));qq=pt(cx,cy,R_SIGN_I,A(i*30));
    o+='<line x1="'+pp[0].toFixed(1)+'" y1="'+pp[1].toFixed(1)+'" x2="'+qq[0].toFixed(1)+'" y2="'+qq[1].toFixed(1)+'" class="sg-wheel-l" stroke-width="0.8"/>';
    var gm=pt(cx,cy,(R_SIGN_O+R_SIGN_I)/2,A(i*30+15));
    o+='<text x="'+gm[0].toFixed(1)+'" y="'+gm[1].toFixed(1)+'" class="sg-gly sg-el'+(i%4)+'" font-size="17" text-anchor="middle" dominant-baseline="central" opacity="0.9">'+SIGN_G[i]+'</text>'}
  /* 宫头 */
  var C=natal.houses.c;
  for(i=1;i<=12;i++){
    pp=pt(cx,cy,R_ASPV,A(C[i]));qq=pt(cx,cy,R_CUSP,A(C[i]));
    var main=(i===1||i===10);
    o+='<line x1="'+pp[0].toFixed(1)+'" y1="'+pp[1].toFixed(1)+'" x2="'+qq[0].toFixed(1)+'" y2="'+qq[1].toFixed(1)+'" class="sg-wheel-l'+(main?'':'2')+'" stroke-width="'+(main?1.6:0.7)+'"/>';
    var mid=n360(C[i]+n360(C[i%12+1]-C[i])/2);
    var np=pt(cx,cy,R_ASPV+11,A(mid));
    o+='<text x="'+np[0].toFixed(1)+'" y="'+np[1].toFixed(1)+'" class="sg-wheel-m" font-size="10" text-anchor="middle" dominant-baseline="central" opacity="0.8">'+i+'</text>'}
  /* ASC / MC 轴 */
  [['ASC',natal.asc],['MC',natal.mc]].forEach(function(ax){
    var e1=pt(cx,cy,R_SIGN_O+6,A(ax[1])),e2=pt(cx,cy,R_SIGN_O+22,A(ax[1]));
    o+='<line x1="'+e1[0].toFixed(1)+'" y1="'+e1[1].toFixed(1)+'" x2="'+((e1[0]+e2[0])/2).toFixed(1)+'" y2="'+((e1[1]+e2[1])/2).toFixed(1)+'" class="sg-wheel-l" stroke-width="1.6"/>';
    o+='<text x="'+e2[0].toFixed(1)+'" y="'+e2[1].toFixed(1)+'" class="sg-wheel-t" font-family="Raleway,sans-serif" font-size="10.5" letter-spacing="1.5" text-anchor="middle" dominant-baseline="central">'+ax[0]+'</text>'});
  /* 相位线 */
  var aspPts,aspects;
  if(bi){
    aspPts=null;
    aspects=S.lastAspects=calcAspects(tran.bodies.slice(0,10).concat([]),ORBS[S.orb],
      natal.bodies.slice(0,10).concat([{i:'ASC',lam:natal.asc,spd:null},{i:'MC',lam:natal.mc,spd:null}]));
  }else{
    aspects=S.lastAspects=calcAspects(natal.bodies.slice(0,10).concat([{i:'ASC',lam:natal.asc,spd:null},{i:'MC',lam:natal.mc,spd:null}]),ORBS[S.orb]);
  }
  aspects.forEach(function(x){
    var rA=(bi?R_TPL-14:R_ASPV),rB=R_ASPV;
    var p1=pt(cx,cy,bi?rA:R_ASPV,A(x.a.lam)),p2v=pt(cx,cy,rB,A(x.b.lam));
    var wgt=x.orb<1?1.5:x.orb<3?1:0.6,op=(1-x.orb/10)*0.85+0.1;
    o+='<line x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2v[0].toFixed(1)+'" y2="'+p2v[1].toFixed(1)+'" class="sg-asp-line '+x.asp.cls+'" stroke-width="'+wgt+'" opacity="'+op.toFixed(2)+'"/>'});
  /* 行星(内圈) */
  function drawSet(bodies,rP,rT,fs,tag){
    var disp=bodies.map(function(b){return {i:b.i,lam:b.lam,lam0:b.lam,retro:b.retro}});
    disp=spreadLams(disp,fs*1.05);
    var s2='';
    disp.forEach(function(d){
      var tickR=tag?R_TICK:(bi?R_CUSP:R_TICK);var g=pt(cx,cy,rP,A(d.lam)),tick1=pt(cx,cy,tickR,A(d.lam0)),tick2=pt(cx,cy,tickR-6,A(d.lam0));
      s2+='<line x1="'+tick1[0].toFixed(1)+'" y1="'+tick1[1].toFixed(1)+'" x2="'+tick2[0].toFixed(1)+'" y2="'+tick2[1].toFixed(1)+'" class="sg-wheel-l" stroke-width="1.2"/>';
      s2+='<text data-b="'+tag+d.i+'" x="'+g[0].toFixed(1)+'" y="'+g[1].toFixed(1)+'" class="sg-gly sg-wheel-t" font-size="'+fs+'" text-anchor="middle" dominant-baseline="central">'+B_G[d.i]+(d.retro?'<tspan font-size="'+(fs*0.5)+'" fill="var(--sgbad)" dy="-6"> R</tspan>':'')+'</text>';
      var f=fmtLon(d.lam0),dt=pt(cx,cy,rT,A(d.lam));
      s2+='<text x="'+dt[0].toFixed(1)+'" y="'+dt[1].toFixed(1)+'" class="sg-wheel-m" font-size="8.6" text-anchor="middle" dominant-baseline="central">'+Math.floor(n360(d.lam0)%30)+'°</text>'});
    return s2}
  o+=drawSet(natal.bodies.filter(function(b){return WHEEL_BODIES.indexOf(b.i)>=0}),R_PL,R_PLTX,bi?15:18,'');
  if(bi){
    o+=drawSet(tran.bodies.filter(function(b){return b.i<=9}),R_TPL,R_TPL+16,13,'t');
  }
  svg.innerHTML=o;
  $('sg-wheel-cap').innerHTML=bi?
    ('内圈 · 本命 '+esc(S.chartName||'')+' '+chartTimeStr(natal)+' &nbsp;·&nbsp; 外圈 · 行运 '+chartTimeStr(tran)):
    (chartTimeStr(natal)+' · '+esc(S.place||'')+' ('+S.lat.toFixed(3)+', '+S.lon.toFixed(3)+')');
  var hs=natal.houses,ht='';
  if(hs.fallback)ht+='<span>高纬度下 Placidus 不可用,已改用整宫制</span>';
  for(i=1;i<=12;i++){var f2=fmtLon(hs.c[i]);ht+='<span><b>'+i+'宫</b> '+f2.full.replace(/ /g,'')+'</span>'}
  $('sg-houses').innerHTML=ht}
function chartTimeStr(ch){var d=new Date(ch.ep.ms+ch.tz*3600000);
  return d.getUTCFullYear()+'-'+p2(d.getUTCMonth()+1)+'-'+p2(d.getUTCDate())+' '+p2(d.getUTCHours())+':'+p2(d.getUTCMinutes())+' '+tzLabel(ch.tz)}

/* ═══════════ 17. 渲染:速览 / 表格 ═══════════ */
function renderGlance(ch,ev,hours,terms){
  var b=ch.bodies,mo=b[1];
  var psi=ch.moonPsi,k=ch.moonK;
  var moonDia=2*Math.asin(1737.4/mo.dist)*R2D*60,sunDia=2*Math.asin(696000/(ch.sunR*AUKM))*R2D*60;
  var lstH=ch.lst/15,lh=Math.floor(lstH),lm=Math.floor((lstH-lh)*60),ls=Math.floor((((lstH-lh)*60)-lm)*60);
  var curHr=null;
  if(hours)for(var i=0;i<hours.slots.length;i++){var s=hours.slots[i];if(ch.ep.ms>=s.a&&ch.ep.ms<s.b){curHr=s;break}}
  var h='<div class="sg-clock" id="sg-clock-line"></div>';
  h+='<div style="height:10px"></div>';
  function row(kk,vv){return '<div class="sg-gl-row"><span class="sg-gl-k">'+kk+'</span><span class="sg-gl-v">'+vv+'</span></div>'}
  h+=row('本地恒星时',p2(lh)+':'+p2(lm)+':'+p2(ls));
  h+=row('三要素','<span class="sg-gly">☉</span> '+fmtLon(b[0].lam).full+'<br><span class="sg-gly">☽</span> '+fmtLon(b[1].lam).full+'<br>ASC '+fmtLon(ch.asc).full);
  h+=row('昼夜区分',(ch.day?'昼盘 · 区分光体 太阳':'夜盘 · 区分光体 月亮'));
  if(curHr)h+=row('当前行星时','<span class="sg-gly">'+B_G[curHr.p]+'</span> '+B_CN[curHr.p]+'时 · 至 '+fmtHM(curHr.b,ch.tz));
  if(ev){h+=row('日出 / 日落',fmtHM(ev[0].rise,ch.tz)+' / '+fmtHM(ev[0].set,ch.tz));
    h+=row('月出 / 月落',fmtHM(ev[1].rise,ch.tz)+' / '+fmtHM(ev[1].set,ch.tz))}
  var mp='<svg width="46" height="46" viewBox="0 0 46 46" style="vertical-align:middle;margin-left:8px"><circle cx="23" cy="23" r="20" class="sg-moon-dark"/><path d="'+moonSVGPath(23,23,20,psi)+'" class="sg-moon-lit"/></svg>';
  h+=row('月相',phaseName(psi)+' · 照亮 '+(k*100).toFixed(1)+'% · 月龄 '+(psi/360*29.530588).toFixed(1)+' 日'+mp);
  h+=row('视直径','太阳 '+sunDia.toFixed(1)+'′ · 月亮 '+moonDia.toFixed(1)+'′');
  if(terms)h+=row('节气',terms.cur+'(自 '+fmtDate(terms.curAt,ch.tz)+')<br>下一个 '+terms.next+' · '+fmtDate(terms.nextAt,ch.tz)+' '+fmtHM(terms.nextAt,ch.tz));
  $('sg-glance').innerHTML=h;
  updateClockLine(ch)}
function updateClockLine(ch){var el=$('sg-clock-line');if(!el)return;
  var live=(S.mode==='now'||S.transit);
  var ms=live?Date.now():ch.ep.ms;var d=new Date(ms+ch.tz*3600000);
  var wd=['周日','周一','周二','周三','周四','周五','周六'][d.getUTCDay()];
  el.innerHTML=p2(d.getUTCHours())+':'+p2(d.getUTCMinutes())+':'+p2(d.getUTCSeconds())+
    ' <small>'+d.getUTCFullYear()+'-'+p2(d.getUTCMonth()+1)+'-'+p2(d.getUTCDate())+' '+wd+' · '+tzLabel(ch.tz)+'</small>'}
function renderPos(ch){
  var t='<tr><th>星体</th><th>黄道位置</th><th>宫位</th><th>日行速度</th><th>古典尊贵</th></tr>';
  ch.bodies.forEach(function(b){
    var f=fmtLon(b.lam),dg=dignityOf(b.i,b.lam,ch.day),badges='';
    if(dg){dg.badges.forEach(function(x){badges+='<span class="sg-badge '+x[1]+'">'+x[0]+'</span>'});
      if(dg.badges.length)badges+=' <span style="color:var(--sgm)">'+(dg.score>0?'+':'')+dg.score+'</span>';else badges='—'}
    else badges='<span style="opacity:0.45">现代星体</span>';
    t+='<tr><td><span class="sg-gly">'+B_G[b.i]+'</span> '+B_CN[b.i]+'</td><td><span class="sg-gly">'+SIGN_G[f.s]+'</span> '+SIGN_CN[f.s]+' '+f.txt+'</td>'+
      '<td>第 '+b.house+' 宫</td><td>'+(b.spd>=0?'+':'−')+Math.abs(b.spd).toFixed(2)+'°'+(b.retro?'<span class="sg-retro">逆 R</span>':'')+'</td><td>'+badges+'</td></tr>'});
  var fa=fmtLon(ch.asc),fm=fmtLon(ch.mc);
  t+='<tr><td>上升 ASC</td><td><span class="sg-gly">'+SIGN_G[fa.s]+'</span> '+SIGN_CN[fa.s]+' '+fa.txt+'</td><td>—</td><td>—</td><td>—</td></tr>';
  t+='<tr><td>中天 MC</td><td><span class="sg-gly">'+SIGN_G[fm.s]+'</span> '+SIGN_CN[fm.s]+' '+fm.txt+'</td><td>—</td><td>—</td><td>—</td></tr>';
  $('sg-pos').innerHTML=t}
function aspName(x){return (typeof x.i==='string')?x.i:'<span class="sg-gly">'+B_G[x.i]+'</span>'}
function renderAspects(ch,tran){
  var pts,cross=null;
  if(tran){pts=tran.bodies.slice(0,10);
    cross=ch.bodies.slice(0,10).concat([{i:'ASC',lam:ch.asc,spd:null},{i:'MC',lam:ch.mc,spd:null}])}
  else pts=ch.bodies.slice(0,10).concat([{i:'ASC',lam:ch.asc,spd:null},{i:'MC',lam:ch.mc,spd:null}]);
  var list=calcAspects(pts,ORBS[S.orb],cross);
  var g='',cols=cross||pts,rows=pts,i,j;
  g+='<tr><th></th>'+cols.map(function(c){return '<th class="sg-gly">'+(typeof c.i==='string'?c.i:B_G[c.i])+'</th>'}).join('')+'</tr>';
  for(i=0;i<rows.length;i++){g+='<tr><th class="sg-gly">'+(typeof rows[i].i==='string'?rows[i].i:B_G[rows[i].i])+'</th>';
    for(j=0;j<cols.length;j++){
      if(!cross&&j<=i){g+='<td'+(j===i?' style="background:rgba(114,168,216,0.05)"':'')+'></td>';continue}
      var hit=null;
      for(var q=0;q<list.length;q++){var L=list[q];
        if((L.a===rows[i]&&L.b===cols[j])||(!cross&&L.a===cols[j]&&L.b===rows[i])){hit=L;break}}
      g+=hit?'<td class="'+hit.asp.cls+'" title="'+B_CNor(rows[i])+' '+hit.asp.cn+' '+B_CNor(cols[j])+' · 容许 '+hit.orb.toFixed(1)+'°"><span class="sg-gly">'+hit.asp.g+'</span></td>':'<td></td>'}
    g+='</tr>'}
  $('sg-aspgrid').innerHTML=g;
  var l2='';
  list.forEach(function(x){
    l2+='<div class="sg-aspitem '+x.asp.cls+'"><span class="t"><span class="sg-gly">'+glyOr(x.a)+'</span> <span class="g2 sg-gly">'+x.asp.g+'</span> '+x.asp.cn+' <span class="sg-gly">'+glyOr(x.b)+'</span> '+B_CNor(x.b)+'</span>'+
      '<span class="o">'+x.orb.toFixed(2)+'°'+(x.app===true?' · 入相位':x.app===false?' · 出相位':'')+'</span></div>'});
  $('sg-asplist').innerHTML=l2||'<div style="color:var(--sgm);font-size:0.8rem">当前容许度内没有相位</div>'}
function glyOr(x){return typeof x.i==='string'?x.i:B_G[x.i]}
function B_CNor(x){return typeof x.i==='string'?x.i:B_CN[x.i]}
function renderDig(ch){
  var t='<tr><th>星体</th><th>所在</th><th>庙主</th><th>旺</th><th>三分主('+(ch.day?'昼':'夜')+')</th><th>界主</th><th>面主</th><th>合计</th></tr>';
  for(var p=0;p<=6;p++){var b=ch.bodies[p],f=fmtLon(b.lam),s=f.s;
    var tr=TRIP[s%4],dg=dignityOf(p,b.lam,ch.day);
    var exalt='—';for(var e in EXALT)if(EXALT[e][0]===s)exalt='<span class="sg-gly">'+B_G[e]+'</span> '+EXALT[e][1]+'°';
    t+='<tr><td><span class="sg-gly">'+B_G[p]+'</span> '+B_CN[p]+'</td><td><span class="sg-gly">'+SIGN_G[s]+'</span> '+SIGN_CN[s]+' '+f.txt+'</td>'+
      '<td><span class="sg-gly">'+B_G[RULER[s]]+'</span>'+(MOD_R[s]?'<span style="opacity:0.55;font-size:0.68rem"> /'+MOD_R[s]+'</span>':'')+'</td>'+
      '<td>'+exalt+'</td><td><span class="sg-gly">'+B_G[ch.day?tr[0]:tr[1]]+'</span><span style="opacity:0.55"> · 伴 '+'<span class="sg-gly">'+B_G[tr[2]]+'</span></span></td>'+
      '<td><span class="sg-gly">'+B_G[termRuler(b.lam)]+'</span></td><td><span class="sg-gly">'+B_G[faceRuler(b.lam)]+'</span></td>'+
      '<td>'+(dg.score>0?'+':'')+dg.score+'</td></tr>'}
  $('sg-dig').innerHTML=t}
function renderHours(hours,ch){
  var w=$('sg-hours');
  if(!hours){w.innerHTML='<div style="color:var(--sgm);font-size:0.8rem">该纬度当日无常规日出日落,行星时不适用。</div>';return}
  var h='',ms=ch.ep.ms;
  hours.slots.forEach(function(s,i){
    var cur=ms>=s.a&&ms<s.b;
    h+='<div class="sg-hr'+(cur?' now':'')+'"><b>'+(s.day?'昼':'夜')+' 第'+(i%12+1)+'时</b><span>'+fmtHM(s.a,ch.tz)+'–'+fmtHM(s.b,ch.tz)+'</span><span class="sg-gly">'+B_G[s.p]+'</span><span>'+B_CN[s.p]+'</span></div>'});
  w.innerHTML=h}
function renderAstro(ch,ev){
  var t='<tr><th>星体</th><th>天文星座(近似)</th><th>赤经</th><th>赤纬</th><th>距离</th><th>视星等</th><th>升</th><th>中天</th><th>落</th></tr>';
  for(var i=0;i<10;i++){var b=ch.bodies[i];
    var dist=(i===1)?(mround(b.dist/10000,2)+' 万km'):(b.dist.toFixed(3)+' AU');
    var mag=(i===1)?moonMag(b.dist,ch.moonK):magOf(i,b.r,b.dist,ch.sunR,ch.moonK);
    var e=ev?ev[i]:null;
    t+='<tr><td><span class="sg-gly">'+B_G[i]+'</span> '+B_CN[i]+'</td><td>'+constOf(b.lamJ)+'</td><td>'+fmtRA(b.ra)+'</td><td>'+fmtDegMin(b.dec)+'</td>'+
      '<td>'+dist+'</td><td>'+(mag==null?'—':(mag>=0?'+':'−')+Math.abs(mag).toFixed(1))+'</td>'+
      '<td>'+(e?(e.circum==='不升'?'不升':fmtHM(e.rise,ch.tz)):'…')+'</td><td>'+(e?fmtHM(e.transit,ch.tz):'…')+'</td><td>'+(e?(e.circum==='恒显'?'恒显':fmtHM(e.set,ch.tz)):'…')+'</td></tr>'}
  $('sg-astro').innerHTML=t}
function mround(x,n){return x.toFixed(n)}

/* ═══════════ 18. 主流程 ═══════════ */
function focusMs(){
  if(S.mode==='now')return Date.now();
  var d=($('sg-d').value||'2000-01-01').split('-'),t=($('sg-t').value||'12:00').split(':');
  return Date.UTC(+d[0],+d[1]-1,+d[2],+t[0],+t[1])-S.tz*3600000}
function recompute(){
  try{
    var natMs=focusMs();
    var natal=computeChart(natMs,S.tz,S.lat,S.lon,S.house);
    var tran=null;
    if(S.transit&&S.mode==='fix'){
      var devTz=-(new Date().getTimezoneOffset())/60;
      tran=computeChart(Date.now(),devTz,S.lat,S.lon,S.house)}
    S.last=natal;S.lastT=tran;
    var alm=tran||natal;
    var loc=new Date(alm.ep.ms+alm.tz*3600000);
    var mid=Date.UTC(loc.getUTCFullYear(),loc.getUTCMonth(),loc.getUTCDate())-alm.tz*3600000;
    var key=mid+'|'+S.lat.toFixed(3)+'|'+S.lon.toFixed(3);
    if(S.dailyKey!==key){S.daily=dailyEvents(mid,alm.tz,S.lat,S.lon);
      S.hours=planetaryHours(alm.ep.ms,alm.tz,S.lat,S.lon);S.dailyKey=key;S.terms=solarTerms(alm.ep.ms)}
    else{ /* 行星时高亮跨界时刷新 */
      if(S.hours){var last=S.hours.slots[S.hours.slots.length-1];
        if(alm.ep.ms>=last.b)S.hours=planetaryHours(alm.ep.ms,alm.tz,S.lat,S.lon)}}
    renderWheel(natal,tran);
    renderGlance(alm,S.daily,S.hours,S.terms);
    renderPos(tran||natal);
    renderAspects(natal,tran);
    renderDig(tran||natal);
    renderHours(S.hours,alm);
    renderAstro(alm,S.daily);
    var y=new Date(natMs).getUTCFullYear();
    if(y<1800||y>2050)say('该年份超出高精度适用范围(1800–2050),结果仅供参考');
  }catch(e){say('Sign 计算出错:'+e.message)}}

/* ═══════════ 19. 报告 ═══════════ */
function buildReport(){
  var ch=S.last;if(!ch)return '';
  var L=[],f;
  L.push('【Sign 星盘报告】');
  L.push('时刻:'+chartTimeStr(ch)+'  地点:'+(S.place||'')+' ('+S.lat.toFixed(4)+', '+S.lon.toFixed(4)+')');
  L.push('体系:'+(ch.houses.sys==='whole'?'整宫制':ch.houses.sys==='equal'?'等宫制':'Placidus')+' · '+(ch.day?'昼盘':'夜盘'));
  L.push('');L.push('— 行星位置 —');
  ch.bodies.forEach(function(b){f=fmtLon(b.lam);
    L.push(B_CN[b.i]+' '+SIGN_CN[f.s]+' '+f.txt+' 第'+b.house+'宫'+(b.retro?' 逆行':''))});
  f=fmtLon(ch.asc);L.push('上升 '+SIGN_CN[f.s]+' '+f.txt);
  f=fmtLon(ch.mc);L.push('中天 '+SIGN_CN[f.s]+' '+f.txt);
  L.push('');L.push('— 相位 —');
  var pts=ch.bodies.slice(0,10).concat([{i:'ASC',lam:ch.asc,spd:null},{i:'MC',lam:ch.mc,spd:null}]);
  calcAspects(pts,ORBS[S.orb]).forEach(function(x){
    L.push(B_CNor(x.a)+' '+x.asp.cn+' '+B_CNor(x.b)+' (容许 '+x.orb.toFixed(2)+'°'+(x.app===true?',入相位':x.app===false?',出相位':'')+')')});
  L.push('');L.push('月相:'+phaseName(ch.moonPsi)+' 照亮'+(ch.moonK*100).toFixed(1)+'% 月龄'+(ch.moonPsi/360*29.530588).toFixed(1)+'日');
  if(S.lastT){L.push('');L.push('— 行运('+chartTimeStr(S.lastT)+')对本命 —');
    calcAspects(S.lastT.bodies.slice(0,10),ORBS[S.orb],
      ch.bodies.slice(0,10).concat([{i:'ASC',lam:ch.asc,spd:null},{i:'MC',lam:ch.mc,spd:null}])).forEach(function(x){
      L.push('行运'+B_CNor(x.a)+' '+x.asp.cn+' 本命'+B_CNor(x.b)+' (容许 '+x.orb.toFixed(2)+'°)')})}
  return L.join('\n')}
function copyReport(){var txt=buildReport();if(!txt)return;
  function ok(){say('报告已复制')}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,function(){fallbackCopy(txt);ok()});
  else{fallbackCopy(txt);ok()}}
function fallbackCopy(t){var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';
  document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove()}

/* ═══════════ 20. 交互 ═══════════ */
function setMode(m){S.mode=m;
  $('sg-mode-now').classList.toggle('on',m==='now');
  $('sg-mode-fix').classList.toggle('on',m==='fix');
  var dis=(m==='now');
  $('sg-d').disabled=dis;$('sg-t').disabled=dis;$('sg-tz').disabled=dis;
  if(m==='now'){S.tz=-(new Date().getTimezoneOffset())/60;setTzSel();S.transit=false;$('sg-transit').checked=false}
  fillNowInputs();
  $('sg-transit').disabled=(m==='now'||!S.chartSel);
  recompute()}
function fillNowInputs(){if(S.mode!=='now')return;
  var d=new Date(Date.now()+S.tz*3600000);
  $('sg-d').value=d.getUTCFullYear()+'-'+p2(d.getUTCMonth()+1)+'-'+p2(d.getUTCDate());
  $('sg-t').value=p2(d.getUTCHours())+':'+p2(d.getUTCMinutes())}
function setTzSel(){var sel=$('sg-tz'),best=0,bd=99;
  for(var i=0;i<TZ_LIST.length;i++){var df=Math.abs(TZ_LIST[i]-S.tz);if(df<bd){bd=df;best=i}}
  sel.selectedIndex=best}
function readInputs(){
  S.tz=parseFloat($('sg-tz').value);
  var la=parseFloat($('sg-lat').value),lo=parseFloat($('sg-lon').value);
  if(isFinite(la)&&Math.abs(la)<=89.9)S.lat=la;
  if(isFinite(lo)&&Math.abs(lo)<=180)S.lon=lo;
  S.place=$('sg-place').value.trim();
  S.house=$('sg-house').value;S.orb=$('sg-orb').value;
  saveS()}
function fillLocInputs(){$('sg-place').value=S.place||'';$('sg-lat').value=S.lat;$('sg-lon').value=S.lon;
  $('sg-house').value=S.house;$('sg-orb').value=S.orb;setTzSel()}
function refreshChartSel(){var sel=$('sg-saved'),h='<option value="">未选择命盘</option>';
  S.charts.forEach(function(c,i){h+='<option value="'+i+'"'+(String(i)===S.chartSel?' selected':'')+'>'+esc(c.name)+'</option>'});
  sel.innerHTML=h}
function saveChart(){
  var name=$('sg-name').value.trim()||('命盘 '+(S.charts.length+1));
  readInputs();
  var d=$('sg-d').value,t=$('sg-t').value;
  if(S.mode==='now'){var n=new Date(Date.now()+S.tz*3600000);
    d=n.getUTCFullYear()+'-'+p2(n.getUTCMonth()+1)+'-'+p2(n.getUTCDate());t=p2(n.getUTCHours())+':'+p2(n.getUTCMinutes())}
  S.charts.push({name:name,d:d,t:t,tz:S.tz,lat:S.lat,lon:S.lon,place:S.place});
  S.chartSel=String(S.charts.length-1);S.chartName=name;
  saveS();refreshChartSel();$('sg-name').value='';say('已保存「'+name+'」')}
function loadChart(idx){
  if(idx===''){S.chartSel='';S.chartName='';S.transit=false;$('sg-transit').checked=false;$('sg-transit').disabled=true;recompute();return}
  var c=S.charts[+idx];if(!c)return;
  S.chartSel=String(idx);S.chartName=c.name;
  S.mode='fix';$('sg-mode-now').classList.remove('on');$('sg-mode-fix').classList.add('on');
  $('sg-d').disabled=false;$('sg-t').disabled=false;$('sg-tz').disabled=false;
  $('sg-d').value=c.d;$('sg-t').value=c.t;S.tz=c.tz;setTzSel();
  S.lat=c.lat;S.lon=c.lon;S.place=c.place;fillLocInputs();
  $('sg-transit').disabled=false;
  recompute();say('已载入「'+c.name+'」,可开启行运对照')}
function delChart(){if(S.chartSel===''){say('先在列表中选择要删除的命盘');return}
  var c=S.charts[+S.chartSel];
  S.charts.splice(+S.chartSel,1);S.chartSel='';S.chartName='';S.transit=false;
  $('sg-transit').checked=false;$('sg-transit').disabled=true;
  saveS();refreshChartSel();recompute();say('已删除「'+(c?c.name:'')+'」')}
function geolocate(){
  if(!navigator.geolocation){say('此浏览器不支持定位,请手动填写经纬度');return}
  say('正在获取当前位置…');
  navigator.geolocation.getCurrentPosition(function(pos){
    S.lat=Math.round(pos.coords.latitude*10000)/10000;
    S.lon=Math.round(pos.coords.longitude*10000)/10000;
    if(!S.place||S.place.indexOf('默认')>=0)S.place='当前位置';
    fillLocInputs();saveS();recompute();say('已使用当前位置')},
    function(){say('定位未成功,请手动填写经纬度')},{timeout:8000})}
function startTick(){stopTick();
  S.timer=setInterval(function(){
    if(document.hidden)return;
    if(S.last)updateClockLine(S.lastT||S.last);
    var live=(S.mode==='now'||S.transit);
    if(live&&Date.now()-S._lastFull>15000){S._lastFull=Date.now();fillNowInputs();recompute()}
  },1000);
  S._lastFull=Date.now()}
function stopTick(){if(S.timer){clearInterval(S.timer);S.timer=null}}

/* ═══════════ 21. 装载 ═══════════ */
function mount(){
  if($('page-sign'))return;
  var st=document.createElement('style');st.id='ib-sign-style';st.textContent=CSS;document.head.appendChild(st);
  var apiA=document.querySelector('.nav-links a[data-page="api"]');
  if(apiA){var li=document.createElement('li');
    li.innerHTML='<a onclick="navTo(\'sign\')" data-page="sign">Sign</a>';
    apiA.closest('li').parentNode.insertBefore(li,apiA.closest('li'))}
  var pg=document.createElement('div');pg.className='page';pg.id='page-sign';pg.innerHTML=buildHTML();
  var app=document.getElementById('app');(app||document.body).appendChild(pg);
  loadS();fillLocInputs();refreshChartSel();fillNowInputs();setTzSel();
  ['sg-lat','sg-lon','sg-place'].forEach(function(id){$(id).addEventListener('change',function(){readInputs();S.dailyKey='';recompute()})});
  ['sg-d','sg-t','sg-tz','sg-house','sg-orb'].forEach(function(id){$(id).addEventListener('change',function(){readInputs();recompute()})});
  $('sg-mode-now').addEventListener('click',function(){setMode('now')});
  $('sg-mode-fix').addEventListener('click',function(){setMode('fix')});
  $('sg-geo').addEventListener('click',geolocate);
  $('sg-save').addEventListener('click',saveChart);
  $('sg-del').addEventListener('click',delChart);
  $('sg-copy').addEventListener('click',copyReport);
  $('sg-saved').addEventListener('change',function(){loadChart(this.value)});
  $('sg-transit').addEventListener('change',function(){S.transit=this.checked;recompute()});
  /* 包裹 navTo:进入/离开 Sign 页时启停实时刷新 */
  var orig=window.navTo;
  if(typeof orig==='function'){window.navTo=function(p){orig.apply(this,arguments);
    var on=document.getElementById('page-sign').classList.contains('active');
    if(on){recompute();startTick()}else stopTick()}}
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden&&document.getElementById('page-sign').classList.contains('active'))recompute()});
  window.IBSign={version:'1.0',recompute:recompute,state:S}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
else mount();
})();
