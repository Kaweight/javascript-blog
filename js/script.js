'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const addHrefAttribute = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(addHrefAttribute);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    /* insert link into titleList */
    html = html + linkHTML;
    // console.log(html);
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function generateTags() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsList = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;
    /* END LOOP: for every article: */
  }
}

generateTags();

function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  // / find all tag links with class active /
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(tag);
  // / START LOOP: for each active tag link /
  for (let activeTag of activeTags) {
    // / remove class active /
    activeTag.classList.remove('active');
    // / END LOOP: for each active tag link /
  }
  // / find all tag links with "href" attribute equal to the "href" constant /
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  // / START LOOP: for each found tag link /
  for (let tagLink of tagLinks) {
    // / add class active /
    tagLink.classList.add('active');
    // / END LOOP: for each found tag link /
  }
  // / execute function "generateTitleLinks" with article selector as argument /
  generateTitleLinks('[data-tags~="' + tag + '"]');
}


function addClickListenersToTags() {
  /* find all links to tags */
  const getTagLinks = document.querySelectorAll(optArticleTagsSelector + ' a');
  /* START LOOP: for each link */
  for (let getTagLink of getTagLinks) {
    /* add tagClickHandler as event listener for that link */
    getTagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}
addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const articleAuthors = article.getAttribute('data-author');
    for (let articleAuthor of articleAuthors) {
      const authorLinkHTML = '<li><a href="#author-' + articleAuthors + '"><span>' + 'by ' + articleAuthors + '</span></a></li>';
      html = authorLinkHTML;
    }
    authorWrapper.innerHTML = html;
  }
}

generateAuthors();