from django.contrib import admin
from .models import Company, AdminProfile, Client, Invoice, InvoiceItem

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'legal_name', 'gstin', 'cin', 'email', 'website')

@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'gstin', 'state', 'state_code')
    search_fields = ('name', 'gstin')

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'client', 'invoice_date', 'status', 'total_amount')
    list_filter = ('status', 'invoice_date')
    search_fields = ('invoice_number', 'client__name')
    inlines = [InvoiceItemInline]
