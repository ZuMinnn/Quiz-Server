import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Results from '../models/resultSchema.js';

// Load biến môi trường
dotenv.config();

// Kết nối đến database
async function connectDB() {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('Đã kết nối đến database');
  } catch (error) {
    console.error('Lỗi kết nối database:', error);
    process.exit(1);
  }
}

// Xóa tất cả dữ liệu kết quả
async function deleteAllResults() {
  try {
    await Results.deleteMany({});
    console.log('Đã xóa tất cả dữ liệu kết quả thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu:', error);
  } finally {
    // Đóng kết nối database
    await mongoose.connection.close();
    console.log('Đã đóng kết nối database');
  }
}

// Chạy script
connectDB().then(() => {
  deleteAllResults();
}); 