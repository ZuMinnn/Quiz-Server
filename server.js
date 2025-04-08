import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';

/** import connection file */
import connect from './database/conn.js';

const app = express()


/** app middlewares */
app.use(morgan('tiny'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/** appliation port */
const port = process.env.PORT || 5000;

// Cấu hình CORS cho thư mục audio
app.use('/audio', cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}), express.static(path.join(__dirname, 'public/audio'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length');
    res.setHeader('Content-Type', 'audio/mpeg');
  }
}));

// Thêm middleware để xử lý lỗi khi tệp âm thanh không tồn tại
app.use('/audio', (req, res, next) => {
  const filePath = path.join(__dirname, 'public/audio', req.path);
  const fs = require('fs');
  
  if (!fs.existsSync(filePath)) {
    console.error(`Audio file not found: ${filePath}`);
    return res.status(404).json({ error: 'Audio file not found' });
  }
  
  next();
});

/** routes */
app.use('/api', router) /** apis */


app.get('/', (req, res) => {
    try {
        res.json("Get Request")
    } catch (error) {
        res.json(error)
    }
})


/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error => {
    console.log("Invalid Database Connection");
})

