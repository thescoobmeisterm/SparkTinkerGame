const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.dataset={};this.style={};this.classList={toggle(){},add(){}}}set innerHTML(s){this.html=s;this.children=[]}get innerHTML(){return this.html}append(e){this.children.push(e)}get firstElementChild(){return this.children[0]}focus(){}click(){if(!this.disabled)this.onclick()}}
const elements={},timeouts=new Map(),intervals=new Map();let now=0,id=0;
const context=vm.createContext({document:{getElementById:id=>elements[id]??=new Element(),createElement:()=>new Element(),addEventListener(){}},window:{scrollTo(){}},performance:{now:()=>now},setInterval:fn=>{intervals.set(++id,fn);return id},clearInterval:id=>intervals.delete(id),setTimeout:fn=>{timeouts.set(++id,fn);return id},clearTimeout:id=>timeouts.delete(id)});
vm.runInContext(fs.readFileSync('game.js','utf8'),context);
const run=code=>vm.runInContext(code,context);
const next=()=>{const [id,fn]=timeouts.entries().next().value;timeouts.delete(id);fn()};
run('start()');assert.equal(run('new Set(deck).size'),5);
for(let n=0;n<5;n++){assert.equal(elements.answers.children.length,4);assert.equal(new Set(elements.answers.children.map(e=>e.dataset.name)).size,4);run('answer(deck[round].name)');run('answer(deck[round].name)');assert.equal(run('score'),n+1);assert(elements.answers.children.every(e=>e.disabled));next()}
assert.equal(run('state'),'results');assert.equal(elements['final-score'].textContent,5);
for(let n=0;n<15;n++)for(const fn of [...intervals.values()])fn();assert.equal(run('state'),'welcome');
run('start()');now=8001;run('updateTimer()');assert.equal(run('score'),0);assert.equal(run('state'),'feedback');next();assert.equal(run('round'),1);run('answer(parts.find(p=>p!==deck[round]).name)');assert.equal(run('score'),0);run('home()');assert.equal(timeouts.size,0);assert.equal(intervals.size,0);
run('start()');assert.equal(run('score'),0);assert.equal(run('round'),0);run('home()');
console.log('PASS: unique questions/options, perfect game, double-answer lock, timeout, wrong answer, reset, and timer cleanup.');
