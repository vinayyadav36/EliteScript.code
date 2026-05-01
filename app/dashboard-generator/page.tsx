'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, ShoppingCart, TrendingUp, Users, Building2,
  Download, ChevronDown, ChevronUp, Loader2, CheckCircle2,
  Megaphone, Package, DollarSign, Clock
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Industry = 'pos' | 'sales' | 'marketing' | 'hr' | 'finance' | 'ecommerce' | 'inventory' | 'crm';

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
}

interface IndustryConfig {
  id: Industry;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  fields: FieldDef[];
}

// ─── Industry Configurations ──────────────────────────────────────────────────

const INDUSTRIES: IndustryConfig[] = [
  {
    id: 'pos',
    label: 'Point of Sale (POS)',
    icon: ShoppingCart,
    color: 'text-emerald-400',
    description: 'Daily sales, transactions, top products, shift summaries',
    fields: [
      { key: 'businessName', label: 'Business Name', placeholder: 'My Retail Store' },
      { key: 'month', label: 'Report Month', placeholder: 'April 2026' },
      { key: 'totalTransactions', label: 'Total Transactions', placeholder: '1250', type: 'number' },
      { key: 'totalRevenue', label: 'Total Revenue (₹/$)', placeholder: '875000', type: 'number' },
      { key: 'avgOrderValue', label: 'Avg Order Value', placeholder: '700', type: 'number' },
      { key: 'topProduct', label: 'Top Selling Product', placeholder: 'Product Name' },
      { key: 'topProductRevenue', label: 'Top Product Revenue', placeholder: '125000', type: 'number' },
      { key: 'returns', label: 'Returns/Refunds Count', placeholder: '18', type: 'number' },
      { key: 'cashTransactions', label: 'Cash Transactions %', placeholder: '40', type: 'number' },
      { key: 'cardTransactions', label: 'Card/UPI Transactions %', placeholder: '60', type: 'number' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales Dashboard',
    icon: TrendingUp,
    color: 'text-yellow-400',
    description: 'Pipeline, conversion rates, rep performance, forecasts',
    fields: [
      { key: 'businessName', label: 'Company Name', placeholder: 'Acme Corp' },
      { key: 'period', label: 'Period', placeholder: 'Q1 2026' },
      { key: 'totalLeads', label: 'Total Leads', placeholder: '500', type: 'number' },
      { key: 'qualifiedLeads', label: 'Qualified Leads', placeholder: '200', type: 'number' },
      { key: 'closedDeals', label: 'Closed Deals', placeholder: '45', type: 'number' },
      { key: 'totalRevenue', label: 'Revenue Closed (₹/$)', placeholder: '2500000', type: 'number' },
      { key: 'target', label: 'Revenue Target (₹/$)', placeholder: '3000000', type: 'number' },
      { key: 'avgDealSize', label: 'Avg Deal Size', placeholder: '55000', type: 'number' },
      { key: 'salesCycle', label: 'Avg Sales Cycle (days)', placeholder: '21', type: 'number' },
      { key: 'topRep', label: 'Top Sales Rep Name', placeholder: 'Rahul Sharma' },
      { key: 'topRepRevenue', label: 'Top Rep Revenue', placeholder: '800000', type: 'number' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing Analytics',
    icon: Megaphone,
    color: 'text-pink-400',
    description: 'Campaigns, CAC, ROAS, lead quality, channel breakdown',
    fields: [
      { key: 'businessName', label: 'Brand Name', placeholder: 'Brand X' },
      { key: 'period', label: 'Period', placeholder: 'May 2026' },
      { key: 'totalSpend', label: 'Total Ad Spend (₹/$)', placeholder: '150000', type: 'number' },
      { key: 'totalImpressions', label: 'Total Impressions', placeholder: '1200000', type: 'number' },
      { key: 'totalClicks', label: 'Total Clicks', placeholder: '48000', type: 'number' },
      { key: 'conversions', label: 'Conversions', placeholder: '960', type: 'number' },
      { key: 'revenue', label: 'Revenue from Campaigns', placeholder: '600000', type: 'number' },
      { key: 'emailSubscribers', label: 'Email Subscribers', placeholder: '12500', type: 'number' },
      { key: 'emailOpenRate', label: 'Email Open Rate %', placeholder: '28', type: 'number' },
      { key: 'topChannel', label: 'Top Performing Channel', placeholder: 'Google Ads', type: 'select', options: ['Google Ads', 'Meta Ads', 'LinkedIn', 'Email', 'SEO', 'YouTube', 'Twitter/X', 'Influencer'] },
    ],
  },
  {
    id: 'hr',
    label: 'HR & Workforce',
    icon: Users,
    color: 'text-blue-400',
    description: 'Headcount, attrition, payroll, leave, performance',
    fields: [
      { key: 'businessName', label: 'Organization Name', placeholder: 'Tech Pvt Ltd' },
      { key: 'period', label: 'Period', placeholder: 'April 2026' },
      { key: 'totalEmployees', label: 'Total Employees', placeholder: '250', type: 'number' },
      { key: 'newHires', label: 'New Hires This Period', placeholder: '12', type: 'number' },
      { key: 'attrition', label: 'Attrition Count', placeholder: '5', type: 'number' },
      { key: 'openPositions', label: 'Open Positions', placeholder: '18', type: 'number' },
      { key: 'avgSalary', label: 'Avg Monthly Salary (₹/$)', placeholder: '65000', type: 'number' },
      { key: 'totalPayroll', label: 'Total Payroll (₹/$)', placeholder: '16250000', type: 'number' },
      { key: 'leaveRequests', label: 'Leave Requests Processed', placeholder: '78', type: 'number' },
      { key: 'trainingHours', label: 'Training Hours Delivered', placeholder: '340', type: 'number' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Accounting',
    icon: DollarSign,
    color: 'text-green-400',
    description: 'P&L, cash flow, expenses, receivables, ratios',
    fields: [
      { key: 'businessName', label: 'Company Name', placeholder: 'FinCo Ltd' },
      { key: 'period', label: 'Period', placeholder: 'Q1 FY2026' },
      { key: 'totalRevenue', label: 'Total Revenue (₹/$)', placeholder: '5000000', type: 'number' },
      { key: 'cogs', label: 'Cost of Goods Sold', placeholder: '2000000', type: 'number' },
      { key: 'operatingExpenses', label: 'Operating Expenses', placeholder: '1200000', type: 'number' },
      { key: 'netProfit', label: 'Net Profit', placeholder: '1800000', type: 'number' },
      { key: 'cashBalance', label: 'Cash Balance', placeholder: '3200000', type: 'number' },
      { key: 'accountsReceivable', label: 'Accounts Receivable', placeholder: '850000', type: 'number' },
      { key: 'accountsPayable', label: 'Accounts Payable', placeholder: '420000', type: 'number' },
      { key: 'taxPaid', label: 'Tax Paid', placeholder: '450000', type: 'number' },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    icon: Package,
    color: 'text-orange-400',
    description: 'Orders, GMV, returns, cart abandonment, top SKUs',
    fields: [
      { key: 'businessName', label: 'Store Name', placeholder: 'ShopNow.in' },
      { key: 'period', label: 'Period', placeholder: 'April 2026' },
      { key: 'totalOrders', label: 'Total Orders', placeholder: '3400', type: 'number' },
      { key: 'gmv', label: 'Gross Merchandise Value', placeholder: '4800000', type: 'number' },
      { key: 'avgOrderValue', label: 'Avg Order Value', placeholder: '1412', type: 'number' },
      { key: 'returnRate', label: 'Return Rate %', placeholder: '8', type: 'number' },
      { key: 'cartAbandonRate', label: 'Cart Abandon Rate %', placeholder: '65', type: 'number' },
      { key: 'newCustomers', label: 'New Customers', placeholder: '1200', type: 'number' },
      { key: 'repeatCustomers', label: 'Repeat Customers', placeholder: '2200', type: 'number' },
      { key: 'topSku', label: 'Top SKU/Product', placeholder: 'Product Code or Name' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    icon: BarChart2,
    color: 'text-purple-400',
    description: 'Stock levels, turnover, dead stock, reorder alerts',
    fields: [
      { key: 'businessName', label: 'Business Name', placeholder: 'Warehouse Co' },
      { key: 'period', label: 'Period', placeholder: 'May 2026' },
      { key: 'totalSkus', label: 'Total SKUs Managed', placeholder: '850', type: 'number' },
      { key: 'totalStockValue', label: 'Total Stock Value (₹/$)', placeholder: '7500000', type: 'number' },
      { key: 'inventoryTurnover', label: 'Inventory Turnover Rate', placeholder: '6.2', type: 'number' },
      { key: 'deadStock', label: 'Dead Stock SKUs', placeholder: '42', type: 'number' },
      { key: 'deadStockValue', label: 'Dead Stock Value', placeholder: '350000', type: 'number' },
      { key: 'reorderAlerts', label: 'Reorder Alerts Triggered', placeholder: '18', type: 'number' },
      { key: 'receivedOrders', label: 'POs Received', placeholder: '34', type: 'number' },
      { key: 'shrinkage', label: 'Shrinkage/Loss (%)', placeholder: '1.2', type: 'number' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM & Customer Success',
    icon: Building2,
    color: 'text-cyan-400',
    description: 'Retention, NPS, support tickets, LTV, churn',
    fields: [
      { key: 'businessName', label: 'Company Name', placeholder: 'SaaS Corp' },
      { key: 'period', label: 'Period', placeholder: 'Q2 2026' },
      { key: 'totalCustomers', label: 'Total Active Customers', placeholder: '1800', type: 'number' },
      { key: 'newCustomers', label: 'New Customers', placeholder: '120', type: 'number' },
      { key: 'churnedCustomers', label: 'Churned Customers', placeholder: '28', type: 'number' },
      { key: 'npsScore', label: 'NPS Score (-100 to 100)', placeholder: '62', type: 'number' },
      { key: 'csat', label: 'CSAT Score (%)', placeholder: '88', type: 'number' },
      { key: 'supportTickets', label: 'Support Tickets Opened', placeholder: '340', type: 'number' },
      { key: 'avgResolutionTime', label: 'Avg Resolution Time (hrs)', placeholder: '4.2', type: 'number' },
      { key: 'avgLtv', label: 'Avg Customer LTV (₹/$)', placeholder: '85000', type: 'number' },
    ],
  },
];

// ─── Excel / CSV generator ────────────────────────────────────────────────────

function buildCsvContent(industry: IndustryConfig, values: Record<string, string>): string {
  const rows: string[][] = [
    [`${industry.label} Report`],
    ['Generated by EliteScript.dev Dashboard Generator'],
    ['Generated At', new Date().toLocaleString()],
    [],
    ['METRIC', 'VALUE'],
  ];

  industry.fields.forEach((f) => {
    rows.push([f.label, values[f.key] || '—']);
  });

  rows.push([], ['--- COMPUTED KPIs ---']);

  // Add computed insights depending on industry
  if (industry.id === 'pos') {
    const rev = parseFloat(values.totalRevenue || '0');
    const tx = parseFloat(values.totalTransactions || '1');
    rows.push(['Gross Revenue', `₹${rev.toLocaleString()}`]);
    rows.push(['Revenue per Transaction', `₹${(rev / tx).toFixed(2)}`]);
    rows.push(['Return Rate Estimate', `${((parseFloat(values.returns || '0') / tx) * 100).toFixed(1)}%`]);
  }
  if (industry.id === 'sales') {
    const leads = parseFloat(values.totalLeads || '1');
    const closed = parseFloat(values.closedDeals || '0');
    const rev = parseFloat(values.totalRevenue || '0');
    const target = parseFloat(values.target || '1');
    rows.push(['Lead-to-Close Rate', `${((closed / leads) * 100).toFixed(1)}%`]);
    rows.push(['Target Achievement', `${((rev / target) * 100).toFixed(1)}%`]);
    rows.push(['Revenue Gap', `₹${(target - rev).toLocaleString()}`]);
  }
  if (industry.id === 'marketing') {
    const spend = parseFloat(values.totalSpend || '1');
    const rev = parseFloat(values.revenue || '0');
    const clicks = parseFloat(values.totalClicks || '1');
    const impressions = parseFloat(values.totalImpressions || '1');
    const conversions = parseFloat(values.conversions || '0');
    rows.push(['ROAS', `${(rev / spend).toFixed(2)}x`]);
    rows.push(['CTR', `${((clicks / impressions) * 100).toFixed(2)}%`]);
    rows.push(['CPC (Cost per Click)', `₹${(spend / clicks).toFixed(2)}`]);
    rows.push(['Conversion Rate', `${((conversions / clicks) * 100).toFixed(2)}%`]);
    rows.push(['Cost per Conversion', `₹${(spend / (conversions || 1)).toFixed(2)}`]);
  }
  if (industry.id === 'hr') {
    const total = parseFloat(values.totalEmployees || '1');
    const attr = parseFloat(values.attrition || '0');
    rows.push(['Attrition Rate', `${((attr / total) * 100).toFixed(1)}%`]);
    rows.push(['Net Headcount Change', `${parseFloat(values.newHires || '0') - attr}`]);
  }
  if (industry.id === 'finance') {
    const rev = parseFloat(values.totalRevenue || '1');
    const profit = parseFloat(values.netProfit || '0');
    const cogs = parseFloat(values.cogs || '0');
    rows.push(['Gross Profit', `₹${(rev - cogs).toLocaleString()}`]);
    rows.push(['Gross Margin', `${(((rev - cogs) / rev) * 100).toFixed(1)}%`]);
    rows.push(['Net Profit Margin', `${((profit / rev) * 100).toFixed(1)}%`]);
  }
  if (industry.id === 'ecommerce') {
    const orders = parseFloat(values.totalOrders || '1');
    const newC = parseFloat(values.newCustomers || '0');
    const repeat = parseFloat(values.repeatCustomers || '0');
    rows.push(['Customer Retention Rate', `${((repeat / (newC + repeat)) * 100).toFixed(1)}%`]);
    rows.push(['Effective Return Count', `${((parseFloat(values.returnRate || '0') / 100) * orders).toFixed(0)}`]);
  }
  if (industry.id === 'crm') {
    const total = parseFloat(values.totalCustomers || '1');
    const churn = parseFloat(values.churnedCustomers || '0');
    rows.push(['Churn Rate', `${((churn / total) * 100).toFixed(1)}%`]);
    rows.push(['Retention Rate', `${(100 - (churn / total) * 100).toFixed(1)}%`]);
  }

  rows.push([], ['Power BI Integration Tip', 'Import this CSV into Power BI Desktop → Transform Data → Load to build visuals automatically.']);

  return rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardGenerator() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const industry = INDUSTRIES.find((i) => i.id === selectedIndustry) || null;

  const handleGenerate = () => {
    if (!industry) return;
    setLoading(true);
    setTimeout(() => {
      const csv = buildCsvContent(industry, values);
      const safeDate = new Date().toISOString().slice(0, 10);
      downloadCsv(csv, `${industry.id}-dashboard-${safeDate}.csv`);
      setLoading(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 900);
  };

  const handleReset = () => {
    setValues({});
    setDone(false);
    setSelectedIndustry(null);
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <BarChart2 className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 text-sm font-medium">Business Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Dashboard <span className="text-yellow-500">Generator</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Enter your business data → get a ready-to-download CSV/Excel report with computed KPIs.
            Import directly into <span className="text-yellow-400 font-semibold">Power BI</span>, Excel, or Google Sheets.
          </p>
        </motion.div>

        {/* Industry Picker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            const isSelected = selectedIndustry === ind.id;
            return (
              <motion.button
                key={ind.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setSelectedIndustry(ind.id); setValues({}); setDone(false); }}
                className={`flex flex-col items-center p-4 rounded-xl border transition-all text-center ${
                  isSelected
                    ? 'bg-yellow-500/15 border-yellow-500/60'
                    : 'bg-yellow-500/5 border-yellow-500/10 hover:border-yellow-500/30'
                }`}
              >
                <Icon className={`w-7 h-7 mb-2 ${ind.color}`} />
                <span className={`text-xs font-semibold ${isSelected ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {ind.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {industry && (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                {(() => { const Icon = industry.icon; return <Icon className={`w-6 h-6 ${industry.color}`} />; })()}
                <div>
                  <h2 className="text-xl font-bold text-white">{industry.label}</h2>
                  <p className="text-gray-500 text-sm">{industry.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {industry.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={values[field.key] || ''}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/60 border border-yellow-500/20 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={values[field.key] || ''}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 bg-black/60 border border-yellow-500/20 rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-black font-bold rounded-xl transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating...</span></>
                  ) : done ? (
                    <><CheckCircle2 className="w-4 h-4" /><span>Downloaded!</span></>
                  ) : (
                    <><Download className="w-4 h-4" /><span>Generate & Download CSV</span></>
                  )}
                </motion.button>

                <button
                  onClick={handleReset}
                  className="px-5 py-3 border border-yellow-500/20 text-gray-400 hover:text-yellow-400 hover:border-yellow-500/40 rounded-xl transition-colors text-sm"
                >
                  Reset
                </button>
              </div>

              {/* Power BI tip */}
              <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <p className="text-xs text-blue-300 font-medium mb-1">📊 Power BI Import Instructions</p>
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Open Power BI Desktop → <strong>Get Data</strong> → <strong>Text/CSV</strong></li>
                  <li>Select your downloaded <code className="text-yellow-400">.csv</code> file → Load</li>
                  <li>Go to <strong>Transform Data</strong> to clean types if needed</li>
                  <li>Build visuals: Bar charts, KPI cards, Trend lines instantly</li>
                  <li>Publish to Power BI Service to share with your team</li>
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        {!industry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[
              { icon: Clock, title: 'Instant Generation', desc: 'Fill in your numbers, get a professional report in seconds' },
              { icon: BarChart2, title: 'Power BI Ready', desc: 'CSV format imports directly into Power BI, Excel, Google Sheets' },
              { icon: TrendingUp, title: 'Auto KPIs', desc: 'Computed ratios, margins, rates — no formulas needed' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-center">
                <Icon className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
