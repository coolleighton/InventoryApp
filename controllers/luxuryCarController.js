const economyCar = require("../models/economyCar");
const luxuryCar = require("../models/luxuryCar");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all luxuryCars.
exports.luxuryCar_list = asyncHandler(async (req, res, next) => {
  const allLuxuryCars = await luxuryCar
    .find({}, "model manufacturer stock price")
    .sort({ price: 1 })
    .populate("manufacturer stock price")
    .exec();

  res.render("luxuryCar_list", {
    title: "Luxury Car List",
    luxuryCar_list: allLuxuryCars,
  });
});

// Display detail page for a specific luxuryCar.
exports.luxuryCar_detail = asyncHandler(async (req, res, next) => {
  // Get details of economy car
  const [LuxuryCar] = await Promise.all([
    luxuryCar
      .findById(req.params.id)
      .populate("model")
      .populate("manufacturer")
      .populate("type")
      .populate("price")
      .populate("power")
      .populate("engine")
      .populate("stock")
      .exec(),
  ]);

  if (LuxuryCar === null) {
    // No results.
    const err = new Error("Car not found");
    err.status = 404;
    return next(err);
  }

  res.render("luxuryCar_detail", {
    title: LuxuryCar.manufacturer + " " + LuxuryCar.model,
    luxuryCar: LuxuryCar,
  });
});

// Display economyCar create form on GET.
exports.luxuryCar_create_get = asyncHandler(async (req, res, next) => {
  res.render("luxuryCar_form", { title: "Add Luxury Car" });
});

// Handle economyCar create on POST.
exports.luxuryCar_create_post = [
  // Validate and sanitize the name field.
  body("model", "luxury car model must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "manufacturer",
    "luxury car manufacturer must contain at least 3 characters"
  )
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("type", "luxury car type must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("power", "luxury car power must contain only 1 characters")
    .trim()
    .isLength({ max: 4 })
    .escape(),
  body("engine", "luxury car engine must contain atleast 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("price", "luxury car luggage volume must contain atleast 4 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("stock", "luxury car stock must contain atleast 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const LuxuryCar = new luxuryCar({
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      type: req.body.type,
      power: req.body.power,
      engine: req.body.engine,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("luxuryCar_form", {
        title: "Add Luxury Car",
        luxuryCar: LuxuryCar,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const luxuryCarExists = await luxuryCar
        .findOne({ model: req.body.model })
        .exec();
      if (luxuryCarExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(luxuryCarExists.url);
      } else {
        await LuxuryCar.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(LuxuryCar.url);
      }
    }
  }),
];

// Display luxuryCar delete form on GET.
exports.luxuryCar_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of luxury and all their books (in parallel)
  const [LuxuryCar] = await Promise.all([
    luxuryCar.findById(req.params.id).exec(),
  ]);

  if (LuxuryCar === null) {
    // No results.
    res.redirect("/catalog/luxuryCar");
  }

  res.render("luxuryCar_delete", {
    title: "Delete Luxury Car",
    luxuryCar: LuxuryCar,
  });
  console.log(LuxuryCar);
});

// Handle luxuryCar delete on POST.
exports.luxuryCar_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of authors.
  console.log(req.body);
  await luxuryCar.findByIdAndDelete(req.body.luxuryCarid);
  res.redirect("/catalog/luxuryCar");
});

// Display luxuryCar update form on GET.
exports.luxuryCar_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const [LuxuryCar] = await Promise.all([
    luxuryCar.findById(req.params.id).populate("model").exec(),
  ]);

  if (LuxuryCar === null) {
    // No results.
    const err = new Error("Luxury Car not found");
    err.status = 404;
    return next(err);
  }

  res.render("luxuryCar_form", {
    title: "Update Luxury Car",
    luxuryCar: LuxuryCar,
  });

  console.log(LuxuryCar);
});

// Handle economyCar update on POST.
exports.luxuryCar_update_post = [
  // Validate and sanitize fields.
  body("model", "luxury car model must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "manufacturer",
    "luxury car manufacturer must contain at least 3 characters"
  )
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("type", "luxury car type must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("power", "luxury car power must contain only 1 characters")
    .trim()
    .isLength({ max: 4 })
    .escape(),
  body("engine", "luxury car engine must contain atleast 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("price", "luxury car price must contain atleast 4 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("stock", "luxury car stock must contain atleast 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const LuxuryCar = new luxuryCar({
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      type: req.body.type,
      power: req.body.power,
      engine: req.body.engine,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      // Get all economy cars for form
      const [luxuryCar] = await Promise.all([
        luxuryCar.find().sort({ model: 1 }).exec(),
      ]);

      res.render("luxuryCar_form", {
        title: "Add Luxury Car",
        luxuryCar: LuxuryCar,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedLuxuryCar = await luxuryCar.findByIdAndUpdate(
        req.params.id,
        LuxuryCar,
        {}
      );
      // Redirect to economy car detail page.
      res.redirect(updatedLuxuryCar.url);
    }
  }),
];
