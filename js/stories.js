"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author ${currentUser ? "logged-in" : ""}">by ${
    story.author
  }</small>
        <small class="story-user ${currentUser ? "logged-in" : ""}">posted by ${
    story.username
  }</small>
      </li>
      
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page.
 * modified by abdullah to also favor or unfavor stories
 */

async function putStoriesOnPage() {
  //await checkForRememberedUser();
  storyList = await StoryList.getStories();
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    // manages favorites

    if (
      currentUser &&
      currentUser.favorites.filter((fstory) => fstory.storyId === story.storyId)
        .length > 0
    ) {
      const $favored = $('<i class="fa-solid fa-heart favored"></i>');
      $story.prepend($favored);
      $favored.on("click", (event) => {
        manageFavorite(event, story.storyId);
      });
    } else if (currentUser) {
      const $unfavored = $('<i class="fa-regular fa-heart unfavored"></i>');
      $story.prepend($unfavored);
      $unfavored.on("click", (event) => {
        manageFavorite(event, story.storyId);
      });
    }
    $story.append("<hr>");
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/**get favorites from server and display them on favorites page*/
async function putFavoritesOnPage() {
  await checkForRememberedUser();
  $allStoriesList.empty();
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    const $favored = $('<i class="fa-solid fa-heart favored"></i>');
    $story.prepend($favored);
    $favored.on("click", (event) => {
      removeMyFavoriteClick(event, story.storyId);
    });
    $allStoriesList.append($story);
  }
  $allStoriesList.prepend($("<h1><b>My Favorite Stories<b></h1><hr>"));
  $allStoriesList.show();
}

/**get stories created by user and display them enables them to be removed*/
async function putMyStoriesOnPage() {
  await checkForRememberedUser();
  $allStoriesList.empty();
  for (let story of currentUser.ownStories) {
    if (
      currentUser.ownStories.filter(
        (fstory) => fstory.storyId === story.storyId
      ).length > 0
    ) {
      const $story = generateStoryMarkup(story);
      const $trashCan = $('<i class="fa-solid fa-trash-can remove-me"></i>');
      $trashCan.on("click", (event) => {
        removeMyStoryClick(event, story.storyId);
      });
      $story.prepend($trashCan);
      $allStoriesList.append($story);
    }
  }
  $allStoriesList.prepend($("<h1><b>My Stories<b></h1><hr>"));
  $allStoriesList.show();
}

//remove user's favorite story from favorites' page and favorites' list
async function removeMyFavoriteClick(event, storyId) {
  await currentUser.removeFromFavorite(storyId);
  putFavoritesOnPage();
}
// remove user's story
async function removeMyStoryClick(event, storyId) {
  await currentUser.removeOwnStory(storyId);
  putMyStoriesOnPage();
}
// manages the click on the favorite star icon
async function manageFavorite(event, storyId) {
  let target = event.target;
  let classList = target.classList;
  if (classList.contains("unfavored")) {
    classList.replace("unfavored", "favored");
    classList.replace("fa-regular", "fa-solid");
    target.style.color = "red";
    await currentUser.addToFavorite(storyId);
  } else {
    classList.replace("favored", "unfavored");
    classList.replace("fa-solid", "fa-regular");
    target.style.color = "";
    await currentUser.removeFromFavorite(storyId);
  }
}

/**adds new story to the story page
 */
async function createNewStory(evt) {
  evt.preventDefault();
  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();
  try {
    let newStory = await storyList.addStory(currentUser, {
      title,
      author,
      url,
    });
    const story = generateStoryMarkup(newStory);
    $allStoriesList.prepend(story);
    $newStoryForm.trigger("reset");
  } catch {
    $invalidURL.text("*invalid url");
  }
}

$newStoryForm.on("submit", createNewStory);
