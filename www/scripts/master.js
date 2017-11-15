window.KA = {
  init: function() {
    KA.contactInit()
  },
  contactInit: function() {
    var form = document.getElementById('contact_form')
    form.action = '/contact.php'
    form.onsubmit = KA.contact
  },
  contact: function(event) {
    event.preventDefault()

    var form = document.getElementById('contact_form')
    var message = document.getElementById('contact_message')

    form.style.display = 'none'
    message.style.display = 'block'

    KA.ajaxPost(form)
  },
  ajaxPost: function(form) {
    var url = form.action,
        xhr = new XMLHttpRequest()

    var params = [].filter.call(form.elements, function(el) {
      return !!el.name
    })
    .map(function(el) {
      return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value)
    })
    .join('&')

    xhr.open('POST', url)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    console.log('params', params)
    xhr.send(params)
  },
}

KA.init()
