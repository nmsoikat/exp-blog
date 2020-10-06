window.onload = () => {
  const bookmarks = document.getElementsByClassName("bookmark")
  ;[...bookmarks].forEach((bookmark) => {
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
}
