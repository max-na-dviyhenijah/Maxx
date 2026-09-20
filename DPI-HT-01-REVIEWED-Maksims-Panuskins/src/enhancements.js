const euro = value => new Intl.NumberFormat('en-IE', {style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
const label = key => key.replace(/([A-Z])/g,' $1').replace(/^./, c=>c.toUpperCase()).replace(/Cogs/g,'COGS').replace(/Ppe/g,'PPE');
const titles = {revenueAndReceivables:'Revenue & receivables',inventoryAndCogs:'Inventory & cost of sales',payroll:'Payroll & accruals',operatingExpenses:'Expense detail',ppe:'Property, plant & equipment',debtAndInterest:'Debt & interest',equityAndDistributions:'Equity & distributions'};

export function enhanceCase(data, review) {
  // The student confirmed review and understanding of the material judgments.
  document.querySelectorAll('.decision-body span,.review-columns span').forEach(el=>{
    if(el.textContent==='Certified answer') el.textContent='Student-confirmed answer';
    if(el.textContent==='Certification reasoning') el.textContent='Student reasoning';
  });
  const kicker=document.querySelector('#decisions .section-kicker');
  if(kicker) kicker.textContent='04 / Decision register';
  document.querySelectorAll('.decision-body b,.evidence-tags b').forEach(tag=>{
    const source=data.evidence.find(e=>e.id===tag.textContent);
    if(source){const a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener';a.title=source.file+' — '+source.locator;a.append(tag.cloneNode(true));tag.replaceWith(a);}
  });
  const board=document.querySelector('.board-grid>div');
  if(board){const p=document.createElement('p');p.textContent=data.boardRecommendation.solvencyWarning;board.append(p);}

  if(!review){
    const section=document.createElement('section');
    section.id='schedules';section.className='section schedules-section';
    section.innerHTML=`<div class="section-head"><div><div class="section-kicker">Show the workings</div><h2>Follow each number.</h2></div><p>Seven supporting schedules connect the source evidence to the statements. Expand a schedule to inspect its components.</p></div><div class="schedule-grid">${Object.entries(data.schedules).map(([key,rows],i)=>`<details class="schedule-panel" ${i===0?'open':''}><summary><span class="schedule-number">0${i+1}</span>${titles[key]||label(key)}<span class="schedule-plus">+</span></summary><dl>${Object.entries(rows).map(([name,value])=>`<div><dt>${label(name)}</dt><dd>${euro(value)}</dd></div>`).join('')}</dl></details>`).join('')}</div><p class="schedule-note">Opening supplier payables are inferred as €126,000 + €378,000 − €459,000 = €45,000. Opening receivables of €35,000 assume that the recorded settlement clears the opening balance. Opening equity of €170,000 is conditional on the completeness of these reconstructed balances.</p>`;
    document.querySelector('#statements').after(section);
    const nav=document.querySelector('nav');
    const link=document.createElement('a');link.href='#schedules';link.textContent='Schedules';
    nav.insertBefore(link,nav.querySelector('[href="#decisions"]'));
    const syncNavigation=()=>nav.querySelectorAll('a[href^="#"]').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===(window.location.hash||'#overview')));
    window.addEventListener('hashchange',syncNavigation);syncNavigation();

    const scenario=document.createElement('section');scenario.className='section scenario-section';
    scenario.innerHTML=`<div class="section-head"><div><div class="section-kicker">Explore the uncertainty</div><h2>What changes the result?</h2></div><p>Compare the two inventory interpretations and counsel's legal range. This illustration leaves the submitted base case unchanged.</p></div><div class="scenario-layout"><div class="scenario-controls"><label for="inventory-case">Inventory interpretation</label><select id="inventory-case"><option value="112000">Cost roll-forward · €112,000</option><option value="121000">Count-based alternative · €121,000</option></select><label for="legal-case">Legal provision <output id="legal-value">€25,000</output></label><input id="legal-case" type="range" min="20000" max="30000" step="1000" value="25000"><div class="range-labels"><span>€20,000</span><span>€30,000</span></div><p>The count alternative implies €9,000 less consumption. A larger legal provision reduces profit and equity without an immediate cash payment.</p><button class="button secondary" id="reset-scenario">Reset to base case</button></div><div class="scenario-results" aria-live="polite"><article><span>Illustrative net profit</span><strong id="scenario-profit">€65,000</strong><small id="scenario-delta">Base case</small></article><article><span>Closing equity</span><strong id="scenario-equity">€125,000</strong><small>Opening equity + profit − distributions</small></article><article><span>Cash remains</span><strong>€60,000</strong><small>Both adjustments are non-cash</small></article></div></div><p class="schedule-note">Quantified illustration only: €60,000–€79,000 profit. Missing insurance information and depreciation inputs are not quantified in this range.</p>`;
    document.querySelector('.uncertainty-section').after(scenario);
    const inventory=scenario.querySelector('select'), legal=scenario.querySelector('input');
    const update=()=>{const delta=Number(inventory.value)-112000+25000-Number(legal.value);document.querySelector('#legal-value').textContent=euro(Number(legal.value));document.querySelector('#scenario-profit').textContent=euro(65000+delta);document.querySelector('#scenario-equity').textContent=euro(125000+delta);document.querySelector('#scenario-delta').textContent=delta?`${delta>0?'+':''}${euro(delta)} versus base case`:'Base case';};
    inventory.addEventListener('change',update);legal.addEventListener('input',update);
    document.querySelector('#reset-scenario').addEventListener('click',()=>{inventory.value='112000';legal.value='25000';update();});
    const search=document.querySelector('#decision-search');search.setAttribute('aria-label','Search decisions');
    const count=document.createElement('p');count.className='result-count';count.setAttribute('aria-live','polite');
    document.querySelector('.filters').after(count);
    const updateCount=()=>{const rows=[...document.querySelectorAll('.decision-row')];const n=rows.filter(r=>!r.hidden).length;count.textContent=n?`${n} of 100 decisions shown`:'No decisions match. Try another term or filter.';};
    updateCount();
  }else{
    document.querySelector('.review-score span').textContent='material judgments documented';
    const flags=document.querySelectorAll('.review-flags article');
    flags[1].innerHTML='<span>Revised material judgments</span><strong>3</strong><small>D058, D072 and D091 · includes later feedback</small>';
    flags[0].innerHTML='<span>Independent analysis differences</span><strong>2</strong><small>D058 and D072 concern disposal cost</small>';
    const provenance=document.createElement('p');provenance.className='schedule-note';provenance.innerHTML='<a href="/AI-REVIEW-RECORD.md" target="_blank" rel="noopener">Read the independent-analysis record ↗</a><br>This is a recorded excerpt and summary, not a full transcript export. The student confirmed the current version, including clarified D013, D091 and D100, on 20 September 2026. Disclosed evidence gaps remain unresolved.';document.querySelector('.review-toolbar').after(provenance);
    const issues=document.createElement('section');issues.className='review-issues';
    issues.innerHTML=`<div><div class="section-kicker">Needs attention</div><h2>Read these before approving.</h2><p>Low-confidence decisions: <strong>D034, D060, D078</strong>. Insurance evidence is missing. No expense has been recognized; actual consumption remains unknown.</p></div><div>${data.uncertainties.filter(u=>u.status==='unresolved').map(u=>`<article><strong>${u.issue}</strong><p>${u.range}. ${u.action}</p></article>`).join('')}</div>`;
    document.querySelector('.review-flags').after(issues);
    document.querySelectorAll('.review-card').forEach(card=>{card.querySelector('.final span').textContent='Student-confirmed answer';});
    const controls=document.createElement('div');controls.className='review-controls';controls.innerHTML='<label><input type="checkbox" id="changes-only"> Show revised judgments only</label><button class="button secondary" id="print-review">Print review</button>';
    document.querySelector('.review-toolbar').after(controls);
    controls.querySelector('input').addEventListener('change',e=>document.querySelectorAll('.review-card').forEach(card=>card.hidden=e.target.checked&&!card.classList.contains('override')));
    document.querySelector('#print-review').addEventListener('click',()=>window.print());
  }
}
