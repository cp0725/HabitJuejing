function home(){
  this.weatherUrl = `http://api.map.baidu.com/telematics/v3/weather?location=北京&output=json&ak=CWsCMLXfU0t4tDWGRDp8wSq4t0StfsOn&n=${+new Date()}`
  this.inputSearch = document.querySelector('.search')

  this.init = function() {
    myAjax('GET', './home/link.json', null, (res) => {
      this.viewLink(res.linkList)
      this.viewLogo(res.linkLogo)
    })
    myAjax('GET', this.weatherUrl, null, (res) => {
      if (res.status == 'success' && res.results && res.results[0] && res.results[0].weather_data) {
        document.querySelector('.weather-wrap .tit').innerHTML = res.results[0].weather_data[0].temperature
        document.querySelector('.weather-wrap .weather').setAttribute('src', res.results[0].weather_data[0].dayPictureUrl)
      }
    })
    this.removeJuejingDom()
    this.inputSearch.focus()
  }
  this.viewLink = list => {
      const HTML = list.map(item => `
      <ul>
        ${this.viewItem(item.linkList)}
        <span>${item.type}</span>
      </ul>  
    `)
    document.querySelector('.link-wrap').innerHTML = HTML.join('')
  }
  this.viewItem = list => {
      const HTML = list.map(item => `
      <a href="${item.link}">
        <li>${item.title}</li>
      </a>  
    `)
    return HTML.join('')
  }
  this.viewLogo = list => {
    const HTML = list.map(item => `
      <li>
        <a href="${item.link}">
          <img src="${item.ioc}">
        </a>
      </li>
    `)
    document.querySelector('#header-logo ul').innerHTML = HTML.join('')
  }
  this.removeJuejingDom = () => {
    let tim1, tim2
    tim1 = setInterval(() => {
      if (document.querySelector('.navbar')){
        document.querySelector('.navbar').innerHTML = ''
        clearInterval(tim1)
      }
    }, 50)
    tim2 = setInterval(() => {
      if (document.querySelector('.other-source')) {
        document.querySelector('.other-source').remove()
        clearInterval(tim2)
      }
    }, 50)
  }

  this.bindEvent = () => {
    document.querySelector('.baidu').onclick = eve => {
      location.href = `https://www.baidu.com/s?wd=${this.inputSearch.value}`
    }
    document.querySelector('.google').onclick = eve => {
      location.href = `https://www.google.com.hk/search?q=${this.inputSearch.value}`
    }
    let keyCode = 0
    this.inputSearch.onkeydown = eve => {
      if (event.keyCode == 13 && keyCode != 16) {
        document.querySelector('.baidu').click()
      } else if (event.keyCode == 13 && keyCode == 16){
        document.querySelector('.google').click()
      }
      keyCode = event.keyCode
    }
  }
}
const Home = new home()
Home.init()
Home.bindEvent()

function myAjax(type, url, data, fun) {
  let ajax = new XMLHttpRequest()
  ajax.open(type, url, true)
  // ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  // ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  ajax.send(data)
  ajax.onreadystatechange = function () {
    if (ajax.readyState == 4 && ajax.status == 200) {
      fun(JSON.parse(ajax.responseText))
    }
  }
}
