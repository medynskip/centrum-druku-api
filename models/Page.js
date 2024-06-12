
import mongoose from "mongoose";
const PageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  linkName: {
    type: String,
    required: true,
  },
  added: {
    type: Date,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

export default PageSchema;
