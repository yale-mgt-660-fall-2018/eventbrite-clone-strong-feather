## Quick GAE scaffolding to launch the front-end.

import webapp2 as webapp
import jinja2
import wsgiref.handlers
import os
import json
from datetime import datetime

#db_user = os.environ.get('CLOUD_SQL_USERNAME')
#db_password = os.environ.get('CLOUD_SQL_PASSWORD')
#db_name = os.environ.get('CLOUD_SQL_DATABASE_NAME')
#db_connection_name = os.environ.get('CLOUD_SQL_CONNECTION_NAME')
#
#cnx = psycopg2.connect(dbname=db_name, user=db_user,
#                       password=db_password, host=host)


def format_to_json(data_stream):
  # NB. Dates don't do well in Python JSON.
  return json.dumps(data_stream, default=str)

def get_data(parameter):
  ## Return a constant for the moment.
  return format_to_json(
    [
      {
          'id': 0,
          'title': 'SOM House Party',
          'date': datetime(2018, 1, 17, 16, 30, 0),
          'imageURL': 'http://i.imgur.com/pXjrQ.gif',
          'location': 'Kyle \'s house',
          'attending': ['kyle.jensen@yale.edu', 'kim.kardashian@yale.edu'],
      },
      {
          'id': 1,
          'title': 'BBQ party for hackers and nerds',
          'date': datetime(2017, 8, 1, 19, 0, 0),
          'imageURL': 'http://i.imgur.com/7pe2k.gif',
          'location': 'Sharon Oster\'s house',
          'attending': ['kyle.jensen@yale.edu', 'kim.kardashian@yale.edu'],
      },
      {
          'id': 2,
          'title': 'BBQ for managers',
          'date': datetime(2017, 12, 20, 18, 0, 0),
          'imageURL': 'http://i.imgur.com/CJLrRqh.gif',
          'location': 'Barry Nalebuff\'s house',
          'attending': ['kim.kardashian@yale.edu'],
      },
      {
          'id': 3,
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

    print self.request

    template_values = {'title': 'Strong Feather Events'}
    template = JINJA_ENVIRONMENT.get_template('index.html')

    self.response.write(template.render(template_values))

class EventAPIHandler(webapp.RequestHandler):
  def get(self):
    events = get_data('events')
    self.response.write(events)
  def post(self):
    payload = self.request
    data = payload.body

class DonationAPIHandler(webapp.RequestHandler):
  def get(self):
    donations = [1, 2, 3]
    self.response.write(donations)

  def post(self):
    payload = self.request
    data = payload.body
    print data

app = webapp.WSGIApplication(
  # List of tuples mapping routes to class handlers.
  [
    ('/', MainPageHandler),
    ('/api/events', EventAPIHandler),
    ('/api/donations', DonationAPIHandler)
  ],
  debug=os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/')
)