document.addEventListener("DOMContentLoaded", function () {
  // BEGIN TRANSITION TOGGLE
  // Credit for CSS/JS Animation Toggle: https://jsfiddle.net/gebpjo1L/18/

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

  // From Django docs to deal with CSRF token
  function getCookie(name) {
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
  }
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

  function likeFunction(id, user) {
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
  }

  let likeButton = document.querySelectorAll(".liked");
  likeButton.forEach(element => {
    element.addEventListener("click", () => {
      likeFunction(element.dataset.value, user);
    });
  });

  // END LIKE

  // BEGIN EDIT TWEET FUNCTIONS

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

  let tweetEditLink = document.querySelectorAll(".edit-tweet-icon");
  tweetEditLink.forEach(element => {
    element.addEventListener("click", () => {
      createTweetEditArea(element.dataset.id);
    });
  });
});
