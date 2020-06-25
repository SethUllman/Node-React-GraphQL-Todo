const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  copleted: Boolean,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', TodoSchema);