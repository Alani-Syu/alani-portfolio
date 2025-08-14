(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("mobile-menu-overlay");
const closeBtn = document.getElementById("close-menu-btn");
function openMenu() {
  mobileMenu.classList.remove("translate-x-full");
  overlay.classList.add("active");
  overlay.style.visibility = "visible";
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  mobileMenu.classList.add("translate-x-full");
  overlay.classList.remove("active");
  overlay.addEventListener("transitionend", handleTransitionEnd);
  document.body.style.overflow = "";
}
function handleTransitionEnd(e) {
  if (e.propertyName === "opacity" && !overlay.classList.contains("active")) {
    overlay.style.visibility = "hidden";
    overlay.removeEventListener("transitionend", handleTransitionEnd);
  }
}
overlay.style.visibility = "hidden";
menuBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
document.querySelectorAll("#mobile-menu a").forEach((el) => {
  el.addEventListener("click", function() {
    closeMenu();
  });
});
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) closeMenu();
});
const header = document.querySelector("header");
function onScroll() {
  if (window.scrollY > 10) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
}
window.addEventListener("scroll", onScroll);
document.addEventListener("DOMContentLoaded", onScroll);
function handleStaggeredScroll() {
  const leftCol = document.querySelector("#works-section .column.left");
  const rightCol = document.querySelector("#works-section .column.right");
  const worksSection = document.querySelector("#works-section");
  if (!leftCol || !rightCol || !worksSection) return;
  const rect = worksSection.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < windowHeight && rect.bottom > 0 && window.innerWidth >= 768) {
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionTop = worksSection.offsetTop;
    const sectionHeight = worksSection.offsetHeight;
    const progress = Math.min(
      Math.max(
        (scrollY + windowHeight - sectionTop) / (sectionHeight + windowHeight),
        0
      ),
      1
    );
    const maxOffset = 80;
    leftCol.style.transform = `translateY(${-progress * maxOffset}px)`;
    rightCol.style.transform = `translateY(${progress * maxOffset}px)`;
  } else {
    leftCol.style.transform = "";
    rightCol.style.transform = "";
  }
}
window.addEventListener("scroll", handleStaggeredScroll);
window.addEventListener("resize", handleStaggeredScroll);
document.addEventListener("DOMContentLoaded", handleStaggeredScroll);
