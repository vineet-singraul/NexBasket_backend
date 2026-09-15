const mongoose = require("mongoose");

const filterDefinitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    productType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    filters: [
      {
        name: {
          type: String,
          required: true,
        },

        key: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          enum: [
            "range",
            "checkbox",
            "radio",
            "rating",
            "boolean"
          ],
          required: true,
        },

        options: [
          {
            value: mongoose.Schema.Types.Mixed,
            count: {
              type: Number,
              default: 0,
            },
          },
        ],

        min: {
          type: Number,
          default: null,
        },

        max: {
          type: Number,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FilterDefinition", filterDefinitionSchema);