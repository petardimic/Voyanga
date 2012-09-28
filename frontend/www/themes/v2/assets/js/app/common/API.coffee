class API
  constructor: ->
    @endpoint = 'http://api.voyanga.com/v1/'

  call: (url, cb) =>
    $('#loadWrapBg').show()

    #  $(document).trigger 'aviaStart'
    $.ajax
      url: "#{@endpoint}#{url}"
      dataType: 'jsonp'
      success: (data)->
        cb(data)
        $('#loadWrapBg').hide()

class ToursAPI extends API
  search: (cb)=>
    @call "tour/search?start=BCN&destinations%5B0%5D%5Bcity%5D=MOW&destinations%5B0%5D%5BdateFrom%5D=01.10.2012&destinations%5B0%5D%5BdateTo%5D=10.10.2012&rooms%5B0%5D%5Badt%5D=1&rooms%5B0%5D%5Bchd%5D=0&rooms%5B0%5D%5BchdAge%5D=0&rooms%5B0%5D%5Bcots%5D=0", (data) -> cb(data)