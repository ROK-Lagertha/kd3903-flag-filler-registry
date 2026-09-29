const faqBtn=document.getElementById('faqBtn');
const backBtn=document.getElementById('backBtn');
const registry=document.getElementById('registryView');
const faq=document.getElementById('faqView');
faqBtn.addEventListener('click',()=>{registry.classList.add('hidden');faq.classList.remove('hidden');scrollTo({top:0,behavior:'smooth'});});
backBtn.addEventListener('click',()=>{faq.classList.add('hidden');registry.classList.remove('hidden');scrollTo({top:0,behavior:'smooth'});});
