const sources = [
 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-cau-hoi.html?id=17766&row_limit=1',
 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-cau-hoi.html?id=17759&row_limit=1',
 'https://chinhphu.vn/default.aspx?docid=152210&pageid=27160',
 'https://vbpq.mof.gov.vn/DKC.FileManagement/FileStorage/File/152937',
 'https://tiengchuong.chinhphu.vn/chinh-thuc-cam-xuat-nhap-khau-thuoc-la-dien-tu-thuoc-la-nung-nong-113260724152044902.htm'
];
const iconPaths = {
 bottle:'M9 3h6M10 3v5l-3 4v9h10v-9l-3-4V3M7 15h10',
 tobacco:'M3 14h18v5H3zM16 14v5M19 11c-3-2 2-4 0-7M15 11c-3-2 2-4 0-7',
 gift:'M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9C5 9 5 2 8 3c3 0 4 6 4 6s1-6 4-6c3-1 3 6-4 6',
 cash:'M2 6h20v12H2zM7 6c0 3-2 4-5 4M17 18c0-3 2-4 5-4M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
 bag:'M8 7V4h8v3M5 7h14v14H5zM9 11v6M15 11v6M7 21v1M17 21v1',
 document:'M6 2h9l4 4v16H6zM15 2v5h4M9 11h7M9 15h7M9 19h4',
 shield:'M12 2l8 3v7c0 5-8 10-8 10S4 17 4 12V5zM8 11l3 3 5-6',
 plane:'M2 12l8-2V3l3-1 2 8 7 2v2l-7 1-2 6h-3v-6l-8-1z'
};
let currentLanguage = 'vi';
let direction = 'in';
try { const stored = localStorage.getItem('customs-language'); if (translations[stored]) currentLanguage = stored; } catch {}
const langQuery = new URLSearchParams(location.search).get('lang');
if (translations[langQuery]) currentLanguage = langQuery;
const $ = id => document.getElementById(id);
function element(tag, className, text) {const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function renderCards() {
 const t=translations[currentLanguage];
 const query=$('search').value.toLocaleLowerCase(currentLanguage).trim();
 const data=direction==='in'?t.cardsIn:t.cardsOut;
 $('cards').replaceChildren();
 const matching=data.filter(row=>row.slice(1).join(' ').toLocaleLowerCase(currentLanguage).includes(query));
 matching.forEach(([icon,title,stat,body,detail])=>{
  const card=element('article','card');const top=element('div','card-top');const symbol=element('span','icon');symbol.setAttribute('aria-hidden','true');
  symbol.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPaths[icon]}"/></svg>`;
  top.append(symbol,element('span','tag',direction==='in'?t.tagArrival:t.tagDeparture));
  card.append(top,element('h3','',title),element('div','stat',stat),element('p','',body),element('p','card-detail',detail));$('cards').append(card);
 });
 $('empty').textContent=t.empty;$('empty').hidden=matching.length>0;
 $('scope').textContent=direction==='in'?t.arrivalScope:t.departureScope;
 $('rules').setAttribute('aria-labelledby',direction==='in'?'arrival':'departure');
}
function renderLanguage() {
 const t=translations[currentLanguage];document.documentElement.lang=currentLanguage;document.title=`${t.brand} | Vietnam Travel Guide`;
 document.querySelectorAll('[data-i]').forEach(node=>{node.textContent=t[node.dataset.i];});
 $('language').value=currentLanguage;$('search').placeholder=t.search;$('search').setAttribute('aria-label',t.search);
 $('restrictedItems').replaceChildren(...t.restricted.map(([title,body])=>{const row=element('div','restrict-item');const text=element('div');text.append(element('b','',title),element('p','',body));row.append(element('span','','!'),text);return row;}));
 $('steps').replaceChildren(...t.steps.map(([title,body],i)=>{const step=element('article','step');step.append(element('span','',`0${i+1}`),element('h3','',title),element('p','',body));return step;}));
 $('faq').replaceChildren(...t.faq.map(([question,answer])=>{const detail=element('details');detail.append(element('summary','',question),element('p','',answer));return detail;}));
 $('sourceLinks').replaceChildren(...sources.map((url,i)=>{const a=element('a','',t.sourceLabels[i]+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}));
 renderCards();
}
$('language').addEventListener('change',event=>{currentLanguage=event.target.value;$('search').value='';try{localStorage.setItem('customs-language',currentLanguage);}catch{}renderLanguage();});
function setDirection(next){direction=next;$('arrival').setAttribute('aria-selected',String(next==='in'));$('departure').setAttribute('aria-selected',String(next==='out'));$('arrival').tabIndex=next==='in'?0:-1;$('departure').tabIndex=next==='out'?0:-1;renderCards();}
$('arrival').addEventListener('click',()=>setDirection('in'));
$('departure').addEventListener('click',()=>setDirection('out'));
document.querySelector('.tabs').addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();setDirection(event.key==='Home'?'in':event.key==='End'?'out':direction==='in'?'out':'in');$(direction==='in'?'arrival':'departure').focus();}});
$('search').addEventListener('input',renderCards);
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();$('search').focus();}});
let beforePrintQuery='',openDetails=[];
window.addEventListener('beforeprint',()=>{beforePrintQuery=$('search').value;$('search').value='';renderCards();openDetails=[...document.querySelectorAll('details')].map(d=>d.open);document.querySelectorAll('details').forEach(d=>d.open=true);});
window.addEventListener('afterprint',()=>{$('search').value=beforePrintQuery;renderCards();document.querySelectorAll('details').forEach((d,i)=>d.open=openDetails[i]);});
$('print').addEventListener('click',()=>window.print());
renderLanguage();setDirection('in');
