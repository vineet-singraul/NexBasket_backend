const LENGTH_OPTIONS = {
  short: { words: 50, maxOutputTokens: 150 },
  long: { words: 80, maxOutputTokens: 220 },
  extralong: { words: 120, maxOutputTokens: 300 },
};

const generateShortDescription = async (req, res) => {
  try {
    const { productName, length } = req.params;

    // Validation
    if (!productName || productName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const normalizedLength = (length || "").toLowerCase().replace(/[^a-z]/g, "");
    const lengthConfig = LENGTH_OPTIONS[normalizedLength];

    if (!lengthConfig) {
      return res.status(400).json({
        success: false,
        message: "Length must be one of: Short, Long, Extra Long",
      });
    }

    const prompt = `You are a professional e-commerce copywriter. Write a compelling product description for the following product in exactly ${lengthConfig.words} words. Focus on key features, benefits, and what makes it appealing to a buyer. Keep the tone persuasive but factual — no exaggeration, no fake claims. Do not repeat the product name unnecessarily.\n\nProduct: ${productName}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topP: 0.9,
            maxOutputTokens: lengthConfig.maxOutputTokens,
          },
        }),
      }
    );

    const data = await response.json();

    // Agar Gemini se error aaya
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data?.error?.message || "Failed to generate description",
      });
    }

    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!description) {
      return res.status(500).json({
        success: false,
        message: "No description generated",
      });
    }

    return res.status(200).json({
      success: true,
      description: description.trim(),
    });
  } catch (error) {
    console.error("Error generating description:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating description",
    });
  }
};

module.exports = { generateShortDescription };