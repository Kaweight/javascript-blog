'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

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

function calculateTagsParams(tags) {

  const params = {
    max: 0,
    min: 999999
  };

  for (let tag in tags) {
    // console.log(tag + ' is used ' + tags[tag] + ' times');

    params.max = tags[tag] > params.max ? tags[tag] : params.max;
    params.min = tags[tag] < params.max ? tags[tag] : params.min;

  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
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
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      // console.log(tag);
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  // console.log('tagsParms:', tagsParams);
  let allTagsHTML = '';
  /* START LOOP: for each tag in allTags */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to alltagsHTML*/
    const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '"><span>' + tag + ' (' + allTags[tag] + ') ' + '</span></a></li>';
    allTagsHTML += tagLinkHTML;
    // console.log(allTagsHTML);
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /* [NEW] add html form allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  // / find all tag links with class active /
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  // console.log(tag);
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

function calculateAuthorParams(authors) {

  const params = {
    max: 0,
    min: 999999
  };

  for (let author in authors) {
    // console.log(author + ' is used ' + authors[author] + ' times');

    params.max = authors[author] > params.max ? authors[author] : params.max;
    params.min = authors[author] < params.max ? authors[author] : params.min;

  }
  return params;
}

function calculateAuthorClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}

function generateAuthors() {
  /* [NEW] create a new variable allTags with an empty object */
  let allAuthors = {};
  let html = '';
  /* [DONE]find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  // console.log(articles);
  /* [DONE]START LOOP: for every article: */
  for (let article of articles) {
    /* [DONE]find authors wrapper */
    const authorsList = article.querySelector(optArticleAuthorSelector);
    // console.log(authorsList);
    /* [DONE]make html variable with empty string */

    /* [DONE]get author from data-author attribute */
    const articleAuthors = article.getAttribute('data-author');
    // console.log(articleAuthors);
    /* [DONE]generate HTML of the author by tag */
    const authorHTML = '<li><a href="#' + articleAuthors + '">' + articleAuthors + '</a></li>';
    /* [DONE]add generated code to html variable */
    html = html + authorHTML;
    // console.log(authorHTML);
    /* [NEW] check if this link is NOT already in allTags */
    if (!allAuthors.hasOwnProperty(articleAuthors)) {
      /* [NEW] add generated code to allTags array */
      allAuthors[articleAuthors] = 1;
    } else {
      allAuthors[articleAuthors]++;
    }
    /* insert HTML of all the links into the authors wrapper */
    authorsList.innerHTML = html;
    // console.log(allAuthors);
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(optAuthorsListSelector);
  /* [NEW] create variable for all links HTML code */
  const authorsParams = calculateAuthorParams(allAuthors);
  // console.log('authorsParms:', authorsParams);
  let allAuthorsHTML = '';
  /* START LOOP: for each author in allAuthors */
  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allauthorsHTML*/
    const authorLinkHTML = '<li><a class="' + calculateAuthorClass(allAuthors[author], authorsParams) + '" href="#author-' + author + '"><span>' + author + ' (' + allAuthors[author] + ') ' + '</span></a></li>';
    allAuthorsHTML += authorLinkHTML;

    /* [NEW] END LOOP: for each author in allAuthors: */
  }
  /* [NEW] add html form allAuthorsHTML to authorList */
  authorList.innerHTML = allAuthorsHTML;
  // console.log(authorList);
}

generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  const allAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let allAuthorLink of allAuthorLinks) {
    allAuthorLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const getAuthorLinks = document.querySelectorAll(optArticleAuthorSelector + ' a');

  for (let getAuthorLink of getAuthorLinks) {
    getAuthorLink.addEventListener('click', authorClickHandler);
  }

}

addClickListenersToAuthors();