const mongoose = require("mongoose");

const electronicsProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBase",
      required: true,
      unique: true,
      index: true,
    },

    deviceType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    deviceCategory: {
      type: String,
      trim: true,
      index: true,
    },

    connectivity: {
      bluetooth: {
        type: Boolean,
        default: false,
      },

      wifi: {
        type: Boolean,
        default: false,
      },

      nfc: {
        type: Boolean,
        default: false,
      },

      usb: {
        type: Boolean,
        default: false,
      },

      hdmi: {
        type: Boolean,
        default: false,
      },

      ethernet: {
        type: Boolean,
        default: false,
      },
    },

    power: {
      powerSource: {
        type: String,
        trim: true,
      },

      voltage: {
        type: Number,
        min: 0,
      },

      powerConsumption: {
        type: Number,
        min: 0,
      },

      powerUnit: {
        type: String,
        enum: ["W", "kW", "mW"],
        default: "W",
      },
    },

    warranty: {
      duration: {
        type: Number,
        min: 0,
      },

      unit: {
        type: String,
        enum: ["days", "months", "years"],
      },

      type: {
        type: String,
        enum: [
          "manufacturer",
          "seller",
          "brand",
          "no_warranty",
        ],
      },

      description: {
        type: String,
        trim: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ElectronicsProduct",
  electronicsProductSchema
);