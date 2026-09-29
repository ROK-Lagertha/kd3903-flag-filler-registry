(() => {
  const COPY = {
    en:{
      menu:"MENU",faq:"FAQ",about:"ABOUT FLAG FILLER REGISTRY",how:"HOW IT WORKS",back:"BACK TO REGISTRY",
      aboutTitle:"ABOUT FLAG FILLER REGISTRY",aboutSub:"The official KD3903 registry for approved CH25 Flag Filler accounts.",
      purposeTitle:"WHY THE REGISTRY EXISTS",purpose:"The Registry links each approved Flag Filler to its Main Governor so KD3903 leadership can distinguish legitimate Flag Fillers from ordinary CH25 farms during DKP reviews and Kingdom Cleanup.",
      statusTitle:"WHAT REGISTRATION MEANS",status:"Registration confirms approved Flag Filler status. It does not create a free farm and it does not remove normal KD3903 contribution requirements.",
      ruleTitle:"KINGDOM RESPONSIBILITY",rule:"Flag Fillers are expected to contribute during KvK and meet the applicable Death Requirements. Failure to meet kingdom requirements may still result in removal from KD3903.",
      dataTitle:"WHAT THE REGISTRY STORES",data:"Governor IDs and names for the Main and Flag Filler, registration status, selected language and administrative timestamps are stored for KD3903 administration.",
      howTitle:"HOW IT WORKS",howSub:"Register once, keep your Registry Code safe, and use it whenever your registration needs to change.",
      s1:"REGISTER",s1t:"Enter the Main Governor ID and name plus the CH25 Flag Filler Governor ID and name.",
      s2:"SAVE YOUR CODE",s2t:"A personal Registry Code is created after successful registration. Keep it safe.",
      s3:"RENAME",s3t:"Use both Governor IDs and the Registry Code to update the Main and/or Flag Filler name. IDs stay unchanged.",
      s4:"REMOVE",s4t:"Use both Governor IDs and the Registry Code to remove the active registration before registering another Flag Filler.",
      rules:"KEY RULES",rulesList:["One active Flag Filler per Main Governor.","A Flag Filler Governor ID can belong to only one active registration.","Main Governor ID and Flag Filler Governor ID must be different.","Do not create a duplicate registration if you lose your Registry Code — contact KD3903 leadership."]
    },
    de:{
      menu:"MENÜ",faq:"FAQ",about:"ÜBER DIE FLAG FILLER REGISTRY",how:"SO FUNKTIONIERT ES",back:"ZURÜCK ZUR REGISTRY",
      aboutTitle:"ÜBER DIE FLAG FILLER REGISTRY",aboutSub:"Die offizielle KD3903-Registry für genehmigte CH25 Flag-Filler-Accounts.",
      purposeTitle:"WARUM ES DIE REGISTRY GIBT",purpose:"Die Registry ordnet jeden genehmigten Flag Filler seinem Main Governor zu. So kann die KD3903-Führung echte Flag Filler bei DKP-Prüfungen und Kingdom Cleanup von normalen CH25-Farmen unterscheiden.",
      statusTitle:"WAS DIE REGISTRIERUNG BEDEUTET",status:"Die Registrierung bestätigt den genehmigten Flag-Filler-Status. Sie macht aus dem Account keine Free Farm und hebt die normalen Beitragsanforderungen von KD3903 nicht auf.",
      ruleTitle:"VERANTWORTUNG IM KÖNIGREICH",rule:"Flag Filler sollen während KvK beitragen und die geltenden Death Requirements erfüllen. Werden die Anforderungen des Königreichs nicht erfüllt, kann der Account weiterhin aus KD3903 entfernt werden.",
      dataTitle:"WELCHE DATEN GESPEICHERT WERDEN",data:"Für die KD3903-Verwaltung werden Governor IDs und Namen von Main und Flag Filler, Registrierungsstatus, gewählte Sprache und administrative Zeitstempel gespeichert.",
      howTitle:"SO FUNKTIONIERT ES",howSub:"Einmal registrieren, den Registrierungscode sicher aufbewahren und ihn verwenden, sobald sich an deiner Registrierung etwas ändern soll.",
      s1:"REGISTRIEREN",s1t:"Main Governor ID und Name sowie Governor ID und Name des CH25 Flag Fillers eingeben.",
      s2:"CODE SPEICHERN",s2t:"Nach erfolgreicher Registrierung wird dein persönlicher Registrierungscode erzeugt. Bewahre ihn sicher auf.",
      s3:"UMBENENNEN",s3t:"Mit beiden Governor IDs und dem Registrierungscode kannst du den Namen des Mains und/oder Flag Fillers ändern. Die IDs bleiben unverändert.",
      s4:"LÖSCHEN",s4t:"Mit beiden Governor IDs und dem Registrierungscode löschst du die aktive Registrierung, bevor du einen anderen Flag Filler registrierst.",
      rules:"WICHTIGE REGELN",rulesList:["Ein aktiver Flag Filler pro Main Governor.","Eine Flag-Filler-Governor-ID kann nur zu einer aktiven Registrierung gehören.","Main Governor ID und Flag Filler Governor ID müssen unterschiedlich sein.","Wenn du deinen Registrierungscode verlierst, erstelle keine doppelte Registrierung – wende dich an die KD3903-Führung."]
    }
  };
  const FALLBACK = COPY.en;
  const labels = {
    ru:{menu:"МЕНЮ",faq:"FAQ",about:"О FLAG FILLER REGISTRY",how:"КАК ЭТО РАБОТАЕТ"},
    tr:{menu:"MENÜ",faq:"SSS",about:"FLAG FILLER REGISTRY HAKKINDA",how:"NASIL ÇALIŞIR"},
    fr:{menu:"MENU",faq:"FAQ",about:"À PROPOS DU FLAG FILLER REGISTRY",how:"COMMENT ÇA MARCHE"},
    ms:{menu:"MENU",faq:"FAQ",about:"TENTANG FLAG FILLER REGISTRY",how:"CARA IA BERFUNGSI"},
    fi:{menu:"VALIKKO",faq:"UKK",about:"TIETOA FLAG FILLER REGISTRYSTÄ",how:"MITEN SE TOIMII"},
    uk:{menu:"МЕНЮ",faq:"FAQ",about:"ПРО FLAG FILLER REGISTRY",how:"ЯК ЦЕ ПРАЦЮЄ"},
    uz:{menu:"MENYU",faq:"FAQ",about:"FLAG FILLER REGISTRY HAQIDA",how:"QANDAY ISHLAYDI"},
    id:{menu:"MENU",faq:"FAQ",about:"TENTANG FLAG FILLER REGISTRY",how:"CARA KERJA"}
  };
  const menuBtn=document.getElementById('menuBtn'),menu=document.getElementById('mainMenu');
  const views=['registryView','faqView','aboutView','howView'];

  const currentLang=()=>document.getElementById('language')?.value||'en';
  const c=()=>COPY[currentLang()]||FALLBACK;
  const closeMenu=()=>{menu.classList.add('hidden');menuBtn.setAttribute('aria-expanded','false')};
  function setLabels(){
    const l=currentLang(),x=COPY[l]||labels[l]||FALLBACK;
    document.getElementById('menuButtonLabel').textContent=x.menu||FALLBACK.menu;
    document.getElementById('menuFaqLabel').textContent=x.faq||FALLBACK.faq;
    document.getElementById('menuAboutLabel').textContent=x.about||FALLBACK.about;
    document.getElementById('menuHowLabel').textContent=x.how||FALLBACK.how;
    if(!document.getElementById('aboutView').classList.contains('hidden')) renderAbout();
    if(!document.getElementById('howView').classList.contains('hidden')) renderHow();
  }
  function hideAll(){views.forEach(id=>document.getElementById(id)?.classList.add('hidden'))}
  function backButton(){return `<button class="nav-btn info-back" type="button" data-home>← ${c().back}</button>`}
  function renderAbout(){
    const x=c();
    document.getElementById('aboutView').innerHTML=`<div class="info-shell">${backButton()}<div class="info-head"><div class="eyebrow">KD3903</div><h2>${x.aboutTitle}</h2><p>${x.aboutSub}</p></div><div class="info-grid"><article class="info-card"><div class="info-icon">♛</div><h3>${x.purposeTitle}</h3><p>${x.purpose}</p></article><article class="info-card"><div class="info-icon">⚑</div><h3>${x.statusTitle}</h3><p>${x.status}</p></article><article class="info-card"><div class="info-icon">⚔</div><h3>${x.ruleTitle}</h3><p>${x.rule}</p></article><article class="info-card"><div class="info-icon">◉</div><h3>${x.dataTitle}</h3><p>${x.data}</p></article></div></div>`;
  }
  function renderHow(){
    const x=c(),steps=[[x.s1,x.s1t],[x.s2,x.s2t],[x.s3,x.s3t],[x.s4,x.s4t]];
    document.getElementById('howView').innerHTML=`<div class="info-shell">${backButton()}<div class="info-head"><div class="eyebrow">KD3903</div><h2>${x.howTitle}</h2><p>${x.howSub}</p></div><div class="info-steps">${steps.map((s,i)=>`<article class="info-step"><div class="step-no">${i+1}</div><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join('')}</div><article class="info-card wide" style="margin-top:14px"><div class="info-icon">♜</div><h3>${x.rules}</h3><ul>${x.rulesList.map(r=>`<li>${r}</li>`).join('')}</ul></article></div>`;
  }
  function show(view){
    closeMenu();
    if(view==='faq'){document.getElementById('faqBtn').click();return}
    hideAll();
    if(view==='about'){renderAbout();document.getElementById('aboutView').classList.remove('hidden')}
    if(view==='how'){renderHow();document.getElementById('howView').classList.remove('hidden')}
    scrollTo({top:0,behavior:'smooth'});
  }
  function home(){
    hideAll();
    document.getElementById('registryView').classList.remove('hidden');
    closeMenu();scrollTo({top:0,behavior:'smooth'});
  }
  menuBtn.addEventListener('click',e=>{e.stopPropagation();const open=menu.classList.toggle('hidden')===false;menuBtn.setAttribute('aria-expanded',String(open))});
  menu.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)show(b.dataset.view)});
  document.addEventListener('click',e=>{if(!e.target.closest('.menu-wrap'))closeMenu();const h=e.target.closest('[data-home]');if(h)home()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  document.getElementById('language')?.addEventListener('change',setLabels);
  setLabels();
})();