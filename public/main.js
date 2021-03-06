const qrButton = document.getElementById('createqr')

window.onload = () => qreator()

function qreator() {
  fetch('/qrcards')
    .then(res => res.json())
    .then(data => {
      const $cardRow = document.getElementById('cardrow')
      if (data.length > 0) {
        const $cardHeader = document.getElementById('cardheader')
        $cardHeader.classList.remove('hidden')
      }
      data.forEach((data) => $cardRow.appendChild(createCard(data)))
    })
    .catch((err) => console.log(err))
}

function updateQRCardRow() {
  const $cardRow = document.getElementById('cardrow')
  const $createQrView = document.getElementById('createqrcode')
  const $editQrView = document.getElementById('editqrcode')
  const $qreatorHeader = document.getElementById('qreatorheader')
  const $cardheader = document.getElementById('cardheader')

  $qreatorHeader.textContent = 'Create Your Custom QR Code'

  $cardheader.setAttribute('class', 'hidden')
  $editQrView.setAttribute('class', 'hidden')
  $createQrView.removeAttribute('class', 'hidden')

  $cardRow.innerHTML = ''
  qreator()
}

function createCard(data) {
  const $qrCodeDiv = document.createElement('div')
  const $qrCode = document.createElement('img')
  const $name = document.createElement('h3')

  $qrCode.setAttribute('src', data.qr)
  $qrCode.setAttribute('class', 'img-thumbnail')
  $qrCodeDiv.setAttribute('class', 'col-xs-3')
  $qrCodeDiv.setAttribute('id', data.id)

  $name.setAttribute('class', 'text-center')
  $name.textContent = data.name

  $qrCodeDiv.appendChild($qrCode)
  $qrCodeDiv.appendChild($name)

  $qrCode.addEventListener('click', () => editQr(data))

  return $qrCodeDiv
}

function editQr(data) {
  const $qreatorHeader = document.getElementById('qreatorheader')
  const $createQrView = document.getElementById('createqrcode')
  const $editQrView = document.getElementById('editqrcode')
  const $updatedqrurl = document.getElementById('updated-qr-url')
  const $updatedqrname = document.getElementById('updated-qr-name')
  const $updatedqrdescrip = document.getElementById('updated-qr-description')
  const $qrEditView = document.getElementById('qreditview')
  const $saveChanges = document.getElementById('savechanges')
  const $deleteQR = document.getElementById('delete-qr')

  $qreatorHeader.textContent = 'Edit QR Code: ' + data.name

  $createQrView.setAttribute('class', 'hidden')
  $editQrView.removeAttribute('class', 'hidden')
  $qrEditView.setAttribute('src', data.qr)
  $updatedqrurl.value = data.url
  $updatedqrname.value = data.name
  $updatedqrdescrip.value = data.description

  $saveChanges.setAttribute('data-id', data.id)
  $deleteQR.setAttribute('data-id', data.id)
}

function updateQRData(id) {
  const urlInput = document.getElementById('updated-qr-url')
  const nameInput = document.getElementById('updated-qr-name')
  const descripInput = document.getElementById('updated-qr-description')

  const qrUpdate = {
    url: urlInput.value,
    name: nameInput.value,
    description: descripInput.value
  }

  fetch('/qrcards/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(qrUpdate)
  })
    .then(res => res.json())
    .then((data) => {
      updateQRCardRow()
    })
    .catch((res) => console.log(res))
}

function deleteQRCode(id) {
  const qrCodeId = {id}
  fetch('/qrcards/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(qrCodeId)
  })
    .then(() => {
      updateQRCardRow()
    })
    .catch((res) => console.log(res))
}

const $deleteQR = document.getElementById('delete-qr')
$deleteQR.addEventListener('click', (event) => deleteQRCode(event.target.dataset.id))

const $saveChanges = document.getElementById('savechanges')
$saveChanges.addEventListener('click', (event) => updateQRData(event.target.dataset.id))

qrButton.addEventListener('click', () => {
  const urlInput = document.getElementById('qr-url-input').value
  const nameInput = document.getElementById('qr-name-input').value
  const descripInput = document.getElementById('qr-description-input').value

  const qrCode = {
    url: urlInput,
    name: nameInput,
    description: descripInput
  }
  fetch('/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(qrCode)
  })
    .then(res => res.json())
      .then(data => {
        const qrData = data
        console.log(qrData)
        const $cardHeader = document.getElementById('cardheader')
        const $cardRow = document.getElementById('cardrow')
        const qr = document.getElementById('picture')
        const createQrForm = document.getElementById('createqrform')

        createQrForm.reset()

        $cardHeader.classList.remove('hidden')

        data.forEach((data) => {
          qr.setAttribute('src', data.qr)
          $cardRow.appendChild(createCard(data))
        })
      })
    .catch((res) => console.log(res))
})
