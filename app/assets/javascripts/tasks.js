$(function() {
  // taskHtml method taks JS representation of the task
  // and produces an HTML representation using <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done ? "checked" : "";
    var liElement = '<li><div class="view"><input class="toggle" type="checkbox"' +
      " data-id='" + task.id + "'" +
      checkedStatus +
      '><label>' +
       task.title +
       '</label></div></li>';

    return liElement;
  }

  // toggleTask takes an HTML rep of an event that 
  // fires from an HTML rep of the toggle checkbox and
  // performs an API req to toggle the val of 'done' field
  function toggleTask(e) {
    var itemId = $(e.target).data("id");

    var doneValue = Boolean($(e.target).is(':checked'));
    
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    });
  }
  // after successful page load, allow functions above
  // taskHtml and toggleTask to work
  $.get("/tasks").success( function( data ) {
    var htmlString = "";

    $.each(data, function(index,  task) {
      htmlString += taskHtml(task);
    });
    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);

    $('.toggle').change(toggleTask);
  });

  // allow submission of new tasks
  $('#new-form').submit(function(event) {
    event.preventDefault();
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    $.post("/tasks", payload).success(function(data) {
      var htmlString = taskHtml(data);
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.toggle').click(toggleTask);
      $('.new-todo').val('');
    });
  });

});