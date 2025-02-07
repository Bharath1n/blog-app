import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let posts = [];

app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/new", (req,res) => {
    res.render("new");
});

app.post("/new", (req, res) => {
    const {title, content} = req.body;
    posts.push({title, content});
    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    if (postId >= 0 && postId < posts.length) {
        res.render("edit", { post: posts[postId], postId });
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    if (postId >= 0 && postId < posts.length) {
        posts[postId] = { id: postId, title: req.body.title, content: req.body.content };
    }
    res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter((_, index) => index !== postId);
    res.redirect("/");
});

export default (req, res) => {
    app(req, res);
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
