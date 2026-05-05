const express = require('express');
const cors = require('cors');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "حط_مفتاحك_هنا";

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/page1.html');
});

app.post("/chat", async (req, res) => {
    try {
        const userText = req.body.message;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: userText }],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        console.log(data); // 👈 مهم عشان نشوف الرد

        res.json({
            reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "مفيش رد",
        });

    } catch (error) {
        console.log("ERROR:", error);
        res.json({ reply: "حصل خطأ في السيرفر" });
    }
});

app.listen(3000, () => console.log("السيرفر شغال"));