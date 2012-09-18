STARS_VERBOSE = ['one', 'two', 'three', 'four', 'five']

class Room
  constructor: (data) ->
    @name = data.showName
    @meal = data.mealName

    if typeof @meal == "undefined" || @meal == ''
      @meal = 'Не известно'
    console.log(@meal)
    @hasMeal = (@meal != 'Без питания' && @meal != 'Не известно')

class RoomSet
  constructor: (data) ->
    @price = Math.ceil(data.rubPrice)

    @rooms = []
    for room in data.rooms
      @rooms.push new Room room
#
# Stacked hotel, FIXME can we use this as roomset ?
#
class HotelResult
  constructor: (data) ->
    # Mix in events
    _.extend @, Backbone.Events

    @hotelName = data.hotelName
    @address = data.address
    @description = data.description
    # FIXME check if we can get diffirent photos for different rooms in same hotel
    @photos = data.images
    @numPhotos = 0
    # FIXME trollface
    @frontPhoto =
      smallUrl: 'http://upload.wikimedia.org/wikipedia/en/thumb/7/78/Trollface.svg/200px-Trollface.svg.png'
      largeUrl: 'http://ya.ru'
    if @photos && @photos.length
      @frontPhoto = @photos[0]
      @numPhotos = @photos.length

    # for popup
    @activePhoto = @frontPhoto['largeUrl']
    # FIXME check if categoryId matches star rating
    @stars = STARS_VERBOSE[data.categoryId-1]
    @rating = data.rating
    # coords
    @lat = data.latitude / 1
    @lng = data.longitude / 1
    @distanceToCenter = Math.round(data.centerDistance/1000)

    @hasHotelServices = if data.facilities then true else false
    @hotelServices = data.facilities
    @hasRoomAmenities = if data.roomAmenities then true else false
    @roomAmenities = data.roomAmenities
    @roomSets = []
    @push data

  push: (data) ->
    set = new RoomSet data
    if @roomSets.length == 0
      @cheapest = set.price
    else
      @cheapest = if set.price < @cheapest then set.price else @cheapest
    @roomSets.push set

  showPhoto: =>
    new PhotoBox(@photos)


  # FIXME copy-pasted from avia
  # Shows popup with detailed info about given result
  showDetails: =>
    # If user had clicked read-more link
    @readMoreExpanded = false
    window.voyanga_debug "HOTELS: Setting popup result", @
    @trigger "popup", @
    $('body').prepend('<div id="popupOverlay"></div>')

    $('#hotels-body-popup').show()
    ko.processAllDeferredBindingUpdates()

    SizeBox('hotels-popup-body')
    ResizeBox('hotels-popup-body')
    sliderPhoto('.photo-slide-hotel')
    # FIXME explicitly call tab handler here ?
    $(".description .text").dotdotdot({watch: 'window'})

    # If we initialized google map already
    @mapInitialized = false

    $('#popupOverlay').click =>
      @closeDetails()

  showMapDetails: =>
    @showDetails()
    @showMap()

  # Hide popup with detailed info about given result
  closeDetails: =>
    window.voyanga_debug "Hiding popup"
    $('#hotels-body-popup').hide()
    $('#popupOverlay').remove()

  # Click handler for map/description in popup
  showMap: (context, event) =>
    el = $('#hotels-popup-tumblr-map')
    if el.hasClass('active')
      return
    $('.place-buy .tmblr li').removeClass('active')
    el.addClass('active')
    $('.tab').hide();
    $('#hotels-popup-map').show()
    $('#boxContent').css 'height', $('#hotels-popup-map').height() + $('#hotels-popup-header1').height() + $('#hotels-popup-header2').height() + 'px'
    if ! @mapInitialized
      coords = new google.maps.LatLng(@lat, @lng)
      mapOptions =
        center: coords
        zoom: 12
        mapTypeId: google.maps.MapTypeId.ROADMAP
      map = new google.maps.Map $('#hotels-popup-gmap')[0], mapOptions
      marker = new google.maps.Marker
        position: coords
        map: map
        title: @hotelName
      @mapInitialized = true
    SizeBox 'hotels-popup-body'

  showDescription: (context, event) ->
    el = $('#hotels-popup-tumblr-description')
    if el.hasClass('active')
      return
    $('.place-buy .tmblr li').removeClass('active')
    el.addClass('active')
    $('.tab').hide();
    $('#hotels-popup-description').show()
    $(".description .text").dotdotdot({watch: 'window'})
    $('#boxContent').css 'height', 'auto'
    SizeBox 'hotels-popup-body'

  #mapTumbler: (context, event) =>
  #  el = $(event.currentTarget)
  #  if ! el.hasClass('active')
  #    var_nameBlock = el.attr('href')
  #    var_nameBlock = var_nameBlock.slice(1)
  #    $('.place-buy .tmblr li').removeClass('active')
  #    el.parent().addClass('active')
  #    $('.tab').hide();
  #    $('#'+var_nameBlock).show()

#    sliderPhoto('.photo-slide-hotel');
#    $('a.photo').click(function(e) {
#      e.preventDefault();
#      createPhotoBox(this);
#    });
#    $(".description .text").dotdotdot({watch: 'window'});


  # Click handler for read more button in popup
  readMore: (context, event)->
    el = $(event.currentTarget)
    if ! el.hasClass('active')
      var_heightCSS = el.parent().find('.text').css('height');
      var_heightCSS = Math.abs(parseInt(var_heightCSS.slice(0,-2)));
      el.parent().find('.text').attr('rel',var_heightCSS).css('height','auto');
      $(".description .text").dotdotdot({watch: 'window'});
      $(".description .text").css('overflow','visible');
      el.text('Свернуть');
      el.addClass('active');
    else
      rel = el.parent().find('.text').attr('rel');
      el.parent().find('.text').css('height', rel+'px');
      el.text('Подробнее');
      el.removeClass('active');
      $(".description .text").dotdotdot({watch: 'window'});
      $(".description .text").css('overflow','hidden');
    SizeBox('hotels-popup-body')

  smallMapUrl: =>
      base = "http://maps.googleapis.com/maps/api/staticmap?zoom=13&size=310x259&maptype=roadmap&markers=color:red%7Ccolor:red%7C"
      base += "%7C"
      base += @lat + "," + @lng
      base += "&sensor=false"
      return base



#
# Result container
# Stacks them by price and company
#
class HotelsResultSet
  constructor: (rawHotels,duraion = 0) ->
    @_results = {}

    if duraion == 0
      for hotel in rawHotels
        checkIn = hotel.checkIn;
    for hotel in rawHotels
      key = hotel.hotelId
      if @_results[key]
        @_results[key].push hotel
      else
        result =  new HotelResult hotel
        @_results[key] = result
        result.on "popup", (data)=>
          @popup data

    # We need array for knockout to work right
    @data = []

    for key, result of @_results
      @data.push result

    @popup = ko.observable @data[0]


# Model for Hotel info params,
# Used in infoAcion controller
class HotelInfoParams
  constructor: ->
    @cacheId = ''
    @hotelId = ''

  url: ->
    result = 'http://api.voyanga/v1/hotel/search/info/'+@cacheId+'/'+@hotelId+'/'

    return result


  key: ->
    key = @dep() + @arr() + @date
    if @rt
      key += @rt_date
    key += @adults()
    key += @children()
    key += @infants()
    return key

  getHash: ->
    # FIXME
    hash = 'avia/search/' + [@dep(), @arr(), @date, @adults(), @children(), @infants()].join('/') + '/'
    window.voyanga_debug "Generated hash for avia search", hash
    return hash


  fromList: (data)->
    @cacheId data[0]
    @hotelId data[1]
