export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=6b728d458803b1b1b7093e1610def58e&callback=initAMap'
      script.onerror = reject
      var script2 = document.createElement('script')
      script2.type = 'text/javascript'
      script2.async = true
      script2.src = 'https://webapi.amap.com/ui/1.0/main-async.js'
      script2.onerror = reject
      document.head.appendChild(script)
      document.head.appendChild(script2)
    }
    window.initAMap = () => {
      resolve(window.AMap)
      initAMapUI()
    }
  })
}
