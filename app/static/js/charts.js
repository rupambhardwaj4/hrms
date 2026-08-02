// QT Consultancy Dashboard Charts Configuration

function initDashboardCharts(data) {
    if (!data) return;
    
    // 1. Monthly Revenue Line Chart
    const revCtx = document.getElementById('monthly-revenue-chart');
    if (revCtx) {
        new Chart(revCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.months || [],
                datasets: [{
                    label: 'Revenue (₹)',
                    data: data.revenue || [],
                    borderColor: '#6A89A7', // Brand Slate Blue
                    backgroundColor: 'rgba(106, 137, 167, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#88BDF2', // Brand Sky Blue
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(200, 200, 200, 0.1)' },
                        ticks: { font: { family: 'sans-serif', size: 11 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'sans-serif', size: 11 } }
                    }
                }
            }
        });
    }

    // 2. Invoices by Month Bar Chart
    const countCtx = document.getElementById('invoices-count-chart');
    if (countCtx) {
        new Chart(countCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.months || [],
                datasets: [{
                    label: 'Invoices Generated',
                    data: data.invoice_counts || [],
                    backgroundColor: '#88BDF2', // Brand Sky Blue
                    borderRadius: 6,
                    hoverBackgroundColor: '#629dd6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(200, 200, 200, 0.1)' },
                        ticks: { stepSize: 1, font: { family: 'sans-serif', size: 11 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'sans-serif', size: 11 } }
                    }
                }
            }
        });
    }

    // 3. Payment Status Pie Chart
    const statusCtx = document.getElementById('payment-status-chart');
    if (statusCtx) {
        new Chart(statusCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Paid', 'Pending', 'Draft'],
                datasets: [{
                    data: data.status_counts || [0, 0, 0],
                    backgroundColor: [
                        '#10B981', // Emerald green for PAID
                        '#F59E0B', // Amber for PENDING
                        '#6B7280'  // Gray for DRAFT
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'sans-serif', size: 11 },
                            padding: 15
                        }
                    }
                }
            }
        });
    }

    // 4. GST Collections Breakdown Bar Chart
    const gstCtx = document.getElementById('gst-collections-chart');
    if (gstCtx) {
        new Chart(gstCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['CGST', 'SGST', 'IGST'],
                datasets: [{
                    label: 'GST Collected (₹)',
                    data: data.gst_totals || [0, 0, 0],
                    backgroundColor: [
                        '#88BDF2', // sky blue
                        '#BDDDFC', // light sky blue
                        '#6A89A7'  // slate blue
                    ],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(200, 200, 200, 0.1)' },
                        ticks: { font: { family: 'sans-serif', size: 11 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'sans-serif', size: 11 } }
                    }
                }
            }
        });
    }
}
