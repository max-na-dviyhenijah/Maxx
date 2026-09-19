import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "public", "submission.json"), "utf8"));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const sum = (...values) => values.reduce((total, value) => total + value, 0);

assert(data.decisions.length === 100, "Decision count must be 100");
assert(new Set(data.decisions.map((d) => d.id)).size === 100, "Decision IDs must be unique");
assert(data.decisions.filter((d) => d.reviewTier === "material_judgment").length === 25, "Material decision count must be 25");
assert(data.decisions.filter((d) => d.reviewTier === "operational").length === 75, "Operational decision count must be 75");
for(let i=1;i<=100;i++) assert(data.decisions.some(d=>d.id===`D${String(i).padStart(3,'0')}`),`Missing decision D${i}`);
for(const e of data.evidence) assert(fs.existsSync(path.join(root,'public',decodeURIComponent(e.url))),`Missing original source ${e.id}`);
for(const d of data.decisions) {
  assert(d.evidence.every(id=>data.evidence.some(e=>e.id===id)),`Invalid evidence reference on ${d.id}`);
  if(d.statementEffect && Object.values(d.statementEffect).every(v=>typeof v==='number')) {
    assert(d.statementEffect.assets===d.statementEffect.liabilities+d.statementEffect.equity,`Unbalanced financial effect on ${d.id}`);
  }
}
// The trailing three CSV columns are numeric, including on rows with quoted descriptions.
const bankLines=fs.readFileSync(path.join(root,'public/evidence/02 Bank Export August.csv'),'utf8').trim().split(/\r?\n/).slice(1);
let priorBalance=0;
for(const row of bankLines){const [debit,credit,balance]=row.split(',').slice(-3).map(v=>Number(v||0));assert(priorBalance-debit+credit===balance,'Bank row does not roll forward');priorBalance=balance;}
assert(priorBalance===data.statements.cashFlow.closingCash,'Cash does not match original bank evidence');

const p = data.statements.profitAndLoss;
const recomputedProfit = sum(
  p.revenue, p.physicalProductCogs, p.serviceDirectPayroll, p.salesPayroll, p.officePayroll,
  p.rent, p.marketing, p.software, p.utilities, p.repairs, p.depreciation, p.badDebt,
  p.inventoryWriteOff, p.disposalProvision, p.legalProvision, p.interestExpense
);
assert(recomputedProfit === p.netProfit, `P&L mismatch: ${recomputedProfit} versus ${p.netProfit}`);

const c = data.statements.cashFlow;
const operating = sum(c.customerCollections, c.supplierPayments, c.payrollPaid, c.cashOperatingCosts, c.interestPaid);
assert(operating === c.netOperatingCashFlow, "Operating cash flow mismatch");
assert(sum(c.openingCash, c.netOperatingCashFlow, c.netInvestingCashFlow, c.netFinancingCashFlow) === c.closingCash, "Cash roll-forward mismatch");

const b = data.statements.balanceSheet;
assert(sum(b.cash, b.netReceivables, b.inventory, b.netPpe) === b.totalAssets, "Asset total mismatch");
assert(sum(b.supplierPayables, b.payrollPayable, b.customerDeposits, b.loanPrincipal, b.interestPayable, b.legalProvision, b.disposalProvision) === b.totalLiabilities, "Liability total mismatch");
assert(b.totalAssets === sum(b.totalLiabilities, b.equity), "Balance sheet mismatch");

const s = data.schedules;
assert(sum(s.revenueAndReceivables.openingReceivables, s.revenueAndReceivables.deliveredRevenue, -s.revenueAndReceivables.collectionsExcludingDeposits, -s.revenueAndReceivables.writeOff) === s.revenueAndReceivables.netClosingReceivables, "Receivables schedule mismatch");
assert(sum(s.inventoryAndCogs.openingInventory, s.inventoryAndCogs.purchases, -s.inventoryAndCogs.physicalMaterialsConsumed, -s.inventoryAndCogs.damagedStockWriteOff) === s.inventoryAndCogs.closingInventory, "Inventory schedule mismatch");
assert(sum(s.payroll.openingPayable, s.payroll.totalExpense, -s.payroll.cashPaid) === s.payroll.closingPayable, "Payroll schedule mismatch");
assert(sum(s.debtAndInterest.openingPrincipal, s.debtAndInterest.advance, -s.debtAndInterest.principalRepaid) === s.debtAndInterest.closingPrincipal, "Debt schedule mismatch");
assert(sum(s.equityAndDistributions.inferredOpeningEquity, s.equityAndDistributions.profit, -s.equityAndDistributions.ownerDistributions) === s.equityAndDistributions.closingEquity, "Equity schedule mismatch");
assert(data.reconciliations.every((r) => r.result === 0 && r.status === "pass"), "All reconciliations must pass");

console.log("Verified 100 decisions, 25 material judgments, all schedules, three statements and nine reconciliations.");
