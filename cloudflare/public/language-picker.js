(() => {
const L=[
["en","English","gb"],["de","Deutsch","de"],["ru","Русский","ru"],["tr","Türkçe","tr"],
["fr","Français","fr"],["ms","Bahasa Melayu","my"],["fi","Suomi","fi"],["uk","Українська","ua"],
["uz","O‘zbekcha","uz"],["id","Bahasa Indonesia","id"]
];
const s=document.getElementById("language"),b=document.getElementById("languageBtn"),m=document.getElementById("languageMenu");
if(!s||!b||!m)return;
const flag=(cc)=>`<img class="flag-svg" src="https://flagcdn.com/${cc}.svg" alt="" aria-hidden="true">`;
const close=()=>{m.classList.add("hidden");b.setAttribute("aria-expanded","false")};
const sync=()=>{
 const x=L.find(v=>v[0]===(s.value||"en"))||L[0];
 b.innerHTML=flag(x[2]);b.title=x[1];b.setAttribute("aria-label","Language: "+x[1]);
 m.querySelectorAll("button").forEach(q=>{const a=q.dataset.lang===x[0];q.classList.toggle("is-active",a);q.setAttribute("aria-checked",String(a))});
};
m.innerHTML="";
L.forEach(([code,name,cc])=>{
 const q=document.createElement("button");q.type="button";q.dataset.lang=code;q.innerHTML=flag(cc);
 q.title=name;q.setAttribute("aria-label",name);q.setAttribute("role","menuitemradio");
 q.addEventListener("click",e=>{e.stopPropagation();if(s.value!==code){s.value=code;s.dispatchEvent(new Event("change",{bubbles:true}))}sync();close();b.focus()});
 m.appendChild(q);
});
b.addEventListener("click",e=>{
 e.preventDefault();e.stopPropagation();
 const open=m.classList.contains("hidden");
 document.getElementById("mainMenu")?.classList.add("hidden");
 document.getElementById("menuBtn")?.setAttribute("aria-expanded","false");
 if(open){m.classList.remove("hidden");b.setAttribute("aria-expanded","true")}else close();
});
s.addEventListener("change",sync);
document.addEventListener("click",e=>{if(!e.target.closest(".compact-language"))close()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
sync();
})();