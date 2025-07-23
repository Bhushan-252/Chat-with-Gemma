export function formatHumanTime(isoDateStr, flag = false) {
  const date = new Date(isoDateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const minutePadded = String(minutes).padStart(2, "0");

  const timeStr = `${hour12}:${minutePadded} ${ampm}`;

  if (isToday) {
    return timeStr;
  } else if (isYesterday) {
    return !flag ? "Yesterday" : `Yesterday at ${timeStr}`;
  } else {
    const dateStr = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return !flag ? dateStr : `${dateStr} at ${timeStr}`;
  }
}

export function extractTitleFromText(text) {
  const stopWords = [
    "the",
    "is",
    "and",
    "to",
    "of",
    "in",
    "with",
    "a",
    "an",
    "this",
    "that",
  ];
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "") // remove punctuation
    .split(/\s+/)
    .filter((word) => word && !stopWords.includes(word))
    .slice(0, 5); // top 5 keywords

  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}
