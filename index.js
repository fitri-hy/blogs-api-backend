const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const app = express();
const getData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

// ADMIN PAGES START
app.set('view engine', 'ejs');
app.get('/admin', (req, res) => {
  res.render('admin/main');
});
// ADMIN PAGES END

// API DATA START
app.get('/api/data', (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = getData.post.slice(startIndex, endIndex);
    const totalPages = Math.ceil(getData.post.length / limit);
    res.json({
        data: paginatedData,
        pagination: {
            page,
            limit,
            totalPages,
        },
    });
});

app.get('/api/data/search', (req, res) => {
    const query = req.query.query;
    if (!query) {
        res.status(400).json({
            error: 'Parameter "query" not found',
        });
    }
    const regex = new RegExp(query, 'i');
    const filteredData = getData.post.filter(data => regex.test(data.title));
    res.json({
        data: filteredData,
    });
});

app.get('/api/data/category', (req, res) => {
    const query = req.query.query;
    if (!query) {
        res.status(400).json({
            error: 'Parameter "query" not found',
        });
    }
    const regex = new RegExp(query, 'i');
    const filteredData = getData.post.filter(data => regex.test(data.category));
    res.json({
        data: filteredData,
    });
});

app.get('/api/data/:id', (req, res) => {
    const id = req.params.id;
    const data = getData.post.find(data => data.id === id);
    if (data) {
        res.json({
            data: data,
        });
    } else {
    res.status(404).json({
        error: 'Data detail not found',
    });
    }
});

app.listen(3000, () => {
    console.log('Server running port: 3000');
});