import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url'; 
import multer from 'multer';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/favicon.ico', (req, res) => res.status(204).end());


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });
let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const { title, content } = req.body;
    const imagePath = 'uploads/' + req.file.filename;
    posts.push({ title, content, image : imagePath });
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

app.post('/edit/:id', upload.single('image'), (req, res) => {
    const postId = parseInt(req.params.id);
    if (postId >= 0 && postId < posts.length) {
        posts[postId] = { 
            title: req.body.title,
            content: req.body.content,
            image: req.file ? `uploads/${req.file.filename}` : posts[postId].image
        };
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
import { createServer } from 'http';
const server = createServer(app);
export default server;

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}