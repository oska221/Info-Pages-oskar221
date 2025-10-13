document.addEventListener("DOMContentLoaded", () => {

  // Expand SUBMENU
  document.querySelectorAll(".menu-header .arrow").forEach(btn => {
    btn.addEventListener("click", toggleMenu);
  });

  // Clicking on the category title
  document.querySelectorAll(".menu-title").forEach(title => {
    title.addEventListener("click", () => loadArticle(title.dataset.path, title));
  });

  // Clicking on an article in the submenu
  document.querySelectorAll(".submenu a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      loadArticle(link.dataset.path, link);
    });
  });

  // Clicking on the logo - opens the main file
  const logo = document.querySelector(".logo");
  logo.addEventListener("click", () => {
    const path = logo.dataset.path;
    if (path) loadArticle(path, logo);
  });

  // Injecting CSS into the iframe
  const iframe = document.getElementById("content-frame");
  iframe.addEventListener("load", () => injectStylesIntoIframe(iframe));
});

function toggleMenu(e) {
  const arrow = e.currentTarget;
  const submenu = arrow.closest(".menu-item").querySelector(".submenu");
  const icon = arrow.querySelector(".material-symbols-outlined");

  if (submenu.style.maxHeight) {
    submenu.style.maxHeight = null;
    icon.textContent = "chevron_right";
  } else {
    submenu.style.maxHeight = submenu.scrollHeight + "px";
    icon.textContent = "expand_more";
  }
}

function loadArticle(path, element) {
  // Remove active state from all elements
  document.querySelectorAll(".menu-title, .submenu a").forEach(el => el.classList.remove("active"));

  // Set the clicked element as active
  element.classList.add("active");

  // Load the article into the iframe
  const iframe = document.getElementById("content-frame");
  iframe.src = path;

  // Close sidebar on mobile
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }
}

function injectStylesIntoIframe(iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;

    // Fetch the main CSS
    fetch(document.getElementById("main-css").href)
      .then(res => res.text())
      .then(css => {
        const style = doc.createElement("style");
        style.textContent = css;
        doc.head.appendChild(style);

        doc.body.classList.add("article-page");
      });
  } catch (err) {
    console.error("Failed to inject CSS into the iframe:", err);
  }
}
