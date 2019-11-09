const express = require('express');
const app = express();

app.use(express.json());

// GET
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post();
app.put();
app.delete();

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));