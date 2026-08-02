from django import forms
from .models import Client, Invoice, InvoiceItem

class ClientForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ['name', 'address', 'gstin', 'state', 'state_code']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'}),
            'address': forms.Textarea(attrs={'rows': 2, 'class': 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'}),
            'gstin': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'}),
            'state': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'}),
            'state_code': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'}),
        }

class InvoiceForm(forms.ModelForm):
    class Meta:
        model = Invoice
        fields = [
            'invoice_number', 'invoice_date', 'client', 'supply_state',
            'topic_label', 'topic_value', 'account_name', 'account_no',
            'ifsc_code', 'bank_name', 'branch_name', 'signatory_name', 'status',
            'tax_type', 'gst_rate', 'cgst_rate', 'sgst_rate', 'igst_rate',
            'cgst_amount', 'sgst_amount', 'igst_amount', 'total_tax',
            'taxable_amount', 'grand_total', 'seller_state', 'buyer_state'
        ]
        widgets = {
            'invoice_number': forms.TextInput(attrs={'readonly': 'readonly', 'class': 'w-full px-3 py-2 border rounded-lg bg-gray-100'}),
            'invoice_date': forms.DateInput(attrs={'type': 'date', 'class': 'w-full px-3 py-2 border rounded-lg'}),
            'client': forms.Select(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'supply_state': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'topic_label': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'topic_value': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'account_name': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'account_no': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'ifsc_code': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'bank_name': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'branch_name': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'signatory_name': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'status': forms.Select(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'tax_type': forms.Select(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'gst_rate': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'cgst_rate': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'sgst_rate': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'igst_rate': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'cgst_amount': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'sgst_amount': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'igst_amount': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'total_tax': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'taxable_amount': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'grand_total': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'seller_state': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'buyer_state': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
        }

class InvoiceItemForm(forms.ModelForm):
    class Meta:
        model = InvoiceItem
        fields = ['name', 'qty', 'unit', 'rate', 'igst_rate']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'qty': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'unit': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'rate': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
            'igst_rate': forms.NumberInput(attrs={'class': 'w-full px-3 py-2 border rounded-lg'}),
        }
