// ============================================================
// ALEL OPEX Analytics — 7 demo dashboards (Chart.js + inline data)
// ============================================================
(function () {
  'use strict';

  // ---- chart theme defaults ----
  Chart.defaults.color = '#8ea0bd';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;

  const C = ['#22d3ee', '#6366f1', '#a855f7', '#34d399', '#f59e0b', '#ef4444', '#f4c542', '#60a5fa', '#f472b6'];

  // ---- helpers ----
  function $(s) { return document.querySelector(s); }
  function fmt(n) {
    n = Math.floor(n);
    if (n < 1000) return String(n);
    const u = ['K', 'M', 'B']; let v = n, i = -1;
    while (v >= 1000 && i < u.length - 1) { v /= 1000; i++; }
    return (v >= 100 ? Math.floor(v) : v.toFixed(1)) + u[i];
  }
  function fmtMoney(n) { return '$' + (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : Math.floor(n)); }

  // chart registry (destroy on switch)
  const charts = [];
  function make(id, cfg) {
    const el = document.getElementById(id);
    if (!el) return null;
    const c = new Chart(el, cfg);
    charts.push(c);
    return c;
  }
  function destroyAll() { charts.forEach(c => c.destroy()); charts.length = 0; }

  function kpi(icon, label, value, delta, dir) {
    return '<div class="kpi"><div class="l"><span class="ic">' + icon + '</span>' + label + '</div>' +
      '<div class="v">' + value + '</div>' +
      '<div class="d ' + (dir || 'flat') + '">' + delta + '</div></div>';
  }
  function panel(title, sub, inner) {
    return '<div class="panel"><h3>' + title + '</h3><div class="sub">' + (sub || '') + '</div>' + inner + '</div>';
  }
  function chartBox(id, cls) { return '<div class="chart ' + (cls || '') + '"><canvas id="' + id + '"></canvas></div>'; }
  function pill(cls, txt) { return '<span class="pill ' + cls + '">' + txt + '</span>'; }

  function barOpts() {
    return { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } } };
  }
  function lineOpts() {
    return { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { boxWidth: 10, usePointStyle: true } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } } };
  }

  // ============================================================
  // 1. PRODUCTION
  // ============================================================
  function dashProduction(host) {
    host.innerHTML =
      '<div class="dash-head"><h1>Production Dashboard</h1><p>Daily output, line efficiency and achievement vs target — LED &amp; electrical appliances.</p></div>' +
      '<div class="kpi-grid">' +
        kpi('🏭', 'Total Production', '48,210', '▲ 4.2% vs target', 'up') +
        kpi('🎯', 'Target', '46,250', 'units', 'flat') +
        kpi('📈', 'Achievement', '104.2%', '▲ 2.1%', 'up') +
        kpi('⚡', 'Line Efficiency', '87.4%', '▲ 1.3%', 'up') +
        kpi('🔁', 'Active Lines', '8 / 10', '2 offline', 'flat') +
        kpi('⏱️', 'Avg SMV', '0.82', 'min/unit', 'flat') +
      '</div>' +
      '<div class="grid grid-2-1">' +
        panel('Hourly Output', 'units per hour · today', chartBox('pHour', 'tall')) +
        panel('Achievement by Line', '%', chartBox('pLine')) +
      '</div>' +
      '<div class="grid grid-2">' +
        panel('Achievement vs Target', 'gauge', chartBox('pGauge')) +
        panel('Top SKUs', 'target vs actual', '<table class="tbl" id="pTop"></table>') +
      '</div>';

    const hours = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p'];
    const out = [2800, 4100, 5200, 5900, 5600, 6100, 4800, 5200, 5400, 5100, 4900, 4300, 3800, 2900];
    make('pHour', { type: 'line', data: { labels: hours, datasets: [{ data: out, borderColor: C[0], backgroundColor: 'rgba(34,211,238,.14)', fill: true, tension: .35, borderWidth: 2, pointRadius: 0 }] }, options: lineOpts() });

    const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'SMT', 'Piano', 'Socket', 'Flood'];
    const ach = [96, 108, 101, 89, 114, 93, 107, 82];
    make('pLine', { type: 'bar', data: { labels: lines, datasets: [{ data: ach, backgroundColor: ach.map(a => a >= 100 ? 'rgba(52,211,153,.75)' : 'rgba(239,68,68,.7)'), borderRadius: 6 }] }, options: { ...barOpts(), scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 60, max: 120 } } } });

    make('pGauge', { type: 'doughnut', data: { labels: ['Achieved', 'Remaining'], datasets: [{ data: [104.2, Math.max(0, 100 - 104.2)], backgroundColor: ['#34d399', 'rgba(255,255,255,0.06)'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '78%', plugins: { legend: { display: false } } } });
    // center text via plugin (skip — show in KPI)

    const top = [
      ['LED Bulb 9W', '12,400', '13,050', 105.2], ['LED Bulb 12W', '9,800', '10,120', 103.3],
      ['2 Pin Socket', '7,500', '7,410', 98.8], ['Switch 1G 16A', '6,200', '6,540', 105.5],
      ['MCB 16A', '4,400', '4,280', 97.3], ['Extension Socket', '3,800', '4,120', 108.4],
      ['Flood Light 50W', '2,150', '1,960', 91.2], ['Bell Push', '1,500', '1,730', 115.3],
    ];
    $('#pTop').innerHTML = '<tr><th>SKU</th><th class="num">Target</th><th class="num">Actual</th><th class="num">Achiev %</th></tr>' +
      top.map(r => '<tr><td>' + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + '</td><td class="num">' + pill(r[3] >= 100 ? 'g' : 'r', r[3] + '%') + '</td></tr>').join('');
  }

  // ============================================================
  // 2. MAINTENANCE
  // ============================================================
  function dashMaintenance(host) {
    host.innerHTML =
      '<div class="dash-head"><h1>Maintenance Analysis</h1><p>Equipment reliability, downtime and breakdown trends across the plant.</p></div>' +
      '<div class="kpi-grid">' +
        kpi('🕐', 'MTBF', '128 hrs', '▲ 8.5%', 'up') +
        kpi('🔧', 'MTTR', '42 min', '▼ 6.2%', 'up') +
        kpi('✅', 'Availability', '94.6%', '▲ 0.8%', 'up') +
        kpi('⛔', 'Downtime', '86.4 hrs', '▼ 12%', 'up') +
        kpi('💥', 'Breakdowns', '27', '▼ 4', 'up') +
        kpi('💰', 'Maint. Cost', '$42.8K', '▼ 3.1%', 'up') +
      '</div>' +
      '<div class="grid grid-2-1">' +
        panel('Downtime by Machine', 'hours · Pareto', chartBox('mPareto', 'tall')) +
        panel('Breakdown Categories', '%', chartBox('mCat')) +
      '</div>' +
      '<div class="grid grid-2">' +
        panel('MTBF / MTTR Trend', '6-month', chartBox('mTrend')) +
        panel('Open Work Orders', '', '<table class="tbl" id="mWo"></table>') +
      '</div>';

    const mach = ['Injection 1', 'SMT Line', 'Assembly 2', 'Stamping', 'Blow Mould', 'Conveyor 3', 'Welding', 'Packing'];
    const dt = [22.4, 18.1, 14.6, 11.2, 8.9, 6.4, 3.2, 1.6];
    make('mPareto', { type: 'bar', data: { labels: mach, datasets: [{ data: dt, backgroundColor: C[0], borderRadius: 6 }] }, options: barOpts() });

    make('mCat', { type: 'doughnut', data: { labels: ['Mechanical', 'Electrical', 'Hydraulic', 'Pneumatic', 'Software', 'Other'], datasets: [{ data: [38, 24, 14, 10, 8, 6], backgroundColor: [C[4], C[0], C[1], C[2], C[3], C[7]] }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } } } });

    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    make('mTrend', { type: 'line', data: { labels: months, datasets: [
      { label: 'MTBF (hrs)', data: [96, 104, 111, 118, 123, 128], borderColor: C[3], backgroundColor: 'rgba(52,211,153,.12)', fill: true, tension: .35, borderWidth: 2, pointRadius: 3, yAxisID: 'y' },
      { label: 'MTTR (min)', data: [58, 53, 49, 47, 44, 42], borderColor: C[4], tension: .35, borderWidth: 2, pointRadius: 3, yAxisID: 'y1' }
    ] }, options: { ...lineOpts(), scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } }, y1: { position: 'right', grid: { display: false } } } } });

    const wo = [
      ['WO-2041', 'Injection 1', 'Hydraulic leak', 'In progress', 'y'],
      ['WO-2042', 'SMT Line', 'Feeder jam', 'Waiting parts', 'y'],
      ['WO-2043', 'Blow Mould', 'Temp controller', 'Scheduled', 'b'],
      ['WO-2044', 'Conveyor 3', 'Belt wear', 'In progress', 'y'],
      ['WO-2045', 'Assembly 2', 'Sensor fault', 'Complete', 'g'],
    ];
    $('#mWo').innerHTML = '<tr><th>WO</th><th>Machine</th><th>Issue</th><th>Status</th></tr>' +
      wo.map(r => '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + pill(r[4], r[3]) + '</td></tr>').join('');
  }

  // ============================================================
  // 3. DELIVERY
  // ============================================================
  function dashDelivery(host) {
    host.innerHTML =
      '<div class="dash-head"><h1>Delivery Analysis</h1><p>On-time delivery performance, backlog and lead times by customer.</p></div>' +
      '<div class="kpi-grid">' +
        kpi('🚚', 'OTIF', '92.4%', '▲ 1.8%', 'up') +
        kpi('⏱️', 'On-time Orders', '184 / 199', '▲ 3', 'up') +
        kpi('⚠️', 'Delayed', '15 orders', '▼ 5', 'up') +
        kpi('📦', 'Avg Lead Time', '6.2 days', '▼ 0.4', 'up') +
        kpi('🕳️', 'Backlog', '34 orders', '▼ 8', 'up') +
        kpi('📊', 'Fill Rate', '97.8%', '▲ 0.5%', 'up') +
      '</div>' +
      '<div class="grid grid-2">' +
        panel('Delivery Trend', 'on-time vs delayed · 6 months', chartBox('dTrend')) +
        panel('By Customer', 'OTIF %', chartBox('dCust')) +
      '</div>' +
      '<div class="panel"><h3>Open Orders</h3><div class="sub">pending &amp; in-transit</div><table class="tbl" id="dOrders"></table></div>';

    const m2 = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    make('dTrend', { type: 'line', data: { labels: m2, datasets: [
      { label: 'On-time %', data: [88.2, 89.4, 90.1, 91.0, 91.6, 92.4], borderColor: C[3], backgroundColor: 'rgba(52,211,153,.12)', fill: true, tension: .35, borderWidth: 2, pointRadius: 3 },
      { label: 'Delayed', data: [24, 21, 19, 18, 17, 15], borderColor: C[5], tension: .35, borderWidth: 2, pointRadius: 3, yAxisID: 'y1' }
    ] }, options: { ...lineOpts(), scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } }, y1: { position: 'right', grid: { display: false } } } } });

    const cust = ['ElectroMart', 'Volt BD', 'BrightStar', 'Urban Lights', 'National Grid', 'HomeFix'];
    make('dCust', { type: 'bar', data: { labels: cust, datasets: [{ data: [95, 91, 88, 93, 86, 90], backgroundColor: C.map((c, i) => C[i % C.length]).slice(0, 6), borderRadius: 6 }] }, options: { ...barOpts(), scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 70, max: 100 } } } });

    const ord = [
      ['SO-8812', 'ElectroMart', 'LED Bulb 9W', '2,500', 'Sep 26', 'On-time', 'g'],
      ['SO-8813', 'Volt BD', 'Switch 1G', '1,800', 'Sep 28', 'In transit', 'b'],
      ['SO-8814', 'BrightStar', 'MCB 16A', '900', 'Sep 29', 'At risk', 'y'],
      ['SO-8815', 'HomeFix', 'Extension Socket', '1,200', 'Sep 30', 'Delayed', 'r'],
      ['SO-8816', 'Urban Lights', 'Flood 50W', '600', 'Oct 2', 'On-time', 'g'],
    ];
    $('#dOrders').innerHTML = '<tr><th>SO</th><th>Customer</th><th>Product</th><th class="num">Qty</th><th>Due</th><th>Status</th></tr>' +
      ord.map(r => '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td class="num">' + r[3] + '</td><td>' + r[4] + '</td><td>' + pill(r[6], r[5]) + '</td></tr>').join('');
  }

  // ============================================================
  // 4. PRODUCTION PLANNING
  // ============================================================
  function dashPlanning(host) {
    host.innerHTML =
      '<div class="dash-head"><h1>Production Planning</h1><p>Forecast vs production, capacity utilization and monthly plan performance.</p></div>' +
      '<div class="kpi-grid">' +
        kpi('📋', 'Plan vs Actual', '98.7%', '▲ 1.1%', 'up') +
        kpi('🏭', 'Capacity Util.', '86.2%', '▲ 2.3%', 'up') +
        kpi('🔄', 'WIP', '1,240 units', '▼ 6%', 'up') +
        kpi('🎯', 'Forecast Acc.', '93.5%', '▲ 0.9%', 'up') +
        kpi('📦', 'Open Orders', '34', '▼ 8', 'up') +
        kpi('⚙️', 'OTD', '92.4%', '▲ 1.8%', 'up') +
      '</div>' +
      '<div class="grid grid-2-1">' +
        panel('Forecast vs Actual', 'units · Sep', chartBox('plForecast', 'tall')) +
        panel('Capacity by Line', '%', chartBox('plCap')) +
      '</div>' +
      '<div class="panel"><h3>SKU Plan vs Actual</h3><div class="sub">weekly plan performance</div><table class="tbl" id="plSku"></table></div>';

    const days = ['W1', 'W2', 'W3', 'W4'];
    make('plForecast', { type: 'bar', data: { labels: days, datasets: [
      { label: 'Forecast', data: [11500, 11800, 12100, 11700], backgroundColor: 'rgba(99,102,241,.5)', borderRadius: 6 },
      { label: 'Actual', data: [11240, 11680, 12040, 11850], backgroundColor: 'rgba(34,211,238,.8)', borderRadius: 6 }
    ] }, options: { ...barOpts(), plugins: { legend: { labels: { boxWidth: 10, usePointStyle: true } } } } });

    const lines2 = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'SMT', 'Socket', 'Piano'];
    make('plCap', { type: 'bar', data: { labels: lines2, datasets: [{ data: [92, 85, 78, 88, 95, 80, 71], backgroundColor: C[0], borderRadius: 6 }] }, options: { ...barOpts(), scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 0, max: 100 } } } });

    const sku = [
      ['LED Bulb 9W', '12,400', '13,050', '+5.2%', 'g'],
      ['LED Bulb 12W', '9,800', '10,120', '+3.3%', 'g'],
      ['2 Pin Socket', '7,500', '7,410', '-1.2%', 'r'],
      ['Switch 1G 16A', '6,200', '6,540', '+5.5%', 'g'],
      ['MCB 16A', '4,400', '4,280', '-2.7%', 'r'],
      ['Extension Socket', '3,800', '4,120', '+8.4%', 'g'],
      ['Flood Light 50W', '2,150', '1,960', '-8.8%', 'r'],
    ];
    $('#plSku').innerHTML = '<tr><th>SKU</th><th class="num">Forecast</th><th class="num">Planned</th><th class="num">Actual</th><th class="num">Variance</th></tr>' +
      sku.map(r => '<tr><td>' + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + '</td><td class="num">' + pill(r[4], r[3]) + '</td></tr>').join('');
  }

  // ============================================================
  // 5. QUALITY
  // ============================================================
  function dashQuality(host) {
    host.innerHTML =
      '<div class="dash-head"><h1>Quality</h1><p>First-pass yield, defect rates and rejection analysis across product lines.</p></div>' +
      '<div class="kpi-grid">' +
        kpi('✅', 'FPY', '97.6%', '▲ 0.7%', 'up') +
        kpi('⚠️', 'Defect Rate', '2.4%', '▼ 0.6%', 'up') +
        kpi('🎯', 'PPM', '8,420', '▼ 9.1%', 'up') +
        kpi('🔁', 'Rework', '1.1%', '▼ 0.2%', 'up') +
        kpi('🔍', 'QC Inspections', '1,862', 'this month', 'flat') +
        kpi('💰', 'Rejection Cost', '$18.6K', '▼ 14%', 'up') +
      '</div>' +
      '<div class="grid grid-2">' +
        panel('Defect Pareto', 'by type · count', chartBox('qPareto')) +
        panel('FPY Trend', '6 months', chartBox('qTrend')) +
      '</div>' +
      '<div class="grid grid-2">' +
        panel('Defect by Line', 'PPM', chartBox('qLine')) +
        panel('Top Defects', '', '<table class="tbl" id="qDef"></table>') +
      '</div>';

    const def = ['Soldering', 'Cracked housing', 'Loose screw', 'LED fail', 'Misaligned pin', 'Scratch', 'Missing part'];
    const cnt = [1420, 1180, 960, 720, 540, 410, 240];
    make('qPareto', { type: 'bar', data: { labels: def, datasets: [{ data: cnt, backgroundColor: C[5], borderRadius: 6 }] }, options: barOpts() });

    const m3 = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    make('qTrend', { type: 'line', data: { labels: m3, datasets: [{ label: 'FPY %', data: [95.8, 96.1, 96.4, 96.9, 97.2, 97.6], borderColor: C[3], backgroundColor: 'rgba(52,211,153,.12)', fill: true, tension: .35, borderWidth: 2, pointRadius: 3 }] }, options: { ...lineOpts(), scales: { y: { min: 94, max: 99, grid: { color: 'rgba(255,255,255,0.04)' } } } } });

    const lines3 = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'SMT', 'Socket'];
    make('qLine', { type: 'bar', data: { labels: lines3, datasets: [{ data: [6200, 8400, 7100, 9800, 4300, 7600], backgroundColor: C[1], borderRadius: 6 }] }, options: barOpts() });

    const def2 = [
      ['Soldering defect', '1,420', '16.9%', 'r'],
      ['Cracked housing', '1,180', '14.0%', 'r'],
      ['Loose screw', '960', '11.4%', 'y'],
      ['LED failure', '720', '8.6%', 'y'],
      ['Misaligned pin', '540', '6.4%', 'y'],
      ['Scratch', '410', '4.9%', 'g'],
    ];
    $('#qDef').innerHTML = '<tr><th>Defect</th><th class="num">Count</th><th class="num">Share</th></tr>' +
      def2.map(r => '<tr><td>' + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + pill(r[3], r[2]) + '</td></tr>').join('');
  }

  // ============================================================
  // 6. CEO DASHBOARD
  // ============================================================
  function dashCeo(host) {
    host.innerHTML =
      '<div class="dash-head"><h1>CEO Overview</h1><p>Executive summary — revenue, profitability, operations and quality at a glance.</p></div>' +
      '<div class="kpi-grid">' +
        kpi('💰', 'Revenue', '$4.82M', '▲ 6.4% MoM', 'up') +
        kpi('📊', 'Gross Profit', '$1.61M', '▲ 5.2%', 'up') +
        kpi('🎯', 'OEE', '78.6%', '▲ 2.4%', 'up') +
        kpi('🚚', 'OTIF', '92.4%', '▲ 1.8%', 'up') +
        kpi('✅', 'FPY', '97.6%', '▲ 0.7%', 'up') +
        kpi('🌟', '5S Score', '91', '▲ 3', 'up') +
      '</div>' +
      '<div class="grid grid-2-1">' +
        panel('Revenue vs Cost', '$ thousands · 6 months', chartBox('cRev', 'tall')) +
        panel('Business Units', 'revenue share', chartBox('cBu')) +
      '</div>' +
      '<div class="grid grid-2">' +
        panel('Operational Health', 'this month', '<table class="tbl" id="cOps"></table>') +
        panel('Key Highlights', '', '<div id="cHigh"></div>') +
      '</div>';

    const m4 = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    make('cRev', { type: 'line', data: { labels: m4, datasets: [
      { label: 'Revenue', data: [720, 780, 810, 840, 800, 830], borderColor: C[3], backgroundColor: 'rgba(52,211,153,.12)', fill: true, tension: .35, borderWidth: 2, pointRadius: 3 },
      { label: 'Cost', data: [480, 500, 515, 530, 520, 525], borderColor: C[5], tension: .35, borderWidth: 2, pointRadius: 3 }
    ] }, options: lineOpts() });

    make('cBu', { type: 'doughnut', data: { labels: ['LED Lighting', 'Switches & Sockets', 'MCB & Protection', 'Flood & Outdoor', 'Wiring Acc.'], datasets: [{ data: [42, 24, 16, 11, 7], backgroundColor: [C[0], C[1], C[2], C[4], C[3]] }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } } } });

    const ops = [
      ['OEE', '78.6%', 'g'], ['Availability', '94.6%', 'g'], ['Performance', '83.1%', 'y'], ['Quality rate', '97.6%', 'g'],
      ['Downtime', '86.4 hrs', 'y'], ['Delivery OTIF', '92.4%', 'g'], ['Inventory turns', '8.2', 'g'], ['Energy / unit', '-4.8%', 'g'],
    ];
    $('#cOps').innerHTML = '<tr><th>Metric</th><th class="num">Value</th></tr>' +
      ops.map(r => '<tr><td>' + r[0] + '</td><td class="num">' + pill(r[2], r[1]) + '</td></tr>').join('');

    $('#cHigh').innerHTML =
      '<div class="row">📈 Revenue up <b>6.4%</b> — LED lighting led growth.</div>' +
      '<div class="row">🔧 OEE improved <b>2.4 pts</b> after TPM rollout on SMT line.</div>' +
      '<div class="row">✅ Defect PPM down <b>9.1%</b> — soldering rework initiative.</div>' +
      '<div class="row">🚚 On-time delivery reached <b>92.4%</b>.</div>';
    $('#cHigh').querySelectorAll('.row').forEach(r => { r.style.cssText = 'padding:10px 2px;border-bottom:1px solid var(--line);font-size:13px;color:var(--muted)'; });
  }

  // ============================================================
  // 7. 5S DASHBOARD (improved)
  // ============================================================
  function dashFives(host) {
    host.innerHTML =
      '<div class="dash-head"><h1>5S Dashboard</h1><p>Workplace organization audit — Sort, Set-in-Order, Shine, Standardize, Sustain by floor.</p></div>' +
      '<div class="kpi-grid">' +
        kpi('🌟', 'Overall 5S Score', '91', '▲ 3 pts', 'up') +
        kpi('📋', 'Audits This Month', '24', 'across 6 zones', 'flat') +
        kpi('⚠️', 'Open Actions', '9', '▼ 4', 'up') +
        kpi('🏆', 'Best Zone', 'SMT · 96', '▲ 2', 'up') +
        kpi('📉', 'Weakest Zone', 'Packing · 84', '▼ 1', 'down') +
        kpi('🎯', 'Sustainment', '88%', '▲ 4%', 'up') +
      '</div>' +
      '<div class="grid grid-1-2">' +
        panel('5 Pillars', 'radar', chartBox('fRadar')) +
        panel('Score by Zone', 'current month', chartBox('fZone', 'tall')) +
      '</div>' +
      '<div class="grid grid-2">' +
        panel('6-Month Trend', 'overall score', chartBox('fTrend')) +
        panel('Recent Audits', '', '<table class="tbl" id="fAudit"></table>') +
      '</div>';

    make('fRadar', { type: 'radar', data: { labels: ['Sort', 'Set-in-Order', 'Shine', 'Standardize', 'Sustain'], datasets: [
      { label: 'Current', data: [94, 90, 92, 89, 86], borderColor: C[0], backgroundColor: 'rgba(34,211,238,.18)', pointBackgroundColor: C[0], borderWidth: 2 },
      { label: 'Last month', data: [90, 86, 88, 85, 82], borderColor: C[7], backgroundColor: 'rgba(96,165,250,.1)', pointBackgroundColor: C[7], borderWidth: 2 }
    ] }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 60, max: 100, grid: { color: 'rgba(255,255,255,0.08)' }, angleLines: { color: 'rgba(255,255,255,0.08)' }, pointLabels: { color: '#8ea0bd', font: { size: 11 } }, ticks: { display: false } } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } } } });

    const zones = ['SMT', 'Assembly 1', 'Assembly 2', 'Socket', 'Piano', 'Packing'];
    const scores = [96, 92, 90, 88, 86, 84];
    make('fZone', { type: 'bar', data: { labels: zones, datasets: [{ data: scores, backgroundColor: scores.map(s => s >= 90 ? 'rgba(52,211,153,.75)' : s >= 86 ? 'rgba(245,158,11,.7)' : 'rgba(239,68,68,.7)'), borderRadius: 6 }] }, options: { ...barOpts(), scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 70, max: 100 } } } });

    const m5 = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    make('fTrend', { type: 'line', data: { labels: m5, datasets: [{ label: '5S Score', data: [84, 86, 85, 88, 88, 91], borderColor: C[4], backgroundColor: 'rgba(245,158,11,.14)', fill: true, tension: .35, borderWidth: 2, pointRadius: 3 }] }, options: { ...lineOpts(), scales: { y: { min: 70, max: 100, grid: { color: 'rgba(255,255,255,0.04)' } } } } });

    const audit = [
      ['Sep 24', 'SMT', '96', 'g', '2 findings'],
      ['Sep 22', 'Assembly 1', '92', 'g', '3 findings'],
      ['Sep 20', 'Socket', '88', 'y', '5 findings'],
      ['Sep 18', 'Packing', '84', 'r', '6 findings'],
      ['Sep 16', 'Piano', '86', 'y', '4 findings'],
      ['Sep 14', 'Assembly 2', '90', 'g', '3 findings'],
    ];
    $('#fAudit').innerHTML = '<tr><th>Date</th><th>Zone</th><th class="num">Score</th><th>Note</th></tr>' +
      audit.map(r => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td class="num">' + pill(r[3], r[2]) + '</td><td class="mono">' + r[4] + '</td></tr>').join('');
  }

  // ============================================================
  // registry + nav
  // ============================================================
  const DASHBOARDS = [
    { id: 'ceo', name: 'CEO Overview', icon: '💼', render: dashCeo },
    { id: 'production', name: 'Production Dashboard', icon: '🏭', render: dashProduction },
    { id: 'maintenance', name: 'Maintenance Analysis', icon: '🔧', render: dashMaintenance },
    { id: 'delivery', name: 'Delivery Analysis', icon: '🚚', render: dashDelivery },
    { id: 'planning', name: 'Production Planning', icon: '📋', render: dashPlanning },
    { id: 'quality', name: 'Quality', icon: '✅', render: dashQuality },
    { id: 'fives', name: '5S Dashboard', icon: '🌟', render: dashFives },
  ];

  function buildNav() {
    $('#nav').innerHTML = DASHBOARDS.map(d =>
      '<button data-id="' + d.id + '"><span class="ic">' + d.icon + '</span>' + d.name + '</button>'
    ).join('');
  }

  function open(id) {
    const d = DASHBOARDS.find(x => x.id === id);
    if (!d) return;
    destroyAll();
    $('#crumb').textContent = d.name;
    d.render($('#content'));
    document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
    $('#content').scrollTop = 0;
    closeSidebar();
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }

  function closeSidebar() {
    $('#sidebar').classList.remove('open');
    $('#overlay').classList.remove('show');
  }

  // wire events
  $('#nav').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) open(b.dataset.id);
  });
  $('#burger').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
    $('#overlay').classList.toggle('show');
  });
  $('#overlay').addEventListener('click', closeSidebar);

  // boot
  buildNav();
  function fromHash() {
    const id = (location.hash || '').replace('#', '');
    return DASHBOARDS.some(x => x.id === id) ? id : 'ceo';
  }
  open(fromHash());
  window.addEventListener('hashchange', () => open(fromHash()));
})();
