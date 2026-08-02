import datetime

COMPANY_CONFIG = {
    'name': 'QT Consultancy',
    'legal_name': 'QT Consultancy Private Limited',
    'logo_initials': 'QT',
    'gstin': '09AABCQ0892L1Z0',
    'cin': 'U78100UP2025OPC218928',
    'address': 'Plot no 5, New Shambhu Nagar Road, Delhi Road, Near Transport Nagar, Mohokampur Phase 1, Meerut, Uttar Pradesh - 250002',
    'phone': '7830899085, 8750015790',
    'email': 'hr@qtconsultancy.in',
    'website': 'www.qtconsultancy.in',
    'primary_color': '#88BDF2', # Sky Blue
    'secondary_color': '#6A89A7', # Slate Blue
    'description': 'Your Trusted Recruitment & Payroll Partner. QT Consultancy is dedicated to providing reliable manpower solutions across India.',
    'mission': 'Right Candidate | Right Time | Right Company'
}

DEFAULT_CLIENTS = [
    {
        'id': 'CL-1',
        'name': 'ElectricPe (Greenlight Mobility Pvt Ltd)',
        'address': 'Plot No-12-A, GR Flat No-264B-KH No-99/18 Late K L Vig Old New Delhi, West Delhi, Delhi, 110059',
        'gstin': '07AACCW9615J1ZY',
        'state': 'Delhi',
        'state_code': '07'
    },
    {
        'id': 'CL-2',
        'name': 'Zepto (Kiranakart Technologies Pvt Ltd)',
        'address': '5th Floor, Equinox Business Park, Kurla West, Mumbai, Maharashtra 400070',
        'gstin': '27AAECK9928A1Z5',
        'state': 'Maharashtra',
        'state_code': '27'
    },
    {
        'id': 'CL-3',
        'name': 'Shadowfax Technologies Pvt Ltd',
        'address': '1st Floor, Block B, Outer Ring Rd, Bellandur, Bengaluru, Karnataka 560103',
        'gstin': '29AAGCS0293J1Z8',
        'state': 'Karnataka',
        'state_code': '29'
    },
    {
        'id': 'CL-4',
        'name': 'Elasticrun (Nreach Online Services Pvt Ltd)',
        'address': 'Building A, 4th Floor, Cerebrum IT Park, Kalyani Nagar, Pune, Maharashtra 411014',
        'gstin': '27AAFCN0931B1ZY',
        'state': 'Maharashtra',
        'state_code': '27'
    }
]

DEFAULT_INVOICES = [
    {
        'id': 'INV-2026-0001',
        'invoice_number': 'QT-2026-0001',
        'invoice_date': '2026-06-12',
        'client_id': 'CL-1',
        'client_name': 'ElectricPe (Greenlight Mobility Pvt Ltd)',
        'client_address': 'Plot No-12-A, GR Flat No-264B-KH No-99/18 Late K L Vig Old New Delhi, West Delhi, Delhi, 110059',
        'client_gstin': '07AACCW9615J1ZY',
        'client_state': 'Delhi',
        'client_state_code': '07',
        'supply_state': 'Delhi',
        'topic_label': 'Topic',
        'topic_value': 'Manpower & Deployment Charges - June 2026',
        'account_name': 'QT Consultancy Private Limited',
        'account_no': '9250099086',
        'ifsc_code': 'KKBK0005047',
        'bank_name': 'KOTAK MAHINDRA BANK',
        'branch_name': 'SECTOR 12,NOIDA',
        'signatory_name': 'Aakash Giri',
        'status': 'PAID',
        'items': [
            {
                'name': 'Deployment of Delivery Executives (15 Staff)',
                'qty': 15,
                'unit': 'Staff',
                'rate': 12000.00,
                'igst_rate': 18
            },
            {
                'name': 'Background Verification & Document Processing Fee',
                'qty': 15,
                'unit': 'Services',
                'rate': 500.00,
                'igst_rate': 18
            }
        ],
        'total_amount': 221250,
        # GST fields
        'tax_type': 'IGST',
        'gst_rate': 18,
        'cgst_rate': 0,
        'sgst_rate': 0,
        'igst_rate': 18,
        'cgst_amount': 0,
        'sgst_amount': 0,
        'igst_amount': 33750,
        'total_tax': 33750,
        'taxable_amount': 187500,
        'grand_total': 221250,
        'seller_state': 'Uttar Pradesh',
        'buyer_state': 'Delhi'
    },
    {
        'id': 'INV-2026-0002',
        'invoice_number': 'QT-2026-0002',
        'invoice_date': '2026-06-18',
        'client_id': 'CL-2',
        'client_name': 'Zepto (Kiranakart Technologies Pvt Ltd)',
        'client_address': '5th Floor, Equinox Business Park, Kurla West, Mumbai, Maharashtra 400070',
        'client_gstin': '27AAECK9928A1Z5',
        'client_state': 'Maharashtra',
        'client_state_code': '27',
        'supply_state': 'Maharashtra',
        'topic_label': 'Topic',
        'topic_value': 'Warehouse Support Services - June 2026',
        'account_name': 'QT Consultancy Private Limited',
        'account_no': '9250099086',
        'ifsc_code': 'KKBK0005047',
        'bank_name': 'KOTAK MAHINDRA BANK',
        'branch_name': 'SECTOR 12,NOIDA',
        'signatory_name': 'Aakash Giri',
        'status': 'PENDING',
        'items': [
            {
                'name': 'Warehouse Pickers/Packers Staffing Services (30 staff)',
                'qty': 30,
                'unit': 'Staff',
                'rate': 14000.00,
                'igst_rate': 18
            }
        ],
        'total_amount': 495600,
        # GST fields
        'tax_type': 'IGST',
        'gst_rate': 18,
        'cgst_rate': 0,
        'sgst_rate': 0,
        'igst_rate': 18,
        'cgst_amount': 0,
        'sgst_amount': 0,
        'igst_amount': 75600,
        'total_tax': 75600,
        'taxable_amount': 420000,
        'grand_total': 495600,
        'seller_state': 'Uttar Pradesh',
        'buyer_state': 'Maharashtra'
    },
    {
        'id': 'INV-2026-0003',
        'invoice_number': 'QT-2026-0003',
        'invoice_date': '2026-07-02',
        'client_id': 'CL-3',
        'client_name': 'Shadowfax Technologies Pvt Ltd',
        'client_address': '1st Floor, Block B, Outer Ring Rd, Bellandur, Bengaluru, Karnataka 560103',
        'client_gstin': '29AAGCS0293J1Z8',
        'client_state': 'Karnataka',
        'client_state_code': '29',
        'supply_state': 'Karnataka',
        'topic_label': 'Topic',
        'topic_value': 'Bulk Delivery Fleet Hiring Charges',
        'account_name': 'QT Consultancy Private Limited',
        'account_no': '9250099086',
        'ifsc_code': 'KKBK0005047',
        'bank_name': 'KOTAK MAHINDRA BANK',
        'branch_name': 'SECTOR 12,NOIDA',
        'signatory_name': 'Aakash Giri',
        'status': 'DRAFT',
        'items': [
            {
                'name': 'Consultancy Fee for Bulk Fleet Recruitment',
                'qty': 1,
                'unit': 'Service',
                'rate': 75000.00,
                'igst_rate': 18
            }
        ],
        'total_amount': 88500,
        # GST fields
        'tax_type': 'IGST',
        'gst_rate': 18,
        'cgst_rate': 0,
        'sgst_rate': 0,
        'igst_rate': 18,
        'cgst_amount': 0,
        'sgst_amount': 0,
        'igst_amount': 13500,
        'total_tax': 13500,
        'taxable_amount': 75000,
        'grand_total': 88500,
        'seller_state': 'Uttar Pradesh',
        'buyer_state': 'Karnataka'
    }
]

def initialize_session_data(session):
    """Initializes dummy database in Django's session store to allow full dynamic CRUD."""
    if 'company' not in session:
        session['company'] = COMPANY_CONFIG
    if 'clients' not in session:
        session['clients'] = DEFAULT_CLIENTS
    if 'invoices' not in session:
        session['invoices'] = DEFAULT_INVOICES
    session.modified = True

def get_next_invoice_number(session):
    """Generates next invoice number dynamically based on standard format QT-2026-XXXX"""
    invoices = session.get('invoices', [])
    current_year = datetime.datetime.now().year
    
    # Filter invoices that match QT-current_year-XXXX format
    prefix = f"QT-{current_year}-"
    highest_num = 0
    for inv in invoices:
        num_str = inv.get('invoice_number', '')
        if num_str.startswith(prefix):
            try:
                suffix = num_str[len(prefix):]
                val = int(suffix)
                if val > highest_num:
                    highest_num = val
            except ValueError:
                pass
    
    next_num = highest_num + 1
    return f"{prefix}{next_num:04d}"
