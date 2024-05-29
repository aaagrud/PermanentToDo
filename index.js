import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
    user : 'postgres',
    host : 'localhost',
    database : 'todo_db',
    password : 'caramelcheese',
    port : 5432
});
db.connect();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try{
        const result = await db.query('SELECT * from todos   ORDER BY id');
        res.render('index.ejs', {tasks : result.rows});
    } catch (err) {
        console.log("error is: ", err);
        res.send('error displaying tasks');
    }
});

app.post('/add', async (req, res) => {
    try{
        await db.query('  INSERT INTO todos(task) VALUES($1)', [req.body.task]);
        res.redirect('/');
    } catch (err) {
        console.error("error is: ", err);
        res.send('error adding task');
    }
});

app.post('/complete/:id', async (req, res) => {
    try{
        await db.query('UPDATE todos SET completed = true WHERE id = $1', [req.params.id]);
        res.redirect('/');
    } catch (err) {
        console.log("error is: ", err);
        res.send('error completing task');
    }
});

app.post('/delete/:id', async (req, res) => {
    try{
        await db.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
        res.redirect('/');
    } catch (err) {
        console.log("error is: ", err);
        res.send('error deleting task');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});