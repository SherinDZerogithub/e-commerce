import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  tagRelated: [],
  // Features detected for the last image search
  imageConcepts: [],
};

const COLOR_FAMILIES = [
  { name: "red", hue: 0 },
  { name: "orange", hue: 30 },
  { name: "yellow", hue: 55 },
  { name: "green", hue: 120 },
  { name: "cyan", hue: 180 },
  { name: "blue", hue: 225 },
  { name: "purple", hue: 275 },
  { name: "pink", hue: 320 },
];

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { hue: 0, saturation: 0, lightness };
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue;

  switch (max) {
    case r:
      hue = (g - b) / delta + (g < b ? 6 : 0);
      break;
    case g:
      hue = (b - r) / delta + 2;
      break;
    default:
      hue = (r - g) / delta + 4;
  }

  return { hue: hue * 60, saturation, lightness };
}

function closestColorFamily(hue) {
  return COLOR_FAMILIES.reduce((closest, color) => {
    const distance = Math.min(
      Math.abs(hue - color.hue),
      360 - Math.abs(hue - color.hue)
    );

    return distance < closest.distance ? { ...color, distance } : closest;
  }, { name: "red", distance: 360 }).name;
}

async function extractImageFeatures(imageFile) {
  const objectUrl = URL.createObjectURL(imageFile);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = objectUrl;
    });

    const sampleSize = 64;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const scale = Math.min(sampleSize / image.width, sampleSize / image.height, 1);
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      const alpha = pixels[index + 3];
      if (alpha < 80) continue;

      red += pixels[index];
      green += pixels[index + 1];
      blue += pixels[index + 2];
      count += 1;
    }

    if (!count) return {};

    const avgRed = Math.round(red / count);
    const avgGreen = Math.round(green / count);
    const avgBlue = Math.round(blue / count);
    const hsl = rgbToHsl(avgRed, avgGreen, avgBlue);
    let colorFamily = closestColorFamily(hsl.hue);

    if (hsl.lightness < 0.16) colorFamily = "black";
    else if (hsl.lightness > 0.9 && hsl.saturation < 0.25) colorFamily = "white";
    else if (hsl.saturation < 0.16) colorFamily = "gray";
    else if (hsl.hue >= 20 && hsl.hue <= 45 && hsl.lightness < 0.55) {
      colorFamily = "brown";
    }

    const labels = imageFile.name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .split(/[^a-z0-9]+/)
      .filter((label) => label.length > 2);

    return {
      colorFamily,
      brightness:
        hsl.lightness > 0.68 ? "light" : hsl.lightness < 0.32 ? "dark" : "medium",
      saturation: hsl.saturation > 0.55 ? "colorful" : "neutral",
      orientation:
        image.width > image.height * 1.15
          ? "wide"
          : image.height > image.width * 1.15
          ? "tall"
          : "square",
      labels,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const getSearchResults = createAsyncThunk(
  "/search/getSearchResults",
  async (keyword) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/search/${keyword}`
    );

    return response.data;
  }
);

/**
 * Visual / image search.
 * Accepts a File object, extracts simple browser-side image features, and sends
 * both the file and features to the backend for local product matching.
 */
export const imageSearchProducts = createAsyncThunk(
  "/search/imageSearchProducts",
  async (imageFile, { rejectWithValue }) => {
    try {
      const features = await extractImageFeatures(imageFile).catch(() => ({}));
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("features", JSON.stringify(features));

      const response = await axios.post(
        "http://localhost:5000/api/shop/search/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Image search failed"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.tagRelated = [];
      state.imageConcepts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Text search ──────────────────────────────────────────────────────
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.tagRelated = action.payload.tagRelated || [];
        state.imageConcepts = [];
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
        state.tagRelated = [];
      })
      // ── Image search ─────────────────────────────────────────────────────
      .addCase(imageSearchProducts.pending, (state) => {
        state.isLoading = true;
        state.imageConcepts = [];
      })
      .addCase(imageSearchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.tagRelated = action.payload.tagRelated || [];
        state.imageConcepts = action.payload.concepts || [];
      })
      .addCase(imageSearchProducts.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
        state.tagRelated = [];
        state.imageConcepts = [];
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
