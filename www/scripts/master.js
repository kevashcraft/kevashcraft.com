document.addEventListener('DOMContentLoaded', init)

// global object
window.KA = {}

// initialization functions
function init() {
  initInputLabels()
  initContactForm()
}

function initInputLabels() {
  // input labels show
  Array.prototype.forEach.call(document.querySelectorAll('.autoshow-labels input, .autoshow-labels textarea'), function(el) {
    el.addEventListener('input', function() {
      if (this.value.length > 0) {
        var label = document.querySelector('label:not(.active)[for="' + this.id + '"]')
        if (label) {
          label.classList.add('active')
        }
      } else {
        var label = document.querySelector('label.active[for="' + this.id + '"]')
        if (label) {
          label.classList.remove('active')
        }
      }
    })
  })
}

function initContactForm() {
  document.querySelector('#contact_form').addEventListener('submit', contact)

  function contact(event) {
    event.preventDefault()

    var form = document.getElementById('contact_form')
    var message = document.getElementById('contact_message')

    var fields = form.querySelector('.fields')
    message.style.height = fields.offsetHeight + 'px'
    fields.style.display = 'none'
    message.style.display = 'table-cell'

    // ajax post
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

    xhr.send(params)
  }
}

