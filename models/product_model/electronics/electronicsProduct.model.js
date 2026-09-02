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

      cellular: {
        type: Boolean,
        default: false,
      },

      gps: {
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

    // ---------- Battery ----------
    battery: {
      capacity: {
        type: Number,
        min: 0,
      },

      capacityUnit: {
        type: String,
        enum: ["mAh", "Wh"],
        default: "mAh",
      },

      batteryType: {
        type: String,
        trim: true,
      },

      batteryLifeHours: {
        type: Number,
        min: 0,
      },

      removable: {
        type: Boolean,
        default: false,
      },
    },

    // ---------- Display ----------
    display: {
      screenSize: {
        type: Number,
        min: 0,
      },

      screenSizeUnit: {
        type: String,
        enum: ["inch", "cm"],
        default: "inch",
      },

      resolution: {
        type: String,
        trim: true,
      },

      displayType: {
        type: String,
        enum: ["LED", "OLED", "AMOLED", "LCD", "QLED", "Retina", "Other"],
      },

      touchScreen: {
        type: Boolean,
        default: false,
      },

      refreshRate: {
        type: Number,
        min: 0,
      },
    },

    // ---------- Memory & Storage ----------
    memory: {
      ram: {
        type: Number,
        min: 0,
      },

      ramUnit: {
        type: String,
        enum: ["MB", "GB"],
        default: "GB",
      },

      internalStorage: {
        type: Number,
        min: 0,
      },

      storageUnit: {
        type: String,
        enum: ["MB", "GB", "TB"],
        default: "GB",
      },

      expandable: {
        type: Boolean,
        default: false,
      },

      maxExpandableStorage: {
        type: Number,
        min: 0,
      },
    },

    // ---------- Processor ----------
    processor: {
      brand: {
        type: String,
        trim: true,
      },

      name: {
        type: String,
        trim: true,
      },

      cores: {
        type: Number,
        min: 0,
      },

      speed: {
        type: Number,
        min: 0,
      },

      speedUnit: {
        type: String,
        enum: ["MHz", "GHz"],
        default: "GHz",
      },
    },

    // ---------- Operating System ----------
    os: {
      name: {
        type: String,
        trim: true,
      },

      version: {
        type: String,
        trim: true,
      },
    },

    // ---------- Smart Features ----------
    smartFeatures: {
      isSmart: {
        type: Boolean,
        default: false,
      },

      voiceAssistants: [
        {
          type: String,
          trim: true,
        },
      ],

      appControl: {
        type: Boolean,
        default: false,
      },
    },

    // ---------- Durability / Ratings ----------
    ipRating: {
      type: String,
      trim: true,
    },

    energyRating: {
      type: String,
      enum: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"],
    },

    sensors: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ElectronicsProduct",
  electronicsProductSchema
);