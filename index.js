const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
let getData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
let lastId = getData.post.length > 0 ? Math.max(...getData.post.map(post => parseInt(post.id))) : 0;
app.set('view engine', 'ejs');

const generateId = () => {
  return (++lastId).toString();
};

app.get('/add', (req, res) => {
  res.render('add_post');
});

app.get('/edit/:id', (req, res) => {
  const postId = req.params.id;
  const postData = getData.post.find(post => post.id === postId);
  res.render('edit_post', { postData });
});

app.get('/', (req, res) => {
  res.render('view_posts', { data: getData.post });
});

app.post('/create', upload.single('image'), (req, res) => {
  const { title, category, content } = req.body;
  const image = req.file ? req.file.filename : '';
  const newPost = { id: generateId(), title, category, content, image };
  getData.post.push(newPost);
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(getData, null, 2));
  res.redirect('/');
});

app.post('/update/:id', upload.single('image'), (req, res) => {
  const postId = req.params.id;
  const { title, category, content } = req.body;
  const postIndex = getData.post.findIndex(data => data.id === postId);
  if (postIndex !== -1) {
    const updatedPost = { ...getData.post[postIndex], title, category, content };
    if (req.file) {
      updatedPost.image = req.file.filename;
    }
    getData.post[postIndex] = updatedPost;
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(getData, null, 2));
  }
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const postId = req.params.id;
  getData.post = getData.post.filter(data => data.id !== postId);
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(getData, null, 2));
  res.redirect('/');
});

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