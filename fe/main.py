## Quick GAE scaffolding to launch the front-end.

import webapp2 as webapp
import jinja2
import wsgiref.handlers
import os
import json
from datetime import datetime

def format_to_json(data_stream):
  # Convert whole thing to string before JSON serializing, as date objects don't
  # do well in JSON.
  return json.dumps(str(data_stream))

def get_data(parameter):
  ## Return a constant for the moment.
  return format_to_json(
    [
      {
          'title': 'SOM House Party',
          'date': datetime(2018, 1, 17, 16, 30, 0),
          'imageURL': 'http://i.imgur.com/pXjrQ.gif',
          'location': 'Kyle \'s house',
          'attending': ['kyle.jensen@yale.edu', 'kim.kardashian@yale.edu'],
      },
      {
          'title': 'BBQ party for hackers and nerds',
          'date': datetime(2017, 8, 1, 19, 0, 0),
          'imageURL': 'http://i.imgur.com/7pe2k.gif',
          'location': 'Sharon Oster\'s house',
          'attending': ['kyle.jensen@yale.edu', 'kim.kardashian@yale.edu'],
      },
      {
          'title': 'BBQ for managers',
          'date': datetime(2017, 12, 20, 18, 0, 0),
          'imageURL': 'http://i.imgur.com/CJLrRqh.gif',
          'location': 'Barry Nalebuff\'s house',
          'attending': ['kim.kardashian@yale.edu'],
      },
      {
          'title': 'Cooking lessons for the busy business student',
          'date': datetime(2018, 3, 2, 19, 0, 0),
          'imageURL': 'http://i.imgur.com/02KT9.gif',
          'location': 'Yale Farm',
          'attending': ['homer.simpson@yale.edu'],
      },
    ]

  )

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class MainPageHandler(webapp.RequestHandler):
  def get(self):
    template_values = {'title': 'Strong Feather Events'}
    template = JINJA_ENVIRONMENT.get_template('index.html')

    self.response.write(template.render(template_values))

class EventAPIHandler(webapp.RequestHandler):
  def get(self):
    events = get_data('events')
    self.response.write(events)
  def post(self):
    print('Filing to dev/null!')


app = webapp.WSGIApplication(
  # List of tuples mapping routes to class handlers.
  [
    ('/', MainPageHandler),
    ('/api/events', EventAPIHandler)
  ],
  debug=os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/')
)