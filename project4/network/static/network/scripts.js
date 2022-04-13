document.addEventListener("DOMContentLoaded", function () {
  // BEGIN TRANSITION TOGGLE
  // Credit for CSS/JS Animation Toggle: https://jsfiddle.net/gebpjo1L/18/
  // I did not write this animation code.

  let container = document.querySelector(".toggleBox");
  let button = document.querySelector(".toggle");

  button.addEventListener("click", () => {
    /** Slide down. */
    if (!container.classList.contains("active")) {
      /** Show the container. */
      container.classList.add("active");
      container.style.height = "auto";

      /** Get the computed height of the container. */
      let height = container.clientHeight + "px";

      /** Set the height of the content as 0px, */
      /** so we can trigger the slide down animation. */
      container.style.height = "0px";

      /** Do this after the 0px has applied. */
      /** It's like a delay or something. MAGIC! */
      setTimeout(() => {
        container.style.height = height;
      }, 0);
      button.innerHTML = "Close Tweet Box";
      /** Slide up. */
    } else {
      /** Set the height as 0px to trigger the slide up animation. */
      container.style.height = "0px";
      /** Remove the `active` class when the animation ends. */
      container.addEventListener("transitionend", () => {
        container.classList.remove("active");
      }, {once: true});
      button.innerHTML = "Write Tweet";
    }
  });

  // END ANIMATION TOGGLE

  // ***************  CUSTOM CODE *****************

  /**
     * getCookie takes 1 argument and is from the Django docs to deal with CSRF token.
     * https://docs.djangoproject.com/en/4.0/ref/csrf/
     */
  const getCookie = name => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        //  Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };
  let csrftoken = getCookie("csrftoken");

  // BEGIN FOLLOW/UNFOLLOW TOGGLE

  const followBtn = document.querySelector(".follow-toggle");
  if (followBtn) {
    followBtn.addEventListener("click", () => {
      if (followBtn.innerHTML === "Follow") {
        followBtn.innerHTML = "Unfollow";
      } else {
        followBtn.innerHTML = "Follow";
      }
    });
  }

  // END FOLLOW/UNFOLLOW TOGGLE

  // BEGIN LIKE
  // Credit object manipulation: https://stackoverflow.com/questions/35099779/javascript-if-a-value-exists-in-an-object

  user = document.querySelector('input[type="submit"][value="user.id"]');
  likeObj = {};

  /**
     * likeFunction takes 2 arguments. When a user clicks like via the click
     * listener outside the function, a POST request is sent to the backend (like view).
     * On a successful response, the user and tweet id are pushed to likeObj to track
     * if user has previously liked/unliked this specific tweet. If tweet is liked,
     * likeCount is incemented by 1 and that count is displayed on user's screen. If
     * the same user clicks again, then the like is de-incremented, displayed, and that
     * like is removed from likeObj.
     * @param {string} [id] is tweet id.
     * @param {string} [user] is userid.
     */
  const likeFunction = (id, user) => {
    fetch(`/network/like`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken
      },
      mode: "same-origin", // Do not send CSRF token to another domain.
      body: JSON.stringify({post_liked: id})
    }).then(response => response.json()).then(result => {
      console.log(result);
      let like = document.querySelector("#id-" + id);
      let likeCount = parseInt(like.innerHTML);
      if (Object.keys(likeObj).includes(id)) {
        likeCount--;
        like.innerHTML = likeCount;
        delete likeObj[id];
      } else {
        likeCount++;
        like.innerHTML = likeCount;
        likeObj[id] = user;
      }
    });
    return false;
  };

  // Event listener on all tweets waiting for like button to be clicked
  let likeButton = document.querySelectorAll(".liked");
  likeButton.forEach(element => {
    element.addEventListener("click", () => {
      likeFunction(element.dataset.value, user);
    });
  });

  // END LIKE

  // BEGIN EDIT TWEET FUNCTIONS

  /**
     * editToggle takes 1 argument toggles whether a tweet block is show or if a
     * texarea is displayed for editing that specific tweet.
     * @param {string} [id] the tweet id that identifies the div being manipulated.
     */
  const editToggle = id => {
    let tweetBody = document.querySelector(`[data-tweet="${id}"]`);
    let tweetEditArea = document.querySelector(`[data-edit="${id}"]`);

    if (tweetBody.style.display === "block") {
      tweetBody.style.display = "none";
      tweetEditArea.style.display = "block";
    } else {
      tweetBody.style.display = "block";
      tweetEditArea.style.display = "none";
    }
  };

  /**
     * submitEdit takes 1 argument and sends a POST request to the server
     * (edit_tweet view) containing the content of the edited tweet. It then
     * called editToggle to toggle the view for the user and displays the updated
     * tweet text.
     * @param {object} [event] is the event passed from the event listener in
     * createTweetEditArea function.
     */
  const submitEdit = event => {
    event.preventDefault();
    let id = event.currentTarget.attributes.tweetID.value;

    const body = document.querySelector("#body-" + id).value;
    fetch(`/network/edit-tweet`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken
      },
      mode: "same-origin", // Do not send CSRF token to another domain.
      body: JSON.stringify({id: id, post_body: body})
    }).then(response => response.json()).then(result => {
      console.log(result);
      editToggle(id);
      let editTweetBody = document.querySelector(`[data-edited="${id}"]`);
      editTweetBody.innerHTML = body;
    });
    return false;
  };

  /**
     * createTweetEditArea takes 1 argument and begins the 3 step process of allowing
     * a user to edit their tweet.
     * Step 1 calls editToggle to display a textarea.
     * Step 2 fetches the original text from the server and displays it.
     * Step 3 instantiates a event listener to listen for a submit event and call
     * the submitEdit function.
     * @param {string} [tweetID] the id if the tweet being edited.
     */
  const createTweetEditArea = tweetID => {
    // step 1 create text box
    editToggle(tweetID);
    // step 2 fill text box with tweet to be edited
    fetch(`/network/get-tweet/${tweetID}`).then(response => response.json()).then(tweetRes => {
      document.querySelector("#body-" + tweetID).value = tweetRes[0]["fields"]["post_body"];
    });
    // step 3 submit the new form
    const form = document.querySelector("#form-" + tweetID);
    form.setAttribute("tweetID", tweetID);
    form.addEventListener("submit", submitEdit);
  };

  // click listener for all tweets listening for "edit" click.
  let tweetEditLink = document.querySelectorAll(".edit-tweet-icon");
  tweetEditLink.forEach(element => {
    element.addEventListener("click", () => {
      createTweetEditArea(element.dataset.id);
    });
  });
});
