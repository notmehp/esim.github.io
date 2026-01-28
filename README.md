# 🌍 Website Bán eSIM Du Lịch - ARICO ESIM

Website đặt hàng eSIM du lịch quốc tế với tính năng tự động tính tiền, tạo QR thanh toán và gửi email thông báo cho admin.

## 📋 Tính năng

✅ Chọn quốc gia/khu vực du lịch  
✅ Chọn gói dung lượng data (500MB - Unlimited)  
✅ Tùy chỉnh số ngày sử dụng  
✅ Đặt nhiều eSIM cùng lúc  
✅ Tính tiền tự động theo công thức  
✅ Tạo QR code thanh toán tự động (VietQR)  
✅ Gửi email thông báo đơn hàng cho admin  
✅ Giao diện responsive (desktop & mobile)  
✅ Không cần database backend  

## 🚀 Cài đặt

### Bước 1: Download/Clone code

```bash
# Clone repository hoặc download các file sau:
- index.html
- style.css
- script.js
- README.md
```

### Bước 2: Cấu hình EmailJS

1. **Đăng ký EmailJS** (miễn phí):
   - Truy cập: https://www.emailjs.com/
   - Đăng ký tài khoản miễn phí
   - Xác nhận email

2. **Tạo Email Service**:
   - Vào dashboard → Email Services
   - Click "Add New Service"
   - Chọn provider (Gmail khuyên dùng)
   - Kết nối với email của bạn
   - Copy **Service ID**

3. **Tạo Email Template**:
   - Vào dashboard → Email Templates
   - Click "Create New Template"
   - Đặt tên template: "eSIM Order Notification"
   - **To email**: `{{admin_email}}` (hoặc email admin cố định)
   - **From name**: ARICO ESIM
   - **Subject**: `🎉 Đơn hàng mới #{{order_code}}`
   - **Content** (paste vào):

```
Có đơn hàng eSIM mới!

═══════════════════════════════════
📦 THÔNG TIN ĐƠN HÀNG
═══════════════════════════════════
Mã đơn hàng: {{order_code}}
Quốc gia/Khu vực: {{country}}
Gói data: {{package}}
Số ngày sử dụng: {{days}} ngày
Số lượng eSIM: {{quantity}}
Tổng tiền: {{total}}

═══════════════════════════════════
👤 THÔNG TIN KHÁCH HÀNG
═══════════════════════════════════
Email: {{email}}
Số điện thoại: {{phone}}
Ghi chú: {{notes}}

═══════════════════════════════════
💳 THÔNG TIN THANH TOÁN
═══════════════════════════════════
Ngân hàng: MB Bank
Số tài khoản: {{account_number}}
Chủ tài khoản: {{account_name}}
Nội dung CK: ESIM {{order_code}}
Số tiền: {{total}}

---
Vui lòng kiểm tra thanh toán và gửi eSIM cho khách hàng.
```

   - Click "Save"
   - Copy **Template ID**

4. **Lấy Public Key**:
   - Vào dashboard → Account → General
   - Copy **Public Key**

5. **Cập nhật vào code**:
   - Mở file `script.js`
   - Tìm dòng 9-13:

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',      // Paste Service ID
    templateID: 'YOUR_TEMPLATE_ID',    // Paste Template ID
    publicKey: 'YOUR_PUBLIC_KEY'       // Paste Public Key
};
```

   - Thay `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`, `YOUR_PUBLIC_KEY` bằng giá trị thực

6. **Thay email admin**:
   - Tìm dòng 16:

```javascript
const ADMIN_EMAIL = 'admin@aricoesim.com';  // Thay email của bạn
```

### Bước 3: Cấu hình thông tin ngân hàng

Mở file `script.js`, tìm dòng 35-40:

```javascript
const BANK_INFO = {
    bankCode: 'MB',                    // Mã ngân hàng
    accountNumber: '0931516579',       // Số tài khoản
    accountName: 'ARICO%20ESIM',       // Tên TK (URL encoded)
    accountNameDisplay: 'ARICO ESIM'   // Tên hiển thị
};
```

**Cách thay đổi**:
1. **bankCode**: Mã ngân hàng theo chuẩn VietQR
   - VCB = Vietcombank
   - TCB = Techcombank
   - MB = MB Bank
   - ACB = ACB
   - Xem full list: https://api.vietqr.io/v2/banks

2. **accountNumber**: Số tài khoản của bạn

3. **accountName**: Tên chủ tài khoản (URL encoded)
   - VD: "NGUYEN VAN A" → "NGUYEN%20VAN%20A"
   - Tool encode: https://www.urlencoder.org/

4. **accountNameDisplay**: Tên hiển thị (không encode)

### Bước 4: Tùy chỉnh giá gói (tùy chọn)

Trong file `script.js`, tìm dòng 23-30:

```javascript
const PACKAGE_PRICES = {
    '500': 50000,      // 500MB = 50,000đ
    '1000': 80000,     // 1GB = 80,000đ
    '2000': 120000,    // 2GB = 120,000đ
    '3000': 150000,    // 3GB = 150,000đ
    '5000': 200000,    // 5GB = 200,000đ
    'unlimited': 300000 // Unlimited = 300,000đ
};
```

Thay đổi giá theo ý muốn.

**Lưu ý**: Cũng cần cập nhật giá trong HTML:
- Mở `index.html`
- Tìm các dòng `<option value="..." data-price="...">`
- Cập nhật `data-price` cho khớp

## 🧪 Test website

### Test không cần EmailJS (Local)

1. Mở `index.html` trong file
2. Tìm nút "Hoàn tất đơn hàng"
3. Đổi `onclick="submitOrder()"` thành `onclick="submitOrderDemo()"`
4. Mở browser console (F12)
5. Đặt hàng thử → xem thông tin log ra console

### Test với EmailJS thật

1. Đảm bảo đã cấu hình EmailJS đầy đủ
2. Mở `index.html` trong browser
3. Điền form và đặt hàng
4. Kiểm tra email admin có nhận được không

## 📱 Sử dụng

1. Khách hàng truy cập website
2. Chọn:
   - Quốc gia/khu vực
   - Gói dung lượng
   - Số ngày
   - Số lượng eSIM
3. Nhập thông tin:
   - Email
   - Số điện thoại
   - Ghi chú (tùy chọn)
4. Hệ thống tự động:
   - Tính tổng tiền
   - Tạo QR code thanh toán
   - Hiển thị thông tin CK
5. Khách quét QR hoặc chuyển khoản thủ công
6. Bấm "Hoàn tất đơn hàng"
7. Email tự động gửi về admin
8. Admin kiểm tra thanh toán và gửi eSIM

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu sắc chủ đạo

Mở `style.css`, tìm các biến màu:

```css
/* Gradient chính */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Màu nút, tiêu đề */
color: #667eea;
```

Thay `#667eea` và `#764ba2` bằng màu bạn muốn.

### Thay logo/tên thương hiệu

Mở `index.html`, tìm dòng 12-13:

```html
<h1>🌍 ARICO ESIM</h1>
<p class="tagline">eSIM Du Lịch Quốc Tế - Kết Nối Mọi Nơi</p>
```

## 📊 Công thức tính tiền

```
Tổng tiền = Đơn giá/ngày × Số ngày × Số lượng eSIM
```

**Ví dụ**:
- Gói: 2GB/ngày = 120,000đ
- Số ngày: 7 ngày
- Số lượng: 2 eSIM
- **Tổng** = 120,000 × 7 × 2 = **1,680,000đ**

## 🏦 VietQR API

Website sử dụng VietQR API miễn phí để tạo QR code:

```
https://img.vietqr.io/image/{BANK_CODE}-{ACCOUNT_NUMBER}-compact2.jpg
?amount={AMOUNT}
&addInfo={ORDER_CODE}
&accountName={ACCOUNT_NAME}
```

**Tham số**:
- `BANK_CODE`: Mã ngân hàng (VCB, TCB, MB...)
- `ACCOUNT_NUMBER`: Số tài khoản
- `AMOUNT`: Số tiền (VND)
- `ORDER_CODE`: Mã đơn hàng (YYYYMMDDHHmmss)
- `ACCOUNT_NAME`: Tên chủ TK (URL encoded)

## 🔧 Troubleshooting

### Email không được gửi

1. Kiểm tra cấu hình EmailJS:
   - Service ID đúng?
   - Template ID đúng?
   - Public Key đúng?

2. Kiểm tra console browser (F12):
   - Có lỗi nào không?
   - Copy lỗi và search Google

3. Kiểm tra EmailJS dashboard:
   - Có log request không?
   - Status code là gì?

4. Kiểm tra giới hạn EmailJS:
   - Free plan: 200 emails/tháng
   - Đã dùng hết chưa?

### QR code không hiển thị

1. Kiểm tra BANK_INFO trong `script.js`
2. Kiểm tra console có lỗi load ảnh không
3. Test URL QR trực tiếp trong browser
4. Đảm bảo có kết nối internet

### Form validation không hoạt động

1. Kiểm tra đã load `script.js` chưa
2. Mở console xem có lỗi JavaScript không
3. Kiểm tra các ID element có đúng không

## 📁 Cấu trúc file

```
esim-website/
├── index.html          # File HTML chính
├── style.css           # File CSS (giao diện)
├── script.js           # File JavaScript (logic)
└── README.md           # File hướng dẫn
```

## 🌐 Deploy lên web

### Option 1: GitHub Pages (Miễn phí)

1. Tạo repository trên GitHub
2. Upload 3 file: index.html, style.css, script.js
3. Vào Settings → Pages
4. Source: Deploy from a branch
5. Branch: main → Save
6. Website sẽ có URL: `https://username.github.io/repo-name`

### Option 2: Netlify (Miễn phí)

1. Truy cập: https://www.netlify.com/
2. Drag & drop folder vào Netlify
3. Website tự động deploy
4. Được subdomain: `https://random-name.netlify.app`

### Option 3: Vercel (Miễn phí)

1. Truy cập: https://vercel.com/
2. Import project từ GitHub
3. Deploy tự động
4. Domain: `https://project-name.vercel.app`

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Đọc kỹ README này
2. Kiểm tra console browser (F12)
3. Google lỗi cụ thể
4. Hỏi ChatGPT/Claude

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🎉 Credits

- VietQR API: https://vietqr.io/
- EmailJS: https://www.emailjs.com/
- Icons: Unicode Emoji

---

**Chúc bạn thành công! 🚀**
