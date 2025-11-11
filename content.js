async function hidePostsWithKeywords() {
  const { keywords = ["nubank", "roxinho"], enabled = true } = await chrome.storage.sync.get([
    "keywords",
    "enabled",
  ]);

  if (!enabled) {
    console.log("cale-a-boqui: desativado");
    return;
  }

  const keywordList = Array.isArray(keywords) ? keywords : [];
  const matchers = keywordList.map(createMatcher);
  const posts = document.querySelectorAll("div.feed-shared-update-v2, article");
  posts.forEach(post => {
    const text = post.innerText || "";
    const lowerText = text.toLowerCase();
    const shouldHide = matchers.some(matcher => matcher.matches(text, lowerText));
    if (shouldHide) {
      post.style.display = "none";
    }
  });

  console.log(`cale-a-boqui: hide [${keywordList.join(", ")}]`);
}

hidePostsWithKeywords();

const observer = new MutationObserver(hidePostsWithKeywords);
observer.observe(document.body, { childList: true, subtree: true });

function createMatcher(keyword) {
  const trimmed = keyword.trim();

  if (trimmed.startsWith("/") && trimmed.length > 1) {
    const lastSlash = trimmed.lastIndexOf("/");
    if (lastSlash > 0) {
      const pattern = trimmed.slice(1, lastSlash);
      const flags = trimmed.slice(lastSlash + 1);
      try {
        const regex = new RegExp(pattern, flags || "i");
        return {
          matches: text => regex.test(text),
        };
      } catch (error) {
        console.warn(`cale-a-boqui: regex inválida "${trimmed}", usando busca simples.`, error);
      }
    }
  }

  const lowerKeyword = trimmed.toLowerCase();
  return {
    matches: (_, lowerText) => lowerText.includes(lowerKeyword),
  };
}
