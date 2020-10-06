window.onload = function () {
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