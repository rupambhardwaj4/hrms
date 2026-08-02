# Invoicing & HRMS Dashboard (GST Enhanced)

A premium, modern Django-powered Invoicing Management System and HRMS Dashboard. The system supports full dynamic Indian GST calculation engine regulations, interactive reporting visualizations, and browser-side `localStorage` database operations for zero-session disruption.

---

## 🚀 Key Features

### 1. Dynamic Invoicing & GST Engine
* **CGST + SGST (Intrastate)**: Auto-applied when buyer and seller states match (Uttar Pradesh to Uttar Pradesh). Splits GST evenly into CGST (Central) and SGST (State).
* **IGST (Interstate)**: Auto-applied when states differ, rendering the full tax rate under Integrated Tax (IGST).
* **No GST**: For exempt, non-taxable, or zero-rated services. Removes GST lines from the math ledger.
* **Smart State Auto-Detection**: Selecting a billing client automatically detects the buyer's state and configures the default GST taxation method.

### 2. Signatory & Corporate Stamp Options
* **Rubber Stamp Option**: Displays the circular corporate rubber stamp with Aakash Giri's signature and designation.
* **Professional Blending**: Applies CSS multiply rendering (`mix-blend-multiply`) to merge the stamp transparently onto the invoice page surface.
* **Signature Option**: Displays the standard digital signature layout with timestamps.
* **Pure Blank Option**: Hides both layouts to leave space for manual signing or physical rubber-stamping.

### 3. Indian State Code Synchronization & GSTIN Validation
* **State Codes Registry**: Supports all 37 official Indian states/territories.
* **Read-only state code field**: Selecting a state in the client modal or invoicing dashboard overrides and autofills the matching GST state code.
* **Strict GSTIN Check**: Assures that the first 2 characters of the GSTIN match the chosen state's GST prefix (e.g. Maharashtra must start with `27`), displaying error toasts and halting saves on mismatches.

### 4. Interactive Telemetry Dashboard
* **Dynamic GST Cards**: Displays aggregate GST Collection, CGST/SGST breakdown, IGST collections, Taxable net revenues, and Non-taxable net revenues.
* **Weekly & Monthly Timelines**: Displays monthly paid revenue charts and active billing count bar charts.
* **GST Collections Breakdown Chart**: A side-by-side collections breakdown rendered dynamically with Chart.js.
* **Top Billed Clients**: Computes paid revenue sums to display top accounts.

### 5. Client-Side Persistent Architecture
* Operates entirely on browser `localStorage` for CRUD operations (Create, Edit, Clone, Delete, and Client registry).
* Allows full dashboard calculations to execute inside browser memory, bypassing server session state loss on app restarts.

---

## 📁 Project Structure

```text
├── app/
│   ├── static/
│   │   ├── css/           # Modular custom styling stylesheets
│   │   ├── images/        # Static assets (Company Logo, Stamp, etc.)
│   │   └── js/
│   │       ├── charts.js     # Chart.js visualizations configuration
│   │       ├── dashboard.js  # Dashboard cards and client modal logic
│   │       └── invoice.js    # GST engine and CRUD local persistence
│   ├── templates/
│   │   ├── dashboard.html # GST widgets and client modals UI
│   │   └── invoice.html   # Invoice compiler and dynamic A4 preview print
│   ├── models.py          # Serializer schemas and Django models
│   ├── views.py           # Dashboard routes and initial seed context
│   └── utils.py           # Seed invoices database mapping
├── project/               # Settings, configurations, and core routing
├── db.sqlite3             # Local development database
├── manage.py              # Django manage entry point
└── requirements.txt       # Python dependencies list
```

---

## 🛠️ Local Environment Setup

### Prerequisites
* Python 3.10+
* Google Chrome or any modern web browser

### Installation Steps

1. **Clone & open the directory**:
   ```powershell
   cd "AAKASH UPDATED HRMS"
   ```

2. **Initialize Python Virtual Environment**:
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

4. **Prepare Database Migrations**:
   ```powershell
   python manage.py migrate
   ```

5. **Start Development Server**:
   ```powershell
   python manage.py runserver
   ```
   Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your web browser.

---

## 🧪 Verification & Integrity

Run Django's built-in system checks to verify coding standards:
```powershell
python manage.py check
```
*Expected Output:* `System check identified no issues (0 silenced).`
