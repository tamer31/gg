import TelegramBot from "node-telegram-bot-api";
import express from "express";
import fs from "fs-extra";

const token = "8244747313:AAHbRLSK1SbZZDLyoSz_dknt13k1rdcKQpw";
const webAppUrl = "https://gleaming-conkies-d11d10.netlify.app/"; // сюда вставь свой сайт
const bot = new TelegramBot(token, { polling: true });

// 1️⃣ API для WebApp, чтобы обмениваться данными
const app = express();
app.use(express.json());

// Чтение текущих карточек
app.get("/cards", async (req, res) => {
  const data = await fs.readJson("cards.json").catch(() => []);
  res.json(data);
});

// Добавление карточки
app.post("/add", async (req, res) => {
  const data = await fs.readJson("cards.json").catch(() => []);
  data.push(req.body);
  await fs.writeJson("cards.json", data);
  res.send("ok");
});

// Удаление по индексу
app.post("/delete", async (req, res) => {
  let data = await fs.readJson("cards.json").catch(() => []);
  data.splice(req.body.index, 1);
  await fs.writeJson("cards.json", data);
  res.send("ok");
});

// Запуск HTTP-сервера для WebApp
app.listen(8080, () => console.log("Server running"));

// 2️⃣ Команды бота
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Добро пожаловать в доску заметок!", {
    reply_markup: {
      inline_keyboard: [[
        { text: "Открыть доску", web_app: { url: webAppUrl } }
      ]]
    }
  });
});
