// QT Consultancy Tax Invoice compiler Workspace

const stateCodesMap = {
    "Jammu and Kashmir": "01",
    "Himachal Pradesh": "02",
    "Punjab": "03",
    "Chandigarh": "04",
    "Uttarakhand": "05",
    "Haryana": "06",
    "Delhi": "07",
    "Rajasthan": "08",
    "Uttar Pradesh": "09",
    "Bihar": "10",
    "Sikkim": "11",
    "Arunachal Pradesh": "12",
    "Nagaland": "13",
    "Manipur": "14",
    "Mizoram": "15",
    "Tripura": "16",
    "Meghalaya": "17",
    "Assam": "18",
    "West Bengal": "19",
    "Jharkhand": "20",
    "Odisha": "21",
    "Chhattisgarh": "22",
    "Madhya Pradesh": "23",
    "Gujarat": "24",
    "Dadra and Nagar Haveli and Daman and Diu": "26",
    "Maharashtra": "27",
    "Andhra Pradesh (former code)": "28",
    "Karnataka": "29",
    "Goa": "30",
    "Lakshadweep": "31",
    "Kerala": "32",
    "Tamil Nadu": "33",
    "Puducherry": "34",
    "Andaman and Nicobar Islands": "35",
    "Telangana": "36",
    "Andhra Pradesh (new code)": "37",
    "Ladakh": "38",
    "Other Territory": "97",
    "Centre Jurisdiction": "99"
};

let invoiceState = {
    id: null,
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    client_id: '',
    client_name: '',
    client_address: '',
    client_gstin: '',
    client_state: '',
    client_state_code: '',
    supply_state: '',
    topic_label: 'Topic',
    topic_value: 'Manpower Supply Charges',
    account_name: 'QT Consultancy Private Limited',
    account_no: '9250099086',
    ifsc_code: 'KKBK0005047',
    bank_name: 'KOTAK MAHINDRA BANK',
    branch_name: 'SECTOR 12,NOIDA',
    signatory_name: 'Aakash Giri',
    status: 'PENDING',
    items: [
        { name: 'Manpower Supply Services', qty: 1, unit: 'Staff', rate: 15000.00, igst_rate: 18 }
    ],
    // GST fields
    tax_type: 'IGST',
    gst_rate: 18,
    cgst_rate: 0,
    sgst_rate: 0,
    igst_rate: 18,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 0,
    total_tax: 0,
    taxable_amount: 0,
    grand_total: 0,
    seller_state: 'Uttar Pradesh',
    buyer_state: '',
    show_stamp: 'NO'
};

// 1. Initialize Event Listeners & Local Storage Seeding
document.addEventListener('DOMContentLoaded', () => {
    // Seed Local Storage from Django session context if empty
    if (!localStorage.getItem('clients') && typeof clientList !== 'undefined') {
        localStorage.setItem('clients', JSON.stringify(clientList));
    }
    if (!localStorage.getItem('invoices') && typeof serverInvoices !== 'undefined') {
        localStorage.setItem('invoices', JSON.stringify(serverInvoices));
    }

    // Migration routine for Kotak Bank details
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    let migrated = false;
    storedInvoices.forEach(inv => {
        if (inv.bank_name === 'Axis Bank' || inv.account_no === '920020054718421') {
            inv.account_name = 'QT Consultancy Private Limited';
            inv.account_no = '9250099086';
            inv.ifsc_code = 'KKBK0005047';
            inv.bank_name = 'KOTAK MAHINDRA BANK';
            inv.branch_name = 'SECTOR 12,NOIDA';
            migrated = true;
        }
    });
    if (migrated) {
        localStorage.setItem('invoices', JSON.stringify(storedInvoices));
    }

    // Render list table and dropdowns from local storage
    renderInvoicesListTable();

    // Populate dropdown selection on load
    const clientSelect = document.getElementById('client-select');
    if (clientSelect) {
        clientSelect.addEventListener('change', handleClientSelection);
    }
    
    // Bind all parameter form fields
    const formFields = [
        { id: 'inp-invoice-number', key: 'invoice_number' },
        { id: 'inp-invoice-date', key: 'invoice_date' },
        { id: 'inp-supply-state', key: 'supply_state' },
        { id: 'inp-topic-label', key: 'topic_label' },
        { id: 'inp-topic-value', key: 'topic_value' },
        { id: 'inp-account-name', key: 'account_name' },
        { id: 'inp-account-no', key: 'account_no' },
        { id: 'inp-ifsc-code', key: 'ifsc_code' },
        { id: 'inp-bank-name', key: 'bank_name' },
        { id: 'inp-branch-name', key: 'branch_name' },
        { id: 'inp-signatory-name', key: 'signatory_name' },
        { id: 'inp-status', key: 'status' }
    ];

    formFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            el.addEventListener('input', (e) => {
                invoiceState[field.key] = e.target.value;
                recalculateInvoice();
            });
        }
    });

    // Client fields override listeners
    const clientFields = [
        { id: 'inp-client-name', key: 'client_name' },
        { id: 'inp-client-address', key: 'client_address' },
        { id: 'inp-client-gstin', key: 'client_gstin' },
        { id: 'inp-client-state', key: 'client_state' },
        { id: 'inp-client-state-code', key: 'client_state_code' }
    ];

    clientFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(eventType, (e) => {
                invoiceState[field.key] = e.target.value;
                if (field.id === 'inp-client-state') {
                    // Update state code
                    const code = stateCodesMap[e.target.value] || '';
                    const codeInp = document.getElementById('inp-client-state-code');
                    if (codeInp) codeInp.value = code;
                    invoiceState.client_state_code = code;

                    // Update buyer state in sync
                    const buyerStateEl = document.getElementById('inp-buyer-state');
                    if (buyerStateEl) buyerStateEl.value = e.target.value;
                    invoiceState.buyer_state = e.target.value;
                    autoDetectTaxType();
                }
                recalculateInvoice();
            });
        }
    });

    // Seller State and Buyer State listeners for auto state detection
    const sellerStateEl = document.getElementById('inp-seller-state');
    if (sellerStateEl) {
        sellerStateEl.addEventListener('change', (e) => {
            invoiceState.seller_state = e.target.value;
            autoDetectTaxType();
            recalculateInvoice();
        });
    }

    const buyerStateEl = document.getElementById('inp-buyer-state');
    if (buyerStateEl) {
        buyerStateEl.addEventListener('change', (e) => {
            invoiceState.buyer_state = e.target.value;
            // Also sync the client state dropdown override input
            const clientStateEl = document.getElementById('inp-client-state');
            if (clientStateEl) {
                clientStateEl.value = e.target.value;
                invoiceState.client_state = e.target.value;
                
                const code = stateCodesMap[e.target.value] || '';
                const codeEl = document.getElementById('inp-client-state-code');
                if (codeEl) codeEl.value = code;
                invoiceState.client_state_code = code;
            }
            
            autoDetectTaxType();
            recalculateInvoice();
        });
    }

    // Tax Type select override
    const taxTypeEl = document.getElementById('inp-tax-type');
    if (taxTypeEl) {
        taxTypeEl.addEventListener('change', (e) => {
            invoiceState.tax_type = e.target.value;
            recalculateInvoice();
        });
    }

    // GST Rate select
    const gstRateEl = document.getElementById('inp-gst-rate');
    if (gstRateEl) {
        gstRateEl.addEventListener('change', (e) => {
            invoiceState.gst_rate = parseFloat(e.target.value) || 0;
            recalculateInvoice();
        });
    }

    // Stamp toggle selection listener
    const showStampEl = document.getElementById('inp-show-stamp');
    if (showStampEl) {
        showStampEl.addEventListener('change', (e) => {
            invoiceState.show_stamp = e.target.value;
            recalculateInvoice();
        });
    }

    // Add item listener
    const addItemBtn = document.getElementById('btn-add-item-row');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addNewItemRow);
    }

    // Save button trigger
    const saveBtn = document.getElementById('btn-save-invoice');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveInvoiceToServer);
    }

    // Print trigger
    const printBtn = document.getElementById('btn-print-invoice');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Look for share view links parameter to load preview immediately
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get('view');
    if (viewId) {
        loadInvoiceInCompiler(viewId);
    } else {
        // Initial render
        renderItemRows();
        recalculateInvoice();
    }
});

// 2. Local Storage Renderer
function renderInvoicesListTable() {
    const tbody = document.getElementById('invoices-list-table-body');
    if (!tbody) return;
    
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    if (invoices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400 font-bold">No Invoices found. Click "Compile New Invoice" above to start.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = invoices.map(inv => {
        let statusBadge = '';
        if (inv.status === 'PAID') {
            statusBadge = `<span class="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-250 dark:border-emerald-800/40 text-[0.62rem] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">🟢 PAID</span>`;
        } else if (inv.status === 'PENDING') {
            statusBadge = `<span class="bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-250 dark:border-amber-800/40 text-[0.62rem] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">🟡 PENDING</span>`;
        } else {
            statusBadge = `<span class="bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 text-[0.62rem] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">⚪ DRAFT</span>`;
        }
        
        const finalAmt = inv.grand_total !== undefined ? inv.grand_total : inv.total_amount;
        
        return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors" onclick="loadInvoiceInCompiler('${inv.id}')" data-inv-id="${inv.id}" data-num="${inv.invoice_number}" data-client="${inv.client_name}" data-date="${inv.invoice_date}" data-status="${inv.status}" data-amount="${finalAmt}">
                <td class="py-4 font-sans font-bold text-slate-900 dark:text-white">${inv.invoice_number}</td>
                <td class="py-4 font-bold">${inv.client_name}</td>
                <td class="py-4 text-slate-400">${formatDate(inv.invoice_date)}</td>
                <td class="py-4">${statusBadge}</td>
                <td class="py-4 text-right pr-6 font-sans font-bold text-slate-900 dark:text-white">₹ ${parseFloat(finalAmt).toFixed(2)}</td>
                <td class="py-4">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="event.stopPropagation(); loadInvoiceInCompiler('${inv.id}')" class="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                            📝 Edit
                        </button>
                        <button onclick="event.stopPropagation(); duplicateInvoice('${inv.id}')" class="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-brand-orange hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                            📋 Clone
                        </button>
                        <button onclick="event.stopPropagation(); deleteInvoice('${inv.id}', '${inv.invoice_number}')" class="py-1.5 px-3 bg-slate-50 dark:bg-slate-900 hover:bg-rose-600 hover:text-white text-rose-500 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                            🗑️ Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Populate client list selectors
    const clientSelect = document.getElementById('client-select');
    if (clientSelect) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        clientSelect.innerHTML = `<option value="">-- Choose Client --</option>` + 
            clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
}

// 3. Client Selection Pre-filler
function handleClientSelection(e) {
    const clientId = e.target.value;
    if (!clientId) return;

    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find(c => c.id === clientId);
    if (client) {
        invoiceState.client_id = client.id;
        invoiceState.client_name = client.name;
        invoiceState.client_address = client.address;
        invoiceState.client_gstin = client.gstin;
        invoiceState.client_state = client.state;
        invoiceState.client_state_code = client.state_code;
        invoiceState.buyer_state = client.state;
        invoiceState.supply_state = client.state; // default supply state to client state

        // Populate form values
        document.getElementById('inp-client-name').value = client.name;
        document.getElementById('inp-client-address').value = client.address;
        document.getElementById('inp-client-gstin').value = client.gstin;
        document.getElementById('inp-client-state').value = client.state;
        document.getElementById('inp-client-state-code').value = client.state_code;
        document.getElementById('inp-supply-state').value = client.state;
        document.getElementById('inp-buyer-state').value = client.state;

        autoDetectTaxType();
        recalculateInvoice();
        showToast(`Ingested billing address: ${client.name}`, 'info');
    }
}

// 4. Automatic State Detector
function autoDetectTaxType() {
    const seller = (document.getElementById('inp-seller-state').value || '').trim();
    const buyer = (document.getElementById('inp-buyer-state').value || '').trim();
    
    if (seller && buyer) {
        if (seller.toLowerCase() === buyer.toLowerCase()) {
            invoiceState.tax_type = 'CGST_SGST';
        } else {
            invoiceState.tax_type = 'IGST';
        }
        const taxTypeEl = document.getElementById('inp-tax-type');
        if (taxTypeEl) taxTypeEl.value = invoiceState.tax_type;
    }
}

// 5. Modular GST Calculation Engine
function calculateGST(taxType, gstRate, items) {
    let totalTaxable = 0;
    items.forEach(item => {
        totalTaxable += (item.qty || 0) * (item.rate || 0);
    });

    let cgstRate = 0;
    let sgstRate = 0;
    let igstRate = 0;
    
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    
    let totalTax = 0;
    let grandTotal = 0;

    if (taxType === 'CGST_SGST') {
        cgstRate = gstRate / 2;
        sgstRate = gstRate / 2;
        cgstAmount = totalTaxable * (cgstRate / 100);
        sgstAmount = totalTaxable * (sgstRate / 100);
        totalTax = cgstAmount + sgstAmount;
    } else if (taxType === 'IGST') {
        igstRate = gstRate;
        igstAmount = totalTaxable * (igstRate / 100);
        totalTax = igstAmount;
    } else {
        // NONE
        gstRate = 0;
    }

    // Validation asserts
    if (taxType === 'CGST_SGST' && (cgstRate + sgstRate !== gstRate)) {
        console.error("Validation error: CGST + SGST rate does not equal selected GST rate!");
    }
    if (taxType === 'IGST' && igstRate !== gstRate) {
        console.error("Validation error: IGST rate does not equal selected GST rate!");
    }
    if (taxType === 'NONE' && (cgstRate !== 0 || sgstRate !== 0 || igstRate !== 0)) {
        console.error("Validation error: NONE type has non-zero tax rates!");
    }

    const exactGrandTotal = totalTaxable + totalTax;
    grandTotal = Math.round(exactGrandTotal);
    const roundOff = grandTotal - exactGrandTotal;

    return {
        taxable_amount: totalTaxable,
        gst_rate: gstRate,
        cgst_rate: cgstRate,
        sgst_rate: sgstRate,
        igst_rate: igstRate,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        igst_amount: igstAmount,
        total_tax: totalTax,
        grand_total: grandTotal,
        round_off: roundOff
    };
}

// 6. Render compiler line items forms
function renderItemRows() {
    const container = document.getElementById('items-form-container');
    if (!container) return;

    container.innerHTML = invoiceState.items.map((item, idx) => `
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative transition-all">
            <button type="button" onclick="removeItemRow(${idx})" class="absolute top-3 right-3 text-slate-400 hover:text-rose-600 font-bold transition-colors">✕</button>
            
            <div class="flex flex-col gap-1">
                <label class="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">Product Name / Job description</label>
                <input type="text" value="${item.name}" oninput="updateItemField(${idx}, 'name', this.value)" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#6A89A7] bg-white">
            </div>
            
            <div class="grid grid-cols-4 gap-2">
                <div class="col-span-2 flex flex-col gap-1">
                    <label class="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">Rate (₹)</label>
                    <input type="number" step="0.01" value="${item.rate}" oninput="updateItemField(${idx}, 'rate', this.value)" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#6A89A7] bg-white font-sans">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">QTY</label>
                    <input type="number" value="${item.qty}" oninput="updateItemField(${idx}, 'qty', this.value)" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#6A89A7] bg-white font-sans">
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">Unit</label>
                    <input type="text" value="${item.unit}" oninput="updateItemField(${idx}, 'unit', this.value)" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#6A89A7] bg-white">
                </div>
            </div>
            
            <div class="flex flex-col gap-1">
                <label class="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">GST Inheritance Rate</label>
                <div class="px-3 py-2 text-xs border border-slate-100 rounded-lg bg-slate-100 text-slate-500 font-sans font-bold">
                    Inherited from Invoice GST Rate (${invoiceState.gst_rate || 0}%)
                </div>
            </div>
        </div>
    `).join('');
}

function addNewItemRow() {
    invoiceState.items.push({
        name: 'Sales Support Services',
        qty: 1,
        unit: 'Service',
        rate: 0.00,
        igst_rate: invoiceState.gst_rate
    });
    renderItemRows();
    recalculateInvoice();
}

// Update items rates and sync
function syncInvoiceGstRateToItems() {
    invoiceState.items.forEach(item => {
        item.igst_rate = invoiceState.gst_rate;
    });
}

function removeItemRow(idx) {
    if (invoiceState.items.length <= 1) {
        showToast('At least one item line is required.', 'warning');
        return;
    }
    invoiceState.items.splice(idx, 1);
    renderItemRows();
    recalculateInvoice();
}

function updateItemField(idx, field, val) {
    if (field === 'rate') {
        invoiceState.items[idx][field] = parseFloat(val) || 0.0;
    } else if (field === 'qty') {
        invoiceState.items[idx][field] = parseInt(val) || 0;
    } else {
        invoiceState.items[idx][field] = val;
    }
    recalculateInvoice();
}

// 7. Calculations & Live Preview Synchronization
function recalculateInvoice() {
    const taxType = document.getElementById('inp-tax-type').value;
    const gstRate = parseFloat(document.getElementById('inp-gst-rate').value) || 0;
    const sellerState = document.getElementById('inp-seller-state').value;
    const buyerState = document.getElementById('inp-buyer-state').value;
    
    // Sync state parameters
    invoiceState.tax_type = taxType;
    invoiceState.gst_rate = gstRate;
    invoiceState.seller_state = sellerState;
    invoiceState.buyer_state = buyerState;
    syncInvoiceGstRateToItems();

    const calc = calculateGST(taxType, gstRate, invoiceState.items);
    
    // Sync state mathematical details
    invoiceState.cgst_rate = calc.cgst_rate;
    invoiceState.sgst_rate = calc.sgst_rate;
    invoiceState.igst_rate = calc.igst_rate;
    invoiceState.cgst_amount = calc.cgst_amount;
    invoiceState.sgst_amount = calc.sgst_amount;
    invoiceState.igst_amount = calc.igst_amount;
    invoiceState.total_tax = calc.total_tax;
    invoiceState.taxable_amount = calc.taxable_amount;
    invoiceState.total_amount = calc.grand_total; // backward compatibility mapping
    invoiceState.grand_total = calc.grand_total;

    // Redraw table colgroups, headers, footers and rows
    const thead = document.getElementById('prev-table-thead');
    const colgroup = document.getElementById('prev-table-colgroup');
    const tfoot = document.getElementById('prev-table-tfoot');
    const mathLedger = document.getElementById('prev-math-ledger');
    
    if (colgroup && thead && tfoot && mathLedger) {
        if (taxType === 'CGST_SGST') {
            colgroup.innerHTML = `
                <col style="width: 5%;">
                <col style="width: 25%;">
                <col style="width: 5%;">
                <col style="width: 7%;">
                <col style="width: 10%;">
                <col style="width: 12%;">
                <col style="width: 7%;">
                <col style="width: 9%;">
                <col style="width: 7%;">
                <col style="width: 9%;">
                <col style="width: 10%;">
            `;
            
            thead.innerHTML = `
                <tr class="bg-slate-50/50 text-[0.52rem] font-extrabold uppercase text-slate-800 tracking-wider border-b border-black">
                    <th rowspan="2" class="p-2 border-r border-black text-center">Sr. No.</th>
                    <th rowspan="2" class="p-2 border-r border-black">Description of Job / Service</th>
                    <th rowspan="2" class="p-2 border-r border-black text-center">QTY</th>
                    <th rowspan="2" class="p-2 border-r border-black text-center">Unit</th>
                    <th rowspan="2" class="p-2 border-r border-black text-right">Rate</th>
                    <th rowspan="2" id="prev-taxable-hdr" class="p-2 border-r border-black text-right bg-[#6A89A7] text-white font-extrabold">Taxable Value</th>
                    <th colspan="2" class="border-r border-black text-center py-0.5 font-extrabold">CGST</th>
                    <th colspan="2" class="border-r border-black text-center py-0.5 font-extrabold">SGST</th>
                    <th rowspan="2" class="p-2 text-right">Total</th>
                </tr>
                <tr class="bg-slate-50/50 text-[0.45rem] font-extrabold uppercase text-slate-800 tracking-wider border-b border-black">
                    <th class="p-1 border-r border-black text-center">Rate</th>
                    <th class="p-1 border-r border-black text-right pr-1">Amount</th>
                    <th class="p-1 border-r border-black text-center">Rate</th>
                    <th class="p-1 border-r border-black text-right pr-1">Amount</th>
                </tr>
            `;
        } else if (taxType === 'IGST') {
            colgroup.innerHTML = `
                <col style="width: 6%;">
                <col style="width: 25%;">
                <col style="width: 6%;">
                <col style="width: 8%;">
                <col style="width: 10%;">
                <col style="width: 13%;">
                <col style="width: 8%;">
                <col style="width: 11%;">
                <col style="width: 13%;">
            `;
            
            thead.innerHTML = `
                <tr class="bg-slate-50/50 text-[0.56rem] font-extrabold uppercase text-slate-800 tracking-wider border-b border-black">
                    <th rowspan="2" class="p-2 border-r border-black text-center">Sr. No.</th>
                    <th rowspan="2" class="p-2 border-r border-black">Description of Job / Service</th>
                    <th rowspan="2" class="p-2 border-r border-black text-center">QTY</th>
                    <th rowspan="2" class="p-2 border-r border-black text-center">Unit</th>
                    <th rowspan="2" class="p-2 border-r border-black text-right">Rate</th>
                    <th rowspan="2" id="prev-taxable-hdr" class="p-2 border-r border-black text-right bg-[#6A89A7] text-white font-extrabold">Taxable Value</th>
                    <th colspan="2" class="border-r border-black text-center py-0.5 font-extrabold">IGST</th>
                    <th rowspan="2" class="p-2 text-right">Total</th>
                </tr>
                <tr class="bg-slate-50/50 text-[0.48rem] font-extrabold uppercase text-slate-800 tracking-wider border-b border-black">
                    <th class="p-1 border-r border-black text-center">Rate</th>
                    <th class="p-1 border-r border-black text-right pr-2">Amount</th>
                </tr>
            `;
        } else {
            colgroup.innerHTML = `
                <col style="width: 6%;">
                <col style="width: 40%;">
                <col style="width: 8%;">
                <col style="width: 10%;">
                <col style="width: 12%;">
                <col style="width: 12%;">
                <col style="width: 12%;">
            `;
            
            thead.innerHTML = `
                <tr class="bg-slate-50/50 text-[0.56rem] font-extrabold uppercase text-slate-800 tracking-wider border-b border-black">
                    <th class="p-2 border-r border-black text-center">Sr. No.</th>
                    <th class="p-2 border-r border-black">Description of Job / Service</th>
                    <th class="p-2 border-r border-black text-center">QTY</th>
                    <th class="p-2 border-r border-black text-center">Unit</th>
                    <th class="p-2 border-r border-black text-right">Rate</th>
                    <th id="prev-taxable-hdr" class="p-2 border-r border-black text-right bg-[#6A89A7] text-white font-extrabold">Taxable Value</th>
                    <th class="p-2 text-right">Total</th>
                </tr>
            `;
        }
    }

    // Build line rows HTML for preview
    const previewRowsContainer = document.getElementById('preview-item-rows');
    let itemsHTML = '';
    let totalQty = 0;

    invoiceState.items.forEach((item, index) => {
        const taxable = item.qty * item.rate;
        totalQty += item.qty;

        if (taxType === 'CGST_SGST') {
            const cgstRate = gstRate / 2;
            const cgstAmt = taxable * (cgstRate / 100);
            const sgstRate = gstRate / 2;
            const sgstAmt = taxable * (sgstRate / 100);
            const itemTotal = taxable + cgstAmt + sgstAmt;

            itemsHTML += `
                <tr class="border-b border-black">
                    <td class="p-2 border-r border-black text-center">${index + 1}</td>
                    <td class="p-2 border-r border-black font-bold">${item.name}</td>
                    <td class="p-2 border-r border-black text-center">${item.qty}</td>
                    <td class="p-2 border-r border-black text-center">${item.unit}</td>
                    <td class="p-2 border-r border-black text-right font-sans">${item.rate.toFixed(2)}</td>
                    <td class="p-2 border-r border-black text-right font-sans">${taxable.toFixed(2)}</td>
                    <td class="p-2 border-r border-black text-center font-sans">${cgstRate}%</td>
                    <td class="p-2 border-r border-black text-right font-sans">${cgstAmt.toFixed(2)}</td>
                    <td class="p-2 border-r border-black text-center font-sans">${sgstRate}%</td>
                    <td class="p-2 border-r border-black text-right font-sans">${sgstAmt.toFixed(2)}</td>
                    <td class="p-2 text-right font-sans font-bold">${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        } else if (taxType === 'IGST') {
            const igstRate = gstRate;
            const igstAmt = taxable * (igstRate / 100);
            const itemTotal = taxable + igstAmt;

            itemsHTML += `
                <tr class="border-b border-black">
                    <td class="p-2 border-r border-black text-center">${index + 1}</td>
                    <td class="p-2 border-r border-black font-bold">${item.name}</td>
                    <td class="p-2 border-r border-black text-center">${item.qty}</td>
                    <td class="p-2 border-r border-black text-center">${item.unit}</td>
                    <td class="p-2 border-r border-black text-right font-sans">${item.rate.toFixed(2)}</td>
                    <td class="p-2 border-r border-black text-right font-sans">${taxable.toFixed(2)}</td>
                    <td class="p-2 border-r border-black text-center font-sans">${igstRate}%</td>
                    <td class="p-2 border-r border-black text-right font-sans">${igstAmt.toFixed(2)}</td>
                    <td class="p-2 text-right font-sans font-bold">${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        } else {
            // NONE
            itemsHTML += `
                <tr class="border-b border-black">
                    <td class="p-2 border-r border-black text-center">${index + 1}</td>
                    <td class="p-2 border-r border-black font-bold">${item.name}</td>
                    <td class="p-2 border-r border-black text-center">${item.qty}</td>
                    <td class="p-2 border-r border-black text-center">${item.unit}</td>
                    <td class="p-2 border-r border-black text-right font-sans">${item.rate.toFixed(2)}</td>
                    <td class="p-2 border-r border-black text-right font-sans">${taxable.toFixed(2)}</td>
                    <td class="p-2 text-right font-sans font-bold">${taxable.toFixed(2)}</td>
                </tr>
            `;
        }
    });

    // Add visual spacers
    const minSpacing = 3;
    if (invoiceState.items.length < minSpacing) {
        for (let i = invoiceState.items.length; i < minSpacing; i++) {
            let cells = '';
            if (taxType === 'CGST_SGST') {
                cells = `<td class="border-r border-black"></td>`.repeat(10) + `<td></td>`;
            } else if (taxType === 'IGST') {
                cells = `<td class="border-r border-black"></td>`.repeat(8) + `<td></td>`;
            } else {
                cells = `<td class="border-r border-black"></td>`.repeat(6) + `<td></td>`;
            }
            itemsHTML += `<tr class="border-b border-black h-8">${cells}</tr>`;
        }
    }
    if (previewRowsContainer) previewRowsContainer.innerHTML = itemsHTML;

    // Render tfoot
    if (tfoot) {
        if (taxType === 'CGST_SGST') {
            tfoot.innerHTML = `
                <tr class="border-t-2 border-black bg-slate-50/40 font-bold text-slate-900">
                    <td colspan="2" class="p-2 text-center font-extrabold border-r border-black">Total</td>
                    <td class="p-2 text-center border-r border-black font-extrabold">${totalQty}</td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 text-right border-r border-black font-bold">${calc.taxable_amount.toFixed(2)}</td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 border-r border-black text-right font-sans font-bold">${calc.cgst_amount.toFixed(2)}</td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 border-r border-black text-right font-sans font-bold">${calc.sgst_amount.toFixed(2)}</td>
                    <td class="p-2 text-right font-extrabold font-sans">${calc.grand_total.toFixed(2)}</td>
                </tr>
            `;
        } else if (taxType === 'IGST') {
            tfoot.innerHTML = `
                <tr class="border-t-2 border-black bg-slate-50/40 font-bold text-slate-900">
                    <td colspan="2" class="p-2 text-center font-extrabold border-r border-black">Total</td>
                    <td class="p-2 text-center border-r border-black font-extrabold">${totalQty}</td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 text-right border-r border-black font-bold">${calc.taxable_amount.toFixed(2)}</td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 border-r border-black text-right font-sans font-bold">${calc.igst_amount.toFixed(2)}</td>
                    <td class="p-2 text-right font-extrabold font-sans">${calc.grand_total.toFixed(2)}</td>
                </tr>
            `;
        } else {
            tfoot.innerHTML = `
                <tr class="border-t-2 border-black bg-slate-50/40 font-bold text-slate-900">
                    <td colspan="2" class="p-2 text-center font-extrabold border-r border-black">Total</td>
                    <td class="p-2 text-center border-r border-black font-extrabold">${totalQty}</td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 border-r border-black"></td>
                    <td class="p-2 text-right border-r border-black font-bold">${calc.taxable_amount.toFixed(2)}</td>
                    <td class="p-2 text-right font-extrabold font-sans">${calc.grand_total.toFixed(2)}</td>
                </tr>
            `;
        }
    }

    // Render Ledger Math table
    if (mathLedger) {
        let ledgerHTML = `
            <div class="flex justify-between p-1.5 border-b border-black">
                <span>Amount Before Tax</span>
                <span class="font-bold">${calc.taxable_amount.toFixed(2)}</span>
            </div>
        `;
        
        if (taxType === 'CGST_SGST') {
            ledgerHTML += `
                <div class="flex justify-between p-1.5 border-b border-black">
                    <span>Add : Central Tax (CGST) (${(gstRate/2)}%)</span>
                    <span class="font-bold">${calc.cgst_amount.toFixed(2)}</span>
                </div>
                <div class="flex justify-between p-1.5 border-b border-black">
                    <span>Add : State Tax (SGST) (${(gstRate/2)}%)</span>
                    <span class="font-bold">${calc.sgst_amount.toFixed(2)}</span>
                </div>
                <div class="flex justify-between p-1.5 border-b border-black">
                    <span>Total Tax (CGST + SGST)</span>
                    <span class="font-bold">${calc.total_tax.toFixed(2)}</span>
                </div>
            `;
        } else if (taxType === 'IGST') {
            ledgerHTML += `
                <div class="flex justify-between p-1.5 border-b border-black">
                    <span>Add : Integrated Tax (IGST) (${gstRate}%)</span>
                    <span class="font-bold">${calc.igst_amount.toFixed(2)}</span>
                </div>
                <div class="flex justify-between p-1.5 border-b border-black">
                    <span>Total IGST Tax</span>
                    <span class="font-bold">${calc.total_tax.toFixed(2)}</span>
                </div>
            `;
        } else {
            ledgerHTML += `
                <div class="flex justify-between p-1.5 border-b border-black text-rose-500 font-extrabold">
                    <span>GST Not Applicable</span>
                    <span>₹ 0.00</span>
                </div>
            `;
        }

        ledgerHTML += `
            <div class="flex justify-between p-1.5 border-b border-black">
                <span>Round Off Adjustment</span>
                <span class="font-sans">${calc.round_off.toFixed(2)}</span>
            </div>
            <div class="flex justify-between p-1.5 bg-slate-50/50 font-extrabold text-black border-b border-black">
                <span>Final Invoice Value</span>
                <span id="prev-sum-final-invoice" class="font-black font-sans border-b-4 border-double border-slate-900 text-brand-blue text-xs">${formatCurrency(calc.grand_total)}</span>
            </div>
            <div class="flex justify-between p-1.5 bg-slate-50/50 font-extrabold text-black">
                <span>Balance Due</span>
                <span id="prev-sum-balance-due" class="font-black font-sans border-b-4 border-double border-slate-900 text-brand-blue text-xs">${formatCurrency(calc.grand_total)}</span>
            </div>
        `;
        mathLedger.innerHTML = ledgerHTML;
    }

    // Words formatting
    document.getElementById('prev-amount-words').textContent = numberToIndianWords(calc.grand_total);

    // Sync other preview texts
    document.getElementById('prev-invoice-num').textContent = invoiceState.invoice_number || 'AUTO';
    document.getElementById('prev-invoice-date').textContent = formatDate(invoiceState.invoice_date);
    document.getElementById('prev-supply-state').textContent = invoiceState.supply_state || 'Delhi';
    
    document.getElementById('prev-topic-header').textContent = invoiceState.topic_label || 'Topic';
    document.getElementById('prev-invoice-topic').textContent = invoiceState.topic_value || '';

    document.getElementById('prev-client-name').textContent = invoiceState.client_name || '';
    document.getElementById('prev-client-address').textContent = invoiceState.client_address || '';
    document.getElementById('prev-client-gstin').textContent = invoiceState.client_gstin || '';
    document.getElementById('prev-client-state').textContent = invoiceState.client_state || '';
    document.getElementById('prev-client-state-code').textContent = `State Code : ${invoiceState.client_state_code || ''}`;

    document.getElementById('prev-bank-acc-name').textContent = invoiceState.account_name || '';
    document.getElementById('prev-bank-acc-no').textContent = invoiceState.account_no || '';
    document.getElementById('prev-bank-ifsc').textContent = invoiceState.ifsc_code || '';
    document.getElementById('prev-bank-name').textContent = invoiceState.bank_name || '';
    document.getElementById('prev-bank-branch').textContent = invoiceState.branch_name || '';
    document.getElementById('prev-signatory-name').textContent = invoiceState.signatory_name || '';

    // Certified that signature texts are true
    document.getElementById('prev-sig-cursive').textContent = invoiceState.signatory_name || '';
    document.getElementById('prev-sig-date').textContent = formatDate(invoiceState.invoice_date) + ' 18:30:15';

    // Set Watermark stamp display
    const stamp = document.getElementById('prev-status-stamp');
    if (stamp) {
        if (invoiceState.status === 'PAID') {
            stamp.className = 'absolute top-[30%] right-[12%] border-4 border-emerald-600 text-emerald-600 bg-emerald-50/80 rounded-xl px-6 py-2 text-2xl font-black uppercase tracking-widest -rotate-12 select-none pointer-events-none z-10';
            stamp.textContent = 'PAID';
            stamp.classList.remove('hidden');
        } else if (invoiceState.status === 'PENDING') {
            stamp.className = 'absolute top-[30%] right-[12%] border-4 border-amber-600 text-amber-600 bg-amber-50/80 rounded-xl px-6 py-2 text-2xl font-black uppercase tracking-widest -rotate-12 select-none pointer-events-none z-10';
            stamp.textContent = 'PENDING';
            stamp.classList.remove('hidden');
        } else {
            stamp.classList.add('hidden');
        }
    }

    // Toggle Rubber Stamp vs Text Signature display
    const showStamp = invoiceState.show_stamp || 'NO';
    const textBlock = document.getElementById('prev-sig-text-block');
    const stampBlock = document.getElementById('prev-sig-stamp-block');
    if (textBlock && stampBlock) {
        if (showStamp === 'YES') {
            textBlock.classList.add('hidden');
            stampBlock.classList.remove('hidden');
        } else if (showStamp === 'BLANK') {
            textBlock.classList.add('hidden');
            stampBlock.classList.add('hidden');
        } else {
            textBlock.classList.remove('hidden');
            stampBlock.classList.add('hidden');
        }
    }

    // Refresh styling brand color on totals
    const dots = document.querySelectorAll('.theme-dot');
    const activeDot = Array.from(dots).find(d => d.classList.contains('active'));
    if (activeDot) {
        const activeColor = window.getComputedStyle(activeDot).backgroundColor;
        document.getElementById('prev-receiver-banner').style.backgroundColor = activeColor;
        const taxHdr = document.getElementById('prev-taxable-hdr');
        if (taxHdr) taxHdr.style.backgroundColor = activeColor;
        document.getElementById('prev-sum-final-invoice').style.color = activeColor;
        document.getElementById('prev-sum-balance-due').style.color = activeColor;
    }
}

// 8. Open invoice in Editor mode
function openEditor(inv) {
    if (!inv) return;
    
    invoiceState = JSON.parse(JSON.stringify(inv)); // Deep clone
    
    // Fill all editor fields
    document.getElementById('inp-invoice-number').value = invoiceState.invoice_number || '';
    document.getElementById('inp-invoice-date').value = invoiceState.invoice_date;
    document.getElementById('inp-supply-state').value = invoiceState.supply_state;
    document.getElementById('inp-topic-label').value = invoiceState.topic_label;
    document.getElementById('inp-topic-value').value = invoiceState.topic_value;
    
    document.getElementById('inp-seller-state').value = invoiceState.seller_state || 'Uttar Pradesh';
    document.getElementById('inp-buyer-state').value = invoiceState.buyer_state || '';
    document.getElementById('inp-tax-type').value = invoiceState.tax_type || 'IGST';
    document.getElementById('inp-gst-rate').value = invoiceState.gst_rate || 18;

    const clientSelect = document.getElementById('client-select');
    if (clientSelect) {
        clientSelect.value = invoiceState.client_id || '';
    }

    document.getElementById('inp-client-name').value = invoiceState.client_name;
    document.getElementById('inp-client-address').value = invoiceState.client_address;
    document.getElementById('inp-client-gstin').value = invoiceState.client_gstin;
    document.getElementById('inp-client-state').value = invoiceState.client_state;
    document.getElementById('inp-client-state-code').value = invoiceState.client_state_code;

    document.getElementById('inp-account-name').value = invoiceState.account_name;
    document.getElementById('inp-account-no').value = invoiceState.account_no;
    document.getElementById('inp-ifsc-code').value = invoiceState.ifsc_code;
    document.getElementById('inp-bank-name').value = invoiceState.bank_name;
    document.getElementById('inp-branch-name').value = invoiceState.branch_name;
    document.getElementById('inp-signatory-name').value = invoiceState.signatory_name;
    document.getElementById('inp-status').value = invoiceState.status;
    document.getElementById('inp-show-stamp').value = invoiceState.show_stamp || 'NO';

    // Toggle panels
    document.getElementById('invoices-listing-view').classList.add('hidden');
    document.getElementById('invoices-editor-view').classList.remove('hidden');

    renderItemRows();
    recalculateInvoice();
    showToast(`Loaded invoice: ${invoiceState.invoice_number}`, 'info');
}

function getNextInvoiceNumberLocalStorage() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const currentYear = new Date().getFullYear();
    const prefix = `QT-${currentYear}-`;
    let highestNum = 0;
    
    invoices.forEach(inv => {
        const numStr = inv.invoice_number || '';
        if (numStr.startsWith(prefix)) {
            try {
                const suffix = numStr.slice(prefix.length);
                const val = parseInt(suffix);
                if (!isNaN(val) && val > highestNum) {
                    highestNum = val;
                }
            } catch (e) {}
        }
    });
    
    const nextNum = highestNum + 1;
    const padded = String(nextNum).padStart(4, '0');
    return `${prefix}${padded}`;
}

function openNewInvoiceCompiler(nextNumber) {
    const freshNumber = getNextInvoiceNumberLocalStorage();
    invoiceState = {
        id: null,
        invoice_number: freshNumber,
        invoice_date: new Date().toISOString().split('T')[0],
        client_id: '',
        client_name: '',
        client_address: '',
        client_gstin: '',
        client_state: '',
        client_state_code: '',
        supply_state: 'Delhi',
        topic_label: 'Topic',
        topic_value: 'Manpower Supply Charges',
        account_name: 'QT Consultancy Private Limited',
        account_no: '9250099086',
        ifsc_code: 'KKBK0005047',
        bank_name: 'KOTAK MAHINDRA BANK',
        branch_name: 'SECTOR 12,NOIDA',
        signatory_name: 'Aakash Giri',
        status: 'PENDING',
        items: [
            { name: 'Manpower Supply Services', qty: 1, unit: 'Staff', rate: 15000.00, igst_rate: 18 }
        ],
        tax_type: 'IGST',
        gst_rate: 18,
        cgst_rate: 0,
        sgst_rate: 0,
        igst_rate: 18,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        total_tax: 0,
        taxable_amount: 0,
        grand_total: 0,
        seller_state: 'Uttar Pradesh',
        buyer_state: '',
        show_stamp: 'NO'
    };

    // Reset inputs
    document.getElementById('inp-invoice-number').value = invoiceState.invoice_number || '';
    document.getElementById('inp-invoice-date').value = invoiceState.invoice_date;
    document.getElementById('inp-supply-state').value = invoiceState.supply_state;
    document.getElementById('inp-topic-label').value = invoiceState.topic_label;
    document.getElementById('inp-topic-value').value = invoiceState.topic_value;
    
    document.getElementById('inp-seller-state').value = invoiceState.seller_state;
    document.getElementById('inp-buyer-state').value = '';
    document.getElementById('inp-tax-type').value = 'IGST';
    document.getElementById('inp-gst-rate').value = 18;

    const clientSelect = document.getElementById('client-select');
    if (clientSelect) clientSelect.value = '';

    document.getElementById('inp-client-name').value = '';
    document.getElementById('inp-client-address').value = '';
    document.getElementById('inp-client-gstin').value = '';
    document.getElementById('inp-client-state').value = '';
    document.getElementById('inp-client-state-code').value = '';

    document.getElementById('inp-account-name').value = invoiceState.account_name;
    document.getElementById('inp-account-no').value = invoiceState.account_no;
    document.getElementById('inp-ifsc-code').value = invoiceState.ifsc_code;
    document.getElementById('inp-bank-name').value = invoiceState.bank_name;
    document.getElementById('inp-branch-name').value = invoiceState.branch_name;
    document.getElementById('inp-signatory-name').value = invoiceState.signatory_name;
    document.getElementById('inp-status').value = invoiceState.status;
    document.getElementById('inp-show-stamp').value = 'NO';

    // Toggle panels
    document.getElementById('invoices-listing-view').classList.add('hidden');
    document.getElementById('invoices-editor-view').classList.remove('hidden');

    renderItemRows();
    recalculateInvoice();
    showToast('Form reset. Ready to compile a new invoice.', 'info');
}

function closeEditor() {
    document.getElementById('invoices-editor-view').classList.add('hidden');
    document.getElementById('invoices-listing-view').classList.remove('hidden');
}

// 9. Save Invoice to LocalStorage
function saveInvoiceToServer() {
    if (!invoiceState.client_name || !invoiceState.client_gstin || !invoiceState.items.length) {
        showToast('Please specify client parameters and item descriptions.', 'error');
        return;
    }

    // GSTIN Prefix Validation Check against Client State
    const state = invoiceState.client_state;
    const gstin = (invoiceState.client_gstin || '').trim().toUpperCase();
    const expectedCode = stateCodesMap[state] || '';
    if (expectedCode) {
        if (gstin.slice(0, 2) !== expectedCode) {
            showToast(`Validation error: GSTIN first two digits must match State Code (${expectedCode}) for ${state}!`, 'error');
            return;
        }
        if (gstin.length !== 15) {
            showToast('Validation error: GSTIN must be exactly 15 characters long.', 'error');
            return;
        }
    }

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');

    if (invoiceState.id) {
        // Edit Mode
        const index = invoices.findIndex(i => i.id === invoiceState.id);
        if (index !== -1) {
            invoices[index] = JSON.parse(JSON.stringify(invoiceState));
            showToast(`Invoice ${invoiceState.invoice_number} updated successfully!`, 'success');
        } else {
            showToast('Invoice not found in local storage.', 'error');
            return;
        }
    } else {
        // Create Mode
        invoiceState.id = `INV-${new Date().getTime()}`;
        invoiceState.invoice_number = getNextInvoiceNumberLocalStorage();
        invoices.unshift(JSON.parse(JSON.stringify(invoiceState)));
        showToast(`Invoice ${invoiceState.invoice_number} created successfully!`, 'success');
    }

    localStorage.setItem('invoices', JSON.stringify(invoices));
    renderInvoicesListTable();
    setTimeout(() => {
        closeEditor();
    }, 850);
}

// 10. Duplicate / Clone operations
function duplicateInvoice(invId) {
    if (!confirm('Are you sure you want to duplicate this invoice?')) return;
    
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const target = invoices.find(i => i.id === invId);
    
    if (target) {
        const cloned = JSON.parse(JSON.stringify(target));
        cloned.id = `INV-${new Date().getTime()}`;
        cloned.invoice_number = getNextInvoiceNumberLocalStorage();
        cloned.invoice_date = new Date().toISOString().split('T')[0];
        
        invoices.unshift(cloned);
        localStorage.setItem('invoices', JSON.stringify(invoices));
        
        showToast(`Invoice duplicated successfully as ${cloned.invoice_number}!`, 'success');
        renderInvoicesListTable();
    } else {
        showToast('Failed to clone invoice.', 'error');
    }
}

// 11. Delete operation
function deleteInvoice(invId, number) {
    if (!confirm(`Are you sure you want to delete invoice ${number}?`)) return;
    
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const filtered = invoices.filter(i => i.id !== invId);
    
    if (filtered.length < invoices.length) {
        localStorage.setItem('invoices', JSON.stringify(filtered));
        showToast(`Invoice ${number} deleted.`, 'info');
        renderInvoicesListTable();
    } else {
        showToast('Invoice not found in local storage.', 'error');
    }
}

// 12. Quick WhatsApp & Email Shares
function shareViaWhatsApp(number, client) {
    showToast(`Compiling WhatsApp share link for ${client}...`, 'info');
    setTimeout(() => {
        const finalAmt = invoiceState.grand_total || invoiceState.total_amount;
        const text = `Hi, please find the tax invoice ${number} generated for your account. Total amount is ${formatCurrency(finalAmt)}. Thank you!`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }, 800);
}

// 13. Quick Email Shares
function shareViaEmail(number, client) {
    showToast(`Opening default mail client for ${client}...`, 'info');
    setTimeout(() => {
        const subject = `Tax Invoice - ${number}`;
        const body = `Hi Team, \n\nPlease find attached the tax invoice ${number} generated for services rendered. \n\nRegards,\nFinance Team\nQT Consultancy`;
        window.location.href = `mailto:billing@company.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 800);
}
