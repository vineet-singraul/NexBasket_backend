const { model } = require("mongoose");

const checkCategortExiste = async (userWrittenCategory, existCategory) => {
  const prompt = `
        You are an advanced e-commerce category validation engine.

        Your task is to determine whether a NEW CATEGORY entered by an administrator
        can be created as a TOP-LEVEL CATEGORY when a list of EXISTING TOP-LEVEL
        CATEGORIES already exists in the database.

        You must work dynamically for ANY category type.

        Do NOT assume specific categories such as Electronics, Grocery, Furniture,
        Office, Fashion, etc.

        The category names can represent any product domain.

        ==================================================
        NEW CATEGORY
        ==================================================

        "${userWrittenCategory}"

        ==================================================
        EXISTING TOP-LEVEL CATEGORIES
        ==================================================

        ${JSON.stringify(existCategory)}

        ==================================================
        CORE RULE
        ==================================================

        A new category must NOT be created if it is:

        1. The same as an existing category.
        2. A spelling variation of an existing category.
        3. A singular/plural variation.
        4. A synonym of an existing category.
        5. A broader version of an existing category.
        6. A narrower version of an existing category.
        7. A child/subcategory of an existing category.
        8. A product type that naturally belongs inside an existing category.
        9. A subtype or specialization of an existing category.
        10. A strongly semantically related category that would logically belong
            under an existing top-level category.

        The purpose is to prevent administrators from creating a second TOP-LEVEL
        category when the new category should logically belong inside an existing
        top-level category.

        ==================================================
        IMPORTANT SEMANTIC RULE
        ==================================================

        Do NOT only compare the words.

        Understand the real-world meaning of the categories.

        For example, if an existing category represents a broad product domain and
        the new category represents a product type normally sold or classified under
        that domain, the new category should be rejected as a top-level category.

        This rule must work dynamically for ANY domain.

        Do NOT hard-code category-specific relationships.

        ==================================================
        PARENT → CHILD RELATIONSHIP
        ==================================================

        Determine whether:

        Existing Category
                ↓
        New Category

        would naturally form a parent → child relationship.

        If YES, reject the new category as a top-level category.

        ==================================================
        CATEGORY OVERLAP
        ==================================================

        Also reject the new category if customers would reasonably expect it to be
        classified under an existing category.

        The new category should be rejected when it would create:

        - duplicate classification
        - overlapping classification
        - redundant category structure
        - confusing category navigation
        - parent/child category conflict
        - product-type/category conflict

        ==================================================
        DO NOT OVER-REJECT
        ==================================================

        Do NOT reject a category merely because:

        - it is used with an existing category
        - it is purchased by the same type of customer
        - it belongs to the same broad marketplace
        - it has a weak conceptual relationship
        - one word happens to be similar

        There must be a meaningful semantic relationship.

        ==================================================
        IMPORTANT CATEGORY-LEVEL RULE
        ==================================================

        The EXISTING CATEGORIES represent TOP-LEVEL categories.

        Therefore, if the NEW CATEGORY is naturally a subcategory, product type,
        subtype, specialization, or child of an existing top-level category,
        return:

        allowed: false

        Even if the names are completely different.

        For example, semantic reasoning must be able to identify relationships such as:

        Existing broad category
                ↓
        New specific product category

        without relying on keyword matching.

        ==================================================
        CHECK ALL EXISTING CATEGORIES
        ==================================================

        Compare the new category against EVERY category in the provided list.

        Do not stop after checking only the first category.

        Find the strongest semantic match.

        Never invent a category that does not exist in the provided database list.

        ==================================================
        DECISION
        ==================================================

        Return:

        allowed: true

        ONLY if the new category is sufficiently independent and does not naturally
        belong under any existing top-level category.

        Return:

        allowed: false

        if the new category is:

        - duplicate
        - synonym
        - spelling variation
        - singular/plural variation
        - parent
        - child
        - subcategory
        - subtype
        - product type
        - specialization
        - strongly overlapping category
        - naturally belonging under an existing top-level category

        ==================================================
        OUTPUT FORMAT
        ==================================================

        Return ONLY valid JSON.

        Do not return markdown.
        Do not return explanations outside JSON.
        Do not return code fences.

        If allowed:

        {
        "allowed": true,
        "matchedCategory": null,
        "relationship": "none",
        "reason": "The new category is independent from the existing top-level categories.",
        "confidence": 0.94
        }

        If rejected:

        {
        "allowed": false,
        "matchedCategory": "EXACT CATEGORY FROM DATABASE",
        "relationship": "child_category",
        "reason": "The new category naturally belongs under an existing top-level category.",
        "confidence": 0.96
        }

        ==================================================
        ALLOWED RELATIONSHIP VALUES
        ==================================================

        Use exactly one:

        "exact_match"
        "same_category"
        "singular_plural"
        "spelling_variation"
        "synonym"
        "parent_category"
        "child_category"
        "subcategory"
        "product_type"
        "subtype"
        "specialization"
        "semantic_overlap"
        "none"

        ==================================================
        CONFIDENCE
        ==================================================

        Return a number from 0 to 1.

        0.90 - 1.00 = very high confidence
        0.75 - 0.89 = high confidence
        0.50 - 0.74 = moderate confidence
        below 0.50 = low confidence

        ==================================================
        FINAL TASK
        ==================================================

        Analyze the NEW CATEGORY against ALL EXISTING TOP-LEVEL CATEGORIES.

        Determine whether the new category can safely exist as another TOP-LEVEL
        CATEGORY.

        If it naturally belongs inside an existing category, reject it.

        Return ONLY the JSON object.
    `;

  const response = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "command-a-03-2025",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: userWrittenCategory,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Cohere API Error:", data);
    throw new Error(data?.message || "Category validation request failed.");
  }

  const generatedText = (data?.message?.content?.[0]?.text || "")
    .replace(/```json|```/g, "")
    .trim();

  try {
    return JSON.parse(generatedText);
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError);
    console.error("Cohere Response:", generatedText);
    throw new Error("Category validation returned invalid JSON.");
  }
};

const checkUserAdressesIsValid = async (
  lattitude,
  logitude,
  AdressIs,
  fullAdress,
  AdressConfirm,
  LandMark,
) => {
  const prompt = `
        You are an Advanced AI Address Intelligence,
        Address Correction and Delivery Location Analysis System.

        Your task is to analyze the actual user-provided address
        data and return the most accurate possible delivery address.

        IMPORTANT:
        You will receive six dynamically generated input fields
        from the user. You MUST read and analyze ALL six fields
        before generating your response.

        DYNAMIC INPUT FIELDS:

        1. lattitude
        2. logitude
        3. AdressIs
        4. fullAdress
        5. AdressConfirm
        6. LandMark

        HOW TO ANALYZE THE DATA:

        STEP 1: READ ALL INPUTS

        Read the actual values of:
        - ${lattitude}
        - ${logitude}
        - ${AdressIs}
        - ${fullAdress}
        - ${AdressConfirm}
        - ${LandMark}

        Never assume that these fields contain fixed values.

        STEP 2: UNDERSTAND THE LOCATION

        Analyze latitude and longitude as geographical coordinates.

        Understand the dynamically generated fullAdress
        and identify its available address components.

        Analyze AdressConfirm to identify:
        - House number
        - Flat number
        - Floor number
        - Building name
        - Apartment name

        Analyze LandMark to identify nearby landmarks.

        STEP 3: ADDRESS ACCURACY

        Compare all available address information.

        Identify:
        - Correct house or flat number
        - Correct building name
        - Correct floor
        - Correct street or road
        - Correct locality
        - Correct city
        - Correct state
        - Correct PIN code
        - Correct country
        - Correct landmark

        Correct spelling mistakes and formatting errors.

        Remove unnecessary duplicate information.

        Combine related address details only when they
        clearly refer to the same location.

        STEP 4: NUMERIC ADDRESS ANALYSIS

        Sometimes the user may provide only numeric values
        or incomplete address information.

        Examples:
        - House number only
        - Flat number only
        - Building number
        - PIN code
        - House number with locality

        Understand the meaning of numeric values using
        all available input fields.

        Never confuse a house number with a PIN code.

        Never invent missing address details.

        If exact building or house-level information
        is unavailable, preserve the available information
        without claiming pinpoint accuracy.

        STEP 5: DYNAMIC ADDRESS PRESERVATION

        The incoming address is dynamically generated.

        NEVER hardcode any city, state, country,
        building, landmark, street or PIN code.

        NEVER replace the user's actual address with
        an example or assumed address.

        Preserve genuine user-provided house, flat,
        floor and building details.

        Do not discard useful information.

        STEP 6: LOCATION CONSISTENCY

        Use latitude and longitude to understand
        the geographical location.

        If a reverse-geocoded address is provided,
        compare it with the user-provided address.

        If the information conflicts:
        - Do not guess.
        - Do not fabricate.
        - Preserve reliable original information.
        - Do not claim that the address is verified.

        Coordinates alone cannot establish an exact
        house or apartment address.

        STEP 7: FINAL OUTPUT

        Return exactly these three fields:

        1. fullAdress:
        The most complete and properly formatted
        delivery address using all reliable information.

        2. AdressConfirm:
        The corrected house, flat, floor or building
        address while preserving original details.

        3. LandMark:
        The corrected landmark provided by the user.

        If a field has no reliable information,
        return an empty string.

        STRICT OUTPUT FORMAT:

        Return ONLY valid JSON.

        {
          "fullAdress": "",
          "AdressConfirm": "",
          "LandMark": ""
        }

        FINAL RULES:

        - Read all six dynamically passed input fields.
        - Analyze all fields together.
        - Never assume fixed address values.
        - Never invent an address.
        - Never invent a house number or landmark.
        - Never change the actual meaning of the address.
        - Return only the three requested JSON fields.
        - No explanations.
        - No markdown.
        - No additional properties.

        Your highest priority is accurate delivery address
        normalization, location consistency and preservation
        of the user's original address information.
       `;

  const response = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "command-a-03-2025",
      // Cohere ko force karo ki sirf valid JSON object hi return kare
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `
    Analyze the following actual dynamic user data:

    ${JSON.stringify(
      {
        lattitude,
        logitude,
        AdressIs,
        fullAdress,
        AdressConfirm,
        LandMark,
      },
      null,
      2,
    )}

    Read all six fields and return the required JSON.
  `,
        },
      ],
    }),
  });

  // Response ko text mein read karo
  const responseText = await response.text();


  // Empty response check
  if (!responseText) {
    throw new Error("Cohere API returned an empty response");
  }

  // JSON parsing safely
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (error) {
    throw new Error("Cohere API returned invalid JSON");
  }

  // API error check (401, 429, 500 etc.)
  if (!response.ok) {
    throw new Error(
      `Cohere API error (${response.status}): ${data.message || responseText}`,
    );
  }

  const aiResponse = data?.message?.content?.[0]?.text;

  if (!aiResponse) {
    throw new Error("Cohere API response has no text content");
  }

  // AI kabhi kabhi JSON ke aage/peeche extra text ya ``` bhej deta hai, sirf {...} wala part nikalo
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  const cleanedResponse = jsonMatch ? jsonMatch[0] : aiResponse.trim();

  let result;

  try {
    result = JSON.parse(cleanedResponse);
  } catch (error) {
    console.log("AI raw response:", aiResponse);
    throw new Error("AI returned invalid JSON");
  }

  return result;
};

module.exports = { checkCategortExiste, checkUserAdressesIsValid };
