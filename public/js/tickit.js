var task_length = 0;
var timer_handle;
var timing = false;

function duration(seconds) {
  var hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  var minutes = Math.floor(seconds / 60);
  seconds %= 60;
  return hours + "h " + minutes + "m " + seconds + "s";
}

/* Updates the clock to reflect current time in task */
function update() {
  $('#current').text(duration(task_length));
}

/* Executes a single second clock tick */
function tick() {
  task_length++;
  update();
  timer_handle = setTimeout(function() {
    tick();
  }, 1000);
}

/* Starts the clock */
function start() {
  if (timing) {
    return false;
  }
  timing = true;
  $('#toggle').attr('value', 'Stop');
  $('#log').attr('disabled', 'disabled');
  $('#nav').hide();
  $('#current').css('color', '#ff0000');
  update();
  timer_handle = setTimeout(function() {
    tick();
  }, 1000);
  return true;
}

/* Stops the clock */
function stop() {
  if (!timing) {
    return false;
  }
  timing = false;
  $('#toggle').attr('value', 'Start');
  $('#log').removeAttr('disabled');
  clearTimeout(timer_handle);
  return true;
}

/* Logs the current time spent to the total time spent */
function log() {
  if (timing || (task_length == 0)) {
    return false;
  }
  $.post('log', {"seconds":task_length}, function(data, textStatus) {
    $('#current').css('color', '#000000').text(duration(data.total_time));
  }, 'json');
  $('#nav').show();
  task_length = 0;
  return true;
}

$(document).ready(function() {

  /* Handle start/stop toggles */
  $('#toggle').click(function() {
    if (timing) {
      stop();
    }
    else {
      start();
    }
  });

  /* Reset the timer */
  $('#log').click(function() {
    log();
  });

  /* New project */
  $('#new').click(function() {
    var suppress = false;
    if ($(this).attr('href') == undefined) {
      suppress = true;
    }
    $(this).text('Really, New').attr('href', '/new');
    setTimeout(function() {
      $('#new').removeAttr('href').text('New');
    }, 2000);
    return !suppress;
  });

});
