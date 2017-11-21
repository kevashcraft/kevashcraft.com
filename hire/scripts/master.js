var KA = {}
window.KA = KA

var ctx = document.getElementById('pie_chart').getContext('2d')

KA.hatChart = new Chart(ctx, {
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

KA.openTip = function(pointIndex){
  var oChart = KA.hatChart
   var datasetIndex = 0
   if(oChart.tooltip._active === undefined)
      oChart.tooltip._active = []
   var activeElements = oChart.tooltip._active;
   var requestedElem = oChart.getDatasetMeta(datasetIndex).data[pointIndex];
   for(var i = 0; i < activeElements.length; i++) {
       if(requestedElem._index == activeElements[i]._index)
          return;
   }

   activeElements.push(requestedElem);
   oChart.tooltip._active = activeElements;
   oChart.tooltip.update(true);
   oChart.draw();
}

KA.closeTips = function(){
  KA.hatChart.tooltip._active = []
  KA.hatChart.tooltip.update(true);
  KA.hatChart.draw();
}

var hatTitles = document.getElementById('hat_titles').getElementsByTagName('p')
for (var i = 0; i < hatTitles.length; i++) {
  var element = hatTitles[i]

  element.addEventListener('mouseenter', function() {
    // var index = Array.prototype.indexOf.call(this.parentNode.children, this)
    var index = this.dataset.index
    KA.openTip(index)
  })

  element.addEventListener('mouseleave', function() {
    KA.closeTips()
  })

}

var tabShow = function() {
  var tabName = this.dataset.tab || this.closest('[data-tab]').dataset.tab
  
  var tabContainer = this.closest('.tab-container')

  // add active class to tab anchors
  var tabAnchors = tabContainer.querySelectorAll('ul li a')
  for (var i = 0; i < tabAnchors.length; i++) {
    var tabAnchor = tabAnchors[i]
    if (tabAnchor.dataset.tab === tabName) {
      tabAnchor.parentElement.classList.add('active')
    } else {
      tabAnchor.parentElement.classList.remove('active')
    }
  }

  // show/hide tabs
  var tabs = tabContainer.querySelectorAll('div div[data-tab]')
  for (var i = 0; i < tabs.length; i++) {
    var tab = tabs[i]
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active')
    } else {
      tab.classList.remove('active')
    }
  }
}

var tabContainers = document.querySelectorAll('.tab-container')
for (var i = 0; i < tabContainers.length; i++) {
 var tabContainer = tabContainers[i]
 var anchors = tabContainer.querySelectorAll('ul li a')
 for (var j = 0; j < anchors.length; j++) {
   var anchor = anchors[j]
   anchor.addEventListener('click', tabShow)
 }
}

// input labels show
Array.prototype.forEach.call(document.querySelectorAll('.contact-form input, .contact-form textarea'), function(el) {
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
