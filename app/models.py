from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
    name = models.CharField(max_length=255, help_text="Short branding name")
    legal_name = models.CharField(max_length=255, help_text="Full legal registered name")
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    gstin = models.CharField(max_length=15, help_text="GST Identification Number")
    cin = models.CharField(max_length=21, help_text="Corporate Identification Number")
    address = models.TextField()
    phone = models.CharField(max_length=100)
    email = models.EmailField()
    website = models.CharField(max_length=255)
    primary_color = models.CharField(max_length=7, default='#88BDF2', help_text="Hex code of brand primary color")
    secondary_color = models.CharField(max_length=7, default='#6A89A7', help_text="Hex code of brand secondary color")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return self.user.username

class Client(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    gstin = models.CharField(max_length=15, blank=True, null=True)
    state = models.CharField(max_length=100)
    state_code = models.CharField(max_length=10)

    def __str__(self):
        return self.name

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('PAID', 'Paid'),
        ('PENDING', 'Pending'),
        ('DRAFT', 'Draft'),
    ]

    invoice_number = models.CharField(max_length=50, unique=True)
    invoice_date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='invoices')
    supply_state = models.CharField(max_length=100)
    topic_label = models.CharField(max_length=100, default='Topic')
    topic_value = models.CharField(max_length=255)
    
    # Banking Details
    account_name = models.CharField(max_length=255)
    account_no = models.CharField(max_length=50)
    ifsc_code = models.CharField(max_length=20)
    bank_name = models.CharField(max_length=255)
    branch_name = models.CharField(max_length=255)
    
    # Signatory info
    signatory_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # New GST taxation fields
    tax_type = models.CharField(max_length=50, default='IGST', choices=[
        ('CGST_SGST', 'CGST + SGST'),
        ('IGST', 'IGST'),
        ('NONE', 'No GST')
    ])
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18.00)
    cgst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    sgst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    igst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18.00)
    cgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    sgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    igst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    taxable_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    seller_state = models.CharField(max_length=100, default='Uttar Pradesh')
    buyer_state = models.CharField(max_length=100, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.invoice_number} - {self.client.name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    qty = models.IntegerField(default=1)
    unit = models.CharField(max_length=50, default='9985', verbose_name='HSN')
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    igst_rate = models.IntegerField(default=18, help_text="Integrated GST percentage")

    @property
    def taxable_value(self):
        return self.qty * self.rate

    @property
    def igst_amount(self):
        return self.taxable_value * (self.igst_rate / 100)

    @property
    def total_value(self):
        return self.taxable_value + self.igst_amount

    def __str__(self):
        return f"{self.name} for {self.invoice.invoice_number}"
