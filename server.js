const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

const client = redis.createClient({
    url: 'redis://redis:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    await client.connect();
    console.log(JSON.stringify({
        event: 'Đã kết nối thành công tới Redis!'
    }));
}
connectRedis();

app.get('/', async (req, res) => {
    try {
        const currentViews = await client.incr('view_count');
        console.log(JSON.stringify({
            event: "page_view",
            count: currentViews,
            timestamp: new Date().toISOString()
        }));
        res.send(`<h1>Chào mừng bạn đến với trang web!</h1><p>Số lượt truy cập hiện tại là: <strong>${currentViews}</strong></p>`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Đã xảy ra lỗi khi kết nối với database.');
    }
});

app.listen(PORT, () => {
    console.log(JSON.stringify({
        event: `Server đang chạy tại http://localhost:${PORT}`
    }));
});