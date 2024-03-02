const economyCar = require("../models/economyCar");
const luxuryCar = require("../models/luxuryCar");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [numEconomyModels, numLuxuryModels] = await Promise.all([
    economyCar.countDocuments({}).exec(),
    luxuryCar.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Showroom Inventory Home",
    economyCars: numEconomyModels,
    luxuryCars: numLuxuryModels,
    totalCars: numEconomyModels + numLuxuryModels,
  });
});

// Display list of all economyCars.
exports.economyCar_list = asyncHandler(async (req, res, next) => {
  const allEconomyCars = await economyCar
    .find({}, "model manufacturer stock price")
    .sort({ price: 1 })
    .populate("manufacturer stock price")
    .exec();

  res.render("economyCar_list", {
    title: "Economy Car List",
    economyCar_list: allEconomyCars,
  });
});

// Display detail page for a specific economyCar.
exports.economyCar_detail = asyncHandler(async (req, res, next) => {
  // Get details of economy car
  const [EconomyCar] = await Promise.all([
    economyCar
      .findById(req.params.id)
      .populate("model")
      .populate("manufacturer")
      .populate("type")
      .populate("seats")
      .populate("luggageVolume")
      .populate("price")
      .populate("stock")
      .exec(),
  ]);

  if (EconomyCar === null) {
    // No results.
    const err = new Error("Car not found");
    err.status = 404;
    return next(err);
  }

  res.render("economyCar_detail", {
    title: EconomyCar.manufacturer + " " + EconomyCar.model,
    economyCar: EconomyCar,
  });
});

// Display economyCar create form on GET.
exports.economyCar_create_get = asyncHandler(async (req, res, next) => {
  res.render("economyCar_form", { title: "Add Economy Car" });
});

// Handle economyCar create on POST.
exports.economyCar_create_post = [
  // Validate and sanitize the name field.
  body("model", "economy car model must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "manufacturer",
    "economy car manufacturer must contain at least 3 characters"
  )
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("type", "economy car type must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("seats", "economy car seats must contain only 1 characters")
    .trim()
    .isLength({ max: 1 })
    .escape(),
  body(
    "luggageVolume",
    "economy car luggage volume must contain atleast 2 characters"
  )
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("price", "economy car luggage volume must contain atleast 4 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("stock", "economy car stock must contain atleast 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const EconomyCar = new economyCar({
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      type: req.body.type,
      seats: req.body.seats,
      luggageVolume: req.body.luggageVolume,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("economyCar_form", {
        title: "Add Economy Car",
        economyCar: economyCar,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const economyCarExists = await economyCar
        .findOne({ model: req.body.model })
        .exec();
      if (economyCarExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(economyCarExists.url);
      } else {
        await EconomyCar.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(EconomyCar.url);
      }
    }
  }),
];

// Display economyCar delete form on GET.
exports.economyCar_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [EconomyCar] = await Promise.all([
    economyCar.findById(req.params.id).exec(),
  ]);

  if (EconomyCar === null) {
    // No results.
    res.redirect("/catalog/economyCar");
  }

  res.render("economyCar_delete", {
    title: "Delete Economy Car",
    economyCar: EconomyCar,
  });
  console.log(EconomyCar);
});

// Handle economyCar delete on POST.
exports.economyCar_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of authors.
  console.log(req.body);
  await economyCar.findByIdAndDelete(req.body.economyCarid);
  res.redirect("/catalog/economyCar");
});

// Display economyCar update form on GET.
exports.economyCar_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const [EconomyCar] = await Promise.all([
    economyCar.findById(req.params.id).populate("model").exec(),
  ]);

  if (EconomyCar === null) {
    // No results.
    const err = new Error("Economy Car not found");
    err.status = 404;
    return next(err);
  }

  res.render("economyCar_form", {
    title: "Update Economy Car",
    economyCar: EconomyCar,
  });

  console.log(EconomyCar);
});

// Handle economyCar update on POST.
exports.economyCar_update_post = [
  // Validate and sanitize fields.
  body("model", "economy car model must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "manufacturer",
    "economy car manufacturer must contain at least 3 characters"
  )
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("type", "economy car type must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("seats", "economy car seats must contain only 1 characters")
    .trim()
    .isLength({ max: 1 })
    .escape(),
  body(
    "luggageVolume",
    "economy car luggage volume must contain atleast 2 characters"
  )
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("price", "economy car luggage volume must contain atleast 4 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("stock", "economy car stock must contain atleast 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const EconomyCar = new economyCar({
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      type: req.body.type,
      seats: req.body.seats,
      luggageVolume: req.body.luggageVolume,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      // Get all economy cars for form
      const [economyCar] = await Promise.all([
        economyCar.find().sort({ model: 1 }).exec(),
      ]);

      res.render("economyCar_form", {
        title: "Add Economy Car",
        economyCar: EconomyCar,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedEconomyCar = await economyCar.findByIdAndUpdate(
        req.params.id,
        EconomyCar,
        {}
      );
      // Redirect to economy car detail page.
      res.redirect(updatedEconomyCar.url);
    }
  }),
];
