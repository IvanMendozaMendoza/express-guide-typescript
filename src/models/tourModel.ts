import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [50, "name must be below 50 characters"],
      minlength: [10, "name must be above 10 characters"],
    },
    price: {
      type: Number,
      min: [300, "A tour price must have a minimum value of $300"],
      required: [true, "A tour must have a price"],
    },
    maxGroupSize: {
      type: Number,
      min: 1,
      required: [true, "a tour must have a max group size"],
    },
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    duration: {
      type: Number,
      min: 3,
      required: [true, "a tour must have duration"],
    },
    difficulty: {
      type: String,
      enum: ["medium", "easy", "difficult"],
      required: [true, "a tour must have difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, "a tour must have an image cover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    slug: {
      type: String,
      unique: true,
    },
    discount: {
      type: Number,
      validate: {
        validator(this: mongoose.Document & { price: number }, val: number) {
          // Only running in .save() and .create()
          return this.price > val;
        },
        message: "Price discound must be below original price ({VALUE})",
      },
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return Math.round(this.duration / 7);
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function (next) {
  (this as mongoose.Query<any, any>).populate({
    path: "guides",
    select: "-__v -paswordChangedAt -confirmPassword",
  });

  next();
});

// tourSchema.pre("save", async function (next) {
//   const guides = this.guides.map((id) => User.findById(id));

//   this.guides = await Promise.all(guides);
//   next();
// });
// tourSchema.pre(/^find/, function (this: Query<any, any>) {
//   console.log(this.find());
// });

// tourSchema.pre("aggregate", function (this: Aggregate<any>) {
//   // console.log(this.pipeline());
//   this.pipeline().unshift({ $match: { difficulty: "easy" } });
// });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
