{
  'use strict';
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML)
  };

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
    //console.log(articleSelector);

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    //console.log(targetArticle);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector = '.authors.list',
    optAuthorClassPrefix = 'author-size-',
    optAuthorClassCount = 5;

  function generateTitleLinks(customSelector = ''){
    console.log(customSelector);
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
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      /* insert link into titleList */
      html = html + linkHTML;
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }

  function calculateTagsParams(tags){
    params = {
      max: 0,
      min: 9999999,
    };
    for (let tag in tags ){
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;

  }

  function calculateTagClass(count, params){

    const normalizedCount = count - params.min;

    const normalizedMax = params.max - params.min;

    const percentage = normalizedCount / normalizedMax;

    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
    return optCloudClassPrefix + classNumber;
  }

  function generateTags(){
    /* [NEW] create a new variable allTags with an empty object*/
    let allTags = {};
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
      //console.log(articleTags);
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      //console.log(articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray){
      //console.log(tag);
      /* generate HTML of the link */
        const tagHTML = '<li><a href="#tag-' + tag +'">' + tag + '</li></a>';
        /* add generated code to html variable */
        html = html + tagHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
          allTags[tag] = 1;
        }else {
          allTags[tag]++;
        }
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
    //console.log('tagsParams:', tagsParams)
    let allTagsHTML = '';
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){

      const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href=#tag-' +tag + '">' +tag + '</li>';
      //console.log('tagLinkHTML:', tagLinkHTML);
      /* [NEW] generate code of a link and add it to allTagsHTML */

      allTagsHTML = allTagsHTML + tagLinkHTML;
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  }

  function tagClickHandler(event){
  /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href'); // #tag-cat => cat
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', ''); // cat
    /* find all tag links with class active */
    const tagsActive = document.querySelectorAll('active');
    /* START LOOP: for each active tag link */
    for (let tag of tagsActive){
    /* remove class active */
      tag.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagsLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
    for (let tag of tagsLinks){
    /* add class active */
      tag.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag +'"]');
  }

  function addClickListenersToTags(){
  /* find all links to tags */
    const links = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for (let link of links){
    /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  }
  //tworzymy funkcje zliczyc parametry (min i max )
  function calculateAuthorParams(authors){
    params = {
      max: 0,
      min: 9999999,
    };
    //tworzumy petle dla kazdego autora i zliczmy ilosc wystampien
    for (let author in authors ){
      if(authors[author] > params.max){
        params.max = authors[author];
      }
      if(authors[author] < params.min){
        params.min = authors[author];
      }
    }
    return params;

  }
  //tworzymy funkcje klasy dla autorow ktora przyjmuje argumnet count i params
  function calculateAuthorClass(count, params){

    const normalizedCount = count - params.min;

    const normalizedMax = params.max - params.min;

    const percentage = normalizedCount / normalizedMax;

    const classNumber = Math.floor( percentage * (optAuthorClassCount - 1) + 1 );
    return optAuthorClassPrefix + classNumber;
  }
  //tworzymy funkcje generowanie autorow
  function generateAuthors(){
  //tworzymy zmiena let z pustym obiektem
    let allAuthors = {};
    //szukamy wszystkie artykule
    const articles = document.querySelectorAll(optArticleSelector);
    //tworzymy petle dla article
    for (let article of articles){
      //szukamy miejse gdzie musimy zapisac autora
      const authorsWrapper = article.querySelector(optArticleAuthorSelector);
      //pobieramy wartosc autora z atrybutu
      const author = article.getAttribute('data-author');
      //tworzymy link html i dodajemy wartosc autora
      const html = '<a href="#author-' + author +'">' + author + '</a>';
      //wstawiamy link html w miejsce wrappera
      authorsWrapper.innerHTML = html;
      //tworzymy blok if i sprawdzamy ilisoc wystapien autora
      if(!allAuthors[author]){
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    }
    //console.log(allAuthors);
    //tworzymy stala authorParams i pobieramy parametru wszystkich autorow
    const authorParams = calculateAuthorParams(allAuthors);
    console.log('authorsParams:', authorParams);
    // tworzymy zmiena linkow wszystkich autorow
    let allAuthorHTML = '';
    //tworzymy petle dla kazdego autora
    for(let author in allAuthors){
      console.log(allAuthorHTML);
      //tworzymy link html dla autora
      const authorLinkHTML = '<li><a class="' + calculateAuthorClass(allAuthors[author], authorParams) + '" href="#author-' +author + '">' +author + '</li>';
      //console.log('authorLinkHTML:', authorLinkHTML);
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allAuthorHTML = allAuthorHTML + authorLinkHTML;
    }
    console.log(allAuthorHTML);
    //szukamy listy wszystkich autorow
    const authorList = document.querySelector('.authors');
    //wstawiamy link html na strone
    authorList.innerHTML = allAuthorHTML;
    console.log(authorList);
  /*[NEW] add HTML from allTagsHTML to tagList */
  //author.innerHTML = allAuthorsHTML;
  }




  //tworzymy funkcje authorClickHandler
  function authorClickHandler(){
  //blokujemy przegladarke href
    event.preventDefault();
    //tworzymy stala const clickedElement i ustwiamy wartosc this
    const clickedElement = this;
    //tworzymy stala href i pobieramy atrybut href z clickedElement
    const href = clickedElement.getAttribute('href');
    //usun prefiks hash autor
    const author = href.replace('#author-', '');
    //wyszykuj wszystkie aktywne artykule
    const articles = document.querySelectorAll('active');
    //stworz petle dla article i usuwawy active
    for (let article of articles){
      article.classList.remove('active');
    }
    //tworzymy autor links i szukamy href wszystkich linkow
    const authorsLinks = document.querySelectorAll('a[href="' + href +'"]');
    //stworz petle dla authorLink dodaj clase active
    for (let authorLink of authorsLinks){
      authorLink.classList.add('active');
    }
    //wyswietlamy artykule ktore napisal danny autor
    generateTitleLinks('[data-author="' + author +'"]');
  }

  //tworzymy funkcje addClickListenersToAuthors
  function addClickListenersToAuthors(){
  //tworzymy stala links i wyszykujemy wszystkich autorow po atrybucie href w linkach
    const links = document.querySelectorAll('a[href^="#author-"]');
    //stworz petle dla linkow i dodaj addEventListener dla authorClickHandler
    for (let link of links){
      link.addEventListener('click', authorClickHandler);
    }

  }

  generateTags();
  generateTitleLinks();
  addClickListenersToTags();
  generateAuthors();
  addClickListenersToAuthors();

}
