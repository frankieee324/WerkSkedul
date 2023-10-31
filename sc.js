var Hours = [9, 10, 11, 12, 13, 14, 15, 16, 17] 

function AMorPM(hour) {
  let meridiem;
  if (hour <= 11) {
    meridiem = "AM"
  } else if (hour >= 12 && hour <= 24) {
    meridiem = "PM"
  } else {
    console.log('invalide time')
  }
  return meridiem
}

function createTimeBlockElements() {
 
  let allBlocks = $('#time-blocks')

  for (var i = 0; i < Hours.length; i++) {
  
    let blockContainerEl = $('<div>', { class: 'row time-block' });
    let eventHourEl = $('<div>', { class: 'col-2 col-md-1 hour text-center py-3' });
    let eventTextEl = $('<textarea>', { class: 'col-8 col-md-10 description', rows: '3' });
    let eventSaveBtn = $('<button class="btn saveBtn col-2 col-md-1" aria-label="save"><i class="fas fa-save" aria-hidden="true"></i></button>');

   
    let currentHour = Hours[i];
    blockContainerEl.attr('id', 'hour-' + currentHour)
    if (currentHour > 12) {
      eventHourEl.text((currentHour - 12) + AMorPM(currentHour));
    } else {
      eventHourEl.text(currentHour + AMorPM(currentHour));
    }


    blockContainerEl.append([eventHourEl, eventTextEl, eventSaveBtn])
    allBlocks.append(blockContainerEl)

  }
}

function renderEventText() {
  for (let index = 0; index < Hours.length; index++) {
    let timeBlock = $('#hour-' + Hours[index]);
    let eventText = $(timeBlock).children('.description')

    let storedEvent = localStorage.getItem('hour-' + Hours[index] + '-event')
    if (storedEvent != null) {
      eventText.val(storedEvent);
    }
  }
}
function updateWithCurrentTimeState(currentTimeState) {
  for (let index = 0; index < Hours.length; index++) {
    let elementHour = Hours[index]
    let myTime = $('#hour-' + elementHour);
    if (elementHour == currentTimeState) {
      myTime.addClass('present')
      myTime.removeClass('past future')
    } else if (elementHour > currentTimeState) {
      myTime.addClass('future')
      myTime.removeClass('past present')
    } else {
      myTime.addClass('past')
      myTime.removeClass('present future')
    }

  }
}


$(function () {

  createTimeBlockElements();
  renderEventText();

  const currentDayElement = $('#currentDay');
  const currentDay = dayjs();
  currentDayElement.text(currentDay.format('dddd, MMMM D') + 'th');

 
  const saveBtns = $('#time-blocks').children().children('button');


 
  saveBtns.on('click', function () {
  
    let timeBlock = $(this).parent('.time-block')
    let eventText = $(timeBlock).children('.description').val();

    localStorage.setItem(timeBlock.attr('id') + '-event', eventText);
    renderEventText();

    
    let hourText = $(timeBlock).children('.hour').text()
    let apppointmentConfirmation = $('<p>').text('Your ' + hourText + ' appointment has been added ✅')
    let timeDisplayed = 5;
    $('header').append(apppointmentConfirmation)
    let displayAppointmentConfirmation = setInterval(function () {
      timeDisplayed--;

      if (timeDisplayed <= 0) {
        clearInterval(displayAppointmentConfirmation);
        apppointmentConfirmation.fadeOut()
      }
    }, 1000)
  })

  updateWithCurrentTimeState(currentDay.format('H'));
});