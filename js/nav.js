"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  await checkForRememberedUser();
  hidePageComponents();
  putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

async function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  await checkForRememberedUser();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

async function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $addStory.show();
  $favorites.show();
  $myStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  await checkForRememberedUser();
  hidePageComponents();
  await putStoriesOnPage();
}

/** displays a form for creating new story when
 * submit link clicked
 */
async function navSubmitClick(e) {
  await checkForRememberedUser();
  hidePageComponents();
  //show the story form here
  $newStoryForm.show();
}

$addStory.on("click", navSubmitClick);

/**displays favorite stories page
 * when favorites link is clicked
 */
async function navFavoritesClick() {
  await checkForRememberedUser();
  hidePageComponents();
  putFavoritesOnPage();
}
$favorites.on("click", navFavoritesClick);

/**displays user's stories page
 * when My Stories link is clicked
 */
async function navMyStoriesClick(){
  await checkForRememberedUser();
  hidePageComponents();
  putMyStoriesOnPage();
}
$myStories.on("click",navMyStoriesClick)