import "./styles.css";
import "./design.css";
import { enhanceCase } from "./enhancements.js";

const money = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const fmt = (value) => value === null || value === undefined ? "—" : value < 0 ? `(${money.format(Math.abs(value))})` : money.format(value);
const signed = (value) => value === null || value === undefined ? "—" : `${value > 0 ? "+" : ""}${money.format(value)}`;
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);

const app = document.querySelector("#app");

async function loadData() {
  const response = await fetch("/submission.json");
  if (!response.ok) throw new Error("submission.json could not be loaded");
  return response.json();
}

function shell(data, review = false) {
  const nav = review
    ? `<a href="/">Full case</a><a class="active" href="/review">Assessor view</a><a href="/submission.json">JSON</a>`
    : `<a class="active" href="#overview">Overview</a><a href="#statements">Statements</a><a href="#decisions">Decisions</a><a href="#evidence">Evidence</a><a href="#recommendation">Board action</a><a href="/review">Review</a>`;
  return `
    <header class="topbar">
      <a class="brand" href="/" aria-label="DPI Decision Room home">
        <span class="brand-mark">DPI</span>
        <span>Bad Decisions Capital<small>PRIVATE INVESTMENT OFFICE</small></span>
      </a>
      <nav>${nav}</nav>
    </header>
    <main>${review ? reviewPage(data) : mainPage(data)}</main>
    <footer><span>DPI-HT-01 · Reporting date 31 August 2026</span><span>Evidence before opinion. Cash before ego.</span></footer>`;
}

function metric(label, value, note, tone = "") {
  return `<article class="metric ${tone}"><span>${label}</span><strong>${fmt(value)}</strong><small>${note}</small></article>`;
}

function statementTable(title, items, totalKeys = []) {
  return `<article class="statement-card">
    <div class="section-kicker">Reconstructed statement</div><h3>${title}</h3>
    <div class="statement-lines">${Object.entries(items).map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).replace(/Cogs/g, 'COGS').replace(/Ppe/g, 'PPE');
      return `<div class="statement-line ${totalKeys.includes(key) ? "total" : ""}"><span>${label}</span><strong class="${value < 0 ? "negative" : ""}">${fmt(value)}</strong></div>`;
    }).join("")}</div>
  </article>`;
}

function mainPage(data) {
  const pnl = data.statements.profitAndLoss;
  const bs = data.statements.balanceSheet;
  const cf = data.statements.cashFlow;
  return `
    <section class="hero" id="overview">
      <div class="hero-copy">
        <div class="eyebrow"><span class="live-dot"></span> Investment committee dossier · 01</div>
        <h1>A clearer picture.<br><em>A stronger decision.</em></h1>
        <p>Divorce Party International. A financial reconstruction of the business we acquired — and a disciplined plan for what comes next.</p>
        <div class="hero-actions"><a class="button primary" href="#statements">Explore the financials <span>↗</span></a><a class="button secondary" href="/review">Review the case</a></div>
        <div class="hero-meta"><span>31 AUG 2026 <small>Reporting date</small></span><span>12 SOURCES <small>Evidence reviewed</small></span><span>100 DECISIONS <small>Prepared for review</small></span></div>
      </div>
      <aside class="verdict-card">
        <span class="verdict-label">Investment view <span class="case-stamp">DPI / 01</span></span>
        <h2>Continue under control</h2>
        <p>Keep the core products. Remove founder payment access. Reject the management earn-out basis.</p>
        <div class="profit-comparison"><div><span>Management claim</span><strong>€312k</strong></div><div class="comparison-track"><i style="width:100%"></i></div><div><span>Reconstructed profit</span><strong>€65k</strong></div><div class="comparison-track corrected"><i style="width:20.8333%"></i></div><p>€247,000 below the management claim</p></div>
        <div class="verdict-bottom"><span class="live-dot"></span> Continue with strict financial controls</div>
      </aside>
    </section>

    <section class="metric-grid">
      ${metric("Provisional net profit", 65000, "Subject to disclosed evidence gaps", "good")}
      ${metric("Closing cash", 60000, "Confirmed by bank", "warn")}
      ${metric("Net receivables", 168000, "After €18k write-off")}
      ${metric("Supplier payables", 126000, "2.1× closing cash", "danger")}
    </section>

    <section class="section" id="statements">
      <div class="section-head"><div><div class="section-kicker">01 / Financial reconstruction</div><h2>The financial position.</h2></div><p>Eight months ended 31 August 2026. All figures in EUR. VAT and corporate income tax are outside the case.</p></div>
      <div class="statement-grid">
        ${statementTable("Profit & loss", {
          revenue: pnl.revenue, physicalProductCogs: pnl.physicalProductCogs, serviceDirectPayroll: pnl.serviceDirectPayroll,
          grossProfit: pnl.grossProfit, salesPayroll: pnl.salesPayroll, officePayroll: pnl.officePayroll,
          rent: pnl.rent, marketing: pnl.marketing, software: pnl.software, utilities: pnl.utilities,
          repairs: pnl.repairs, depreciation: pnl.depreciation, badDebt: pnl.badDebt,
          inventoryWriteOff: pnl.inventoryWriteOff, disposalProvision: pnl.disposalProvision,
          legalProvision: pnl.legalProvision, operatingProfit: pnl.operatingProfit,
          interestExpense: pnl.interestExpense, netProfit: pnl.netProfit
        }, ["grossProfit","operatingProfit","netProfit"])}
        ${statementTable("Cash flow", {
          openingCash: cf.openingCash, customerCollections: cf.customerCollections, supplierPayments: cf.supplierPayments,
          payrollPaid: cf.payrollPaid, cashOperatingCosts: cf.cashOperatingCosts, interestPaid: cf.interestPaid,
          netOperatingCashFlow: cf.netOperatingCashFlow, equipmentPurchases: cf.equipmentPurchases,
          netInvestingCashFlow: cf.netInvestingCashFlow, loanAdvance: cf.loanAdvance,
          principalRepaid: cf.principalRepaid, ownerDistributions: cf.ownerDistributions,
          netFinancingCashFlow: cf.netFinancingCashFlow, netChangeInCash: cf.netChangeInCash, closingCash: cf.closingCash
        }, ["netOperatingCashFlow","netInvestingCashFlow","netFinancingCashFlow","closingCash"])}
        ${statementTable("Balance sheet", {
          cash: bs.cash, netReceivables: bs.netReceivables, inventory: bs.inventory, netPpe: bs.netPpe,
          totalAssets: bs.totalAssets, supplierPayables: bs.supplierPayables, payrollPayable: bs.payrollPayable,
          customerDeposits: bs.customerDeposits, loanPrincipal: bs.loanPrincipal, interestPayable: bs.interestPayable,
          legalProvision: bs.legalProvision, disposalProvision: bs.disposalProvision,
          totalLiabilities: bs.totalLiabilities, equity: bs.equity, totalLiabilitiesAndEquity: bs.totalLiabilitiesAndEquity
        }, ["totalAssets","totalLiabilities","equity","totalLiabilitiesAndEquity"])}
      </div>
    </section>

    <section class="section split-section">
      <div>
        <div class="section-kicker">03 / Financial checks</div><h2>Trace the connections.</h2>
        <p class="lead">The reconstructed balances reconcile. Opening balances rely on disclosed completeness assumptions; the separate inventory-count difference remains unresolved.</p>
      </div>
      <div class="check-list">${data.reconciliations.map((r) => `<div class="check"><span class="check-icon">✓</span><div><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.formula)}</small></div><b>${Number(r.result).toFixed(2)}</b></div>`).join("")}</div>
    </section>

    <section class="section" id="decisions">
      <div class="section-head"><div><div class="section-kicker">04 / Decision register</div><h2>The reasoning behind the numbers.</h2></div><p>75 operational decisions and 25 material judgments. Open any decision to follow the evidence.</p></div>
      <div class="filters">
        <label class="search"><span>⌕</span><input id="decision-search" type="search" placeholder="Search ID, question or answer" /></label>
        <div class="filter-buttons"><button class="filter active" data-filter="all">All 100</button><button class="filter" data-filter="material_judgment">Material 25</button><button class="filter" data-filter="low">Low confidence</button></div>
      </div>
      <div class="decision-list" id="decision-list">${data.decisions.map(decisionRow).join("")}</div>
    </section>

    <section class="section" id="evidence">
      <div class="section-head"><div><div class="section-kicker">Evidence register</div><h2>Source strength is visible.</h2></div><p>Management claims never outrank bank, contract or external confirmation.</p></div>
      <div class="evidence-grid">${data.evidence.map((e) => `<article class="evidence-card" id="evidence-${e.id}"><div><span class="evidence-id">${e.id}</span><span class="reliability ${e.reliability}">${e.reliability}</span></div><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.finding)}</p><a class="source-link" href="${escapeHtml(e.url)}" target="_blank" rel="noopener">Open original source ↗</a><small class="source-locator">${escapeHtml(e.locator)}</small></article>`).join("")}</div>
    </section>

    <section class="section uncertainty-section">
      <div class="section-head"><div><div class="section-kicker">Uncertainty register</div><h2>Open issues stay open.</h2></div><p>Confidence is earned, not designed into a dashboard.</p></div>
      <div class="uncertainty-list">${data.uncertainties.map((u) => `<article><div><span class="status ${u.status}">${u.status}</span><h3>${escapeHtml(u.issue)}</h3></div><strong>${escapeHtml(u.range)}</strong><p>${escapeHtml(u.action)}</p></article>`).join("")}</div>
    </section>

    <section class="board-section" id="recommendation">
      <div class="section-kicker light">Board recommendation</div>
      <h2>Keep the engine.<br>Replace the controls.</h2>
      <p>${escapeHtml(data.boardRecommendation.decision)}</p>
      <div class="board-grid"><div><span>Liquidity warning</span><p>${escapeHtml(data.boardRecommendation.liquidityWarning)}</p></div><ol>${data.boardRecommendation.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ol></div>
    </section>`;
}

function decisionRow(d) {
  const searchable = `${d.id} ${d.question} ${d.answer}`.toLowerCase();
  return `<details class="decision-row" data-tier="${d.reviewTier}" data-confidence="${d.confidence}" data-search="${escapeHtml(searchable)}">
    <summary><span class="decision-id">${d.id}</span><span class="decision-question">${escapeHtml(d.question)}</span><span class="tier ${d.reviewTier}">${d.reviewTier === "material_judgment" ? "Material" : "Operational"}</span><span class="confidence ${d.confidence}">${d.confidence}</span><span class="chevron">+</span></summary>
    <div class="decision-body"><div><span>Certified answer</span><p>${escapeHtml(d.answer)}</p></div><div><span>Evidence</span><p>${d.evidence.map((e) => `<b>${e}</b>`).join(" ")}</p></div>${d.reviewTier === "material_judgment" ? `<div><span>Agent 1 proposal</span><p>${escapeHtml(d.aiProposal)}</p></div><div><span>Independent challenge</span><p>${escapeHtml(d.independentChallenge)}</p></div><div><span>Certification reasoning</span><p>${escapeHtml(d.studentReasoning)}</p></div>` : ""}</div>
  </details>`;
}

function reviewPage(data) {
  const material = data.decisions.filter((d) => d.reviewTier === "material_judgment");
  const unresolved = data.uncertainties.filter((u) => u.status === "unresolved");
  const low = data.decisions.filter((d) => d.confidence === "low");
  const overrides = material.filter((d) => d.changedFromAI);
  return `
    <section class="review-hero">
      <div><div class="eyebrow"><span class="live-dot"></span> Assessor view</div><h1>Material judgment trail</h1><p>Compact evidence, challenge, certification and financial impact for all 25 management-accounting judgments.</p></div>
      <div class="review-score"><strong>25/25</strong><span>material judgments complete</span></div>
    </section>
    <section class="review-flags">
      <article><span>Agent disagreements</span><strong>${overrides.length}</strong><small>Material conclusions changed after challenge</small></article>
      <article><span>Student overrides</span><strong>${overrides.length}</strong><small>Final answer changed from first proposal</small></article>
      <article><span>Low confidence</span><strong>${low.length}</strong><small>Insurance evidence gap</small></article>
      <article><span>Unresolved uncertainty</span><strong>${unresolved.length}</strong><small>Inventory and insurance</small></article>
    </section>
    <section class="review-table-wrap">
      <div class="review-toolbar"><div><div class="section-kicker">AI review trail</div><h2>Independent challenge record</h2></div><a class="button secondary" href="/submission.json">Open submission.json</a></div>
      <div class="review-cards">${material.map((d) => {
        const effect = Object.entries(d.statementEffect).filter(([,v]) => v !== null).map(([k,v]) => `<span>${k} ${signed(v)}</span>`).join("");
        return `<article class="review-card ${d.changedFromAI ? "override" : ""}">
          <header><span class="decision-id">${d.id}</span><h3>${escapeHtml(d.question)}</h3><span class="confidence ${d.confidence}">${d.confidence}</span></header>
          <div class="review-columns"><div><span>Agent 1</span><p>${escapeHtml(d.aiProposal)}</p></div><div class="challenge"><span>Independent challenge</span><p>${escapeHtml(d.independentChallenge)}</p></div><div class="final"><span>Certified answer</span><p>${escapeHtml(d.answer)}</p></div></div>
          <div class="reasoning"><strong>Why this answer</strong><p>${escapeHtml(d.studentReasoning)}</p><small class="effect-basis">${escapeHtml(d.statementEffectBasis)}</small></div>
          <footer><div class="effect-tags">${effect || "<span>No direct statement effect</span>"}</div><div class="evidence-tags">${d.evidence.map((e) => `<b>${e}</b>`).join("")}</div></footer>
        </article>`;
      }).join("")}</div>
    </section>`;
}

function bindDecisionFilters() {
  const input = document.querySelector("#decision-search");
  const buttons = [...document.querySelectorAll(".filter")];
  const rows = [...document.querySelectorAll(".decision-row")];
  if (!input) return;
  let current = "all";
  const update = () => {
    const query = input.value.trim().toLowerCase();
    rows.forEach((row) => {
      const filterMatch = current === "all" || row.dataset.tier === current || row.dataset.confidence === current;
      row.hidden = !(filterMatch && row.dataset.search.includes(query));
    });
    const count=document.querySelector('.result-count');
    const visible=rows.filter(row=>!row.hidden).length;
    if(count) count.textContent=visible ? `${visible} of ${rows.length} decisions shown` : 'No decisions match. Try another term or filter.';
  };
  input.addEventListener("input", update);
  buttons.forEach((button) => button.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    current = button.dataset.filter;
    update();
  }));
  update();
}

loadData().then((data) => {
  const review = window.location.pathname.replace(/\/$/, "") === "/review";
  app.innerHTML = shell(data, review);
  enhanceCase(data, review);
  bindDecisionFilters();
}).catch((error) => {
  app.innerHTML = `<main class="error"><span>DPI-HT-01</span><h1>Data load failed</h1><p>${escapeHtml(error.message)}</p></main>`;
});
