async function hidePostsWithKeywords() {
  const { keywords = ["nubank", "roxinho"], enabled = true } = await chrome.storage.sync.get(["keywords", "enabled"]);

  if (!enabled) {
    console.log("cale-a-boqui: desativado");
    return;
  }

  const posts = document.querySelectorAll('div.feed-shared-update-v2, article');
  posts.forEach(post => {
    const text = post.innerText.toLowerCase();
    const shouldHide = keywords.some(keyword => text.includes(keyword.toLowerCase()));
    if (shouldHide) {
      post.style.display = "none";
    }
  });

  console.log(`cale-a-boqui: hide [${keywords.join(", ")}]`);
}

hidePostsWithKeywords();

const observer = new MutationObserver(hidePostsWithKeywords);
observer.observe(document.body, { childList: true, subtree: true });
