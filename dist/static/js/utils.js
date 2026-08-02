// QT Consultancy UI Formatting Utilities

/**
 * Formats a raw float/int to standard Indian Rupee currency display (e.g. ₹ 2,21,250.00)
 */
function formatCurrency(amount) {
    const numeric = parseFloat(amount);
    if (isNaN(numeric)) return '₹ 0.00';
    
    return '₹ ' + numeric.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Converts a standard date string YYYY-MM-DD to DD-MM-YYYY
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
}

/**
 * Translates a monetary sum into spoken Indian Rupees words.
 */
function numberToIndianWords(num) {
    const numeric = Math.floor(parseFloat(num));
    if (isNaN(numeric) || numeric === 0) return 'Zero Rupees Only';
    
    const singleDigits = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const doubleDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function helper(n) {
        let text = '';
        if (n > 99) {
            text += singleDigits[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n > 19) {
            text += doubleDigits[Math.floor(n / 10)] + ' ';
            n %= 10;
        }
        if (n > 0) {
            text += singleDigits[n] + ' ';
        }
        return text.trim();
    }
    
    let text = '';
    let val = numeric;
    
    const crore = Math.floor(val / 10000000);
    val %= 10000000;
    const lakh = Math.floor(val / 100000);
    val %= 100000;
    const thousand = Math.floor(val / 1000);
    val %= 1000;
    const remaining = val;
    
    if (crore > 0) {
        text += helper(crore) + ' Crore ';
    }
    if (lakh > 0) {
        text += helper(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
        text += helper(thousand) + ' Thousand ';
    }
    if (remaining > 0) {
        text += helper(remaining) + ' ';
    }
    
    return 'Rupees ' + text.trim().replace(/\s+/g, ' ') + ' Only';
}
