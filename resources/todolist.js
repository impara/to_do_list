/*
 * @author Yusuf Amer
 * @copyright June 2018
 */

/* Info
Used local storage
Content is extracted from local storage in to variable todoList.content
*/

var todoList = todoList || {},
    content = JSON.parse(localStorage.getItem("todoListContent"));

content = content || {};

(function(todoList, content, $) {

    var defaults = {
            todoListTask: "todoList-task",
            todoListHeader: "task-header",
            todoListDate: "task-date",
            todoListDescription: "task-description",
            taskId: "task-",
            formId: "todoList-form",
            contentAttrib: "content",
            delete: "delete"
        }, codes = {
            "1" : "#uafgjort",
            "2" : "#igang",
            "3" : "#afsluttet"
        };

    todoList.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(content, function (index, params) {
            generateElement(params);
        });

        /*generateElement({
            id: "1234",
            code: "1",
            title: "Lorem",
            date: "20/06/2018",
            description: "Lorem Ipsum"
        });*/

        /*removeElement({
            id: "1234",
            code: "1",
            title: "Lorem",
            date: "20/06/2018",
            description: "Lorem Ipsum"
        });*/

        // Add drop function to each category of task
        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(options.taskId, ""),
                            object = content[id];

                            // Remove old element
                            removeElement(object);

                            // Change object code
                            object.code = index;

                            // Generate new element
                            generateElement(object);

                            // Update Local Storage
                            content[id] = object;
                            localStorage.setItem("todoListContent", JSON.stringify(content));

                            // Hide Deleting Area
                            $("#" + defaults.delete).hide();
                    }
            });
        });

        // Adding drop function to delete div
        $("#" + options.delete).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = content[id];

                // Removing old element
                removeElement(object);

                // Updating local storage
                delete content[id];
                localStorage.setItem("todoListContent", JSON.stringify(content));

                // Hiding Delete Area
                $("#" + defaults.delete).hide();
            }
        });

    };

    // Add Task
    var generateElement = function(params){
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class" : defaults.todoListTask,
            "id" : defaults.taskId + params.id,
            "content" : params.id
        }).appendTo(parent);

        $("<div />", {
            "class" : defaults.todoListHeader,
            "text": params.title
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoListDate,
            "text": params.date
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoListDescription,
            "text": params.description
        }).appendTo(wrapper);

	    wrapper.draggable({
            start: function() {
                $("#" + defaults.delete).show();
            },
            stop: function() {
                $("#" + defaults.delete).hide();
            },
	        revert: "invalid",
	        revertDuration : 200
        });

    };

    // Remove Task
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };

    todoList.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Udfyld titel!",
            id, title, description, date, tempContent;

        if (inputs.length !== 4) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;

        if (!title) {
            generateDia(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempContent = {
            id : id,
            code: "1",
            title: title,
            date: date,
            description: description
        };

        // Saving element in local storage
        content[id] = tempContent;
        localStorage.setItem("todoListContent", JSON.stringify(content));

        // Generate Todo Element
        generateElement(tempContent);

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
    };

    var generateDia = function (message) {
        var responseId = "response-dialog",
            title = "Besked",
            responseDia = $("#" + responseId),
            buttonOptions;

        if (!responseDia.length) {
            responseDia = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDia.html(message);

        buttonOptions = {
            "Ok" : function () {
                responseDia.dialog("close");
            }
        };

	    responseDia.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todoList.clear = function () {
        content = {};
        localStorage.setItem("todoListContent", JSON.stringify(content));
        $("." + defaults.todoListTask).remove();
    };

})(todoList, content, jQuery);