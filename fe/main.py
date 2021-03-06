## Quick GAE scaffolding to launch the front-end.

import webapp2 as webapp
import jinja2
import wsgiref.handlers
import os
import json
import sys
import MySQLdb
from datetime import datetime
import re

import hashlib

def provide_email_hash(email):
  input = email.lower() + '-strong-feather'
  hsh = hashlib.sha256(input)
  return hsh.hexdigest()

CLOUDSQL_CONNECTION_NAME = os.environ.get('CLOUDSQL_CONNECTION_NAME')
CLOUDSQL_USER = os.environ.get('CLOUDSQL_USER')
CLOUDSQL_PASSWORD = os.environ.get('CLOUDSQL_PASSWORD')
CLOUDSQL_DATABASE_NAME = os.environ.get('CLOUDSQL_DATABASE_NAME')

def connect_to_cloudsql():
  try:
    cloudsql_unix_socket = os.path.join('/cloudsql', CLOUDSQL_CONNECTION_NAME)
    db = MySQLdb.connect(
            unix_socket=cloudsql_unix_socket,
            user=CLOUDSQL_USER,
            passwd=CLOUDSQL_PASSWORD,
            db=CLOUDSQL_DATABASE_NAME)
    return db
  except Exception as e:
    global error_message
    error_message = sys.exc_info()
    db = MySQLdb.connect(host='127.0.0.1', user='', passwd='', db='msqldb')
    return db

def executeQuery(query):
	db = connect_to_cloudsql()
	try:
		cursor = db.cursor()
		cursor.execute(query)
		db.commit()
		global response
		response = cursor.fetchall()
		return response
	except Exception as e:
		global error_message
		error_message = sys.exc_info()
	return ""

def format_to_json(data_stream):
  # NB. Dates don't do well in Python JSON.
  return json.dumps(data_stream, default=str)

def get_data(parameter):
	## Return a constant for the moment.
	return format_to_json(getEventDetails())

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
    template_values = {'title': 'Strong Feather Events', 'errormessage': ''}
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
    req = self.request
    payload = json.loads(req.body)

    time = datetime.strptime(payload['time'], '%Y-%m-%dT%H:%M:%S.%f')
    date = datetime.strptime(payload['date'], '%Y-%m-%dT%H:%M:%S.%f')

    response = executeQuery("""
        INSERT INTO events (eventname, location, eventtime, duration, imagelink)
        VALUES (%s, %s, %s, %s, %s)
      """ % (payload['eventname'], payload['location'], date + time, duration, imagelink)
    )



class RSVPHandler(webapp.RequestHandler):
  def post(self):
    req = self.request
    payload = json.loads(req.body)

    if not response == '':
      self.response.write('Your confirmation code is: ' +
                           provide_email_hash(email)[0:8]
      )
      self.response.set_status(200)


    email = payload["email"]
    if not validate_email(email):
      self.response.set_status(501)
      self.response.write('Email Was Not Valid. Please Try Again.')
      return

    s = 'Yes' if (payload['status'] == 'Yes') else 'No'
    eventid = payload['eventid']

    if not (eventid):
      self.response.write('Invalid Event Id!')
      self.response.set_status(502)

    now = datetime.now()
    response = executeQuery("""
  	   INSERT INTO attendees (eventid, useremail, status, registertime)
  	   VALUES (%s, %s, %s, %s); "
  	 """ % (str(eventid), str(email), str(s), now.strftime("%Y-%m-%d %H:%M"))
    )


    else:
      self.response.write('Failure!')
      self.response.set_status(503)
    return response


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
  webapp.Route(r'/api/rsvp', handler=RSVPHandler, name="apirsvp"),
  webapp.Route(r'/api/donations', handler=DonationAPIHandler, name="apidonations")
]

app = webapp.WSGIApplication(
  routes,
  debug=os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/')
)


# Get all event details
def getEventDetails():
	allevents = executeQuery("SELECT eventid, eventname, eventtime, imagelink, location, duration FROM events;")
	attendees = executeQuery("SELECT eventid, useremail from attendees WHERE eventid IN (SELECT eventid FROM events) AND status = \"Yes\";")
	#allevents = executeQuery("SELECT e.*, (SELECT GROUP_CONCAT(a.useremail SEPARATOR ', ') FROM attendees a WHERE a.eventid = e.eventid) AS attending FROM events e;")
	eventsCopy = list()
	for i, event in enumerate(allevents):
		newEvent = {}
		newEvent['id'] = event[0]
		newEvent['feid'] = i
		newEvent['title'] = event[1]
		newEvent['date'] = event[2]
		newEvent['imageURL'] = event[3]
		newEvent['location'] = event[4]
		newEvent['attending'] = []
		eventsCopy.append(newEvent)
	for attendee in attendees:
		for newEvent in eventsCopy:
			if attendee[0] == newEvent["id"]:
				newEvent["attending"].append(attendee[1])
				break
	return eventsCopy


# Delete an event by eventid
def deleteEvent(eventid):
	#TODO Aaron Remove hardcode
	if eventid is None:
		eventid = 60
	return executeQuery("DELETE FROM events WHERE eventid = " + str(eventid) + ";")


# Add donation to event
def addDonation(donationObject):
	# @Race: This is the object format.
	# TODO Aaron remove hardcode
	donationObject = {
		'eventid' : 60,
		'useremail' : "aaron.dsouza@yale.edu",
		'amount' : 10.1
		}
	# End of hardcode
	response = executeQuery("INSERT INTO donations (eventid, useremail, amount) VALUES (" + str(donationObject['eventid']) + ", \'" + donationObject['useremail'] + "\', " + str(donationObject['amount']) + ");")
	return response

# DB queries to insert data into tables:
# INSERT INTO events (eventname, location, eventtime, duration, imagelink) VALUES ('Party at Aarons', 'Races house', '2019-01-01 00:00:01', '120', 'https://i.imgur.com/n3PQl9u.png');
# INSERT INTO attendees (eventid, useremail, status, registertime) VALUES (60, 'aaron.dsouza@yale.edu', 'Yes', '2018-12-09 22:36:16.478049');
# INSERT INTO donations (eventid, useremail, amount) VALUES (60, 'aaron.dsouza@yale.edu', 10.1);