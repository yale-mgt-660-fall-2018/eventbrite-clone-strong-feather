## Quick GAE scaffolding to launch the front-end.

import webapp2 as webapp
import jinja2
import wsgiref.handlers
import os
import json
import sys
import MySQLdb
from datetime import datetime
#from flask import Flask
#import psycopg2.pool

CLOUDSQL_CONNECTION_NAME = os.environ.get('CLOUDSQL_CONNECTION_NAME')
CLOUDSQL_USER = os.environ.get('CLOUDSQL_USER')
CLOUDSQL_PASSWORD = os.environ.get('CLOUDSQL_PASSWORD')
CLOUDSQL_DATABASE_NAME = os.environ.get('CLOUDSQL_DATABASE_NAME')

def connect_to_cloudsql():
    if True:
		try:
			cloudsql_unix_socket = os.path.join('/cloudsql', CLOUDSQL_CONNECTION_NAME)
			db = MySQLdb.connect(
	            unix_socket=cloudsql_unix_socket,
	            user=CLOUDSQL_USER,
	            passwd=CLOUDSQL_PASSWORD,
	            db=CLOUDSQL_DATABASE_NAME)
	            
		except Exception as e:
			global error_message 
			error_message = sys.exc_info()
    else:
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


class MainPageHandler(webapp.RequestHandler):
  def get(self):

    print self.request
    # TODO remove before submission. 5 lines of Aarons Testing code. Replace value of errormessage in template_values to ''
    #createEvent(None)
    #deleteEvent(None)
    #addAttendee(None)
    #addDonation(None)
    #eventDetails = getEventDetails()

    template_values = {'title': 'Strong Feather Events', 'errormessage': ''}
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

# Get all event details
def getEventDetails():
	#global allevents
	allevents = executeQuery("SELECT eventid, eventname, eventtime, imagelink, location, duration FROM events;") 
	attendees = executeQuery("SELECT eventid, useremail from attendees WHERE eventid IN (SELECT eventid FROM events) AND status = \"Yes\";")
	#allevents = executeQuery("SELECT e.*, (SELECT GROUP_CONCAT(a.useremail SEPARATOR ', ') FROM attendees a WHERE a.eventid = e.eventid) AS attending FROM events e;")
	eventsCopy = list()
	for event in allevents:
		newEvent = {}
		newEvent['id'] = event[0]
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

# Create new event
def createEvent(eventObject):
	# TODO: Remove hardcode
	# @Race: This is the object format
	eventObject = {
            'title' : "Party at Aarons",
            'location' : "Races house",
            'date' : "2019-01-01 00:00:01",
            'duration' : 120,
            'imageURL' : "https://i.imgur.com/n3PQl9u.png"
            }
	if "duration" not in eventObject:
		newEvent['duration'] = ""
	response = executeQuery("INSERT INTO events (eventname, location, eventtime, duration, imagelink) VALUES (\'" + eventObject["title"] + "\', \'" + eventObject["location"] + "\', \'" + eventObject["date"] + "\', \'" + str(eventObject["duration"]) + "\', \'" + eventObject["imageURL"] + "\');")
	return response
	
# Delete an event by eventid
def deleteEvent(eventid):
	#TODO Aaron Remove hardcode
	eventid = 60
	return executeQuery("DELETE FROM events WHERE eventid = " + str(eventid) + ";")

# Add attendee to event
def addAttendee(attendeeObject):
	# @Race: This is the object format.
	# TODO Aaron remove hardcode
	attendeeObject = {
		'eventid' : 60,
		'useremail' : "aaron.dsouza@yale.edu",
		'status' : "Yes"
		}
	# End of hardcode
	response = executeQuery("INSERT INTO attendees (eventid, useremail, status, registertime) VALUES (" + str(attendeeObject['eventid']) + ", \'" + attendeeObject['useremail'] + "\', \'" + attendeeObject['status'] + "\', \'" + str(datetime.now()) + "\');")
	return response
	
# TODO Aaron
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
	#INSERT INTO donations (eventid, userid, amount, timeofdonation) 
	#VALUES (420, "aaron.dsouza@yale.edu", 10.00, NOW())