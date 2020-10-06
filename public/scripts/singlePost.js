window.onload = () => {


  // ------------------------------------------------
  //============= Bookmark related Script ============
  // ------------------------------------------------
  const bookmarks = document.getElementsByClassName("bookmark");
  [...bookmarks].forEach((bookmark) => {
    bookmark.style.cursor = "pointer"

    bookmark.addEventListener("click", (event) => {
      let target = event.target.parentElement

      let headers = new Headers()
      headers.append("Accept", "Application/JSON")

      let req = new Request(`/api/bookmark/${target.dataset.post}`, {
        method: "GET",
        headers,
        mode: "cors",
      })

      fetch(req)
        .then((res) => res.json())
        .then((data) => {
          if (data.bookmarked) {
            target.innerHTML = '<i class="fas fa-bookmark"></i>'
            console.log("1", target)
          } else {
            console.log("2", target)
            target.innerHTML = '<i class="far fa-bookmark"></i>'
          }
        })
        .catch((e) => {
          console.error(e.response.data.error)
          alert(e.response.data.error)
        })
    })
  })




  // ------------------------------------------------
  //============= Comment related Script ============
  // ------------------------------------------------
  const comment = document.getElementById('comment')
  const commentHolder = document.getElementById('comment-holder')

  comment.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      if (event.target.value) {
        const data = {
          data: event.target.value
        }

        const req = generateRequest(`/api/comments/${event.target.dataset.post}`, 'POST', data)

        // console.log(req);
        fetch(req)
          .then(res => res.json())
          .then(data => {
            // console.log(data);
            const commentElement = createCommentHTML(data.commentData)

            commentHolder.insertBefore(commentElement, commentHolder.children[0])

            event.target.value = '';
          })
          .catch(e => {
            alert(e);
            console.log(e.error);
          })
      }
    }
  })

  commentHolder.addEventListener('keypress', function (event) {
    if (commentHolder.hasChildNodes(event.target)) {
      if (event.key === 'Enter') {
        const commentId = event.target.dataset.comment
        const value = event.target.value;
        if (value) {
          const data = {
            body: value
          }

          const req = generateRequest(`/api/comments/replies/${commentId}`, 'POST', data)

          fetch(req).then(res => {
              return res.json()
            })
            .then(data => {
              const replayElement = createReplyElement(data)
              const parent = event.target.parentElement
              parent.previousElementSibling.append(replayElement)
              event.target.value = ''
            })
            .catch(e => {
              alert(e)
              console.log(e);
            })

        } else {
          alert('Please provide a valid replay')
        }
      }
    }
  })


  function createReplyElement(reply) {
    const elementHtml = `
    <img style="width:40px" src="${reply.profilePics}" class="align-selft-start mr-3 rounded-circle" />
    <div class="media-body">
      <p>${reply.body} </p>
    </div>
  `
    const div = document.createElement('div')
    div.className = 'media border mt-2 mr-2'
    div.innerHTML = elementHtml

    return div;

  }

  function createCommentHTML(comment) {
    const innerHtml = `
    <img src="${comment.userId.profilePics}" class="rounded-circle mx-3 my-3" style="width: 40px;">
    <div class="media-body my-3">
      <p>${comment.body}</p>
      <div class="my-3">
        <input type="text" class="form-control" placeholder="Press Enter to Reply" name="reply"
          data-comment="${comment._id}">
      </div>
    </div>
    `

    const div = document.createElement('div')
    div.classList.add('media', 'border')
    div.innerHTML = innerHtml

    return div;
  }

  function generateRequest(url, method, body) {
    const headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    headers.append('Content-Type', 'Application/JSON')

    const req = new Request(url, {
      method,
      headers,
      body: JSON.stringify(body),
      mode: 'cors',
    })

    return req;
  }




  // ---------------------------------------------------------
  //============= Like and Dislike related Script ============
  // ---------------------------------------------------------

  const btnLike = document.getElementById("btnLike")
  const btnDislike = document.getElementById("btnDislike")

  btnLike.addEventListener("click", function (e) {
    const postId = e.target.dataset.post

    likeDislike("like", postId)
      .then((res) => res.json())
      .then((data) => {
        let likeText = data.liked ? "Liked" : "Like"
        likeText += ` (${data.totalLikes})`

        let dislikeText = `Dislike (${data.totalDislikes})`

        btnLike.innerHTML = likeText
        btnDislike.innerHTML = dislikeText
      })
      .catch((e) => {
        console.log(e.response.data.error)
      })
  })

  btnDislike.addEventListener("click", function (e) {
    const postId = e.target.dataset.post

    likeDislike("dislike", postId)
      .then((res) => res.json())
      .then((data) => {
        let dislikeText = data.disliked ? "Disliked" : "Dislike"
        dislikeText += ` (${data.totalDislikes})`

        let likeText = `Like (${data.totalLikes})`

        console.log(dislikeText, likeText);

        btnDislike.innerHTML = dislikeText
        btnLike.innerHTML = likeText
      })
      .catch((e) => console.log(e.response.data.error))
  })

  function likeDislike(type, postId) {
    const headers = new Headers()
    headers.append("Accept", "Application/JSON")
    headers.append("Content-Type", "Application/JSON")

    const req = new Request(`/api/${type}/${postId}`, {
      method: "GET",
      headers,
      mode: "cors",
    })

    return fetch(req)
  }
}