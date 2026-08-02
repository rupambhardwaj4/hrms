from django.urls import path
from . import views

urlpatterns = [
    path('', views.root_view, name='root'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('invoices/', views.invoice_view, name='invoices'),
    
    # Session API endpoints
    path('api/invoices/create/', views.invoice_create_view, name='api_invoice_create'),
    path('api/invoices/edit/<str:inv_id>/', views.invoice_edit_view, name='api_invoice_edit'),
    path('api/invoices/delete/<str:inv_id>/', views.api_invoice_delete if hasattr(views, 'api_invoice_delete') else views.invoice_delete_view, name='api_invoice_delete'),
    path('api/invoices/duplicate/<str:inv_id>/', views.invoice_duplicate_view, name='api_invoice_duplicate'),
    path('api/clients/create/', views.client_create_view, name='api_client_create'),
]
