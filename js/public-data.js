(() => {
  const cfg=window.KAGUYA_SUPABASE_CONFIG||{};
  const hasSupabase=!!(window.supabase&&cfg.url&&cfg.publishableKey&&!cfg.url.includes('SEU-PROJETO')&&!cfg.publishableKey.includes('SUA_CHAVE'));
  const db=hasSupabase?window.supabase.createClient(cfg.url,cfg.publishableKey):null;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
  const url=(v)=>{try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)?u.href:'#';}catch{return '#';}};
  const fallback='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="116" height="174"><rect width="100%" height="100%" fill="#27222e"/><text x="50%" y="50%" fill="#ff4757" font-size="12" text-anchor="middle">KAGUYAOP</text></svg>');
  const money=v=>v==null||v===''?null:Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const statusInfo={available:{label:'Disponível',cls:'status-available'},unavailable:{label:'Indisponível',cls:'status-unavailable'},preorder:{label:'Pré-venda',cls:'status-preorder'}};
  let modal, lastFocus;
  function ensureModal(){if(modal)return modal;
    const style=el('style');style.textContent=`.kaguya-modal-backdrop{position:fixed;inset:0;z-index:99999;background:rgba(8,7,12,.82);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:18px;overflow-y:auto}.kaguya-modal-backdrop[hidden]{display:none}.kaguya-modal{position:relative;width:min(760px,100%);max-height:min(90vh,900px);overflow:auto;background:#17161d;color:#f5f2f7;border:1px solid #393440;border-radius:18px;box-shadow:0 24px 90px #0009}.kaguya-modal-close{position:sticky;top:10px;float:right;margin:10px 10px -48px 0;z-index:2;width:38px;height:38px;border:1px solid #49424f;border-radius:50%;background:#211e28;color:#fff;font-size:24px;cursor:pointer}.kaguya-modal-body{display:grid;grid-template-columns:minmax(150px,240px) minmax(0,1fr);gap:25px;padding:30px}.kaguya-modal-cover{width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:10px;background:#292530}.kaguya-modal-kicker{font-size:11px;letter-spacing:1.5px;color:#ff6372;font-weight:800;text-transform:uppercase}.kaguya-modal h2{font-size:clamp(22px,4vw,32px);line-height:1.2;margin:8px 0}.kaguya-modal-meta{color:#b7b1bf;font-size:13px;line-height:1.7}.kaguya-modal-synopsis{font-size:14px;line-height:1.75;color:#e0dbe5;white-space:pre-line;margin:18px 0}.kaguya-status{display:inline-flex;align-items:center;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:800;margin:12px 6px 0 0}.status-available{background:#153c2b;color:#8ef0b9}.status-unavailable{background:#48212a;color:#ffabb5}.status-preorder{background:#42331a;color:#ffd98b}.kaguya-price-row{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:14px 0}.kaguya-price-current{font-size:24px;font-weight:900}.kaguya-price-old{color:#aaa1b0;text-decoration:line-through;font-size:14px}.kaguya-promo-tag{font-size:11px;font-weight:900;background:#ff4757;color:white;border-radius:5px;padding:4px 7px}.kaguya-amazon-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;background:#ff4757;color:#fff;font-weight:900;padding:13px 18px;border-radius:9px;margin-top:8px;min-height:46px}.kaguya-amazon-cta:hover{filter:brightness(1.08)}.kaguya-amazon-cta[aria-disabled=true]{opacity:.5;pointer-events:none}.kaguya-modal-footnote{font-size:11px;color:#9c95a5;line-height:1.5;margin-top:12px}@media(max-width:560px){.kaguya-modal-backdrop{padding:8px;align-items:flex-end}.kaguya-modal{max-height:94vh;border-radius:16px}.kaguya-modal-body{grid-template-columns:100px minmax(0,1fr);gap:14px;padding:22px 16px}.kaguya-modal-cover{width:100px}.kaguya-modal-synopsis{grid-column:1/-1;margin:8px 0}.kaguya-modal h2{font-size:22px}.kaguya-modal-price-current{font-size:21px}}`;
    document.head.append(style);
    const backdrop=el('div','kaguya-modal-backdrop');backdrop.hidden=true;backdrop.setAttribute('role','presentation');
    const dialog=el('section','kaguya-modal');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','kaguya-modal-title');
    const close=el('button','kaguya-modal-close','×');close.type='button';close.setAttribute('aria-label','Fechar detalhes');close.addEventListener('click',closeModal);
    const body=el('div','kaguya-modal-body');body.id='kaguya-modal-body';dialog.append(close,body);backdrop.append(dialog);document.body.append(backdrop);backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)closeModal();});modal={backdrop,dialog,body,close};return modal;
  }
  function closeModal(){if(!modal)return;modal.backdrop.hidden=true;document.body.style.overflow='';if(lastFocus?.focus)lastFocus.focus();}
  function openModal(x){const m=ensureModal();lastFocus=document.activeElement;m.body.replaceChildren();
    const img=el('img','kaguya-modal-cover');img.src=x.cover_url||fallback;img.alt='Capa de '+x.title;img.onerror=()=>{img.onerror=null;img.src=fallback;};
    const content=el('div','kaguya-modal-content');content.append(el('div','kaguya-modal-kicker',x.category==='novel'?'LIGHT NOVEL':x.category==='recommendation'?'RECOMENDAÇÃO DA KAGUYA':'MANGÁ'));
    content.append(el('h2','',x.title));const meta=[x.volume,x.author,x.publisher].filter(Boolean);if(meta.length)content.append(el('div','kaguya-modal-meta',meta.join(' · ')));
    const st=statusInfo[x.availability_status]||statusInfo.available;content.append(el('span','kaguya-status '+st.cls,st.label));
    if(x.label)content.append(el('span','kaguya-status',x.label));
    const priceRow=el('div','kaguya-price-row');const current=money(x.promo_price!=null?x.promo_price:x.price);if(current)priceRow.append(el('span','kaguya-price-current',current));else priceRow.append(el('span','kaguya-price-current','Consulte o preço'));
    if(x.promo_price!=null&&x.price!=null&&Number(x.promo_price)<Number(x.price)){priceRow.append(el('span','kaguya-price-old',money(x.price)),el('span','kaguya-promo-tag','EM PROMOÇÃO'));}
    content.append(priceRow);
    const synopsis=el('p','kaguya-modal-synopsis',x.synopsis||'Sinopse ainda não cadastrada.');
    const link=url(x.affiliate_url);const cta=el('a','kaguya-amazon-cta',x.availability_status==='unavailable'?'Consultar na Amazon':'Ver na Amazon ↗');cta.href=link;cta.target='_blank';cta.rel='noopener noreferrer sponsored';if(link==='#'){cta.setAttribute('aria-disabled','true');cta.removeAttribute('href');}
    const foot=el('p','kaguya-modal-footnote','Preço e disponibilidade podem mudar na loja. Confira as condições atualizadas na Amazon.');
    content.append(cta,foot);m.body.append(img,content,synopsis);m.backdrop.hidden=false;document.body.style.overflow='hidden';m.close.focus();
  }
  function card(x){const w=el('div','grid-card-item searchable-item');w.dataset.type=x.category==='novel'?'novel':'manga';w.dataset.tags=(x.genres||[]).join(' ');const a=el('a','book-card');a.href='#detalhes';a.setAttribute('aria-label','Ver detalhes de '+x.title);a.addEventListener('click',e=>{e.preventDefault();openModal(x);});
    const art=el('div','book-art '+(['art-purple','art-teal','art-rose','art-mint'][String(x.id).charCodeAt(0)%4]));if(x.label)art.append(el('span','book-label',x.label));const img=el('img');img.src=x.cover_url||fallback;img.alt='Capa de '+x.title;img.loading='lazy';img.onerror=()=>{img.onerror=null;img.src=fallback;};art.append(img);
    const info=el('div','book-info');const meta=el('div','book-meta',x.category==='novel'?'LIGHT NOVEL':x.category==='recommendation'?'RECOMENDAÇÃO':'MANGÁ');if(x.volume)meta.append(el('span','',' '+x.volume));info.append(meta,el('h3','',x.title),el('div','author',x.author||''));
    const st=statusInfo[x.availability_status]||statusInfo.available;info.append(el('span','kaguya-status '+st.cls,st.label));const bottom=el('div','book-bottom');if(x.promo_price!=null&&x.price!=null&&Number(x.promo_price)<Number(x.price)){bottom.append(el('span','price',money(x.promo_price)),el('span','kaguya-price-old',money(x.price)));}else bottom.append(el('span','price',money(x.price)||'Consulte o preço'));bottom.append(el('span','amazon-link','Ver detalhes ↗'));info.append(bottom);a.append(art,info);w.append(a);return w;}
  async function load(){if(!db)return;const [ir,pr]=await Promise.all([db.from('content_items').select('*').eq('published',true).order('sort_order'),db.from('promotions').select('*').eq('active',true).order('sort_order')]);if(ir.error){console.error('KaguyaOP/Supabase:',ir.error.message);return;}const all=ir.data||[];const shelves=[['manga',all.filter(x=>x.category==='manga'&&!x.featured)],['novel',all.filter(x=>x.category==='novel'&&!x.featured)],['recomenda',all.filter(x=>x.category==='recommendation'||x.featured)]];for(const [type,rows] of shelves){const s=document.querySelector(`[data-section-type="${type}"]`);const t=s?.querySelector('.grid-track');if(!s||!t)continue;t.replaceChildren(...rows.map(card));s.hidden=rows.length===0;const count=s.querySelector('.section-count');if(count)count.textContent=`${rows.length} ${rows.length===1?'ITEM':'ITENS'}`;}
    const track=document.getElementById('track-main');const banners=(pr.data||[]).filter(x=>['banner','promotion','coupon'].includes(x.kind));if(track&&banners.length){track.replaceChildren();banners.forEach((b,i)=>{const slide=el('div','carousel-slide main-slide-item '+(i%2?'visual-promo-2':'visual-promo-1'));slide.append(el('div','slide-badge',b.kind==='coupon'?'🎟️ CUPOM':b.kind==='promotion'?'⚡ PROMOÇÃO':'✦ DESTAQUE'),el('h2','',b.title),el('p','',b.description||''));if(b.cta_url){const a=el('a','slide-cta',b.cta_label||'Ver oferta');a.href=url(b.cta_url);a.target='_blank';a.rel='noopener noreferrer sponsored';slide.append(a);}if(b.kind==='coupon'&&b.code)slide.append(el('p','','Cupom: '+b.code));track.append(slide);});window.kaguyaResetBannerCarousel?.();}
  }
  let activeMain='all', activeTags=[];
  function applyDynamicFilters(){document.querySelectorAll('.dynamic-shelf').forEach(s=>{let visible=0;s.querySelectorAll('.searchable-item').forEach(i=>{const type=i.dataset.type||'',tags=(i.dataset.tags||'').split(/\s+/).filter(Boolean),ok=(activeMain==='all'||type===activeMain)&&(activeTags.length===0||activeTags.some(t=>tags.includes(t)));i.style.display=ok?'':'none';i.classList.toggle('filtered-out',!ok);if(ok)visible++;});s.hidden=visible===0;});}
  document.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click',()=>{activeMain=b.dataset.main||'all';document.querySelectorAll('.filter-btn').forEach(x=>x.classList.toggle('active',x===b));applyDynamicFilters();}));
  document.querySelectorAll('.sub-btn').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.tag;activeTags=activeTags.includes(t)?activeTags.filter(x=>x!==t):[...activeTags,t];b.classList.toggle('active',activeTags.includes(t));applyDynamicFilters();}));
  // Compatibilidade: os cartões que já existem no HTML também abrem o preview,
  // mesmo se o Supabase estiver indisponível ou ainda não tiver itens publicados.
  function parsePrice(value){if(!value)return null;const normalized=value.replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(',','.');const n=Number(normalized);return Number.isFinite(n)?n:null;}
  document.querySelectorAll('.grid-card-item .book-card').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const cardEl=a.closest('.grid-card-item');
      const section=cardEl?.closest('[data-section-type]')?.dataset.sectionType||'manga';
      const meta=a.querySelector('.book-meta');
      const vol=meta?.querySelector('span')?.textContent?.trim()||'';
      const priceText=a.querySelector('.price')?.textContent?.trim()||'';
      const cover=a.querySelector('.book-art img');
      const title=a.querySelector('h3')?.textContent?.trim()||cover?.alt||'Volume';
      openModal({
        id:title, category:section==='novel'?'novel':section==='recomenda'?'recommendation':'manga',
        title, volume:vol, author:a.querySelector('.author')?.textContent?.trim()||'',
        publisher:'', synopsis:'Sinopse ainda não cadastrada. Você pode adicioná-la pelo painel administrativo ao cadastrar este volume.',
        cover_url:cover?.src||'', affiliate_url:a.getAttribute('href')||'', price:parsePrice(priceText),
        availability_status:'available', label:a.querySelector('.book-label')?.textContent?.trim()||''
      });
    });
  });
  load().then(applyDynamicFilters).catch(err=>console.error('KaguyaOP: não foi possível carregar os dados do Supabase.',err));
})();
