## Quick GAE scaffolding to launch the front-end.

import webapp2 as webapp
import jinja2
import wsgiref.handlers
import os


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class MainPageHandler(webapp.RequestHandler):
  def get(self):
    template_values = {'title': 'Strong Feather Events'}
    template = JINJA_ENVIRONMENT.get_template('index.html')

    self.response.write(template.render(template_values))

app = webapp.WSGIApplication(
  # List of tuples mapping routes to class handlers.
  [
    ('/', MainPageHandler)
  ],
  debug=os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/')
)