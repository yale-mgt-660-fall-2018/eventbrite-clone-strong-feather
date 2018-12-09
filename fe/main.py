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
          'location': 'Aaron \'s house',
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


class AboutPageHandler(webapp.RequestHandler):
  def get(self, *args):

    template_values = {'title': 'Strong Feather Team'}
    template = JINJA_ENVIRONMENT.get_template('about.html')

    self.response.write(template.render(template_values))

class MainPageHandler(webapp.RequestHandler):
  def get(self, *args):

    template_values = {'title': 'Strong Feather Events'}
    template = JINJA_ENVIRONMENT.get_template('index.html')

    self.response.write(template.render(template_values))

class CreatePageHandler(webapp.RequestHandler):
  def get(self):

    template_values = {'title': 'Strong Feather Events'}
    template = JINJA_ENVIRONMENT.get_template('create.html')

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


routes = [
  webapp.Route(r'/', handler=MainPageHandler, name="home"),
  webapp.Route(r'/about', handler=AboutPageHandler, name="about"),
  webapp.Route(r'/events/new', handler=CreatePageHandler, name="home"),
  webapp.Route(r'/events/0', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/1', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/2', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/3', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/4', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/5', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/6', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/7', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/8', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/9', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/10', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events/', handler=MainPageHandler, name="home"),
  webapp.Route(r'/events', handler=MainPageHandler, name="home"),
  webapp.Route(r'/api/events', handler=EventAPIHandler, name="apievents"),
  webapp.Route(r'/api/donations', handler=DonationAPIHandler, name="apidonations")
]

app = webapp.WSGIApplication(
  routes,
  debug=os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/')
)



'''
# Get all event details
def getEventDetails():
	events = executeQuery("SELECT * FROM events;")
	attendees = executeQuery("SELECT * from attendees WHERE eventid IN (SELECT eventid FROM events) AND status = \"Yes\"")

# Create new event
def createEvent(eventObject):
	# Dummy object
	eventObject = {
            'eventname' : "Party at Race\'s",
            'location' : '',
            'eventtime' : "No courses to display at this time.",
            'duration_mins' : '',
            'imagelink' : ''
            }


INSERT INTO events (eventname, location, eventtime, duration_mins, imagelink) VALUES ('Party at Race''s', 'Races house', '2019-01-01 00:00:01', 120, 'https://i.imgur.com/n3PQl9u.png');

# Delete an event
DELETE FROM events WHERE eventid = :eventid, eventid = eventid

# Add attendee to event
INSERT INTO attendees (eventid, userid, status, registertime)
VALUES (420, "aaron.dsouza@yale.edu", "Yes", NOW())

# Add donation to event
INSERT INTO donations (eventid, userid, amount, timeofdonation)
VALUES (420, "aaron.dsouza@yale.edu", 10.00, NOW())

def executeQuery(query):
	cnx = psycopg2.connect(dbname=db_name, user=db_user,
                           password=db_password, host=host)
	with cnx.cursor() as cursor:
        cursor.execute(query)
        result = cursor.fetchall()
    current_time = result[0][0]
    cnx.commit()
    cnx.close()
    return result
 '''