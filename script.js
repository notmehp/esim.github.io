// ============================================
// CẤU HÌNH EMAILJS
// ============================================
// HƯỚNG DẪN CẤU HÌNH EMAILJS:
// 1. Đăng ký tài khoản miễn phí tại: https://www.emailjs.com/
// 2. Tạo Email Service (Gmail, Outlook, etc.)
// 3. Tạo Email Template với các biến: {{order_code}}, {{country}}, {{package}}, {{days}}, {{quantity}}, {{total}}, {{email}}, {{phone}}, {{notes}}
// 4. Lấy Service ID, Template ID và Public Key
// 5. Thay đổi các giá trị dưới đây:

const EMAILJS_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',      // Thay bằng Service ID của bạn
    templateID: 'YOUR_TEMPLATE_ID',    // Thay bằng Template ID của bạn
    publicKey: 'YOUR_PUBLIC_KEY'       // Thay bằng Public Key của bạn
};

// Email admin nhận thông báo
const ADMIN_EMAIL = 'admin@aricoesim.com';  // Thay bằng email admin của bạn

// ============================================
// BẢNG GIÁ CÁC GÓI ESIM
// ============================================
// HƯỚNG DẪN THAY ĐỔI GIÁ:
// Chỉnh sửa giá trị trong data-price ở file HTML
// hoặc cập nhật trực tiếp trong object này

const PACKAGE_PRICES = {
    '500': 50000,
    '1000': 80000,
    '2000': 120000,
    '3000': 150000,
    '5000': 200000,
    'unlimited': 300000
};

// ============================================
// THÔNG TIN NGÂN HÀNG
// ============================================
// HƯỚNG DẪN THAY ĐỔI THÔNG TIN NGÂN HÀNG:
// Cập nhật các giá trị dưới đây theo tài khoản của bạn

const BANK_INFO = {
    bankCode: 'MB',                    // Mã ngân hàng (VietQR)
    accountNumber: '0931516579',       // Số tài khoản
    accountName: 'ARICO%20ESIM',       // Tên tài khoản (URL encoded)
    accountNameDisplay: 'ARICO ESIM'   // Tên hiển thị
};

// ============================================
// KHỞI TẠO EMAILJS
// ============================================
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// ============================================
// BIẾN TOÀN CỤC
// ============================================
let currentOrderCode = '';
let currentTotal = 0;

// ============================================
// HÀM KHỞI TẠO KHI LOAD TRANG
// ============================================
window.addEventListener('DOMContentLoaded', function() {
    // Tính toán và hiển thị tổng tiền ban đầu
    calculateTotal();
    
    // Thêm event listeners
    document.getElementById('package').addEventListener('change', calculateTotal);
    document.getElementById('days').addEventListener('input', calculateTotal);
    document.getElementById('quantity').addEventListener('input', calculateTotal);
    document.getElementById('country').addEventListener('change', calculateTotal);
});

// ============================================
// HÀM TĂNG GIÁ TRỊ
// ============================================
function increaseValue(fieldId) {
    const field = document.getElementById(fieldId);
    const currentValue = parseInt(field.value) || 0;
    field.value = currentValue + 1;
    calculateTotal();
}

// ============================================
// HÀM GIẢM GIÁ TRỊ
// ============================================
function decreaseValue(fieldId) {
    const field = document.getElementById(fieldId);
    const currentValue = parseInt(field.value) || 0;
    if (currentValue > 1) {
        field.value = currentValue - 1;
        calculateTotal();
    }
}

// ============================================
// HÀM TÍNH TỔNG TIỀN
// ============================================
function calculateTotal() {
    // Lấy giá trị từ form
    const packageSelect = document.getElementById('package');
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    const unitPrice = parseInt(selectedOption.getAttribute('data-price'));
    
    const days = parseInt(document.getElementById('days').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    
    // Tính tổng tiền
    currentTotal = unitPrice * days * quantity;
    
    // Format số tiền
    const formattedUnitPrice = formatCurrency(unitPrice);
    const formattedTotal = formatCurrency(currentTotal);
    
    // Cập nhật hiển thị
    document.getElementById('unitPrice').textContent = formattedUnitPrice;
    document.getElementById('displayDays').textContent = days + ' ngày';
    document.getElementById('displayQuantity').textContent = quantity;
    document.getElementById('totalPrice').textContent = formattedTotal;
    document.getElementById('paymentAmount').textContent = formattedTotal;
    
    // Tạo mã đơn hàng mới
    currentOrderCode = generateOrderCode();
    
    // Cập nhật nội dung chuyển khoản
    document.getElementById('paymentContent').textContent = 'ESIM ' + currentOrderCode;
    
    // Cập nhật QR code
    updateQRCode();
}

// ============================================
// HÀM FORMAT TIỀN TỆ
// ============================================
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

// ============================================
// HÀM TẠO MÃ ĐƠN HÀNG
// ============================================
// Format: YYYYMMDDHHmmss
function generateOrderCode() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// ============================================
// HÀM CẬP NHẬT QR CODE
// ============================================
function updateQRCode() {
    // Tạo URL QR Code theo VietQR API
    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.jpg?amount=${currentTotal}&addInfo=ESIM${currentOrderCode}&accountName=${BANK_INFO.accountName}`;
    
    // Cập nhật src của ảnh QR
    document.getElementById('qrCode').src = qrUrl;
}

// ============================================
// HÀM VALIDATE FORM
// ============================================
function validateForm() {
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Kiểm tra email
    if (!email) {
        alert('❌ Vui lòng nhập email!');
        return false;
    }
    
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Email không hợp lệ!');
        return false;
    }
    
    // Kiểm tra số điện thoại
    if (!phone) {
        alert('❌ Vui lòng nhập số điện thoại!');
        return false;
    }
    
    // Kiểm tra định dạng số điện thoại Việt Nam
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        alert('❌ Số điện thoại không hợp lệ!');
        return false;
    }
    
    // Kiểm tra số lượng
    const days = parseInt(document.getElementById('days').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (days < 1) {
        alert('❌ Số ngày phải lớn hơn 0!');
        return false;
    }
    
    if (quantity < 1) {
        alert('❌ Số lượng eSIM phải lớn hơn 0!');
        return false;
    }
    
    return true;
}

// ============================================
// HÀM LẤY THÔNG TIN ĐỌN HÀNG
// ============================================
function getOrderInfo() {
    const countrySelect = document.getElementById('country');
    const packageSelect = document.getElementById('package');
    
    return {
        order_code: currentOrderCode,
        country: countrySelect.options[countrySelect.selectedIndex].text,
        package: packageSelect.options[packageSelect.selectedIndex].text,
        days: document.getElementById('days').value,
        quantity: document.getElementById('quantity').value,
        total: formatCurrency(currentTotal),
        total_number: currentTotal,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        notes: document.getElementById('notes').value.trim() || 'Không có ghi chú',
        admin_email: ADMIN_EMAIL,
        bank_name: 'MB Bank',
        account_number: BANK_INFO.accountNumber,
        account_name: BANK_INFO.accountNameDisplay
    };
}

// ============================================
// HÀM GỬI EMAIL QUA EMAILJS
// ============================================
function sendEmail(orderInfo) {
    return emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        orderInfo
    );
}

// ============================================
// HÀM HIỂN thị MODAL
// ============================================
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ============================================
// HÀM ĐÓNG MODAL THÀNH CÔNG VÀ RELOAD TRANG
// ============================================
function closeSuccessModal() {
    hideModal('successModal');
    // Reload trang để làm mới form
    location.reload();
}

// ============================================
// HÀM XỬ LÝ SUBMIT ĐƠN HÀNG
// ============================================
async function submitOrder() {
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Cập nhật progress steps
    document.getElementById('step2').classList.add('active');
    document.getElementById('step3').classList.add('active');
    
    // Hiển thị loading modal
    showModal('loadingModal');
    
    try {
        // Lấy thông tin đơn hàng
        const orderInfo = getOrderInfo();
        
        // Gửi email
        const response = await sendEmail(orderInfo);
        
        console.log('Email sent successfully:', response);
        
        // Đợi 1.5 giây để người dùng thấy loading
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Ẩn loading modal
        hideModal('loadingModal');
        
        // Hiển thị success modal
        showModal('successModal');
        
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Ẩn loading modal
        hideModal('loadingModal');
        
        // Hiển thị thông báo lỗi
        alert('⚠️ Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.\n\nThông tin lỗi: ' + error.text);
    }
}

// ============================================
// HÀM XỬ LÝ DEMO (KHI CHƯA CẤU HÌNH EMAILJS)
// ============================================
// Nếu bạn chưa cấu hình EmailJS, có thể dùng hàm này để test
function submitOrderDemo() {
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Cập nhật progress steps
    document.getElementById('step2').classList.add('active');
    document.getElementById('step3').classList.add('active');
    
    // Hiển thị loading modal
    showModal('loadingModal');
    
    // Lấy thông tin đơn hàng
    const orderInfo = getOrderInfo();
    
    // Log ra console để kiểm tra
    console.log('=== THÔNG TIN ĐƠN HÀNG ===');
    console.log(orderInfo);
    
    // Giả lập gửi email (đợi 2 giây)
    setTimeout(() => {
        // Ẩn loading modal
        hideModal('loadingModal');
        
        // Hiển thị success modal
        showModal('successModal');
    }, 2000);
}

// ============================================
// XỬ LÝ CLICK NGOÀI MODAL ĐỂ ĐÓNG
// ============================================
window.onclick = function(event) {
    const loadingModal = document.getElementById('loadingModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === loadingModal) {
        // Không cho phép đóng loading modal bằng click outside
        return;
    }
    
    if (event.target === successModal) {
        closeSuccessModal();
    }
}

// ============================================
// HƯỚNG DẪN SỬ DỤNG
// ============================================
/*
=== HƯỚNG DẪN CẤU HÌNH VÀ SỬ DỤNG ===

1. CẤU HÌNH EMAILJS:
   - Truy cập: https://www.emailjs.com/
   - Đăng ký tài khoản miễn phí
   - Tạo Email Service (chọn Gmail, Outlook, v.v.)
   - Tạo Email Template với các biến sau:
     * {{order_code}} - Mã đơn hàng
     * {{country}} - Quốc gia
     * {{package}} - Gói data
     * {{days}} - Số ngày
     * {{quantity}} - Số lượng
     * {{total}} - Tổng tiền
     * {{email}} - Email khách
     * {{phone}} - SĐT khách
     * {{notes}} - Ghi chú
     * {{admin_email}} - Email admin
   - Copy Service ID, Template ID, Public Key
   - Paste vào EMAILJS_CONFIG ở đầu file này

2. THAY ĐỔI GIÁ GÓI:
   - Tìm object PACKAGE_PRICES
   - Cập nhật giá trị theo ý muốn
   - Hoặc sửa trực tiếp trong HTML (data-price)

3. THAY ĐỔI THÔNG TIN NGÂN HÀNG:
   - Tìm object BANK_INFO
   - Cập nhật:
     * bankCode: Mã ngân hàng (theo VietQR)
     * accountNumber: Số tài khoản
     * accountName: Tên TK (URL encoded)
     * accountNameDisplay: Tên hiển thị
   - Danh sách mã ngân hàng: https://api.vietqr.io/v2/banks

4. THAY ĐỔI EMAIL ADMIN:
   - Tìm biến ADMIN_EMAIL
   - Đổi thành email của bạn

5. TEST KHÔNG CẦN EMAILJS:
   - Trong HTML, đổi onclick="submitOrder()" 
     thành onclick="submitOrderDemo()"
   - Khi này sẽ chỉ log ra console thay vì gửi email thật

6. MẪU EMAIL TEMPLATE (EmailJS):
   Subject: 🎉 Đơn hàng mới #{{order_code}}
   
   Body:
   Có đơn hàng mới từ ARICO ESIM!
   
   === THÔNG TIN ĐƠN HÀNG ===
   Mã đơn hàng: {{order_code}}
   Quốc gia: {{country}}
   Gói data: {{package}}
   Số ngày: {{days}}
   Số lượng: {{quantity}}
   Tổng tiền: {{total}}
   
   === THÔNG TIN KHÁCH HÀNG ===
   Email: {{email}}
   Điện thoại: {{phone}}
   Ghi chú: {{notes}}
   
   === THÔNG TIN THANH TOÁN ===
   Ngân hàng: {{bank_name}}
   Số TK: {{account_number}}
   Tên TK: {{account_name}}
   Nội dung: ESIM {{order_code}}

*/
