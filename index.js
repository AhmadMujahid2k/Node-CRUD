const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require("fs")
const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended:false}));

// Routes

app.get("/api/users", (req,res) => {
    return res.json(users);
});

app.get("/users", (req,res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    <ul/>`;
    res.send(html)
});

app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({id: users.length+1 , ...body})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "success", id: users.length });
    })
});

app
    .route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    })
    .put((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            // Update the user with new data
            users[index] = { id, ...req.body };
            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update user' });
                }
                return res.json({ status: 'success', user: users[index] });
            });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            // Remove the user from the list
            users.splice(index, 1);
            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete user' });
                }
                return res.json({ status: 'success', message: 'User deleted' });
            });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    });

// app.get("/api/users/:id", (req,res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// })

// app.patch("api/users/:id", (req, res) => {
//     return res.json({ status: "pending"});
// })

// app.delete("api/users/:id", (req,res) => {
//     return res.json({ status: "pending"});
// })

app.listen( PORT, () => console.log(`Server started at PORT:${PORT}`))