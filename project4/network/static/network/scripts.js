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

  function likeFunction(id) {
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
      likeCount++;
      like.innerHTML = likeCount;
    });
    return false;
  }

  let likeButton = document.querySelectorAll(".liked");
  likeButton.forEach(element => {
    element.addEventListener("click", () => {
      likeFunction(element.dataset.value);
    });
  });
});
