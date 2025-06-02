const express = require("express");
const { 
  Article, 
  History, 
  ProductIngredient, 
  ProductNote, 
  Wishlist, 
  Test, 
  ProductReaction, 
  IngredientReaction 
} = require("./models");
const { authenticateUser } = require("./middleware");

const router = express.Router();

// Rutas de Artículos (protegidas)
router.get("/articles", authenticateUser, async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/articles", authenticateUser, async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Historia (protegidas)
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const history = await History.find({ userID: req.user.userID });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/history", authenticateUser, async (req, res) => {
  try {
    const history = new History({
      ...req.body,
      userID: req.user.userID
    });
    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Ingredientes (protegidas)
router.get("/productingredients", authenticateUser, async (req, res) => {
  try {
    const ingredients = await ProductIngredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/productingredients", authenticateUser, async (req, res) => {
  try {
    const ingredient = new ProductIngredient(req.body);
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Notas de Producto (protegidas)
router.get("/productnotes", authenticateUser, async (req, res) => {
  try {
    const notes = await ProductNote.find({ userID: req.user.userID });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/productnotes", authenticateUser, async (req, res) => {
  try {
    const note = new ProductNote({
      ...req.body,
      userID: req.user.userID
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing product note
router.put("/productnotes/:id", authenticateUser, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { note, rating } = req.body;
    
    // Find the note by ID and ensure it belongs to the authenticated user
    const existingNote = await ProductNote.findOne({ 
      _id: noteId,
      userID: req.user.userID 
    });
    
    if (!existingNote) {
      return res.status(404).json({ error: "Note not found or not authorized to update" });
    }
    
    // Update the note
    existingNote.note = note;
    if (rating !== undefined) {
      existingNote.rating = rating;
    }
    
    await existingNote.save();
    res.json(existingNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Wishlist (protegidas)
router.get("/wishlist", authenticateUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userID: req.user.userID });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/wishlist", authenticateUser, async (req, res) => {
  try {
    const item = new Wishlist({
      ...req.body,
      userID: req.user.userID
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE wishlist item endpoint
router.delete("/wishlist/:id", authenticateUser, async (req, res) => {
  try {
    const wishlistItemId = req.params.id;
    
    // Find the wishlist item
    const wishlistItem = await Wishlist.findOne({ 
      _id: wishlistItemId,
      userID: req.user.userID // Ensure the item belongs to the authenticated user
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }
    
    // Delete the item
    await Wishlist.deleteOne({ _id: wishlistItemId });
    
    res.json({ 
      message: "Item removed from wishlist successfully",
      id: wishlistItemId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's active tests
router.get("/tests", authenticateUser, async (req, res) => {
  try {
    const tests = await Test.find({ userID: req.user.userID });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start a new test
router.post("/tests", authenticateUser, async (req, res) => {
  try {
    const { itemID } = req.body;
    
    if (!itemID) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    
    // Check if there's already an active test for this product
    const existingTest = await Test.findOne({ 
      userID: req.user.userID,
      itemID,
      completed: false
    });
    
    if (existingTest) {
      return res.status(400).json({ error: "Test already in progress for this product" });
    }
    
    // Create a new test with 3-day duration
    const startDate = new Date();
    const finishDate = new Date(startDate);
    finishDate.setDate(finishDate.getDate() + 3); // 3-day test
    
    const test = new Test({
      userID: req.user.userID,
      itemID,
      startDate,
      finishDate,
      completed: false
    });
    
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete a test
router.put("/tests/:id", authenticateUser, async (req, res) => {
  try {
    const testId = req.params.id;
    const { result } = req.body;
    
    const test = await Test.findOne({ 
      _id: testId,
      userID: req.user.userID
    });
    
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }
    
    test.completed = true;
    if (result) {
      test.result = result;
    }
    
    await test.save();
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product reactions
router.get("/product-reactions", authenticateUser, async (req, res) => {
  try {
    const reactions = await ProductReaction.find({ userID: req.user.userID });
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save product reaction
router.post("/product-reactions", authenticateUser, async (req, res) => {
  try {
    const { productID, reaction } = req.body;
    
    // Check if reaction already exists for this product
    let existingReaction = await ProductReaction.findOne({
      userID: req.user.userID,
      productID
    });
    
    if (existingReaction) {
      // Update existing reaction
      existingReaction.reaction = reaction;
      await existingReaction.save();
      res.json(existingReaction);
    } else {
      // Create new reaction
      const newReaction = new ProductReaction({
        userID: req.user.userID,
        productID,
        reaction
      });
      
      await newReaction.save();
      res.status(201).json(newReaction);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product reaction
router.delete("/product-reactions/:productID", authenticateUser, async (req, res) => {
  try {
    const { productID } = req.params;
    
    await ProductReaction.deleteOne({
      userID: req.user.userID,
      productID
    });
    
    res.json({ message: "Reaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ingredient reactions
router.get("/ingredient-reactions", authenticateUser, async (req, res) => {
  console.log("[DEBUG] Received request for /ingredient-reactions");
  console.log("[DEBUG] User ID:", req.user.userID);
  
  try {
    // Find all ingredient reactions for this user
    const reactions = await IngredientReaction.find({ userID: req.user.userID });
    console.log("[DEBUG] Found ingredient reactions:", reactions.length);
    
    // Ensure we're sending JSON content type
    res.setHeader('Content-Type', 'application/json');
    res.json(reactions);
  } catch (error) {
    console.error("[ERROR] Failed to fetch ingredient reactions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save ingredient reaction
router.post("/ingredient-reactions", authenticateUser, async (req, res) => {
  try {
    const { ingredientName, reaction } = req.body;
    
    // Check if reaction already exists for this ingredient
    let existingReaction = await IngredientReaction.findOne({
      userID: req.user.userID,
      ingredientName
    });
    
    if (existingReaction) {
      // Update existing reaction
      existingReaction.reaction = reaction;
      await existingReaction.save();
      res.json(existingReaction);
    } else {
      // Create new reaction
      const newReaction = new IngredientReaction({
        userID: req.user.userID,
        ingredientName,
        reaction
      });
      
      await newReaction.save();
      res.status(201).json(newReaction);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete ingredient reaction
router.delete("/ingredient-reactions/:ingredientName", authenticateUser, async (req, res) => {
  try {
    const { ingredientName } = req.params;
    
    await IngredientReaction.deleteOne({
      userID: req.user.userID,
      ingredientName
    });
    
    res.json({ message: "Ingredient reaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;