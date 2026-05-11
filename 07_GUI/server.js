const express = require('express');
const path = require('path');
const { initDbPool } = require('./db');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { index: 'login.html' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/recipients', require('./routes/recipients'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/dashboard', require('./routes/dashboard'));

async function startServer() {
    try {
        await initDbPool();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
