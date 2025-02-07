import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url'; 

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/favicon.ico', (req, res) => res.status(204).end());

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', (req, res) => {
    const { title, content } = req.body;
    posts.push({ title, content });
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    if (postId >= 0 && postId < posts.length) {
        res.render('edit', { post: posts[postId], postId });
    } else {
        res.status(404).send('Post not found');
    }
});

app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    if (postId >= 0 && postId < posts.length) {
        posts[postId] = { title: req.body.title, content: req.body.content };
    }
    res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    if (postId >= 0 && postId < posts.length) {
        posts.splice(postId, 1);
    }
    res.redirect('/');
});
export default function handler(req, res) {
    app(req, res);
}

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}