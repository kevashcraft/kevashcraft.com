// site initialization
document.addEventListener('DOMContentLoaded', init)

// global object
window.KA = {}

// initialization functions
function init() {
  initHatChart()
  initInputLabels()
  initTabController()
  initContactForm()
}

// creates pie chart
function initHatChart() {
  var ctx = document.getElementById('pie_chart').getContext('2d')
  var hatChart = new Chart(ctx, {
    type: 'pie',
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.labels[tooltipItem.index]
            return ' - ' + label
          }
        }
      }
    },
    data: {
      datasets: [{
        data: [100, 100, 100],
        // http://paletton.com/#uid=73x1q0ks5C0hoLJmOFY-Yv3AYnM
        backgroundColor: [
          'rgb(185, 23, 185)',
          'rgb(33, 118, 184)',
          'rgb(255, 159, 31)',
          // 'rgb(211, 248, 30)',
          ]
      }],
      labels: [
        'Database Admin',
        'Full-Stack Dev',
        'Linux Admin',
      ],
    },
  })
  
  function openTip(){
     var pointIndex = this.dataset.index
     var datasetIndex = 0
     if(hatChart.tooltip._active === undefined)
        hatChart.tooltip._active = []
     var activeElements = hatChart.tooltip._active;
     var requestedElem = hatChart.getDatasetMeta(datasetIndex).data[pointIndex];
     for(var i = 0; i < activeElements.length; i++) {
         if(requestedElem._index == activeElements[i]._index)
            return;
     }
  
     activeElements.push(requestedElem);
     hatChart.tooltip._active = activeElements;
     hatChart.tooltip.update(true);
     hatChart.draw();
  }
  
  function closeTips(){
    hatChart.tooltip._active = []
    hatChart.tooltip.update(true);
    hatChart.draw();
  }
  
  // add hatChart tooltip hover listerners on the head texts
  Array.prototype.forEach.call(document.querySelectorAll('#hat_titles p'), function(element) {
    element.addEventListener('mouseenter', openTip)
    element.addEventListener('mouseleave', closeTips)
  })
}

function initTabController() {
  // tab controller
  var tabsAll = document.querySelectorAll('.tabs')
  Array.prototype.forEach.call(tabsAll, function(tabs) {
  
    // click hide/show
    var anchors = tabs.querySelectorAll('a')
    Array.prototype.forEach.call(anchors, function(anchor) {
      anchor.addEventListener('click', function() {
        if (this.classList.contains('is-active')) return
        var tabs = this.parentElement.parentElement.parentElement
   
        // remove old active div
        var active = tabs.querySelector('.is-active')
        if (active) active.classList.remove('is-active')
    
        active = tabs.nextElementSibling.querySelector('.active')
        if (active) active.classList.remove('active')
    
        // activate new div
        this.parentElement.classList.add('is-active')
        var index = Array.prototype.indexOf.call(tabs.firstElementChild.children, tabs.firstElementChild.querySelector('.is-active'))
        if (index > -1)
          tabs.nextElementSibling.children[index].classList.add('active')
      })
    })
  })

  // show currently active tab content
  var tabsSelected = document.querySelectorAll('.tabs .is-active')
  Array.prototype.forEach.call(tabsSelected, function(selected) {
    var index = Array.prototype.indexOf.call(selected.parentElement.children, selected)
    if (index > -1) selected.parentElement.parentElement.nextElementSibling.children[index].classList.add('active')
  })
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

    console.log('params', params)
    xhr.send(params)
  }
}

