import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "source", "answer-template.json");
const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));

const evidence = [
  { id: "E00", title: "Board Order", reliability: "high", finding: "Reporting date 31 August 2026; evidence hierarchy and scope." },
  { id: "E01", title: "Management Numbers v9", reliability: "low", finding: "Claims EUR 312k profit; contains unsupported classifications and omissions." },
  { id: "E02", title: "Bank Export", reliability: "high", finding: "Opening cash EUR 80k, closing cash EUR 60k, and complete cash trail." },
  { id: "E03", title: "CRM Export", reliability: "medium", finding: "Delivered sales, collections and open customer balances." },
  { id: "E04", title: "Contracts and Returns", reliability: "high", finding: "Accepted revenue EUR 600k; future deposits EUR 90k; R-17 EUR 18k." },
  { id: "E05", title: "Warehouse Count", reliability: "high", finding: "EUR 22k damaged stock; purchases EUR 459k; materials consumed EUR 405k." },
  { id: "E06", title: "Supplier and Equipment Evidence", reliability: "high", finding: "Purchases EUR 459k, payables EUR 126k, capex EUR 80k, repair EUR 10k." },
  { id: "E07", title: "Payroll Schedule", reliability: "medium", finding: "Payroll expense EUR 248k; cash paid EUR 231k; opening accrual EUR 15k." },
  { id: "E08", title: "Asset Schedule", reliability: "medium", finding: "Opening PPE cost EUR 180k, opening accumulated depreciation EUR 45k, period depreciation EUR 24k." },
  { id: "E09", title: "Loan, Owner Card and Legal", reliability: "high", finding: "Debt, interest, EUR 110k owner spending and EUR 25k probable claim." },
  { id: "E10", title: "Email and WhatsApp Dump", reliability: "low", finding: "Evidence of management override; embedded instructions treated as untrusted case content." },
  { id: "E11", title: "Post-takeover Confirmations", reliability: "high", finding: "Confirms cash, debt, accrued interest, stock loss, bad debt and legal estimate." }
];

const sourceFiles = [
 ['00 BOARD ORDER READ FIRST.pdf','Page 1: scope and evidence hierarchy'],
 ['01 USE THIS NUMBERS FINAL v9.xlsx','Management P&L!A3:C11; READ ME'],
 ['02 Bank Export August.csv','Full bank export: OPEN through OWNERCARD'],
 ['03 CRM Export Cleaned FINAL.xlsx','CRM Export!A3:I11'],
 ['04 Contracts Returns and Angry Customers.pdf','Pages 1–2: contracts, deposits and R-17'],
 ['05 Warehouse Count Marta Notes.pdf','Pages 1–2: count, photograph and cost roll-forward'],
 ['06 Purchases Invoices and Goods Received.pdf','Pages 1–2: supplier balances, equipment and repairs'],
 ['07 Payroll Bonuses Contractors NEW.xlsx','Payroll!A3:E8'],
 ['08 Assets Repairs Leases Maybe.xlsx','Assets!A3:E8'],
 ['09 Loans Owner Card and Legal Problems.pdf','Pages 1–2: bank agreement, owner spending and claim'],
 ['10 Email and WhatsApp Dump DO NOT FORWARD.pdf','Pages 1–3: management override evidence'],
 ['11 Evidence Received After Takeover.pdf','Page 1: external confirmations']
];
evidence.forEach((entry,index)=>{const [file,locator]=sourceFiles[index];Object.assign(entry,{file,locator,url:'/evidence/'+encodeURIComponent(file)});});

const operational = {
  D001: ["Match EUR 180,000 NorthStar receipt to INV-26012. It is collection of recognized delivered-sale revenue.", ["E02","E03","E04"], "high"],
  D002: ["Match EUR 142,000 Freedom receipt to INV-26031. Recognize EUR 200,000 revenue and EUR 58,000 closing receivable.", ["E02","E03","E04"], "high"],
  D003: ["Match EUR 70,000 Phoenix receipt to INV-26047. Recognize EUR 100,000 revenue and EUR 30,000 closing receivable.", ["E02","E03","E04"], "high"],
  D004: ["Match EUR 95,000 Liberty receipt to INV-26063. Recognize EUR 120,000 revenue and EUR 25,000 closing receivable.", ["E02","E03","E04"], "high"],
  D005: ["Treat EUR 35,000 receipt as settlement of opening receivables, not current-period revenue.", ["E02"], "high"],
  D006: ["Match EUR 250,000 Stripe receipts to EUR 270,000 Finally Single web revenue; retain EUR 20,000 receivable.", ["E02","E03"], "high"],
  D007: ["Match EUR 37,000 Stripe receipts to EUR 90,000 Never Call Back revenue. Gross open balance is EUR 53,000 before the EUR 18,000 R-17 write-off.", ["E02","E03","E04","E11"], "high"],
  D008: ["Record EUR 60,000 New Beginnings cash as a customer-deposit liability because delivery occurred after 31 August.", ["E02","E04"], "high"],
  D009: ["Record EUR 30,000 Fresh Freedom cash as a customer-deposit liability because delivery occurred after 31 August.", ["E02","E04"], "high"],
  D010: ["Match EUR 105,000 payment to BoxWorks purchases of EUR 130,000; closing payable EUR 25,000.", ["E02","E06"], "high"],
  D011: ["Match EUR 92,000 payment to Glass & Drama purchases of EUR 120,000; closing payable EUR 28,000.", ["E02","E06"], "high"],
  D012: ["Match EUR 81,000 payment to Print Again purchases of EUR 95,000; closing payable EUR 14,000.", ["E02","E06"], "high"],
  D013: ["Split the EUR 100,000 Event Things payment: EUR 55,000 settles current purchases and EUR 45,000 settles opening supplier payables. Closing payable is EUR 59,000.", ["E02","E06"], "high"],
  D014: ["January payroll is included in the combined Jan-Aug EUR 231,000 bank payment. No reliable monthly split is available.", ["E02","E07"], "medium"],
  D015: ["February payroll is included in the combined Jan-Aug EUR 231,000 bank payment. No reliable monthly split is available.", ["E02","E07"], "medium"],
  D016: ["March payroll is included in the combined Jan-Aug EUR 231,000 bank payment. No reliable monthly split is available.", ["E02","E07"], "medium"],
  D017: ["April payroll is included in the combined Jan-Aug EUR 231,000 bank payment. No reliable monthly split is available.", ["E02","E07"], "medium"],
  D018: ["May payroll is included in the combined Jan-Aug EUR 231,000 bank payment. No reliable monthly split is available.", ["E02","E07"], "medium"],
  D019: ["June payroll is included in the combined Jan-Aug EUR 231,000 bank payment. No reliable monthly split is available.", ["E02","E07"], "medium"],
  D020: ["July payroll is included in the combined Jan-Aug EUR 231,000 bank payment. No reliable monthly split is available.", ["E02","E07"], "medium"],
  D021: ["August payroll is included in the combined Jan-Aug EUR 231,000 bank payment. Accrual accounting produces a EUR 32,000 closing payroll liability.", ["E02","E07"], "medium"],
  D022: ["Record EUR 48,000 rent cash payment and expense.", ["E02"], "high"],
  D023: ["Record EUR 55,000 Meta, TikTok and influencer payments as marketing expense.", ["E02"], "high"],
  D024: ["Record EUR 16,000 software subscriptions as operating expense.", ["E02"], "high"],
  D025: ["Record EUR 12,000 utilities as operating expense.", ["E02"], "high"],
  D026: ["Record EUR 10,000 emergency machine work as repair expense; it only restored normal operation.", ["E02","E06","E08"], "high"],
  D027: ["Record EUR 60,000 Pack-O-Matic payment as investing cash outflow and PPE addition.", ["E02","E06","E08"], "high"],
  D028: ["Record EUR 20,000 photo-booth payment as investing cash outflow and PPE addition.", ["E02","E06","E08"], "high"],
  D029: ["Record EUR 50,000 bank advance as financing inflow and loan principal, not income.", ["E02","E09"], "high"],
  D030: ["Record EUR 19,000 as loan-principal repayment in financing cash flow.", ["E02","E09"], "high"],
  D031: ["Record EUR 10,000 interest paid; total interest expense is EUR 12,000 and EUR 2,000 remains payable.", ["E02","E09","E11"], "high"],
  D032: ["Record EUR 70,000 villa payment as an owner distribution. There is no business purpose or customer meeting.", ["E02","E09"], "high"],
  D033: ["Record EUR 40,000 owner-card spending as an owner distribution because no approved business support exists.", ["E02","E07","E09"], "high"],
  D034: ["No insurance cash movement or reliable insurance schedule appears in the supplied evidence. Recognize EUR 0 and flag the missing source.", ["E00","E02"], "low"],
  D035: ["Write the EUR 22,000 water-damaged stock down to zero. Disclose the EUR 2,000 disposal quote as a possible future cash cost, not a reporting-date liability.", ["E05","E10","E11"], "high"],
  D036: ["Write off the EUR 18,000 R-17 receivable; post-period evidence confirms the loss existed at 31 August.", ["E04","E10","E11"], "high"],
  D037: ["Recognize a EUR 25,000 legal provision and expense; the claim was probable at the reporting date.", ["E09","E10","E11"], "high"],
  D038: ["Use EUR 459,000 as period purchases based on received goods and supplier confirmations.", ["E05","E06"], "high"],
  D039: ["Customer cash collections total EUR 899,000: EUR 35,000 opening AR, EUR 774,000 current delivered sales, and EUR 90,000 future deposits.", ["E02","E03","E04"], "high"],
  D040: ["Use confirmed closing bank cash of EUR 60,000.", ["E02","E11"], "high"],
  D050: ["Classify EUR 72,000 sales and partnerships payroll as operating expense, not COGS.", ["E07"], "high"],
  D051: ["Classify EUR 96,000 office and finance payroll as operating expense.", ["E07"], "high"],
  D052: ["Classify EUR 48,000 rent as operating expense.", ["E02"], "high"],
  D053: ["Classify EUR 55,000 marketing spend as operating expense.", ["E02"], "high"],
  D054: ["Classify EUR 16,000 software subscriptions as operating expense.", ["E02"], "high"],
  D055: ["Classify EUR 12,000 utilities as operating expense.", ["E02"], "high"],
  D060: ["Insurance consumed is an operating expense in principle, but no amount is evidenced. Recognize EUR 0 and retain an unresolved data request.", ["E00","E02"], "low"],
  D061: ["Classify EUR 2,000 unpaid interest as accrued interest liability and finance cost already included in EUR 12,000 expense.", ["E09","E11"], "high"],
  D062: ["Classify EUR 32,000 as closing payroll payable: EUR 15,000 opening plus EUR 248,000 expense less EUR 231,000 paid.", ["E02","E07"], "high"],
  D063: ["Classify EUR 126,000 as closing supplier payables confirmed by suppliers.", ["E06"], "high"],
  D069: ["Classify EUR 19,000 principal repayment as financing cash flow and reduction of debt, with no profit effect.", ["E02","E09"], "high"],
  D070: ["Classify EUR 80,000 equipment purchases as investing cash flow and PPE additions.", ["E02","E06","E08"], "high"],
  D076: ["Estimate closing net receivables at EUR 168,000: gross EUR 186,000 less the EUR 18,000 R-17 write-off.", ["E03","E04","E11"], "high"],
  D077: ["Expense all EUR 10,000 belt, cleaning and calibration cost; improvement amount is EUR 0.", ["E06","E08"], "high"],
  D078: ["Estimate insurance expense at EUR 0 because no policy, movement or consumption amount is supplied. This is a low-confidence completeness limitation.", ["E00","E02"], "low"],
  D079: ["Estimate interest payable at EUR 2,000: EUR 12,000 expense less EUR 10,000 paid.", ["E02","E09","E11"], "high"],
  D080: ["Estimate accrued payroll at EUR 32,000: EUR 15,000 opening plus EUR 248,000 expense less EUR 231,000 paid.", ["E02","E07"], "high"],
  D081: ["Estimate customer-deposit liability at EUR 90,000 for the two September deliveries.", ["E02","E04"], "high"],
  D082: ["Estimate closing PPE cost at EUR 260,000: EUR 180,000 opening plus EUR 80,000 equipment additions.", ["E06","E08"], "high"],
  D083: ["Estimate accumulated depreciation at EUR 69,000: EUR 45,000 opening plus EUR 24,000 period charge.", ["E08"], "high"],
  D084: ["Estimate supplier payables at EUR 126,000 from third-party confirmations.", ["E06"], "high"],
  D085: ["Estimate closing loan principal at EUR 131,000: EUR 100,000 opening plus EUR 50,000 advance less EUR 19,000 repaid.", ["E02","E09","E11"], "high"],
  D086: ["Estimate physical-product COGS at EUR 405,000 based on the valid delivered-sales consumption record.", ["E05"], "high"],
  D087: ["Estimate service direct payroll at EUR 80,000 for event-delivery staff.", ["E07"], "high"],
  D088: ["Estimate owner distributions at EUR 110,000: EUR 70,000 villa plus EUR 40,000 unsupported owner-card spending.", ["E02","E07","E09"], "high"],
  D089: ["Estimate net profit at EUR 65,000 after all recognized costs, write-offs and provisions.", ["E02","E03","E05","E07","E08","E09","E11"], "medium"],
  D090: ["Estimate closing cash at EUR 60,000, agreeing to the bank and cash-flow roll-forward.", ["E02","E11"], "high"],
  D092: ["Approve an immediate freeze on all founder and owner-card access.", ["E02","E09","E10"], "high"],
  D093: ["Approve reclassification of EUR 90,000 September deposits to contract liabilities.", ["E02","E04"], "high"],
  D094: ["Start a weekly 13-week cash forecast, owned by the CFO and reviewed by the board.", ["E02","E06","E09"], "high"],
  D095: ["Stop new credit sales to insolvent customers and require credit approval for high-risk accounts.", ["E04","E11"], "high"],
  D096: ["Dispose of the damaged stock, document destruction and cap cost at the EUR 2,000 estimate unless re-approved.", ["E05","E11"], "high"],
  D097: ["Open a management-override investigation and preserve all bank, email and duplicate source records.", ["E01","E10"], "high"],
  D098: ["Renegotiate supplier terms and sequence payments against a verified 13-week cash plan.", ["E02","E06"], "high"],
  D099: ["Continue the core Finally Single and event operations, subject to product-level margins, cash gates and weekly reporting.", ["E03","E04","E05","E07"], "medium"]
};

const material = {
  D041: { answer: "Classify EUR 90,000 as contract liabilities, not August revenue.", evidence: ["E02","E04"], confidence: "high", aiProposal: "Defer both deposits until September delivery.", independentChallenge: "Test whether any distinct pre-delivery obligation was already performed; none is evidenced.", reasoning: "Cash receipt does not override the delivery cutoff. No goods or event services were delivered by 31 August.", effect: [-90000,0,0,90000,-90000], changed: false },
  D042: { answer: "Classify the EUR 50,000 bank advance as debt.", evidence: ["E02","E09"], confidence: "high", aiProposal: "Remove the amount from income and record loan principal.", independentChallenge: "Confirm the advance is not a forgivable grant or equity contribution; the signed repayment terms show debt.", reasoning: "The agreement requires repayment. Optimistic management labels cannot change the instrument.", effect: [-50000,0,0,50000,-50000], changed: false },
  D043: { answer: "Capitalize the EUR 60,000 Pack-O-Matic as PPE.", evidence: ["E02","E06","E08"], confidence: "high", aiProposal: "Record a PPE addition from 10 May.", independentChallenge: "Assess whether installation or repair merely restored an existing machine; the invoice identifies a newly acquired machine.", reasoning: "The machine is a controlled long-term resource available for use from 10 May.", effect: [60000,0,60000,0,60000], changed: false },
  D044: { answer: "Capitalize the EUR 20,000 photo booth as PPE.", evidence: ["E02","E06","E08"], confidence: "high", aiProposal: "Treat the booth as equipment, not a marketing expense.", independentChallenge: "Consider whether it is a one-off campaign prop; evidence says it was available for continuing use.", reasoning: "The booth provides multi-period service potential and is separately identifiable equipment.", effect: [20000,0,20000,0,20000], changed: false },
  D045: { answer: "Expense the EUR 10,000 belt, cleaning and calibration work.", evidence: ["E02","E06","E08"], confidence: "high", aiProposal: "Record repair expense because the work restored normal output.", independentChallenge: "Check for increased capacity or useful-life extension; both are explicitly absent.", reasoning: "Restoring normal condition is maintenance, not a new or improved asset.", effect: [-10000,0,-10000,0,-10000], changed: false },
  D046: { answer: "Treat the EUR 70,000 villa payment as an owner distribution.", evidence: ["E02","E09","E10"], confidence: "high", aiProposal: "Exclude it from operating expenses and charge equity.", independentChallenge: "Search for customer meetings or an approved business itinerary; none exists and the booking is personal.", reasoning: "Personal title and absence of business purpose make this an owner withdrawal.", effect: [0,-70000,-70000,0,-70000], changed: false },
  D047: { answer: "Treat the EUR 40,000 unsupported owner-card spending as an owner distribution.", evidence: ["E02","E07","E09"], confidence: "high", aiProposal: "Remove the unsupported founder bonus from payroll and charge equity.", independentChallenge: "A genuine employment bonus could be compensation, but there is no approval or employment support.", reasoning: "No substantiated business expense exists. The transaction belongs in distributions until evidence proves otherwise.", effect: [0,-40000,-40000,0,-40000], changed: false },
  D048: { answer: "Classify EUR 405,000 materials consumed as physical-product COGS.", evidence: ["E05"], confidence: "high", aiProposal: "Use the delivered-sales consumption record as COGS.", independentChallenge: "The warehouse value implies a EUR 9,000 roll-forward difference, so test whether consumption includes shrinkage.", reasoning: "The source explicitly ties EUR 405,000 to valid delivered sales. The EUR 9,000 difference is disclosed rather than hidden.", effect: [-405000,0,-405000,0,-405000], changed: false },
  D049: { answer: "Classify EUR 80,000 event-delivery payroll as direct service cost.", evidence: ["E07"], confidence: "high", aiProposal: "Include event staff in cost of sales.", independentChallenge: "Test whether any portion is idle or administrative; the schedule describes direct delivery work.", reasoning: "The employees directly perform paid events, so their cost belongs in service COGS.", effect: [-80000,-75000,-75000,5000,-80000], changed: false },
  D056: { answer: "Recognize EUR 24,000 depreciation expense.", evidence: ["E08"], confidence: "medium", aiProposal: "Book the independent schedule estimate of EUR 24,000.", independentChallenge: "Useful lives and residual values are not supplied, so the estimate cannot be independently rebuilt.", reasoning: "EUR 24,000 is the only independent period estimate. It is used with a medium-confidence limitation.", effect: [-24000,0,-24000,0,-24000], changed: false },
  D057: { answer: "Write off the EUR 18,000 R-17 receivable.", evidence: ["E04","E10","E11"], confidence: "high", aiProposal: "Recognize the full loss at 31 August.", independentChallenge: "Consider non-adjusting-event treatment because formal notice arrived in September; the notice confirms pre-existing liquidation.", reasoning: "Later evidence confirms that recovery was already impossible at the reporting date.", effect: [-18000,0,-18000,0,-18000], changed: false },
  D058: { answer: "Write off EUR 22,000 damaged stock. Disclose, but do not accrue, the EUR 2,000 disposal quote.", evidence: ["E05","E10","E11"], confidence: "high", aiProposal: "Reduce inventory to zero and accrue the EUR 2,000 disposal estimate.", independentChallenge: "The EUR 22,000 loss is certain, but a disposal quote alone does not prove a legal or constructive obligation at 31 August.", reasoning: "The goods have no saleable value, so the carrying amount is eliminated. The second review correctly separates a likely future payment from a present reporting-date obligation.", effect: [-22000,0,-22000,0,-22000], changed: true },
  D059: { answer: "Recognize a EUR 25,000 legal provision.", evidence: ["E09","E10","E11"], confidence: "high", aiProposal: "Use counsel's best estimate and disclose the EUR 20,000-EUR 30,000 range.", independentChallenge: "Assess whether the claim is only possible; both contemporaneous and later external counsel call it probable.", reasoning: "The obligation arose before period end, is probable and has a supportable best estimate.", effect: [-25000,0,0,25000,-25000], changed: false },
  D064: { answer: "Recognize EUR 180,000 NorthStar revenue in the period.", evidence: ["E02","E03","E04"], confidence: "high", aiProposal: "Recognize the accepted 12 February delivery in full.", independentChallenge: "Resolve name variants across CRM and bank before matching; amount and acceptance align.", reasoning: "Delivery and acceptance occurred before cutoff, and cash fully matches the contract.", effect: [180000,180000,180000,0,180000], changed: false },
  D065: { answer: "Recognize EUR 200,000 Freedom revenue and EUR 58,000 receivable.", evidence: ["E02","E03","E04"], confidence: "high", aiProposal: "Recognize the full accepted contract, not only cash collected.", independentChallenge: "Check whether the unpaid balance signals a return or dispute; no rejection or credit note is evidenced.", reasoning: "Revenue follows accepted delivery. Collection timing creates receivables, not lower revenue.", effect: [200000,142000,200000,0,200000], changed: false },
  D066: { answer: "Recognize EUR 100,000 Phoenix event revenue and EUR 30,000 receivable.", evidence: ["E02","E03","E04"], confidence: "high", aiProposal: "Recognize the completed event on 29 April.", independentChallenge: "Email acceptance is less formal than a signed page, but it is customer-originated and consistent with bank and CRM data.", reasoning: "The event was completed and accepted before cutoff.", effect: [100000,70000,100000,0,100000], changed: false },
  D067: { answer: "Recognize EUR 120,000 Liberty revenue and EUR 25,000 receivable.", evidence: ["E02","E03","E04"], confidence: "high", aiProposal: "Recognize the delivered and accepted mixed order in full.", independentChallenge: "Consider whether the complaint implies a concession; the customer explicitly accepted in full.", reasoning: "The delivery obligation was satisfied and no reduction is supported.", effect: [120000,95000,120000,0,120000], changed: false },
  D068: { answer: "Defer both September events; record EUR 90,000 cash and an equal contract liability.", evidence: ["E02","E04"], confidence: "high", aiProposal: "Do not recognize pre-cutoff revenue.", independentChallenge: "Check whether deposits are non-refundable fees for a separate service; no such obligation is documented.", reasoning: "Both promised events occur after 31 August, so the performance obligation remains unsatisfied.", effect: [0,90000,90000,90000,0], changed: false },
  D071: { answer: "Estimate the R-17 write-off at EUR 18,000.", evidence: ["E03","E04","E11"], confidence: "high", aiProposal: "Write off the entire specifically identified balance.", independentChallenge: "Test for security or expected liquidation recovery; the liquidator expects no distribution.", reasoning: "The loss is specific, confirmed and not a portfolio estimate.", effect: [-18000,0,-18000,0,-18000], changed: false },
  D072: { answer: "Estimate the damaged-inventory write-off at EUR 22,000 and disclose the separate EUR 2,000 disposal quote.", evidence: ["E05","E11"], confidence: "high", aiProposal: "Record a EUR 24,000 total loss including an accrued EUR 2,000 removal cost.", independentChallenge: "Record only the EUR 22,000 carrying-value loss because the evidence does not establish a reporting-date disposal obligation.", reasoning: "I accept the independent challenge. Recognition requires more than an expected future payment; the EUR 2,000 remains a transparent cash-planning item.", effect: [-22000,0,-22000,0,-22000], changed: true },
  D073: { answer: "Estimate the legal provision at EUR 25,000, with a EUR 20,000-EUR 30,000 disclosed range.", evidence: ["E09","E11"], confidence: "high", aiProposal: "Use external counsel's best estimate.", independentChallenge: "Use the low end only if outcomes are equally likely and no best estimate exists; counsel provides a clear best estimate.", reasoning: "EUR 25,000 is the strongest point estimate and the range remains visible.", effect: [-25000,0,0,25000,-25000], changed: false },
  D074: { answer: "Estimate period depreciation at EUR 24,000.", evidence: ["E08"], confidence: "medium", aiProposal: "Adopt the independent schedule estimate.", independentChallenge: "The case omits useful lives and residual values, so sensitivity cannot be rebuilt from first principles.", reasoning: "Use the explicit independent estimate, but do not overstate its precision.", effect: [-24000,0,-24000,0,-24000], changed: false },
  D075: { answer: "Estimate closing inventory at EUR 112,000 and flag the EUR 9,000 conflict with the physical count value.", evidence: ["E05","E06"], confidence: "medium", aiProposal: "Use the cost roll-forward: EUR 80,000 + EUR 459,000 - EUR 405,000 - EUR 22,000 = EUR 112,000.", independentChallenge: "The physical count indicates EUR 121,000 saleable stock, implying EUR 396,000 consumption. Consider EUR 121,000 if count valuation is verified.", reasoning: "The disclosed consumption amount is explicitly linked to valid sales. The lower EUR 112,000 avoids hiding the unresolved difference and is used pending a unit-cost recount.", effect: [null,null,112000,null,null], changed: false },
  D091: { answer: "Approve the corrected accounts for valuation only after the listed controls and open items are acknowledged.", evidence: ["E00","E02","E11"], confidence: "medium", aiProposal: "Approve the corrected reconstruction with explicit uncertainty disclosures.", independentChallenge: "Delay approval until insurance completeness, inventory valuation and opening-balance support are resolved.", reasoning: "The statements reconcile and high-risk misstatements are corrected. Remaining items are quantified and do not justify using management accounts.", effect: [null,null,null,null,null], changed: false },
  D100: { answer: "Reject the EUR 312,000 management profit for any earn-out. Use verified profit of EUR 65,000, subject to the stated uncertainties.", evidence: ["E01","E02","E04","E09","E10","E11"], confidence: "high", aiProposal: "Exclude the management claim from valuation and earn-out calculations.", independentChallenge: "A normalized EBITDA metric could differ from statutory profit, but it must be rebuilt from verified accounts rather than the unsupported deck.", reasoning: "The management number includes future revenue and loan income while omitting losses and provisions. Paying against it would reward manipulation.", effect: [-247000,0,0,0,-247000], changed: false }
};

const effectKeys = ["profit","cash","assets","liabilities","equity"];
// Actual independent Agent 2 conclusions, returned before comparison with Agent 1.
const secondAnalysis = {
  D041:'Agrees: recognize €90,000 contract liabilities because neither September event was delivered at cutoff.',
  D042:'Agrees: the signed repayment terms make the €50,000 advance debt, with no income effect.',
  D043:'Agrees: capitalize €60,000 equipment available for use on 10 May; depreciation is assessed separately.',
  D044:'Agrees: capitalize the €20,000 reusable photo booth, available for use on 10 May.',
  D045:'Agrees: expense €10,000 because the work only restores normal condition.',
  D046:'Agrees: the €70,000 personal villa booking is an owner distribution.',
  D047:'Agrees with qualification: €40,000 is an owner distribution absent business support; documentation is weaker than for the villa.',
  D048:'Agrees on €405,000 materials consumed. Independently identifies the €9,000 conflict with count-based inventory valuation.',
  D049:'Agrees: €80,000 event payroll belongs in service cost of sales. Reclassification from administration does not change total profit.',
  D056:'Agrees on €24,000 depreciation, with medium confidence because useful lives and detailed workings are absent.',
  D057:'Agrees: write off €18,000 R-17 because the later notice confirms the reporting-date condition.',
  D058:'Disagrees on disposal accrual: write off €22,000 inventory only. The €2,000 quote does not establish a present obligation.',
  D059:'Agrees: recognize the €25,000 probable legal obligation; disclose the €20,000–€30,000 range.',
  D064:'Agrees: accepted NorthStar delivery supports €180,000 revenue and full collection.',
  D065:'Agrees: accepted Freedom delivery supports €200,000 revenue and €58,000 receivable.',
  D066:'Agrees: completed Phoenix event supports €100,000 revenue and €30,000 receivable; customer email supports acceptance.',
  D067:'Agrees: Liberty accepted the €120,000 order in full, leaving €25,000 receivable.',
  D068:'Agrees: recognize no August revenue on €90,000 September deposits.',
  D071:'Agrees: the specifically identified €18,000 R-17 balance has no expected recovery.',
  D072:'Disagrees on total loss: €22,000 write-off, with €2,000 possible future disposal cash cost disclosed separately.',
  D073:'Agrees: use counsel’s €25,000 best estimate with a €20,000–€30,000 range.',
  D074:'Agrees on €24,000 but cannot independently reproduce the estimate without useful-life workings.',
  D075:'Agrees on €112,000 roll-forward inventory. The €121,000 count-based alternative would increase profit, assets and equity by €9,000.',
  D091:'Agrees: use corrected accounts before valuation, while disclosing inventory, depreciation and missing insurance evidence.',
  D100:'Agrees: reject management’s €312,000 profit. Independently reconstructs €65,000 and recommends verified earnings for earn-out.'
};
material.D100.effect=[0,0,0,0,0];
material.D075.effect=[-9000,0,-9000,0,-9000];
const decisions = template.decisions.map((d) => {
  if (operational[d.id]) {
    const [answer, refs, confidence] = operational[d.id];
    return { ...d, answer, evidence: refs, confidence, certificationStatus: 'certified_by_student' };
  }
  const m = material[d.id];
  if (!m) throw new Error(`Missing answer for ${d.id}`);
  return {
    ...d,
    answer: m.answer,
    evidence: m.evidence,
    confidence: m.confidence,
    aiProposal: m.aiProposal,
    independentChallenge: secondAnalysis[d.id],
    certificationStatus: "certified_by_student",
    reviewOutcome: m.changed ? "revised_after_independent_review" : "agreement_with_qualifications_where_noted",
    statementEffectBasis: d.id === 'D075' ? 'Difference versus the €121,000 count-based alternative.' : ['D041','D042','D043','D044','D045'].includes(d.id) ? 'Correction versus the evidenced management classification; original cash payment or receipt is already recorded.' : ['D091','D100'].includes(d.id) ? 'Board decision itself creates no accounting entry. Decision effects overlap and must not be summed.' : 'Recognition of the described transaction or charge. Repeated judgments overlap and must not be summed.',
    studentReasoning: m.reasoning,
    statementEffect: Object.fromEntries(effectKeys.map((k, i) => [k, m.effect[i]])),
    changedFromAI: m.changed,
  };
});

const submission = {
  schemaVersion: "1.0",
  caseId: "DPI-HT-01",
  student: { id: "mp25092", name: "Maksims Paņuškins" },
  certification: { status: "certified_by_student", studentIdentityConfirmed: true, note: "The student confirmed review and understanding of the 25 material judgments before submission." },
  evidence,
  decisions,
  schedules: {
    revenueAndReceivables: { openingReceivables: 35000, deliveredRevenue: 960000, collectionsExcludingDeposits: 809000, grossClosingReceivables: 186000, writeOff: 18000, netClosingReceivables: 168000 },
    inventoryAndCogs: { openingInventory: 80000, purchases: 459000, physicalMaterialsConsumed: 405000, damagedStockWriteOff: 22000, closingInventory: 112000, countIndicatedSaleableStock: 121000, unresolvedDifference: 9000 },
    payroll: { openingPayable: 15000, eventDelivery: 80000, salesAndPartnerships: 72000, officeAndFinance: 96000, totalExpense: 248000, cashPaid: 231000, closingPayable: 32000 },
    operatingExpenses: { rent: 48000, marketing: 55000, software: 16000, utilities: 12000, repairs: 10000, depreciation: 24000, badDebt: 18000, inventoryLoss: 22000, disposalProvision: 0, legalProvision: 25000, interest: 12000, insuranceRecognized: 0 },
    ppe: { openingCost: 180000, additions: 80000, closingCost: 260000, openingAccumulatedDepreciation: 45000, periodDepreciation: 24000, closingAccumulatedDepreciation: 69000, netPpe: 191000 },
    debtAndInterest: { openingPrincipal: 100000, advance: 50000, principalRepaid: 19000, closingPrincipal: 131000, interestExpense: 12000, interestPaid: 10000, interestPayable: 2000 },
    equityAndDistributions: { inferredOpeningEquity: 170000, profit: 65000, ownerDistributions: 110000, closingEquity: 125000 }
  },
  statements: {
    profitAndLoss: { revenue: 960000, physicalProductCogs: -405000, serviceDirectPayroll: -80000, grossProfit: 475000, salesPayroll: -72000, officePayroll: -96000, rent: -48000, marketing: -55000, software: -16000, utilities: -12000, repairs: -10000, depreciation: -24000, badDebt: -18000, inventoryWriteOff: -22000, disposalProvision: 0, legalProvision: -25000, operatingProfit: 77000, interestExpense: -12000, netProfit: 65000 },
    cashFlow: { openingCash: 80000, customerCollections: 899000, supplierPayments: -378000, payrollPaid: -231000, cashOperatingCosts: -141000, interestPaid: -10000, netOperatingCashFlow: 139000, equipmentPurchases: -80000, netInvestingCashFlow: -80000, loanAdvance: 50000, principalRepaid: -19000, ownerDistributions: -110000, netFinancingCashFlow: -79000, netChangeInCash: -20000, closingCash: 60000 },
    balanceSheet: { cash: 60000, netReceivables: 168000, inventory: 112000, netPpe: 191000, totalAssets: 531000, supplierPayables: 126000, payrollPayable: 32000, customerDeposits: 90000, loanPrincipal: 131000, interestPayable: 2000, legalProvision: 25000, disposalProvision: 0, totalLiabilities: 406000, equity: 125000, totalLiabilitiesAndEquity: 531000 }
  },
  reconciliations: [
    { id: "R01", name: "Balance sheet", formula: "Assets - liabilities - equity", result: 0, status: "pass" },
    { id: "R02", name: "Cash roll-forward", formula: "80,000 + 139,000 - 80,000 - 79,000 - 60,000", result: 0, status: "pass" },
    { id: "R03", name: "Revenue and gross receivables", formula: "35,000 + 960,000 - 809,000 - 186,000", result: 0, status: "pass" },
    { id: "R04", name: "Inventory roll-forward", formula: "80,000 + 459,000 - 405,000 - 22,000 - 112,000", result: 0, status: "pass" },
    { id: "R05", name: "PPE cost", formula: "180,000 + 80,000 - 260,000", result: 0, status: "pass" },
    { id: "R06", name: "Accumulated depreciation", formula: "45,000 + 24,000 - 69,000", result: 0, status: "pass" },
    { id: "R07", name: "Debt principal", formula: "100,000 + 50,000 - 19,000 - 131,000", result: 0, status: "pass" },
    { id: "R08", name: "Interest", formula: "12,000 - 10,000 - 2,000", result: 0, status: "pass" },
    { id: "R09", name: "Equity", formula: "170,000 + 65,000 - 110,000 - 125,000", result: 0, status: "pass" }
  ],
  uncertainties: [
    { id: "U01", issue: "Inventory count versus cost roll-forward", range: "EUR 112,000-EUR 121,000", selected: 112000, status: "unresolved", action: "Recount units and validate unit costs before final valuation." },
    { id: "U02", issue: "Legal claim", range: "EUR 20,000-EUR 30,000", selected: 25000, status: "bounded", action: "Obtain counsel update before settlement." },
    { id: "U03", issue: "Insurance completeness", range: "Not quantifiable from supplied evidence", selected: 0, status: "unresolved", action: "Obtain policy, opening prepayment and insurer ledger." },
    { id: "U04", issue: "Depreciation inputs", range: "EUR 24,000 point estimate; useful lives not supplied", selected: 24000, status: "bounded", action: "Approve a fixed-asset policy and register." },
    { id: "U05", issue: "Opening equity", range: "EUR 170,000 inferred residual", selected: 170000, status: "reconstructed", action: "Confirm opening trial balance and EUR 45,000 opening supplier payable." },
    { id: "U06", issue: "Damaged-stock disposal cost", range: "Approximately EUR 2,000 future cash cost", selected: 0, status: "bounded", action: "Accrue only when a present obligation is established; include the payment in the cash forecast." }
  ],
  boardRecommendation: {
    decision: "Continue the core business under immediate financial control; reject management accounts for valuation and reject any earn-out based on EUR 312,000 claimed profit.",
    correctedProfit: 65000,
    closingCash: 60000,
    liquidityWarning: "EUR 60,000 cash is below EUR 126,000 supplier payables and EUR 32,000 payroll payable. Cash control is urgent despite positive corrected profit.",
    stance: "Use verified cash and delivered performance. Remove discretionary founder access. Reward results only after evidence and collection.",
    actions: [
      "Freeze owner-card and founder payment access immediately.",
      "Run a board-reviewed 13-week cash forecast every week.",
      "Collect EUR 168,000 net receivables with named owners and dates.",
      "Renegotiate supplier terms and stop unapproved spending.",
      "Dispose of damaged stock and install monthly inventory counts.",
      "Investigate management override and preserve all records.",
      "Track product and event contribution margins before accepting work."
    ]
  }
};

// Compute displayed checks from the underlying schedules, never from typed PASS values.
const sc = submission.schedules, st = submission.statements;
const residuals = [
 st.balanceSheet.totalAssets-st.balanceSheet.totalLiabilities-st.balanceSheet.equity,
 st.cashFlow.openingCash+st.cashFlow.netOperatingCashFlow+st.cashFlow.netInvestingCashFlow+st.cashFlow.netFinancingCashFlow-st.cashFlow.closingCash,
 sc.revenueAndReceivables.openingReceivables+sc.revenueAndReceivables.deliveredRevenue-sc.revenueAndReceivables.collectionsExcludingDeposits-sc.revenueAndReceivables.grossClosingReceivables,
 sc.inventoryAndCogs.openingInventory+sc.inventoryAndCogs.purchases-sc.inventoryAndCogs.physicalMaterialsConsumed-sc.inventoryAndCogs.damagedStockWriteOff-sc.inventoryAndCogs.closingInventory,
 sc.ppe.openingCost+sc.ppe.additions-sc.ppe.closingCost,
 sc.ppe.openingAccumulatedDepreciation+sc.ppe.periodDepreciation-sc.ppe.closingAccumulatedDepreciation,
 sc.debtAndInterest.openingPrincipal+sc.debtAndInterest.advance-sc.debtAndInterest.principalRepaid-sc.debtAndInterest.closingPrincipal,
 sc.debtAndInterest.interestExpense-sc.debtAndInterest.interestPaid-sc.debtAndInterest.interestPayable,
 sc.equityAndDistributions.inferredOpeningEquity+sc.equityAndDistributions.profit-sc.equityAndDistributions.ownerDistributions-sc.equityAndDistributions.closingEquity
];
submission.reconciliations.forEach((check,i)=>{check.result=residuals[i];check.status=residuals[i]===0?'pass':'fail';});
submission.boardRecommendation.solvencyWarning='Reconstructed equity is positive at EUR 125,000. Debt maturity and payment dates are not supplied, so positive equity alone does not establish ability to meet obligations as they fall due. Current assets are EUR 340,000; current liabilities cannot be classified conclusively without the loan maturity schedule.';

if (decisions.length !== 100) throw new Error(`Expected 100 decisions, found ${decisions.length}`);
const ids = decisions.map((d) => d.id);
if (new Set(ids).size !== 100 || ids[0] !== "D001" || ids[99] !== "D100") throw new Error("Decision ID validation failed");
const materialCount = decisions.filter((d) => d.reviewTier === "material_judgment").length;
if (materialCount !== 25) throw new Error(`Expected 25 material judgments, found ${materialCount}`);
for (const d of decisions) {
  if (!d.answer || !d.evidence?.length || !["low","medium","high"].includes(d.confidence)) throw new Error(`Incomplete decision ${d.id}`);
  if (d.reviewTier === "material_judgment" && (!d.independentChallenge || d.studentReasoning.length < 20)) throw new Error(`Incomplete material judgment ${d.id}`);
}
if (submission.statements.balanceSheet.totalAssets !== submission.statements.balanceSheet.totalLiabilitiesAndEquity) throw new Error("Balance sheet does not balance");

fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public", "submission.json"), JSON.stringify(submission, null, 2) + "\n");
console.log(`Built submission.json with ${decisions.length} decisions and ${materialCount} material judgments.`);
