import os
import shutil
import re
import json

# Create output folders
os.makedirs('dist', exist_ok=True)
os.makedirs('dist/static', exist_ok=True)

# Copy static folders
for folder in ['css', 'images', 'js']:
    src = f'app/static/{folder}'
    dst = f'dist/static/{folder}'
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst)

# Fallback/seed datasets
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
        'buyer_state': 'Delhi',
        'show_stamp': 'NO'
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
        'buyer_state': 'Maharashtra',
        'show_stamp': 'NO'
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
        'buyer_state': 'Karnataka',
        'show_stamp': 'NO'
    }
]

# Read Django Templates
with open('app/templates/base.html', 'r', encoding='utf-8') as f:
    base_html = f.read()

with open('app/templates/dashboard.html', 'r', encoding='utf-8') as f:
    dashboard_html = f.read()

with open('app/templates/invoice.html', 'r', encoding='utf-8') as f:
    invoice_html = f.read()

with open('app/templates/login.html', 'r', encoding='utf-8') as f:
    login_html = f.read()

def clean_django_syntax(html, is_login=False):
    # Inject client-side authentication lock
    if not is_login:
        auth_check = """
    <script>
        if (!sessionStorage.getItem('authenticated')) {
            window.location.href = 'login.html';
        }
    </script>
        """
        html = html.replace('</head>', f'{auth_check}</head>')

    # Remove load static
    html = re.sub(r'{%\s*load\s+.*?%}', '', html)
    # Replace static urls
    html = re.sub(r'{%\s*static\s+[\'"](.*?)[\'"]\s*%}', r'static/\1', html)
    
    # Replace links and URLs globally
    html = html.replace("{% url 'dashboard' %}", "index.html")
    html = html.replace("{% url 'invoices' %}", "invoices.html")
    html = html.replace("{% url 'logout' %}", "login.html")
    html = html.replace("{% url 'login' %}", "login.html")
    
    # Replace CSRF token
    html = re.sub(r'{%\s*csrf_token\s*%}', '', html)
    # Replace context variables
    html = html.replace('{{ admin_name }}', 'Aakash Giri')
    html = html.replace('{{ error }}', '')
    html = re.sub(r'{%\s*if\s+error\s*%}.*?{%\s*endif\s*%}', '', html, flags=re.DOTALL)
    
    return html

# 1. Compile Login Page
login_compiled = clean_django_syntax(login_html, is_login=True)
with open('dist/login.html', 'w', encoding='utf-8') as f:
    f.write(login_compiled)

# Helper function to extract block content
def get_block_content(html, block_name):
    pattern = rf'{{\s*%\s*block\s+{block_name}\s*%\s*}}(.*?){{\s*%\s*endblock\s*%}}'
    match = re.search(pattern, html, re.DOTALL)
    return match.group(1).strip() if match else ""

# 2. Compile Dashboard Page
dashboard_content = get_block_content(dashboard_html, 'content')
dashboard_extra_js = get_block_content(dashboard_html, 'extra_js')

# Clean out the unrendered script block with the Django template loops
dashboard_extra_js_cleaned = re.sub(r'<!-- Render chart script injection -->\s*<script>.*?</script>', '', dashboard_extra_js, flags=re.DOTALL)

# Combine static data injection with the modular script source tags
dashboard_extra_js_block = f"""
<script>
    const serverClients = {json.dumps(DEFAULT_CLIENTS, indent=4)};
    const serverInvoices = {json.dumps(DEFAULT_INVOICES, indent=4)};
</script>
{dashboard_extra_js_cleaned}
"""

# Assemble dashboard using base template
dashboard_compiled = base_html.replace('{% block title %}QT Consultancy{% endblock %}', 'Dashboard - QT Consultancy')
dashboard_compiled = dashboard_compiled.replace('{% block content %}{% endblock %}', dashboard_content)
dashboard_compiled = dashboard_compiled.replace('{% block extra_js %}{% endblock %}', dashboard_extra_js_block)
dashboard_compiled = dashboard_compiled.replace('{% block extra_head %}{% endblock %}', '')
# Remove active sidebar markings
dashboard_compiled = dashboard_compiled.replace("request.resolver_match.url_name == 'dashboard'", "true")
dashboard_compiled = dashboard_compiled.replace("request.resolver_match.url_name == 'invoices'", "false")
dashboard_compiled = re.sub(r'{%\s*if\s+request\.resolver_match\.url_name\s*==\s*\'dashboard\'\s*%}(.*?){%\s*endif\s*%}', r'\1', dashboard_compiled)
dashboard_compiled = re.sub(r'{%\s*if\s+request\.resolver_match\.url_name\s*==\s*\'invoices\'\s*%}(.*?){%\s*endif\s*%}', '', dashboard_compiled)

dashboard_compiled = clean_django_syntax(dashboard_compiled)
with open('dist/index.html', 'w', encoding='utf-8') as f:
    f.write(dashboard_compiled)

# 3. Compile Invoices Page
invoice_content = get_block_content(invoice_html, 'content')
invoice_extra_js = get_block_content(invoice_html, 'extra_js')

# Clean out the unrendered script block with the Django template loops
invoice_extra_js_cleaned = re.sub(r'<!-- Client-side configurations list definition script -->\s*<script>.*?</script>', '', invoice_extra_js, flags=re.DOTALL)

# Combine static data injection with the modular script source tags
invoice_extra_js_block = f"""
<script>
    const clientList = {json.dumps(DEFAULT_CLIENTS, indent=4)};
    const serverInvoices = {json.dumps(DEFAULT_INVOICES, indent=4)};
</script>
{invoice_extra_js_cleaned}
"""

invoice_compiled = base_html.replace('{% block title %}QT Consultancy{% endblock %}', 'Invoices - QT Consultancy')
invoice_compiled = invoice_compiled.replace('{% block content %}{% endblock %}', invoice_content)
invoice_compiled = invoice_compiled.replace('{% block extra_js %}{% endblock %}', invoice_extra_js_block)
invoice_compiled = invoice_compiled.replace('{% block extra_head %}{% endblock %}', '')
invoice_compiled = invoice_compiled.replace("request.resolver_match.url_name == 'dashboard'", "false")
invoice_compiled = invoice_compiled.replace("request.resolver_match.url_name == 'invoices'", "true")
invoice_compiled = re.sub(r'{%\s*if\s+request\.resolver_match\.url_name\s*==\s*\'dashboard\'\s*%}(.*?){%\s*endif\s*%}', '', invoice_compiled)
invoice_compiled = re.sub(r'{%\s*if\s+request\.resolver_match\.url_name\s*==\s*\'invoices\'\s*%}(.*?){%\s*endif\s*%}', r'\1', invoice_compiled)

invoice_compiled = clean_django_syntax(invoice_compiled)
with open('dist/invoices.html', 'w', encoding='utf-8') as f:
    f.write(invoice_compiled)

# 4. Modify static/js/auth.js inside dist/ to perform client-side redirecting instead of backend POST
dist_auth_path = 'dist/static/js/auth.js'
with open(dist_auth_path, 'r', encoding='utf-8') as f:
    auth_js_content = f.read()

auth_js_static = auth_js_content.replace(
    "// Allow form submission to Django view",
    "e.preventDefault();\n                sessionStorage.setItem('authenticated', 'true');\n                window.location.href = 'index.html';"
)

with open(dist_auth_path, 'w', encoding='utf-8') as f:
    f.write(auth_js_static)

# 5. Write netlify.toml inside dist/ to allow subdirectory builds
with open('dist/netlify.toml', 'w', encoding='utf-8') as f:
    f.write('[build]\n  publish = "."\n')

print("Static build successfully generated inside dist/ folder!")
