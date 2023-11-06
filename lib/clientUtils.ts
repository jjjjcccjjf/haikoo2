import { syllable } from "syllable";

export interface IsHaikuResponse {
  status: boolean;
  message: string;
}

export function isHaiku(text: string): IsHaikuResponse {
  const data = {
    status: false,
    message: "",
  };

  // Remove leading and trailing whitespace
  text = text.trim();

  // Split the text into lines
  const lines = text.split("\n");

  // Define the syllable count for each line
  const syllableCounts = [5, 7, 5];

  // Check if there are exactly 3 lines (5-7-5 syllable structure)
  if (lines.length > 3) {
    data.message = `Line breaks must be exactly 3. Your line breaks: ${lines.length}.`;
    return data;
  }

  // Check each line for the correct syllable count
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const syllables = syllable(line);

    if (syllables !== syllableCounts[i]) {
      data.message = `Must have exactly ${
        syllableCounts[i]
      } syllables on line ${++i}. Current syllable count: ${syllables}.`;
      return data;
    }
  }

  // Enforce exactly 3 lines (5-7-5 syllable structure)
  if (lines.length !== 3) {
    data.message = `Line breaks must be exactly 3. Your line breaks: ${lines.length}.`;
    return data;
  }

  data.status = true;
  data.message = "OK";
  return data;
}
