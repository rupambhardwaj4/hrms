from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import datetime
from .utils import initialize_session_data, get_next_invoice_number, COMPANY_CONFIG

def login_required_custom(view_func):
    """Custom login wrapper to secure routes without enforcing database migrations."""
    def wrapper(request, *args, **kwargs):
        if not request.session.get('is_authenticated'):
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return wrapper

def root_view(request):
    """Redirects user to dashboard if logged in, otherwise to login page."""
    if request.session.get('is_authenticated'):
        return redirect('dashboard')
    return redirect('login')

def login_view(request):
    """Authenticates admin credentials (admin@company.com / admin123)."""
    error = None
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        if email == 'admin@company.com' and password == 'admin123':
            request.session['is_authenticated'] = True
            request.session['admin_email'] = email
            request.session['admin_name'] = 'HR & Finance Admin'
            initialize_session_data(request.session)
            return redirect('dashboard')
        else:
            error = 'Invalid email or password. Please try again.'
            
    return render(request, 'login.html', {'error': error})

def logout_view(request):
    """Clears the session data and signs out user."""
    request.session.flush()
    return redirect('login')

@login_required_custom
def dashboard_view(request):
    """Compiles visual and numerical statistics for dashboard cards and Chart.js."""
    initialize_session_data(request.session)
    invoices = request.session.get('invoices', [])
    clients = request.session.get('clients', [])
    
    total_clients = len(clients)
    total_invoices = len(invoices)
    paid_invoices = sum(1 for inv in invoices if inv.get('status') == 'PAID')
    pending_invoices = sum(1 for inv in invoices if inv.get('status') == 'PENDING')
    draft_invoices = sum(1 for inv in invoices if inv.get('status') == 'DRAFT')
    
    # Financial sums
    total_revenue = 0.0
    monthly_revenue = 0.0
    outstanding_amount = 0.0
    
    current_year = datetime.datetime.now().year
    current_month = f"{current_year}-{datetime.datetime.now().month:02d}"
    
    for inv in invoices:
        amount = float(inv.get('total_amount', 0))
        status = inv.get('status', '')
        date_str = inv.get('invoice_date', '')
        
        # Calculate total revenue from PAID invoices (or all final invoices, let's treat PAID as revenue)
        if status == 'PAID':
            total_revenue += amount
            if date_str.startswith(current_month):
                monthly_revenue += amount
        elif status == 'PENDING':
            outstanding_amount += amount

    # Latest invoice
    latest_invoice = invoices[0] if invoices else None

    # Chart 1: Monthly Revenue (Line Chart - Last 6 months)
    # We will construct a dummy timeline: Jan - Jun 2026
    months_labels = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026']
    # Paid revenue values
    revenue_data = [95000, 140000, 110000, 185000, 240000, 316250] 

    # Chart 2: Invoices by Month (Bar Chart - Last 6 months)
    invoice_counts = [2, 3, 2, 4, 3, 5]

    # Chart 3: Payment Status (Pie Chart)
    payment_status_data = [paid_invoices, pending_invoices, draft_invoices]

    context = {
        'company': request.session.get('company', COMPANY_CONFIG),
        'admin_name': request.session.get('admin_name', 'Admin'),
        'total_clients': total_clients,
        'total_invoices': total_invoices,
        'paid_invoices': paid_invoices,
        'pending_invoices': pending_invoices,
        'monthly_revenue': monthly_revenue if monthly_revenue > 0 else 316250.00,
        'annual_revenue': total_revenue if total_revenue > 0 else 1086250.00,
        'outstanding_amount': outstanding_amount if outstanding_amount > 0 else 495600.00,
        'latest_invoice': latest_invoice,
        'invoices': invoices, # Pass full list of invoices for storage seeding
        'clients': clients,   # Pass full list of clients for storage seeding
        'recent_invoices': invoices[:5], # Recent 5 for template display
        'chart_data': {
            'months': months_labels,
            'revenue': revenue_data,
            'invoice_counts': invoice_counts,
            'status_counts': payment_status_data
        }
    }
    return render(request, 'dashboard.html', context)

@login_required_custom
def invoice_view(request):
    """Renders the invoice management screen with client data & invoice templates."""
    initialize_session_data(request.session)
    context = {
        'company': request.session.get('company', COMPANY_CONFIG),
        'admin_name': request.session.get('admin_name', 'Admin'),
        'clients': request.session.get('clients', []),
        'invoices': request.session.get('invoices', []),
        'next_invoice_number': get_next_invoice_number(request.session)
    }
    return render(request, 'invoice.html', context)

# API ENDPOINTS FOR SESSION CRUD (database-ready payload receivers)

@csrf_exempt
@login_required_custom
def invoice_create_view(request):
    """Creates a new invoice in the session."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            initialize_session_data(request.session)
            invoices = request.session.get('invoices', [])
            
            # Auto generate number
            new_num = get_next_invoice_number(request.session)
            new_id = f"INV-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            # Compile new invoice
            new_invoice = {
                'id': new_id,
                'invoice_number': new_num,
                'invoice_date': data.get('invoice_date', datetime.date.today().isoformat()),
                'client_id': data.get('client_id'),
                'client_name': data.get('client_name'),
                'client_address': data.get('client_address'),
                'client_gstin': data.get('client_gstin'),
                'client_state': data.get('client_state'),
                'client_state_code': data.get('client_state_code'),
                'supply_state': data.get('supply_state'),
                'topic_label': data.get('topic_label', 'Topic'),
                'topic_value': data.get('topic_value', ''),
                'account_name': data.get('account_name', COMPANY_CONFIG['legal_name']),
                'account_no': data.get('account_no', ''),
                'ifsc_code': data.get('ifsc_code', ''),
                'bank_name': data.get('bank_name', ''),
                'branch_name': data.get('branch_name', ''),
                'signatory_name': data.get('signatory_name', 'Authorized Signatory'),
                'status': data.get('status', 'PENDING'),
                'items': data.get('items', []),
                'total_amount': float(data.get('total_amount', 0)),
                # New GST fields
                'tax_type': data.get('tax_type', 'IGST'),
                'gst_rate': float(data.get('gst_rate', 18.00)),
                'cgst_rate': float(data.get('cgst_rate', 0.00)),
                'sgst_rate': float(data.get('sgst_rate', 0.00)),
                'igst_rate': float(data.get('igst_rate', 18.00)),
                'cgst_amount': float(data.get('cgst_amount', 0.00)),
                'sgst_amount': float(data.get('sgst_amount', 0.00)),
                'igst_amount': float(data.get('igst_amount', 0.00)),
                'total_tax': float(data.get('total_tax', 0.00)),
                'taxable_amount': float(data.get('taxable_amount', 0.00)),
                'grand_total': float(data.get('grand_total', 0.00)),
                'seller_state': data.get('seller_state', 'Uttar Pradesh'),
                'buyer_state': data.get('buyer_state', '')
            }
            
            invoices.insert(0, new_invoice)
            request.session['invoices'] = invoices
            request.session.modified = True
            
            return JsonResponse({'success': True, 'invoice': new_invoice})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'error': 'POST required'}, status=405)

@csrf_exempt
@login_required_custom
def invoice_edit_view(request, inv_id):
    """Updates an existing invoice inside session storage."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            initialize_session_data(request.session)
            invoices = request.session.get('invoices', [])
            
            for index, inv in enumerate(invoices):
                if inv.get('id') == inv_id:
                    # Update parameters
                    inv['invoice_date'] = data.get('invoice_date', inv['invoice_date'])
                    inv['client_id'] = data.get('client_id', inv['client_id'])
                    inv['client_name'] = data.get('client_name', inv['client_name'])
                    inv['client_address'] = data.get('client_address', inv['client_address'])
                    inv['client_gstin'] = data.get('client_gstin', inv['client_gstin'])
                    inv['client_state'] = data.get('client_state', inv['client_state'])
                    inv['client_state_code'] = data.get('client_state_code', inv['client_state_code'])
                    inv['supply_state'] = data.get('supply_state', inv['supply_state'])
                    inv['topic_label'] = data.get('topic_label', inv.get('topic_label', 'Topic'))
                    inv['topic_value'] = data.get('topic_value', inv['topic_value'])
                    inv['account_name'] = data.get('account_name', inv['account_name'])
                    inv['account_no'] = data.get('account_no', inv['account_no'])
                    inv['ifsc_code'] = data.get('ifsc_code', inv['ifsc_code'])
                    inv['bank_name'] = data.get('bank_name', inv['bank_name'])
                    inv['branch_name'] = data.get('branch_name', inv['branch_name'])
                    inv['signatory_name'] = data.get('signatory_name', inv['signatory_name'])
                    inv['status'] = data.get('status', inv['status'])
                    inv['items'] = data.get('items', inv['items'])
                    inv['total_amount'] = float(data.get('total_amount', inv['total_amount']))
                    # New GST fields
                    inv['tax_type'] = data.get('tax_type', inv.get('tax_type', 'IGST'))
                    inv['gst_rate'] = float(data.get('gst_rate', inv.get('gst_rate', 18.00)))
                    inv['cgst_rate'] = float(data.get('cgst_rate', inv.get('cgst_rate', 0.00)))
                    inv['sgst_rate'] = float(data.get('sgst_rate', inv.get('sgst_rate', 0.00)))
                    inv['igst_rate'] = float(data.get('igst_rate', inv.get('igst_rate', 18.00)))
                    inv['cgst_amount'] = float(data.get('cgst_amount', inv.get('cgst_amount', 0.00)))
                    inv['sgst_amount'] = float(data.get('sgst_amount', inv.get('sgst_amount', 0.00)))
                    inv['igst_amount'] = float(data.get('igst_amount', inv.get('igst_amount', 0.00)))
                    inv['total_tax'] = float(data.get('total_tax', inv.get('total_tax', 0.00)))
                    inv['taxable_amount'] = float(data.get('taxable_amount', inv.get('taxable_amount', 0.00)))
                    inv['grand_total'] = float(data.get('grand_total', inv.get('grand_total', 0.00)))
                    inv['seller_state'] = data.get('seller_state', inv.get('seller_state', 'Uttar Pradesh'))
                    inv['buyer_state'] = data.get('buyer_state', inv.get('buyer_state', ''))
                    
                    invoices[index] = inv
                    request.session['invoices'] = invoices
                    request.session.modified = True
                    return JsonResponse({'success': True, 'invoice': inv})
                    
            return JsonResponse({'success': False, 'error': 'Invoice not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'error': 'POST required'}, status=405)

@csrf_exempt
@login_required_custom
def invoice_delete_view(request, inv_id):
    """Deletes an invoice from the session."""
    if request.method == 'POST':
        initialize_session_data(request.session)
        invoices = request.session.get('invoices', [])
        
        filtered_invoices = [inv for inv in invoices if inv.get('id') != inv_id]
        if len(filtered_invoices) < len(invoices):
            request.session['invoices'] = filtered_invoices
            request.session.modified = True
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'error': 'Invoice not found'}, status=404)
        
    return JsonResponse({'success': False, 'error': 'POST required'}, status=405)

@csrf_exempt
@login_required_custom
def invoice_duplicate_view(request, inv_id):
    """Clones / Duplicates an existing invoice in session, generating a new ID and sequential number."""
    if request.method == 'POST':
        initialize_session_data(request.session)
        invoices = request.session.get('invoices', [])
        
        target = None
        for inv in invoices:
            if inv.get('id') == inv_id:
                target = inv
                break
                
        if target:
            new_num = get_next_invoice_number(request.session)
            new_id = f"INV-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            cloned = json.loads(json.dumps(target)) # Deep copy
            cloned['id'] = new_id
            cloned['invoice_number'] = new_num
            cloned['invoice_date'] = datetime.date.today().isoformat()
            
            invoices.insert(0, cloned)
            request.session['invoices'] = invoices
            request.session.modified = True
            return JsonResponse({'success': True, 'invoice': cloned})
            
        return JsonResponse({'success': False, 'error': 'Invoice not found'}, status=404)
        
    return JsonResponse({'success': False, 'error': 'POST required'}, status=405)

@csrf_exempt
@login_required_custom
def client_create_view(request):
    """Appends a new client to the registry in session."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            initialize_session_data(request.session)
            clients = request.session.get('clients', [])
            
            new_id = f"CL-{len(clients) + 1}"
            new_client = {
                'id': new_id,
                'name': data.get('name'),
                'address': data.get('address'),
                'gstin': data.get('gstin'),
                'state': data.get('state'),
                'state_code': data.get('state_code')
            }
            
            clients.append(new_client)
            request.session['clients'] = clients
            request.session.modified = True
            return JsonResponse({'success': True, 'client': new_client})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'error': 'POST required'}, status=405)
