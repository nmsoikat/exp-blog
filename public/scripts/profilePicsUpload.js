window.onload = function () {
  // configure croppie
  const baseCropping = $("#croppieImage").croppie({
    viewport: {
      width: 200,
      height: 200,
    },
    boundary: {
      width: 300,
      height: 300,
    },
    showZoomer: true,
    enableResize: true,
  })

  // read file
  function readableFile(file) {
    const reader = new FileReader()
    reader.onload = function (event) {
      baseCropping
        .croppie("bind", {
          url: event.target.result,
        })
        .then(() => {
          $(".cr-slider").attr({
            min: 0.5,
            max: 1.5,
          })
        })
    }

    reader.readAsDataURL(file)
  }

  // choose imaged
  $("#profilePicsFile").on("change", function (e) {
    if (this.files[0]) {
      readableFile(this.files[0])

      $("#croppieModal").modal({
        backdrop: "static",
        keyboard: false,
      })
    }
  })

  // cancel crop click then clear choose image
  $("#cancelCropping").on("click", function () {
    $("#profilePicsFile").value = ""
  })

  // close modal
  $("#cancelCropping").on("click", function () {
    $("#croppieModal").modal("hide")
    // baseCropping.croppie("destroy")
    // setTimeout(() => {
    // baseCropping.croppie("destroy")
    // }, 1000)
  })

  function generateName(name) {
    const type = /.jpeg|.jpg|.png|.gif/
    return name.replace(type, ".png")
  }

  // upload image
  $("#uploadImg").on("click", function () {
    baseCropping
      .croppie("result", "Blob")
      .then((blob) => {
        // form data
        const formData = new FormData()
        const file = document.getElementById("profilePicsFile").files[0]
        const name = generateName(file.name)
        formData.append("profilePics", blob, name)

        // set header and send data
        const headers = new Headers()
        headers.append("Accept", "Application/JSON")

        // send request
        const req = new Request("/upload/userProfilePics", {
          method: "POST",
          headers,
          mode: "cors",
          body: formData,
        })

        return fetch(req)
      })
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("profilePics").src = data.profilePics
        document.getElementById("removeProfilePics").style.display = "block"
        document.getElementById("profilePicsForm").reset()

        $("#croppieModal").modal("hide")
        // setTimeout(() => {
        //   baseCropping.croppie("destroy")
        // }, 1000)
      })
  })

  $("#removeProfilePics").on("click", function () {
    const req = new Request("/upload/userProfilePics", {
      method: "DELETE",
      mode: "cors",
    })

    fetch(req)
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("removeProfilePics").style.display = "none"
        document.getElementById("profilePics").src = data.profilePics
        document.getElementById("profilePicsForm").reset()
      })
      .catch((e) => {
        next(e)
      })
  })
}
