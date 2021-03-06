// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
// 
// Version 0.9.1
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.

/*
Copyright (c) 2011 by Harvest
Modified by Andrei Bocan
*/


(function() {
  var $, Chosen, ChosenBase, ChosenMultiple, ChosenSingle, get_side_border_padding, get_target_from_event, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if ($.browser.msie && ($.browser.version === "6.0" || $.browser.version === "7.0")) {
        return this;
      }
      return $(this).each(function(input_field) {
        if (!$(this).hasClass("chzn-done")) {
          return new Chosen(this, options);
        }
      });
    }
  });

  ChosenBase = (function() {

    function ChosenBase(element, options) {
      this.keydown_checker = __bind(this.keydown_checker, this);

      this.keyup_checker = __bind(this.keyup_checker, this);

      this.choices_click = __bind(this.choices_click, this);

      this.search_results_mouseout = __bind(this.search_results_mouseout, this);

      this.search_results_mouseover = __bind(this.search_results_mouseover, this);

      this.search_results_mouseup = __bind(this.search_results_mouseup, this);

      this.update_select_state = __bind(this.update_select_state, this);

      this.results_update_field = __bind(this.results_update_field, this);

      this.test_active_click = __bind(this.test_active_click, this);

      this.activate_field = __bind(this.activate_field, this);

      this.close_field = __bind(this.close_field, this);

      this.blur_test = __bind(this.blur_test, this);

      this.input_blur = __bind(this.input_blur, this);

      this.input_focus = __bind(this.input_focus, this);

      this.mouse_leave = __bind(this.mouse_leave, this);

      this.mouse_enter = __bind(this.mouse_enter, this);

      this.container_mousedown = __bind(this.container_mousedown, this);
      this.options = $.extend({
        display_search_box: $.fn.chosenDisplaySearch || true
      }, options);
      this.set_default_values();
      this.form_field = element;
      this.$form_field = $(this.form_field);
      this.is_rtl = this.$form_field.hasClass("chzn-rtl");
      this.set_up_html();
      this.register_observers();
      this.$form_field.addClass("chzn-done");
      this.update_select_state();
    }

    ChosenBase.prototype.default_text = function() {
      if (this.$form_field.data('placeholder')) {
        return this.$form_field.data('placeholder');
      }
      if (this.form_field.multiple) {
        return "Select Some Options";
      } else {
        return "Select an Option";
      }
    };

    ChosenBase.prototype.set_default_values = function() {
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.choices = 0;
      return this.results_none_found = this.options.no_results_text || "No results match";
    };

    ChosenBase.prototype.container_id = function() {
      var container_id;
      container_id = this.form_field.id.length ? this.form_field.id.replace(/(:|\.)/g, '_') : this.generate_field_id();
      return container_id += "_chzn";
    };

    ChosenBase.prototype.additional_container_classes = function() {
      if (this.is_rtl) {
        return 'chzn-rtl';
      } else {
        return '';
      }
    };

    ChosenBase.prototype.build_container_div = function() {
      var container_div;
      container_div = $("<div />", {
        id: this.container_id(),
        "class": "chzn-container " + (this.additional_container_classes()),
        style: "width: " + this.f_width + "px"
      });
      return container_div.html(this.container_div_content());
    };

    ChosenBase.prototype.set_up_html = function() {
      this.f_width = this.$form_field.outerWidth();
      this.$form_field.hide().after(this.build_container_div());
      this.container = $('#' + this.container_id());
      this.dropdown = this.container.find('div.chzn-drop').first();
      this.set_container_class();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chzn-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      this.initialize_search_container();
      this.results_build();
      return this.set_tab_index();
    };

    ChosenBase.prototype.register_observers = function() {
      this.container.mousedown(this.container_mousedown);
      this.container.mouseenter(this.mouse_enter);
      this.container.mouseleave(this.mouse_leave);
      this.search_results.mouseup(this.search_results_mouseup);
      this.search_results.mouseover(this.search_results_mouseover);
      this.search_results.mouseout(this.search_results_mouseout);
      this.$form_field.bind("liszt:updated", this.results_update_field);
      this.search_field.blur(this.input_blur);
      this.search_field.keyup(this.keyup_checker);
      return this.search_field.keydown(this.keydown_checker);
    };

    ChosenBase.prototype.container_mousedown = function(evt) {
      if (this.disabled) {
        return;
      }
      if (evt && evt.type === "mousedown") {
        evt.stopPropagation();
      }
      if (!this.pending_destroy_click) {
        if (!this.active_field) {
          if (this.is_multiple) {
            this.search_field.val("");
          }
          $(document).click(this.test_active_click);
          this.results_show();
        } else if (!this.is_multiple && evt && ($(evt.target) === this.selected_item || $(evt.target).parents("a.chzn-single").length)) {
          evt.preventDefault();
          this.results_toggle();
        }
        return this.activate_field();
      } else {
        return this.pending_destroy_click = false;
      }
    };

    ChosenBase.prototype.select_item = function(index) {
      var id, item;
      item = this.results_data[index + ''];
      id = this.option_id_for_index(item.array_index);
      this.selected_item.find("span").first().text(item.text);
      this.container.find('li.result-selected').removeClass('result-selected');
      return $("#" + id).addClass('result-selected');
    };

    ChosenBase.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    ChosenBase.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    ChosenBase.prototype.input_focus = function(evt) {
      if (!this.active_field) {
        return setTimeout(this.container_mousedown, 50);
      }
    };

    ChosenBase.prototype.input_blur = function(evt) {
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(this.blur_test, 100);
      }
    };

    ChosenBase.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chzn-container-active")) {
        return this.close_field();
      }
    };

    ChosenBase.prototype.close_field = function() {
      $(document).unbind("click", this.test_active_click);
      if (!this.is_multiple) {
        this.selected_item.attr("tabindex", this.search_field.attr("tabindex"));
        this.search_field.attr("tabindex", -1);
      }
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chzn-container-active");
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    ChosenBase.prototype.activate_field = function() {
      if (this.disabled) {
        return;
      }
      if (!this.is_multiple && !this.active_field) {
        this.search_field.attr("tabindex", this.selected_item.attr("tabindex"));
        this.selected_item.attr("tabindex", -1);
      }
      this.container.addClass("chzn-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    ChosenBase.prototype.test_active_click = function(evt) {
      if ($(evt.target).parents('#' + this.container_id()).length) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    ChosenBase.prototype.results_build = function() {
      var content, data, _i, _len, _ref;
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.find("li.search-choice").remove();
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.find("span").text(this.default_text());
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.find("span").text(data.text);
          }
        }
      }
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.html(content);
      return this.parsing = false;
    };

    ChosenBase.prototype.result_add_group = function(group) {
      if (!group.disabled) {
        group.dom_id = this.container_id() + "_g_" + group.array_index;
        return "<li id=\"" + group.dom_id + "\" class=\"group-result\">" + ($("<div />").text(group.label).html()) + "</li>";
      } else {
        return "";
      }
    };

    ChosenBase.prototype.option_id_for_index = function(index) {
      return this.container_id() + "_o_" + index;
    };

    ChosenBase.prototype.result_add_option = function(option) {
      var classes;
      if (!option.disabled) {
        option.dom_id = this.option_id_for_index(option.array_index);
        classes = option.selected && this.is_multiple ? [] : ["active-result"];
        if (option.selected) {
          classes.push("result-selected");
        }
        if (option.group_array_index != null) {
          classes.push("group-option");
        }
        return "<li id=\"" + option.dom_id + "\" class=\"" + (classes.join(' ')) + "\">" + option.html + "</li>";
      } else {
        return "";
      }
    };

    ChosenBase.prototype.results_update_field = function() {
      this.result_clear_highlight();
      this.result_single_selected = null;
      this.results_build();
      return this.update_select_state();
    };

    ChosenBase.prototype.update_select_state = function() {
      this.disabled = this.$form_field.attr('disabled') === 'disabled';
      if (this.disabled) {
        return this.container.addClass('disabled');
      } else {
        return this.container.removeClass('disabled');
      }
    };

    ChosenBase.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    ChosenBase.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    ChosenBase.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    ChosenBase.prototype.results_show = function() {
      this.results_showing = true;
      this.update_dropdown_width();
      this.dropdown.css({
        top: this.dropdown_top(),
        left: 0
      });
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };

    ChosenBase.prototype.update_search_field_width = function() {
      return this.search_field.css({
        width: this.search_field_width() + "px"
      });
    };

    ChosenBase.prototype.update_dropdown_width = function() {
      return this.dropdown.css({
        width: this.dropdown_width() + "px"
      });
    };

    ChosenBase.prototype.update_dropdown_position = function() {
      return this.dropdown.css({
        top: this.dropdown_top() + "px"
      });
    };

    ChosenBase.prototype.dropdown_top = function() {
      return this.container.height();
    };

    ChosenBase.prototype.dropdown_width = function() {
      return this.f_width - get_side_border_padding(this.dropdown);
    };

    ChosenBase.prototype.results_hide = function() {
      if (!this.is_multiple) {
        this.selected_item.removeClass("chzn-single-with-drop");
      }
      this.result_clear_highlight();
      this.dropdown.css({
        left: "-9000px"
      });
      return this.results_showing = false;
    };

    ChosenBase.prototype.add_new_option_and_select = function(text, value) {
      var new_option;
      new_option = jQuery('<option />');
      new_option.text(text);
      new_option.val(value);
      new_option.appendTo(this.$form_field);
      this.results_update_field();
      this.result_highlight = this.search_results.find('li:last-child');
      return this.result_select({
        metaKey: true
      });
    };

    ChosenBase.prototype.set_tab_index = function() {
      var ti;
      if (!this.$form_field.attr("tabindex")) {
        return;
      }
      ti = this.$form_field.attr("tabindex");
      this.$form_field.attr("tabindex", -1);
      return this.update_selected_tab_index(ti);
    };

    ChosenBase.prototype.search_results_mouseup = function(evt) {
      var target;
      target = get_target_from_event(evt);
      if (target.length) {
        this.result_highlight = target;
        return this.result_select(evt);
      }
    };

    ChosenBase.prototype.search_results_mouseover = function(evt) {
      var target;
      target = get_target_from_event(evt);
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    ChosenBase.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    ChosenBase.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (this.active_field && !($(evt.target).hasClass("search-choice" || $(evt.target).parents('.search-choice').first)) && !this.results_showing) {
        return this.results_show();
      }
    };

    ChosenBase.prototype.choice_build = function(item) {
      var choice_id, link,
        _this = this;
      choice_id = this.container_id() + "_c_" + item.array_index;
      this.choices += 1;
      this.search_container.before("<li class=\"search-choice\" id=\"" + choice_id + "\">\n  <span>" + item.html + "</span>\n  <a href=\"javascript:void(0)\" class=\"search-choice-close\" rel=\"" + item.array_index + "\"></a>\n</li>");
      link = $('#' + choice_id).find("a").first();
      return link.click(function(evt) {
        return _this.choice_destroy_link_click(evt);
      });
    };

    ChosenBase.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      this.pending_destroy_click = true;
      return this.choice_destroy($(evt.target));
    };

    ChosenBase.prototype.choice_destroy = function(link) {
      this.choices -= 1;
      this.show_search_field_default();
      if (this.is_multiple && this.choices > 0 && this.search_field.val().length < 1) {
        this.results_hide();
      }
      this.result_deselect(link.attr("rel"));
      return link.parents('li').first().remove();
    };

    ChosenBase.prototype.result_select = function(evt) {
      var high, high_id, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        high_id = high.attr("id");
        this.result_clear_highlight();
        high.addClass("result-selected");
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.result_single_selected = high;
        }
        position = high_id.substr(high_id.lastIndexOf("_") + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.find("span").first().text(item.text);
        }
        if (!(evt.metaKey && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        this.$form_field.trigger("change");
        return this.search_field_scale();
      }
    };

    ChosenBase.prototype.result_activate = function(el) {
      return el.addClass("active-result").show();
    };

    ChosenBase.prototype.result_deactivate = function(el) {
      return el.removeClass("active-result").hide();
    };

    ChosenBase.prototype.result_deselect = function(pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      result_data.selected = false;
      this.form_field.options[result_data.options_index].selected = false;
      result = $("#" + this.container_id() + "_o_" + pos);
      result.removeClass("result-selected").addClass("active-result").show();
      this.result_clear_highlight();
      this.winnow_results();
      this.$form_field.trigger("change");
      return this.search_field_scale();
    };

    ChosenBase.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    ChosenBase.prototype.winnow_results = function() {
      var found, option, part, parts, regex, result_id, results, searchText, startpos, text, _i, _j, _len, _len1, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.search_field.val() === this.default_text() ? "" : $('<div/>').text($.trim(this.search_field.val())).html();
      regex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $('#' + option.dom_id).hide();
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0) {
              parts = option.html.replace(/\[|\]/g, "").split(" ");
              if (parts.length) {
                for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(regex);
                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              if ($("#" + result_id).html !== text) {
                $("#" + result_id).html(text);
              }
              this.result_activate($("#" + result_id));
              if (option.group_array_index != null) {
                $("#" + this.results_data[option.group_array_index].dom_id).show();
              }
            } else {
              if (this.result_highlight && result_id === this.result_highlight.attr('id')) {
                this.result_clear_highlight();
              }
              this.result_deactivate($("#" + result_id));
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        this.no_results(searchText);
      } else {
        this.winnow_results_set_highlight();
      }
      return this.$form_field.trigger("liszt:results");
    };

    ChosenBase.prototype.winnow_results_clear = function() {
      var li, lis, _i, _len, _results;
      this.search_field.val("");
      lis = this.search_results.find("li");
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        li = $(li);
        if (li.hasClass("group-result")) {
          _results.push(li.show());
        } else if (!this.is_multiple || !li.hasClass("result-selected")) {
          _results.push(this.result_activate(li));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ChosenBase.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      if (!this.result_highlight) {
        selected_results = !this.is_multiple ? this.search_results.find(".result-selected") : [];
        do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
        if (do_high != null) {
          return this.result_do_highlight(do_high);
        }
      }
    };

    ChosenBase.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $("<li class=\"no-results\">" + this.results_none_found + " \"<span></span>\"</li>");
      no_results_html.find("span").first().html(terms);
      return this.search_results.append(no_results_html);
    };

    ChosenBase.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    ChosenBase.prototype.keydown_arrow = function() {
      var first_active, next_sib;
      if (!this.result_highlight) {
        first_active = this.search_results.find("li.active-result").first();
        if (first_active) {
          this.result_do_highlight($(first_active));
        }
      } else if (this.results_showing) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          this.result_do_highlight(next_sib);
        }
      }
      if (!this.results_showing) {
        return this.results_show();
      }
    };

    ChosenBase.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    ChosenBase.prototype.keydown_backstroke = function() {
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        this.pending_backstroke = this.search_container.siblings("li.search-choice").last();
        return this.pending_backstroke.addClass("search-choice-focus");
      }
    };

    ChosenBase.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    ChosenBase.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      if (this.disabled) {
        return;
      }
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            return this.results_hide();
          }
          break;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    ChosenBase.prototype.keydown_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          this.keydown_arrow();
          break;
      }
    };

    ChosenBase.prototype.search_field_scale = function() {};

    ChosenBase.prototype.generate_field_id = function() {
      var new_id;
      new_id = this.generate_random_id();
      this.form_field.id = new_id;
      return new_id;
    };

    ChosenBase.prototype.generate_random_id = function() {
      var string;
      string = "sel" + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
      while ($("#" + string).length > 0) {
        string += this.generate_random_char();
      }
      return string;
    };

    ChosenBase.prototype.generate_random_char = function() {
      var chars, newchar, rand;
      chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
      rand = Math.floor(Math.random() * chars.length);
      return newchar = chars.substring(rand, rand + 1);
    };

    return ChosenBase;

  })();

  ChosenSingle = (function(_super) {

    __extends(ChosenSingle, _super);

    function ChosenSingle() {
      this.select_changed = __bind(this.select_changed, this);
      return ChosenSingle.__super__.constructor.apply(this, arguments);
    }

    ChosenSingle.prototype.is_multiple = false;

    ChosenSingle.prototype.should_display_search_box = function() {
      var search_box;
      search_box = this.options['display_search_box'];
      if (typeof search_box === 'function') {
        return search_box(this);
      } else {
        return search_box;
      }
    };

    ChosenSingle.prototype.container_div_content = function() {
      return "<a href=\"javascript:void(0)\" class=\"chzn-single\">\n  <span>" + (this.default_text()) + "</span>\n  <div><b></b></div>\n</a>\n<div class=\"chzn-drop\" style=\"left:-9000px;\">\n  <div class=\"chzn-search\">\n    <input type=\"text\" autocomplete=\"off\" />\n  </div>\n  <ul class=\"chzn-results\"></ul>\n</div>";
    };

    ChosenSingle.prototype.initialize_search_container = function() {
      this.search_container = this.container.find('div.chzn-search').first();
      return this.selected_item = this.container.find('.chzn-single').first();
    };

    ChosenSingle.prototype.search_field_width = function() {
      return this.dropdown_width() - get_side_border_padding(this.search_container) - get_side_border_padding(this.search_field);
    };

    ChosenSingle.prototype.register_observers = function() {
      ChosenSingle.__super__.register_observers.apply(this, arguments);
      this.selected_item.focus(this.activate_field);
      return this.$form_field.change(this.select_changed);
    };

    ChosenSingle.prototype.select_changed = function(evt) {
      return this.select_item(this.form_field.selectedIndex);
    };

    ChosenSingle.prototype.set_container_class = function() {
      return this.container.addClass("chzn-container-single");
    };

    ChosenSingle.prototype.update_selected_tab_index = function(ti) {
      this.selected_item.attr("tabindex", ti);
      return this.search_field.attr("tabindex", -1);
    };

    ChosenSingle.prototype.results_show = function() {
      this.selected_item.addClass("chzn-single-with-drop");
      if (this.result_single_selected) {
        this.result_do_highlight(this.result_single_selected);
      }
      this.update_search_field_width();
      return ChosenSingle.__super__.results_show.apply(this, arguments);
    };

    ChosenSingle.prototype.show_search_field_default = function() {
      this.search_field.val("");
      this.search_field.removeClass("default");
      if (!this.should_display_search_box()) {
        return this.search_field.hide();
      }
    };

    ChosenSingle.prototype.dropdown_top = function() {
      return this.container.height() - 1;
    };

    return ChosenSingle;

  })(ChosenBase);

  ChosenMultiple = (function(_super) {

    __extends(ChosenMultiple, _super);

    function ChosenMultiple() {
      return ChosenMultiple.__super__.constructor.apply(this, arguments);
    }

    ChosenMultiple.prototype.is_multiple = true;

    ChosenMultiple.prototype.container_div_content = function() {
      return "<ul class=\"chzn-choices\">\n  <li class=\"search-field\">\n    <input type=\"text\" value=\"" + (this.default_text()) + "\" class=\"default\" autocomplete=\"off\" style=\"width:25px;\" />\n  </li>\n</ul>\n<div class=\"chzn-drop\" style=\"left:-9000px;\">\n  <ul class=\"chzn-results\"></ul>\n</div>";
    };

    ChosenMultiple.prototype.initialize_search_container = function() {
      this.search_choices = this.container.find('ul.chzn-choices').first();
      return this.search_container = this.container.find('li.search-field').first();
    };

    ChosenMultiple.prototype.register_observers = function() {
      ChosenMultiple.__super__.register_observers.apply(this, arguments);
      this.search_choices.click(this.choices_click);
      return this.search_field.focus(this.input_focus);
    };

    ChosenMultiple.prototype.set_container_class = function() {
      return this.container.addClass("chzn-container-multi");
    };

    ChosenMultiple.prototype.update_selected_tab_index = function(ti) {
      return this.search_field.attr("tabindex", ti);
    };

    ChosenMultiple.prototype.show_search_field_default = function() {
      if (this.choices < 1 && !this.active_field) {
        this.search_field.val(this.default_text());
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    ChosenMultiple.prototype.search_field_scale = function() {
      var div, h, style, style_block, styles, w, _i, _len;
      h = 0;
      w = 0;
      style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
      styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
      for (_i = 0, _len = styles.length; _i < _len; _i++) {
        style = styles[_i];
        style_block += style + ":" + this.search_field.css(style) + ";";
      }
      div = $('<div />', {
        'style': style_block
      });
      div.text(this.search_field.val());
      $('body').append(div);
      w = div.width() + 25;
      div.remove();
      if (w > this.f_width - 10) {
        w = this.f_width - 10;
      }
      this.search_field.css({
        width: w + 'px'
      });
      return this.update_dropdown_position();
    };

    ChosenMultiple.prototype.update_dropdown_width = function() {
      return this.dropdown.css({
        width: this.dropdown_width() + 'px'
      });
    };

    return ChosenMultiple;

  })(ChosenBase);

  Chosen = (function() {

    function Chosen(element, options) {
      var chosen;
      if (element.multiple) {
        chosen = new ChosenMultiple(element, options);
      } else {
        chosen = new ChosenSingle(element, options);
      }
      $(element).data('chosen', chosen);
      return chosen;
    }

    return Chosen;

  })();

  get_target_from_event = function(evt) {
    if ($(evt.target).hasClass("active-result")) {
      return $(evt.target);
    } else {
      return $(evt.target).parents(".active-result").first();
    }
  };

  get_side_border_padding = function(elmt) {
    return elmt.outerWidth() - elmt.width();
  };

  root.get_side_border_padding = get_side_border_padding;

}).call(this);
(function() {
  var SelectParser;

  SelectParser = (function() {

    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  this.SelectParser = SelectParser;

}).call(this);
