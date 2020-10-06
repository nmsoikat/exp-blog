window.onload = function () {
  tinymce.init({
    selector: "#tiny-mcs-post-body",
    plugins: [
      "advlist autolink link image lists charmap print preview hr anchor pagebreak",
      "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
      "table emoticons template paste help",
    ],
    toolbar:
      "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | " +
      "bullist numlist outdent indent | link image | print preview media fullpage | " +
      "forecolor backcolor emoticons | help",
    height: 400,
    automatic_uploads: true,
    images_upload_url: "/upload/postImage",
    relative_urls: false,
    images_upload_handler: function (blobInfo, success, failure) {
      // create headers
      const headers = new Headers()
      headers.append("Accept", "Application/JSON")

      // create form data
      const formData = new FormData()
      formData.append("post-image", blobInfo.blob(), blobInfo.filename())

      // create request
      const req = new Request("/upload/postImage", {
        method: "POST",
        headers,
        body: formData,
        mode: "cors",
      })

      //fetch request
      fetch(req)
        .then((res) => res.json())
        .then((data) => success(data.imgUrl))
        .catch(() => failure("HTTP Error"))
    },
  })
}
