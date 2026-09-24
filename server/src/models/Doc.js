const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const docSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4()
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Doc'
    },
    icon: {
      type: String,
      default: '📄'
    },
    parentId: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: null
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      }
    }
  }
);

// Virtual getter for id
docSchema.virtual('id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Doc', docSchema);
