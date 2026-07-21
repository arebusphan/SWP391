# 🏥 Dự án: Hệ thống Quản lý Y tế & Sức khỏe Học đường (School Healthcare Management System)

## 1. Mục đích của dự án (Project Overview)
Dự án này là một hệ thống toàn diện giúp các trường học **quản lý hồ sơ y tế, tình trạng sức khỏe của học sinh**, cũng như theo dõi kho vật tư y tế của phòng y tế nhà trường. Hệ thống kết nối giữa **Nhà trường (Quản lý/Admin)**, **Nhân viên Y tế (Medical Staff)** và **Phụ huynh (Parents)** để đảm bảo sức khỏe cho học sinh được theo dõi sát sao, xử lý kịp thời các sự cố y tế và cung cấp quy trình nạp/gửi thuốc an toàn.

## 2. Các chức năng chính (Tính năng theo vai trò)
Hệ thống phân quyền chi tiết cho nhiều đối tượng người dùng khác nhau:

*   👨‍⚕️ **Nhân viên Y tế (Medical Staff):**
    *   **Quản lý sức khỏe học sinh:** Theo dõi hồ sơ y tế (`HealthProfile`), tình trạng sức khỏe, và kết quả khám sức khỏe định kỳ.
    *   **Quản lý lịch sử sự cố y tế:** Ghi nhận và xử lý các tai nạn, sự cố y tế xảy ra tại trường.
    *   **Quản lý yêu cầu gửi thuốc:** Xếp lịch và tiếp nhận các yêu cầu gửi thuốc từ phụ huynh, lên lịch uống thuốc cho học sinh.
    *   **Quản lý tiêm chủng:** Cập nhật kết quả tiêm chủng của học sinh.
    *   **Quản lý Kho vật tư y tế:** Theo dõi số lượng thuốc, vật tư y tế tiêu hao, nhập/xuất kho.

*   👪 **Phụ huynh (Parents):**
    *   **Theo dõi sức khỏe con cái:** Xem hồ sơ y tế, lịch sử tiêm chủng và các báo cáo khám sức khỏe.
    *   **Gửi thuốc cho trường:** Tạo form yêu cầu y tế/gửi thuốc cho nhân viên y tế trường.
    *   **Nhận thông báo:** Nhận email/thông báo khi có sự cố y tế xảy ra với con mình.
    *   **Tư vấn sức khỏe:** Có tính năng đặt lịch hẹn tư vấn và đọc tin tức y tế.

*   👨‍💼 **Quản lý / Admin (Manager/Admin):**
    *   **Quản lý hệ thống:** Quản trị người dùng, tạo thông báo chung.
    *   **Quản lý danh sách lớp & học sinh:** Import/Export dữ liệu học sinh.
    *   **Thống kê & Báo cáo:** Xem dashboard số liệu tổng quan về sức khỏe của toàn trường.

## 3. Công nghệ sử dụng (Tech Stack)

Dự án áp dụng mô hình kiến trúc **N-Tier (Backend)** kết hợp với **Single Page Application (Frontend)**, đồng thời hỗ trợ **Containerization (Docker)** cho môi trường triển khai.

### 🎨 Frontend (Thư mục `react/`)
*   **Core / Build Tool:**
    *   `React 19` & `TypeScript`: Xây dựng component với static typing.
    *   `Vite`: Môi trường build siêu tốc.
*   **Giao diện & Thành phần UI:**
    *   `Tailwind CSS v4`: Utility-first CSS framework.
    *   `MUI (Material-UI)` & `Emotion`: Component thư viện Material Design.
    *   `Radix UI` (kết hợp `clsx`, `tailwind-merge` - chuẩn Shadcn UI): Xây dựng các UI element nguyên thủy (Dialog, Label, Slot).
    *   `Lucide React` & `React Icons`: Cung cấp icon cho giao diện.
*   **Trải nghiệm người dùng (UX) & Tính năng nâng cao:**
    *   `Tiptap`: Trình soạn thảo văn bản Rich-Text mạnh mẽ (có hỗ trợ Upload ảnh, text-align, v.v.).
    *   `Embla Carousel`: Tạo slider hiển thị banner/thông tin mượt mà.
    *   `Floating UI`: Hỗ trợ định vị cho các tooltip/popover.
*   **Quản lý Dữ liệu & Routing:**
    *   `Axios`: Xử lý HTTP Client gọi API.
    *   `React-router-dom v7`: Điều hướng các trang trong ứng dụng.
    *   `JWT Decode`: Trích xuất thông tin người dùng từ token.
    *   `Recharts`: Vẽ biểu đồ thống kê cho Dashboard Admin.
    *   `XLSX` & `File-saver`: Đọc, xuất (export) danh sách học sinh ra file Excel.
*   **Code Quality / Linter:**
    *   `ESLint` (v9 flat config) & `TypeScript-ESLint`: Quản lý chất lượng code, check lỗi cú pháp.
    *   `PostCSS` & `Autoprefixer`: Tiền xử lý CSS.

### ⚙️ Backend (Các thư mục `Api_`, `Application.BLL`, `DAL`)
*   **Core:**
    *   `ASP.NET Core Web API (.NET 9)`: Framework xử lý Web API mạnh mẽ.
*   **Kiến trúc hệ thống (N-Tier Architecture):**
    *   `API Layer` (`Api_`): Chứa các Controllers tiếp nhận Request, cấu hình hệ thống.
    *   `Business Logic Layer (BLL)`: Chứa các Services xử lý nghiệp vụ logic.
    *   `Data Access Layer (DAL)`: Chứa các Repositories tương tác với CSDL.
*   **Tương tác Database (ORM) & CSDL:**
    *   `Entity Framework Core 9`: Sử dụng phương thức Code-First Migration.
    *   `PostgreSQL` (`Npgsql.EntityFrameworkCore.PostgreSQL`): CSDL chính.
    *   (Hỗ trợ song song `SQL Server` qua `Microsoft.EntityFrameworkCore.SqlServer`).
*   **Bảo mật & Xác thực:**
    *   `ASP.NET Core Identity`: Quản trị thông tin người dùng & Role.
    *   `JWT Bearer` (`System.IdentityModel.Tokens.Jwt`): Cấp và xác thực token API.
*   **Công cụ & Triển khai (DevOps):**
    *   `Docker`: Tích hợp sẵn `Dockerfile` (sử dụng mcr.microsoft.com/dotnet/aspnet:9.0) để đóng gói ứng dụng Backend thành Container (Containerization).
    *   `Swashbuckle.AspNetCore (Swagger / OpenAPI)`: Tự động sinh tài liệu API (Document) để Frontend test dễ dàng.
