# Trò Chơi Đoán Số

Một trò chơi đơn giản được viết bằng Node.js, nơi người chơi phải đoán một số ngẫu nhiên từ 1 đến 100.

## Yêu Cầu Hệ Thống

- Node.js (phiên bản 12.0.0 trở lên)
- npm (Node Package Manager)

## Cách Cài Đặt

1. Clone repository này về máy của bạn:
```bash
git clone [URL_REPOSITORY]
```

2. Di chuyển vào thư mục dự án:
```bash
cd Number_Guessing_Game
```

3. Chạy trò chơi:
```bash
node number-guessing-game.js
```

## Cách Chơi

1. Khi bắt đầu trò chơi, bạn sẽ được yêu cầu chọn mức độ khó:
   - Dễ (Easy): 10 lần đoán
   - Trung bình (Medium): 5 lần đoán
   - Khó (Hard): 3 lần đoán

2. Trò chơi sẽ tạo một số ngẫu nhiên từ 1 đến 100

3. Nhập số bạn đoán và nhận gợi ý:
   - Nếu số của bạn lớn hơn số cần đoán, trò chơi sẽ báo "The number is less than X"
   - Nếu số của bạn nhỏ hơn số cần đoán, trò chơi sẽ báo "The number is greater than X"
   - Nếu đoán đúng, bạn sẽ thấy thông báo chúc mừng

4. Sau khi kết thúc mỗi vòng, bạn có thể chọn chơi lại hoặc thoát

## Tính Năng

- Ba mức độ khó khác nhau
- Gợi ý sau mỗi lần đoán
- Kiểm tra tính hợp lệ của đầu vào
- Thống kê số lần đoán
- Tùy chọn chơi lại

## Tác Giả
[https://roadmap.sh/projects/number-guessing-game](https://roadmap.sh/projects/number-guessing-game)