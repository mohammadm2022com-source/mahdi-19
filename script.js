/* ===========================
        ELEMENTS
=========================== */

const envelope = document.getElementById("envelope");
const typingBox = document.getElementById("typing");
const template = document.getElementById("paragraphs");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");
const openSound = document.getElementById("openSound");
const closeSound = document.getElementById("closeSound");
const closeBtn = document.getElementById("closeLetter");

const stars = document.getElementById("stars");
const particles = document.getElementById("particles");
const petals = document.getElementById("petals");

let opened = false;
let musicOn = false;

/* ===========================
        STARS
=========================== */

function createStars(){

for(let i=0;i<170;i++){

const star=document.createElement("div");

star.className="star";

star.style.left=Math.random()*100+"%";
star.style.top=Math.random()*100+"%";

star.style.animationDuration=
(2+Math.random()*5)+"s";

star.style.animationDelay=
Math.random()*4+"s";

star.style.opacity=Math.random();

stars.appendChild(star);

}

}

/* ===========================
        PARTICLES
=========================== */

function createParticle(){

const p=document.createElement("div");

p.className="particle";

p.style.left=Math.random()*100+"vw";

p.style.animationDuration=
(5+Math.random()*6)+"s";

p.style.opacity=Math.random();

particles.appendChild(p);

setTimeout(()=>{

p.remove();

},11000);

}

setInterval(createParticle,350);

/* ===========================
        PETALS
=========================== */

function createPetal(){

const petal=document.createElement("div");

petal.className="petal";

petal.style.left=Math.random()*100+"vw";

petal.style.animationDuration=
(8+Math.random()*7)+"s";

petal.style.animationDelay=
Math.random()*2+"s";

petal.style.transform=

"rotate("+Math.random()*360+"deg)";

petals.appendChild(petal);

setTimeout(()=>{

petal.remove();

},16000);

}

setInterval(createPetal,900);

/* ===========================
        MUSIC
=========================== */

musicBtn.onclick=()=>{

if(!musicOn){

music.play();

musicBtn.innerHTML="🎵";

musicOn=true;

}else{

music.pause();

musicBtn.innerHTML="🔇";

musicOn=false;

}

};

/* ===========================
        TYPEWRITER
=========================== */

async function typeParagraph(text){

return new Promise(resolve=>{

const p=document.createElement("p");

p.className="fadeIn";

typingBox.appendChild(p);

let i=0;

const cursor=document.createElement("span");

cursor.className="cursor";

p.appendChild(cursor);

function write(){

if(i<text.length){

cursor.insertAdjacentText("beforebegin",text[i]);

i++;

setTimeout(write,35);

}else{

cursor.remove();

resolve();

}

}

write();

});

}

async function startTyping(){

typingBox.innerHTML="";

const list=[

...template.content.querySelectorAll("p")

];

for(const item of list){

await typeParagraph(item.textContent);

await new Promise(r=>setTimeout(r,700));

}

}

/* ===========================
        OPEN ENVELOPE
=========================== */

function openEnvelope(){

if(opened) return;

opened=true;

envelope.classList.add("open");

openSound.currentTime=0;

openSound.play();

setTimeout(()=>{

startTyping();

},1200);

}

envelope.addEventListener(

"click",

openEnvelope

);

/* ادامه در پیام بعدی... */
/* ===========================
        CLOSE LETTER
=========================== */

function closeEnvelope(){

if(!opened) return;

closeSound.currentTime=0;
closeSound.play();

typingBox.innerHTML="";

envelope.classList.remove("open");

opened=false;

}

closeBtn.addEventListener(

"click",

closeEnvelope

);

/* ===========================
        ESC KEY
=========================== */

document.addEventListener(

"keydown",

e=>{

if(e.key==="Escape"){

closeEnvelope();

}

}

);

/* ===========================
        TOUCH SUPPORT
=========================== */

let startY=0;

document.addEventListener(

"touchstart",

e=>{

startY=e.touches[0].clientY;

}

);

document.addEventListener(

"touchend",

e=>{

const endY=e.changedTouches[0].clientY;

if(startY-endY>80){

openEnvelope();

}

if(endY-startY>80){

closeEnvelope();

}

});

/* ===========================
        PARALLAX
=========================== */

document.addEventListener(

"mousemove",

e=>{

const x=(e.clientX/window.innerWidth-.5)*20;
const y=(e.clientY/window.innerHeight-.5)*20;

envelope.style.transform=

`rotateY(${x}deg)
 rotateX(${-y}deg)`;

if(opened){

envelope.style.transform+=
" translateY(-15px)";

}

});

/* ===========================
        RESET ON LEAVE
=========================== */

document.addEventListener(

"mouseleave",

()=>{

if(opened){

envelope.style.transform=
"translateY(-15px)";

}else{

envelope.style.transform=
"rotateX(0) rotateY(0)";

}

});

/* ===========================
        RANDOM GLOW
=========================== */

setInterval(()=>{

const glow=document.createElement("div");

glow.style.position="fixed";
glow.style.width="8px";
glow.style.height="8px";
glow.style.borderRadius="50%";

glow.style.background="#fff8b5";

glow.style.left=Math.random()*100+"vw";
glow.style.top=Math.random()*100+"vh";

glow.style.boxShadow=
"0 0 30px #fff2aa";

glow.style.opacity=".8";

glow.style.pointerEvents="none";

glow.style.transition="2s";

document.body.appendChild(glow);

setTimeout(()=>{

glow.style.opacity="0";
glow.style.transform="scale(4)";

},50);

setTimeout(()=>{

glow.remove();

},2000);

},1200);

/* ===========================
        AUTO PLAY TRY
=========================== */

window.addEventListener(

"click",

()=>{

if(!musicOn){

music.play().catch(()=>{});

}

},

{once:true}

);

/* ===========================
        INITIALIZE
=========================== */

createStars();

for(let i=0;i<20;i++){

setTimeout(createParticle,i*120);

}

for(let i=0;i<10;i++){

setTimeout(createPetal,i*250);

}

console.log("Romantic Letter Ready ❤️");
