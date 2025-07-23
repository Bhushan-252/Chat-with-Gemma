const { extractTitleFromText } = require("../Frontend/src/util");
const pool = require("./connection")

// Get all chats
async function getChats() {
  const res = await pool.query('SELECT * FROM chats ORDER BY created_at DESC');
  return res.rows;
}

// Get messages for a chat by chat_id
async function getMessagesByChatId(chatId) {
  const res = await pool.query(
    'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC',
    [chatId]
  );
  return res.rows;
}

// Insert a new chat
async function createChat(title) {
  const res = await pool.query(
    'INSERT INTO chats (title) VALUES ($1) RETURNING *',
    [title]
  );
  return res.rows[0];
}

// Insert a new message into a chat
async function createMessage(chatId, role, content) {
  const res = await pool.query(
    'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3) RETURNING *',
    [chatId, role, content]
  );
  return res.rows[0];
}
async function updateTitle(chatId,content) {
   const title = extractTitleFromText(content)
   const result = await pool.query(
      "UPDATE chats SET title = $1 WHERE id = $2 AND title = 'Titles' RETURNING *",
      [title, chatId]
    );
  return result.rows[0];
}

module.exports =  function extractTitleFromText(text) {
  const stopWords = ['the', 'is', 'and', 'to', 'of', 'in', 'with', 'a', 'an', 'this', 'that'];
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(word => word && !stopWords.includes(word))
    .slice(0, 5); // top 5 keywords

  return words.map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}


module.exports = {createMessage,createChat,getMessagesByChatId,getChats,updateTitle}