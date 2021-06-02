{
  'use strcit';

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    /* add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');

    for (let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log(targetArticle);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  }

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';

  function generateTitleLinks(customSelector = ''){
    console.log(customSelector)
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for (let article of articles){
      /* get the article id */
      const articleId = article.getAttribute('id');
      /* find the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      /* get the title from the title element */

      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId +'"><span>' + articleTitle + '</span></a></li>';
      /* insert link into titleList */
      html = html + linkHTML;
    }
    titleList.innerHTML = html
    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }
  function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles){
    /* find tags wrapper */
    const tagsList = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
      console.log(tag);
      /* generate HTML of the link */
      const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>'
      /* add generated code to html variable */
      html = html + tagHTML;
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
      tagsList.innerHTML = html;
  /* END LOOP: for every article: */
  }
}
function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault()
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href') // #tag-cat => cat
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '') // cat
  /* find all tag links with class active */
  const tagsActive = document.querySelectorAll('active')
  /* START LOOP: for each active tag link */
  for (let tag of tagsActive){
    /* remove class active */
    tag.classList.remove('active')
  /* END LOOP: for each active tag link */
}
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagsLinks = document.querySelectorAll('a[href="' + href + '"]')
  /* START LOOP: for each found tag link */
  for (let tag of tagsLinks){
    /* add class active */
    tag.classList.add('active')
  /* END LOOP: for each found tag link */
}
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag +'"]')
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]')
  /* START LOOP: for each link */
  for (let link of links){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

function generateAuthors(){
//szukamy wszystkie artykule
const articles = document.querySelectorAll(optArticleSelector);
for (let article of articles){
//szukamy miejse gdzie musimy zapisac autora
const authorsWrapper = article.querySelector(optArticleAuthorSelector);
//pobieramy wartosc autora z atrybutu
const author = article.getAttribute('data-author')
//twozrymy kod html
const html = '<a href="#author-' + author + '">' + author + '</a>'
//dodanie kodu do listy zapisanych autorow
authorsWrapper.innerHTML = html;

}
}

function authorClickHandler(){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href')
  //usun prefiks hash autor
  const author = href.replace('#author-', '')
  const articles = document.querySelectorAll('active')
  for (let article of articles){
    article.classList.remove('active')
  }
  const authorsLinks = document.querySelectorAll('a[href="' + href + '"]')
  console.log(authorsLinks);
  for (let authorLink of authorsLinks){
    authorLink.classList.add('active')
  }
  //wyswietlamy artykule ktore napisal danny autor
  generateTitleLinks('[data-author="' + author +'"]')
}

function addClickListenersToAuthors(){
  const links = document.querySelectorAll('a[href^="#author-"]')
  for (let link of links){
    link.addEventListener('click',authorClickHandler)
  }
}

generateTags();
generateTitleLinks()
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();

}
